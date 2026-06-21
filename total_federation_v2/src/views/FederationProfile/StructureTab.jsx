import React from '../../utils/react-shim.js';
import { useTranslation } from '../../context/LanguageContext.jsx';
import DepartmentTree from './DepartmentTree.jsx';
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
        result.push({ id: node.id, name: node.name, unitType: node.unitType });
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
      setTreeData(data);
      setFlatUnits(flattenTree(data));
      
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
        const updated = findInTree(data, activeUnit.id);
        setActiveUnit(updated);
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
      const response = await fetch('http://localhost:5005/hr/structure/move', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ draggedId, targetId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "გადაადგილება ვერ მოხერხდა");
      }

      triggerAlert(isGeo ? "ქვედანაყოფი წარმატებით გადაადგილდა!" : "Unit moved successfully!", true);
      await fetchTree();
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

      if (!response.ok) throw new Error("ქვედანაყოფის დამატება ვერ მოხერხდა");
      
      triggerAlert(isGeo ? "ქვედანაყოფი წარმატებით დაემატა!" : "Unit added successfully!", true);
      setIsAddModalOpen(false);
      await fetchTree();
    } catch (err) {
      console.error(err);
      triggerAlert(isGeo ? "შეცდომა დამატებისას" : "Error adding unit", false);
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
            {isGeo ? "სტრუქტურა იტვირთება..." : "Loading structural tree..."}
          </span>
        </div>
      ) : (
        <div style={splitContainerStyle}>
          {/* Left Panel: Tree */}
          <DepartmentTree 
            treeData={treeData}
            activeUnit={activeUnit}
            onSelect={setActiveUnit}
            onMove={handleMoveUnit}
            onAddClick={() => setIsAddModalOpen(true)}
          />

          {/* Right Panel: Details */}
          <DepartmentDetails 
            activeUnit={activeUnit}
            availableUsers={availableUsers}
            onAssignUser={handleAssignUser}
            onUnassignUser={handleUnassignUser}
            onUpdateDetails={handleUpdateDetails}
            onDeleteUnit={handleDeleteUnit}
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
