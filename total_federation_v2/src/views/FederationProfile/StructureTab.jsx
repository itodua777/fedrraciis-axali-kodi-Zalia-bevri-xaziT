import React from '../../utils/react-shim.js';
import { useTranslation } from '../../context/LanguageContext.jsx';
import DepartmentDetails from './DepartmentDetails.jsx';
import AddDepartmentModal from './AddDepartmentModal.jsx';

const StructureTab = () => {
  const { i18n } = useTranslation();
  const isGeo = i18n.language === 'GEO';

  const [treeData, setTreeData] = React.useState([]);
  const [flatUnits, setFlatUnits] = React.useState([]);
  const [activeUnit, setActiveUnit] = React.useState(null);
  const [availableUsers, setAvailableUsers] = React.useState([]);
  
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  const getHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    'Content-Type': 'application/json'
  });

  // Flat helper to build parent dropdown choice
  const flattenTree = (nodes) => {
    let result = [];
    const traverse = (list) => {
      list.forEach(node => {
        if (node.unitType !== 'თანამდებობა') {
          result.push({ id: node.id, name: node.name, unitType: node.unitType });
        }
        if (node.children && node.children.length > 0) {
          traverse(node.children);
        }
      });
    };
    traverse(nodes);
    return result;
  };

  const fetchTree = async () => {
    try {
      const response = await fetch('http://localhost:5005/hr/structure', {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error("სტრუქტურის ჩატვირთვა ვერ მოხერხდა");
      const data = await response.json();
      const safeData = Array.isArray(data) ? data : [];
      setTreeData(safeData);
      setFlatUnits(flattenTree(safeData));
      
      // Update selected unit data if it is active
      if (activeUnit) {
        const findInTree = (nodes, id) => {
          for (let node of nodes) {
            if (node.id === id) return node;
            if (node.children) {
              const res = findInTree(node.children, id);
              if (res) return res;
            }
          }
          return null;
        };
        const updated = findInTree(safeData, activeUnit.id);
        setActiveUnit(updated);
      } else if (safeData.length > 0) {
        // Auto-select the first department unit (e.g. "ადმინისტრაცია") on initial load
        const findInitialActive = (nodes) => {
          for (let node of nodes) {
            if (node.unitType === 'დეპარტამენტი/სამსახური' || node.unitType === 'მმართველი ორგანო') return node;
            if (node.children) {
              const res = findInitialActive(node.children);
              if (res) return res;
            }
          }
          return nodes[0];
        };
        const initialActive = findInitialActive(safeData);
        setActiveUnit(initialActive);
      }
    } catch (err) {
      console.error(err);
      setError(isGeo ? "შეცდომა სტრუქტურის ჩატვირთვისას" : "Error loading structure tree");
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const response = await fetch('http://localhost:5005/hr/members/available', {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error("თანამშრომლების სიის ჩატვირთვა ვერ მოხერხდა");
      const data = await response.json();
      setAvailableUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchTree(), fetchAvailableUsers()]);
      setLoading(false);
    };
    init();
  }, []);

  React.useEffect(() => {
    setError("");
    setSuccessMessage("");
  }, [activeUnit]);

  const triggerAlert = (msg, isSuccess = false) => {
    if (isSuccess) {
      setSuccessMessage(msg);
      setError("");
      setTimeout(() => setSuccessMessage(""), 4000);
    } else {
      setError(msg);
      setSuccessMessage("");
      setTimeout(() => setError(""), 4000);
    }
  };

  // 1. Move Structure Unit (Drag & Drop)
  const handleMoveUnit = async (draggedId, targetId) => {
    try {
      let url = `http://localhost:5005/api/structure/${draggedId}/reparent`;
      let method = 'PATCH';
      let body = { parentId: targetId };

      if (draggedId && draggedId.startsWith('user-')) {
        const userId = draggedId.replace('user-', '');
        url = 'http://localhost:5005/hr/members';
        method = 'POST';
        body = { userId, unitId: targetId };
      }

      const response = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || (isGeo ? "გადაადგილება ვერ მოხერხდა" : "Move failed"));
      }

      triggerAlert(isGeo ? "სტრუქტურა წარმატებით განახლდა!" : "Structure updated successfully!", true);
      await Promise.all([fetchTree(), fetchAvailableUsers()]);
    } catch (err) {
      console.error(err);
      triggerAlert(isGeo ? `შეცდომა: ${err.message}` : `Error: ${err.message}`, false);
    }
  };

  // 2. Add Structure Unit
  const handleAddUnit = async (unitData) => {
    try {
      const response = await fetch('http://localhost:5005/hr/structure', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(unitData)
      });

      if (!response.ok) {
        let errorMsg = isGeo ? "ქვედანაყოფის დამატება ვერ მოხერხდა" : "Failed to add unit";
        try {
          const errData = await response.json();
          if (errData?.message) {
            errorMsg = Array.isArray(errData.message) ? errData.message.join(', ') : errData.message;
          }
        } catch (e) {}
        throw new Error(errorMsg);
      }
      
      triggerAlert(isGeo ? "ქვედანაყოფი წარმატებით დაემატა!" : "Unit added successfully!", true);
      setIsAddModalOpen(false);
      await fetchTree();
    } catch (err) {
      console.error(err);
      triggerAlert(err.message, false);
      throw err;
    }
  };

  // 3. Update Unit Metadata Details
  const handleUpdateDetails = async (metadata) => {
    if (!activeUnit) return;
    try {
      const response = await fetch(`http://localhost:5005/hr/structure/${activeUnit.id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(metadata)
      });

      if (!response.ok) throw new Error("პარამეტრების განახლება ვერ მოხერხდა");

      triggerAlert(isGeo ? "მონაცემები წარმატებით შეინახა!" : "Details saved successfully!", true);
      await fetchTree();
    } catch (err) {
      console.error(err);
      triggerAlert(isGeo ? "შეცდომა მონაცემების შენახვისას" : "Error saving details", false);
    }
  };

  // 3b. Update Unit Permissions Matrix
  const handleUpdatePermissions = async (permissions) => {
    if (!activeUnit) return;
    try {
      const response = await fetch(`http://localhost:5005/api/structure/${activeUnit.id}/permissions`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ permissions })
      });

      if (!response.ok) throw new Error("უფლებების განახლება ვერ მოხერხდა");

      triggerAlert(isGeo ? "უფლებები წარმატებით განახლდა!" : "Permissions updated successfully!", true);
      await fetchTree();
    } catch (err) {
      console.error(err);
      triggerAlert(isGeo ? "შეცდომა უფლებების შენახვისას" : "Error saving permissions", false);
    }
  };

  // 4. Delete Structure Unit
  const handleDeleteUnit = async (id) => {
    try {
      const response = await fetch(`http://localhost:5005/hr/structure/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) throw new Error("ქვედანაყოფის წაშლა ვერ მოხერხდა");

      triggerAlert(isGeo ? "ქვედანაყოფი წარმატებით წაიშალა!" : "Unit deleted successfully!", true);
      setActiveUnit(null);
      await fetchTree();
    } catch (err) {
      console.error(err);
      triggerAlert(isGeo ? "შეცდომა წაშლისას" : "Error deleting unit", false);
    }
  };

  // 5. Assign User to Unit
  const handleAssignUser = async (userId) => {
    if (!activeUnit) return;
    try {
      const response = await fetch('http://localhost:5005/hr/members', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ userId, unitId: activeUnit.id })
      });

      if (!response.ok) throw new Error("წევრის მიბმა ვერ მოხერხდა");

      triggerAlert(isGeo ? "წევრი წარმატებით მიება ქვედანაყოფს!" : "Member successfully mapped to unit!", true);
      await Promise.all([fetchTree(), fetchAvailableUsers()]);
    } catch (err) {
      console.error(err);
      triggerAlert(isGeo ? "შეცდომა მიბმისას" : "Error mapping member", false);
    }
  };

  // 6. Remove User from Unit
  const handleUnassignUser = async (userId) => {
    try {
      const response = await fetch('http://localhost:5005/hr/members', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ userId, unitId: null })
      });

      if (!response.ok) throw new Error("წევრის მოხსნა ვერ მოხერხდა");

      triggerAlert(isGeo ? "წევრი წარმატებით მოიხსნა ქვედანაყოფიდან!" : "Member successfully removed from unit!", true);
      await Promise.all([fetchTree(), fetchAvailableUsers()]);
    } catch (err) {
      console.error(err);
      triggerAlert(isGeo ? "შეცდომა მოხსნისას" : "Error removing member", false);
    }
  };

  // Main Styles
  const splitContainerStyle = {
    display: "flex",
    gap: "24px",
    height: "calc(100vh - 240px)",
    width: "100%",
    alignItems: "stretch"
  };

  const notificationStyle = (isSuccess) => ({
    padding: "10px 14px",
    backgroundColor: isSuccess ? "rgba(0, 230, 118, 0.08)" : "rgba(180, 3, 7, 0.08)",
    border: `1px solid ${isSuccess ? "rgba(0, 230, 118, 0.2)" : "rgba(180, 3, 7, 0.2)"}`,
    borderRadius: "6px",
    color: isSuccess ? "var(--emerald)" : "var(--crisis-from)",
    fontSize: "12px",
    fontFamily: "var(--font-mono)",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    animation: "slideDown 0.2s ease"
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
      {/* Title Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        borderBottom: "1px solid var(--iron-line)",
        paddingBottom: "16px"
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <h1 style={{ margin: 0, fontSize: "20px", fontFamily: "var(--font-heading)", color: "var(--bone)", fontWeight: 700 }}>
            {isGeo ? "ფედერაციის ორგანიზაციული როლები" : "Federation Organizational Roles"}
          </h1>
          <span style={{ fontSize: "12px", color: "var(--silver)", fontFamily: "var(--font-primary)" }}>
            {isGeo ? "მართეთ ფედერაციის ფუნქციური როლები და თანამშრომლები" : "Manage federation functional roles and staff"}
          </span>
        </div>
      </div>

      {/* Alert Notices */}
      {error && (
        <div style={notificationStyle(false)}>
          <i className="fa-solid fa-triangle-exclamation"></i>
          <span>{error}</span>
        </div>
      )}
      {successMessage && (
        <div style={notificationStyle(true)}>
          <i className="fa-solid fa-circle-check"></i>
          <span>{successMessage}</span>
        </div>
      )}

      {loading ? (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "300px",
          color: "var(--emerald)",
          flexDirection: "column",
          gap: "10px"
        }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "24px" }}></i>
          <span style={{ fontSize: "13px", fontFamily: "var(--font-mono)" }}>
            {isGeo ? "როლები იტვირთება..." : "Loading roles..."}
          </span>
        </div>
      ) : (
        <div style={splitContainerStyle}>
          {/* Left Panel: Flat Roles List */}
          <div style={{
            width: "280px",
            borderRight: "1px solid var(--iron-line)",
            paddingRight: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            height: "100%",
            overflowY: "auto",
            flexShrink: 0
          }}>
            <div style={{
              fontFamily: "var(--font-heading)",
              fontSize: "11px",
              color: "var(--silver)",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "1px"
            }}>
              {isGeo ? "როლების სია" : "Roles List"}
            </div>

            <div style={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "6px"
            }} className="custom-scrollbar">
              {treeData.length === 0 ? (
                <div style={{
                  padding: "20px 0",
                  textAlign: "center",
                  color: "var(--silver)",
                  fontSize: "12px",
                  fontStyle: "italic"
                }}>
                  {isGeo ? "როლები არ არის" : "No roles defined"}
                </div>
              ) : (
                treeData.map(role => {
                  const isActive = activeUnit && activeUnit.id === role.id;
                  return (
                    <div 
                      key={role.id}
                      onClick={() => setActiveUnit(role)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        backgroundColor: isActive ? "rgba(0, 230, 118, 0.08)" : "transparent",
                        border: isActive ? "1px solid rgba(0, 230, 118, 0.2)" : "1px solid transparent",
                        color: isActive ? "var(--emerald)" : "var(--bone)",
                        fontSize: "13px",
                        fontWeight: isActive ? "700" : "500",
                        transition: "all 0.15s ease",
                        userSelect: "none"
                      }}
                      onMouseEnter={e => {
                        if (!isActive) e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.02)";
                      }}
                      onMouseLeave={e => {
                        if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <i className="fa-solid fa-user-tie" style={{ fontSize: "12px", width: "16px", textAlign: "center", color: isActive ? "var(--emerald)" : "var(--silver)" }}></i>
                      <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "160px" }}>
                        {role.name}
                      </span>
                      {role.memberCount > 0 && (
                        <span style={{
                          marginLeft: "auto",
                          fontSize: "10px",
                          fontWeight: "700",
                          backgroundColor: isActive ? "rgba(0, 230, 118, 0.2)" : "rgba(255, 255, 255, 0.05)",
                          border: `1px solid ${isActive ? "rgba(0, 230, 118, 0.3)" : "rgba(255, 255, 255, 0.1)"}`,
                          color: isActive ? "var(--emerald)" : "var(--silver)",
                          borderRadius: "10px",
                          padding: "2px 8px",
                          fontFamily: "var(--font-mono)"
                        }}>
                          {role.memberCount}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <button 
              onClick={() => setIsAddModalOpen(true)}
              style={{
                padding: "10px 14px",
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                border: "1px dashed var(--iron-line)",
                borderRadius: "6px",
                color: "var(--emerald)",
                fontFamily: "var(--font-heading)",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--emerald)";
                e.currentTarget.style.backgroundColor = "rgba(0, 230, 118, 0.04)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--iron-line)";
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.02)";
              }}
            >
              <i className="fa-solid fa-plus"></i>
              <span>{isGeo ? "როლის დამატება" : "Add Role"}</span>
            </button>
          </div>

          {/* Right Panel: Details */}
          <DepartmentDetails 
            activeUnit={activeUnit}
            onDeleteUnit={handleDeleteUnit}
            onRefresh={fetchTree}
            staffLedger={treeData.reduce((acc, role) => {
              if (role.users && role.users.length > 0) {
                role.users.forEach(u => {
                  acc.push({
                    ...u,
                    roleName: role.name,
                    permissions: role.permissions || []
                  });
                });
              }
              return acc;
            }, [])}
            onUnassignUser={handleUnassignUser}
          />
        </div>
      )}

      {/* Add Unit Dialog */}
      <AddDepartmentModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddUnit}
        activeUnit={activeUnit}
        flatUnits={flatUnits}
      />
    </div>
  );
};

export default StructureTab;
