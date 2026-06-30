import React from '../../utils/react-shim.js';
import { useTranslation } from '../../context/LanguageContext.jsx';

const GovernanceHierarchyTab = () => {
  const { i18n } = useTranslation();
  const isGeo = i18n.language === 'GEO';

  const [treeData, setTreeData] = React.useState([]);
  const [flatNodes, setFlatNodes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Modeling mode states
  const [isModelingMode, setIsModelingMode] = React.useState(false);
  const [inlineEditingId, setInlineEditingId] = React.useState(null);
  const [inlineEditName, setInlineEditName] = React.useState("");
  const [movingNodeId, setMovingNodeId] = React.useState(null);

  // Form states (Add)
  const [newName, setNewName] = React.useState("");
  const [newParentId, setNewParentId] = React.useState("");

  // Form states (Edit)
  const [editingNode, setEditingNode] = React.useState(null);
  const [editName, setEditName] = React.useState("");
  const [editParentId, setEditParentId] = React.useState("");

  // Full-screen canvas states & refs
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);

  const canvasContainerRef = React.useRef(null);
  const dragStart = React.useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    if (!canvasContainerRef.current) return;
    if (e.button !== 0) return;
    if (
      e.target &&
      typeof e.target.closest === 'function' &&
      (e.target.closest('input') ||
        e.target.closest('button') ||
        e.target.closest('select') ||
        e.target.closest('option'))
    ) {
      return;
    }
    setIsDragging(true);
    dragStart.current = { x: e.clientX - (pan?.x ?? 0), y: e.clientY - (pan?.y ?? 0) };
    if (e.target && typeof e.target.setPointerCapture === 'function') {
      try {
        e.target.setPointerCapture(e.pointerId);
      } catch (err) {
        console.error("setPointerCapture failed", err);
      }
    }
  };

  const handlePointerMove = (e) => {
    if (!canvasContainerRef.current) return;
    if (!isDragging || !dragStart.current || dragStart.current.x === undefined || dragStart.current.y === undefined) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handlePointerUp = (e) => {
    if (!canvasContainerRef.current) return;
    if (isDragging) {
      if (e.target && typeof e.target.releasePointerCapture === 'function') {
        try {
          e.target.releasePointerCapture(e.pointerId);
        } catch (err) {
          console.error("releasePointerCapture failed", err);
        }
      }
      setIsDragging(false);
    }
  };

  React.useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const handleWheelNative = (e) => {
      if (!canvasContainerRef.current) return;
      e.preventDefault();
      const zoomFactor = 1.05;
      setZoom((prevZoom) => {
        let nextZoom = prevZoom ?? 1;
        if (e.deltaY < 0) {
          nextZoom = Math.min(nextZoom * zoomFactor, 3);
        } else {
          nextZoom = Math.max(nextZoom / zoomFactor, 0.3);
        }
        return Number(nextZoom.toFixed(2));
      });
    };

    container.addEventListener('wheel', handleWheelNative, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheelNative);
    };
  }, [isFullScreen]);


  const getHeaders = () => {
    const headers = {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json'
    };
    const activeUserStr = localStorage.getItem('activeUser');
    if (activeUserStr) {
      try {
        const activeUser = JSON.parse(activeUserStr);
        if (activeUser.companyId) {
          headers['x-company-id'] = activeUser.companyId;
          headers['company-id'] = activeUser.companyId;
        }
      } catch (e) {
        // ignore
      }
    }
    return headers;
  };

  const flattenTree = (nodes) => {
    let result = [];
    if (!nodes || !Array.isArray(nodes)) return result;
    const traverse = (list) => {
      if (!list || !Array.isArray(list)) return;
      list.forEach(node => {
        if (!node) return;
        result.push(node);
        if (node?.children && Array.isArray(node.children) && node.children.length > 0) {
          traverse(node.children);
        }
      });
    };
    traverse(nodes);
    return result;
  };

  const fetchTree = async () => {
    try {
      const activeUserStr = localStorage.getItem('activeUser');
      let companyId = '';
      if (activeUserStr) {
        try {
          const activeUser = JSON.parse(activeUserStr);
          companyId = activeUser.companyId || '';
        } catch (e) {
          // ignore
        }
      }
      const url = companyId 
        ? `http://localhost:5005/api/governance?companyId=${companyId}`
        : 'http://localhost:5005/api/governance';

      const response = await fetch(url, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error("მმართველობითი სტრუქტურის ჩატვირთვა ვერ მოხერხდა");
      const data = await response.json();
      const safeData = Array.isArray(data) ? data : [];
      setTreeData(safeData);
      setFlatNodes(flattenTree(safeData));
    } catch (err) {
      console.error(err);
      setError(isGeo ? "შეცდომა ჩატვირთვისას" : "Error loading tree");
    }
  };

  React.useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchTree();
      setLoading(false);
    };
    init();
  }, []);

  const triggerAlert = (msg, isSuccess = false) => {
    if (isSuccess) {
      setSuccess(msg);
      setError("");
      setTimeout(() => setSuccess(""), 4000);
    } else {
      setError(msg);
      setSuccess("");
      setTimeout(() => setError(""), 4000);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5005/api/governance', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          name: newName,
          parentId: newParentId || null
        })
      });

      if (!response.ok) throw new Error("შენახვა ვერ მოხერხდა");

      triggerAlert(isGeo ? "სტრუქტურული ერთეული წარმატებით დაემატა!" : "Governance unit added successfully!", true);
      setNewName("");
      setNewParentId("");
      await fetchTree();
    } catch (err) {
      console.error(err);
      triggerAlert(err.message, false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingNode || !editName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:5005/api/governance/${editingNode.id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({
          name: editName,
          parentId: editParentId || null
        })
      });

      if (!response.ok) throw new Error("განახლება ვერ მოხერხდა");

      triggerAlert(isGeo ? "ერთეული წარმატებით განახლდა!" : "Governance unit updated successfully!", true);
      setEditingNode(null);
      await fetchTree();
    } catch (err) {
      console.error(err);
      triggerAlert(err.message, false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(isGeo ? "დარწმუნებული ხართ, რომ გსურთ ამ ერთეულისა და მისი ყველა ქვედანაყოფის წაშლა?" : "Are you sure you want to delete this unit and all of its sub-units?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5005/api/governance/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) throw new Error("წაშლა ვერ მოხერხდა");

      triggerAlert(isGeo ? "ერთეული წარმატებით წაიშალა!" : "Governance unit deleted successfully!", true);
      if (editingNode && editingNode.id === id) {
        setEditingNode(null);
      }
      await fetchTree();
    } catch (err) {
      console.error(err);
      triggerAlert(err.message, false);
    }
  };

  const handleInlineSave = async (id) => {
    if (!inlineEditName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:5005/api/governance/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({
          name: inlineEditName
        })
      });

      if (!response.ok) throw new Error("განახლება ვერ მოხერხდა");

      triggerAlert(isGeo ? "ერთეული წარმატებით განახლდა!" : "Governance unit updated successfully!", true);
      setInlineEditingId(null);
      await fetchTree();
    } catch (err) {
      console.error(err);
      triggerAlert(err.message, false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInlineMove = async (id, parentId) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const targetParentId = parentId === 'root' ? null : parentId;
      const response = await fetch(`http://localhost:5005/api/governance/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({
          parentId: targetParentId
        })
      });

      if (!response.ok) throw new Error("გადაადგილება ვერ მოხერხდა");

      triggerAlert(isGeo ? "იერარქია წარმატებით განახლდა!" : "Hierarchy updated successfully!", true);
      setMovingNodeId(null);
      await fetchTree();
    } catch (err) {
      console.error(err);
      triggerAlert(err.message, false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDescendantIds = (nodeId, list) => {
    let ids = [nodeId];
    if (!list || !Array.isArray(list)) return ids;
    const traverse = (id) => {
      list.forEach(item => {
        if (item && item.parentId === id && item.id) {
          ids.push(item.id);
          traverse(item.id);
        }
      });
    };
    traverse(nodeId);
    return ids;
  };

  const startEdit = (node) => {
    setEditingNode(node);
    setEditName(node.name);
    setEditParentId(node.parentId || "");
  };

  const getNodeIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes("ყრილობა") || lower.includes("assembly")) return "fa-users";
    if (lower.includes("გამგეობა") || lower.includes("board")) return "fa-building-columns";
    if (lower.includes("პრეზიდენტი") || lower.includes("president")) return "fa-user-tie";
    if (lower.includes("დირექტორი") || lower.includes("secretary") || lower.includes("ceo")) return "fa-user-gear";
    if (lower.includes("ფინანსური") || lower.includes("treasurer") || lower.includes("ხაზინადარი") || lower.includes("cfo")) return "fa-coins";
    if (lower.includes("კომისია") || lower.includes("audit")) return "fa-check-double";
    if (lower.includes("კომისიები") || lower.includes("committees")) return "fa-network-wired";
    return "fa-sitemap";
  };

  // Render a recursive tree branch
  const renderTreeNode = (node, depth = 0) => {
    if (!node) return null;
    const iconClass = getNodeIcon(node?.name || "");
    const hasChildren = node?.children && Array.isArray(node.children) && node.children.length > 0;

    return (
      <div 
        key={node?.id || depth} 
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          paddingLeft: depth === 0 ? "0" : "32px",
          marginTop: "12px",
        }}
      >
        {/* Connection Line to Parent */}
        {depth > 0 && (
          <div 
            style={{
              position: "absolute",
              left: "12px",
              top: "-12px",
              bottom: "50%",
              width: "20px",
              borderLeft: "2px dashed rgba(0, 230, 118, 0.25)",
              borderBottom: "2px dashed rgba(0, 230, 118, 0.25)",
              borderRadius: "0 0 0 8px",
              pointerEvents: "none"
            }}
          />
        )}

        {/* Node Box */}
        <div 
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "rgba(30, 34, 42, 0.65)",
            border: inlineEditingId === node?.id || movingNodeId === node?.id
              ? "1px solid #00E676"
              : isModelingMode
                ? "1px dashed rgba(0, 230, 118, 0.4)"
                : editingNode?.id === node?.id 
                  ? "1px solid var(--emerald)" 
                  : "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "8px",
            padding: "12px 16px",
            gap: "12px",
            backdropFilter: "blur(8px)",
            boxShadow: inlineEditingId === node?.id || movingNodeId === node?.id
              ? "0 0 12px rgba(0, 230, 118, 0.3)"
              : "0 4px 12px rgba(0,0,0,0.15)",
            transition: "all 0.2s ease",
            position: "relative",
            zIndex: 2,
          }}
          className="governance-node-hover"
        >
          {/* Node Info */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
            <div 
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "6px",
                backgroundColor: "rgba(0, 230, 118, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--emerald)",
                border: "1px solid rgba(0, 230, 118, 0.15)"
              }}
            >
              <i className={`fa-solid ${iconClass}`} style={{ fontSize: "15px" }}></i>
            </div>
            <div style={{ flex: 1 }}>
              {inlineEditingId === node?.id ? (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <input
                    type="text"
                    value={inlineEditName}
                    onChange={(e) => setInlineEditName(e.target.value)}
                    style={{
                      backgroundColor: "rgba(0,0,0,0.3)",
                      border: "1px solid var(--emerald)",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      color: "var(--bone)",
                      fontSize: "13px",
                      outline: "none",
                      fontFamily: "var(--font-primary)",
                      minWidth: "150px"
                    }}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleInlineSave(node?.id);
                      if (e.key === 'Escape') setInlineEditingId(null);
                    }}
                  />
                  <button
                    onClick={() => handleInlineSave(node?.id)}
                    disabled={isSubmitting}
                    style={{
                      background: "var(--emerald)",
                      border: "none",
                      color: "#121418",
                      cursor: "pointer",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: "bold",
                    }}
                    title={isGeo ? "შენახვა" : "Save"}
                  >
                    {isSubmitting ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-check"></i>}
                  </button>
                  <button
                    onClick={() => setInlineEditingId(null)}
                    disabled={isSubmitting}
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      border: "none",
                      color: "var(--bone)",
                      cursor: "pointer",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: "bold",
                    }}
                    title={isGeo ? "გაუქმება" : "Cancel"}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              ) : movingNodeId === node?.id ? (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <select
                    onChange={(e) => handleInlineMove(node?.id, e.target.value)}
                    defaultValue=""
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: "rgba(0,0,0,0.3)",
                      border: "1px solid var(--emerald)",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      color: "var(--bone)",
                      fontSize: "12px",
                      outline: "none",
                      fontFamily: "var(--font-primary)",
                      cursor: "pointer"
                    }}
                  >
                    <option value="" disabled style={{ backgroundColor: "#1c202a" }}>
                      {isGeo ? "-- აირჩიეთ მშობელი --" : "-- Choose Parent --"}
                    </option>
                    <option value="root" style={{ backgroundColor: "#1c202a" }}>
                      {isGeo ? "[მთავარი შტო / Root]" : "[Root Branch]"}
                    </option>
                    {(flatNodes || [])
                      .filter(n => n && !getDescendantIds(node?.id, flatNodes || []).includes(n?.id))
                      .map(parentOpt => (
                        <option key={parentOpt?.id} value={parentOpt?.id} style={{ backgroundColor: "#1c202a" }}>
                          {parentOpt?.name}
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={() => setMovingNodeId(null)}
                    disabled={isSubmitting}
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      border: "none",
                      color: "var(--bone)",
                      cursor: "pointer",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: "bold",
                    }}
                    title={isGeo ? "გაუქმება" : "Cancel"}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              ) : (
                <>
                  <div 
                    style={{ 
                      fontFamily: "var(--font-heading)", 
                      fontSize: "14px", 
                      fontWeight: "600", 
                      color: "var(--bone)" 
                    }}
                  >
                    {node?.name}
                  </div>
                  <div 
                    style={{ 
                      fontSize: "11px", 
                      color: "rgba(255,255,255,0.4)", 
                      marginTop: "2px",
                      fontFamily: "var(--font-mono)"
                    }}
                  >
                    ID: {node?.id ? node.id.substring(0, 8) : ""}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Node Actions */}
          {isModelingMode && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {inlineEditingId !== node?.id && movingNodeId !== node?.id && (
                <>
                  {/* Inline Edit Button */}
                  <button
                    onClick={() => {
                      setInlineEditingId(node?.id);
                      setInlineEditName(node?.name || "");
                      setMovingNodeId(null);
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--silver)",
                      cursor: "pointer",
                      padding: "6px",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s",
                    }}
                    title={isGeo ? "ინლაინ რედაქტირება" : "Inline Edit"}
                    className="action-btn-hover"
                  >
                    <i className="fa-solid fa-pen-to-square" style={{ fontSize: "13px" }}></i>
                  </button>

                  {/* Inline Move Button */}
                  <button
                    onClick={() => {
                      setMovingNodeId(node?.id);
                      setInlineEditingId(null);
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--silver)",
                      cursor: "pointer",
                      padding: "6px",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s",
                    }}
                    title={isGeo ? "მშობლის შეცვლა" : "Reparent Unit"}
                    className="action-btn-hover"
                  >
                    <i className="fa-solid fa-network-wired" style={{ fontSize: "13px" }}></i>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(node?.id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "rgba(244, 67, 54, 0.75)",
                      cursor: "pointer",
                      padding: "6px",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s",
                    }}
                    title={isGeo ? "წაშლა" : "Delete"}
                    className="action-btn-hover-danger"
                  >
                    <i className="fa-solid fa-trash-can" style={{ fontSize: "13px" }}></i>
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Children Branch Connection Line */}
        {hasChildren && (
          <div 
            style={{
              position: "absolute",
              left: "48px",
              top: "40px",
              bottom: "20px",
              width: "2px",
              borderLeft: "2px dashed rgba(0, 230, 118, 0.2)",
              pointerEvents: "none"
            }}
          />
        )}

        {/* Render Children Recursively */}
        {hasChildren && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {node?.children?.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Filter logic to prevent selection of descendants as parents
  const validParents = editingNode
    ? (flatNodes || []).filter(n => n && !getDescendantIds(editingNode?.id, flatNodes || []).includes(n?.id))
    : (flatNodes || []);

  const safeRenderTree = () => {
    try {
      return (treeData || []).map(rootNode => renderTreeNode(rootNode, 0));
    } catch (e) {
      console.error("Error rendering tree:", e);
      return (
        <div style={{ color: "#f44336", padding: "10px" }}>
          {isGeo ? "შეცდომა ხის დახატვისას" : "Error rendering hierarchy tree"}
        </div>
      );
    }
  };

  const safeRenderCanvas = () => {
    try {
      return (treeData || []).map(rootNode => renderTreeNode(rootNode, 0));
    } catch (e) {
      console.error("Error rendering canvas:", e);
      return (
        <div style={{ color: "#f44336", padding: "20px" }}>
          {isGeo ? "შეცდომა ხის დახატვისას" : "Error rendering hierarchy tree"}
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "300px", gap: "12px" }} className="text-[#00E676] p-8">
        <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: "32px", color: "var(--emerald)" }}></i>
        <div style={{ color: "var(--emerald)", fontFamily: "var(--font-primary)", fontSize: "14px" }}>
          {isGeo ? "იტვირთება იერარქია..." : "Loading hierarchy..."}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Tab Header Description */}
      <div 
        style={{ 
          borderBottom: "1px solid rgba(255,255,255,0.06)", 
          paddingBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "18px", margin: 0, fontWeight: "700", color: "var(--bone)" }}>
            {isGeo ? "მმართველობითი იერარქია (სტრუქტურა)" : "Governance Hierarchy (Structure)"}
          </h2>
          <p style={{ fontSize: "13px", color: "var(--silver)", margin: "4px 0 0 0" }}>
            {isGeo 
              ? "ფედერაციის მმართველი რგოლებისა და იერარქიული კავშირების ვიზუალური მოდელირება (იზოლირებული)." 
              : "Visual blueprint modeling of the high-level federation management branches (Isolated)."}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button 
            onClick={() => {
              setIsModelingMode(!isModelingMode);
              setInlineEditingId(null);
              setMovingNodeId(null);
            }}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              padding: "6px 12px",
              borderRadius: "6px",
              backgroundColor: isModelingMode ? "#00E676" : "rgba(0, 230, 118, 0.05)",
              color: isModelingMode ? "#121418" : "rgba(0, 230, 118, 0.8)",
              border: isModelingMode ? "1px solid #00E676" : "1px solid rgba(0, 230, 118, 0.2)",
              textTransform: "uppercase",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: isModelingMode ? "0 0 15px rgba(0, 230, 118, 0.6)" : "none",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              outline: "none"
            }}
          >
            <i className={`fa-solid ${isModelingMode ? 'fa-toggle-on' : 'fa-toggle-off'}`}></i>
            {isGeo ? "მოდელირების რეჟიმი" : "Modeling Mode"}
          </button>

          <button
            onClick={() => {
              setIsFullScreen(true);
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              padding: "6px 12px",
              borderRadius: "6px",
              backgroundColor: "rgba(0, 230, 118, 0.05)",
              color: "rgba(0, 230, 118, 0.8)",
              border: "1px solid rgba(0, 230, 118, 0.2)",
              textTransform: "uppercase",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              outline: "none"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "rgba(0, 230, 118, 0.15)";
              e.target.style.color = "#00E676";
              e.target.style.borderColor = "#00E676";
              e.target.style.boxShadow = "0 0 10px rgba(0, 230, 118, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "rgba(0, 230, 118, 0.05)";
              e.target.style.color = "rgba(0, 230, 118, 0.8)";
              e.target.style.borderColor = "rgba(0, 230, 118, 0.2)";
              e.target.style.boxShadow = "none";
            }}
          >
            <i className="fa-solid fa-expand"></i>
            {isGeo ? "სრულ ეკრანზე ნახვა" : "Full Screen"}
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div style={{ padding: "12px 16px", borderRadius: "6px", backgroundColor: "rgba(244, 67, 54, 0.1)", border: "1px solid rgba(244, 67, 54, 0.2)", color: "#f44336", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
          <i className="fa-solid fa-triangle-exclamation"></i>
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div style={{ padding: "12px 16px", borderRadius: "6px", backgroundColor: "rgba(0, 230, 118, 0.1)", border: "1px solid rgba(0, 230, 118, 0.2)", color: "var(--emerald)", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
          <i className="fa-solid fa-circle-check"></i>
          <span>{success}</span>
        </div>
      )}

      {/* Layout Grid */}
      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "350px 1fr", 
          gap: "30px", 
          alignItems: "flex-start" 
        }}
      >
        
        {/* Left column: Add/Edit Form */}
        <div 
          style={{ 
            backgroundColor: "rgba(24, 28, 36, 0.7)", 
            border: "1px solid rgba(255, 255, 255, 0.06)", 
            borderRadius: "10px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            backdropFilter: "blur(10px)"
          }}
        >
          {!editingNode ? (
            /* Creation Form */
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "14px", color: "var(--bone)", margin: 0, fontWeight: "700" }}>
                {isGeo ? "ახალი ერთეულის დამატება" : "Add New Unit"}
              </h3>
              
              {/* Unit Title */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", color: "var(--silver)", fontWeight: "500" }}>
                  {isGeo ? "ერთეულის დასახელება" : "Unit Name"}
                </label>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={isGeo ? "მაგ. სადისციპლინო კომიტეტი" : "e.g. Disciplinary Committee"}
                  style={{
                    backgroundColor: "rgba(0,0,0,0.2)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    padding: "10px 12px",
                    color: "var(--bone)",
                    fontSize: "13px",
                    outline: "none",
                    fontFamily: "var(--font-primary)",
                  }}
                  required
                />
              </div>

              {/* Parent Selector */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", color: "var(--silver)", fontWeight: "500" }}>
                  {isGeo ? "მშობელი ერთეული (იერარქია)" : "Parent Unit (Hierarchy)"}
                </label>
                <select
                  value={newParentId}
                  onChange={(e) => setNewParentId(e.target.value)}
                  style={{
                    backgroundColor: "rgba(0,0,0,0.2)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    padding: "10px 12px",
                    color: "var(--bone)",
                    fontSize: "13px",
                    outline: "none",
                    fontFamily: "var(--font-primary)",
                    cursor: "pointer"
                  }}
                >
                  <option value="" style={{ backgroundColor: "#1c202a" }}>
                    {isGeo ? "-- აირჩიეთ მშობელი (ან დატოვეთ მთავარ შტოდ) --" : "-- Select Parent (or keep Root) --"}
                  </option>
                  {(flatNodes || []).map(node => (
                    <option key={node?.id} value={node?.id} style={{ backgroundColor: "#1c202a" }}>
                      {node?.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: "var(--emerald)",
                  color: "#121418",
                  border: "none",
                  borderRadius: "6px",
                  padding: "12px",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "all 0.2s",
                  opacity: isSubmitting ? 0.6 : 1,
                }}
                className="btn-glow-emerald"
              >
                {isSubmitting ? (
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                ) : (
                  <i className="fa-solid fa-plus"></i>
                )}
                <span>{isSubmitting ? (isGeo ? "ინახება..." : "Saving...") : (isGeo ? "დამატება" : "Add Node")}</span>
              </button>
            </form>
          ) : (
            /* Editing Form */
            <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "14px", color: "var(--emerald)", margin: 0, fontWeight: "700" }}>
                  {isGeo ? "ერთეულის რედაქტირება" : "Edit Unit"}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingNode(null)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--silver)",
                    fontSize: "11px",
                    cursor: "pointer"
                  }}
                >
                  {isGeo ? "გაუქმება" : "Cancel"}
                </button>
              </div>

              {/* Edit Name */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", color: "var(--silver)", fontWeight: "500" }}>
                  {isGeo ? "ახალი დასახელება" : "New Name"}
                </label>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)}
                  style={{
                    backgroundColor: "rgba(0,0,0,0.2)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    padding: "10px 12px",
                    color: "var(--bone)",
                    fontSize: "13px",
                    outline: "none",
                    fontFamily: "var(--font-primary)",
                  }}
                  required
                />
              </div>

              {/* Edit Parent */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", color: "var(--silver)", fontWeight: "500" }}>
                  {isGeo ? "მშობელი ერთეული" : "Parent Unit"}
                </label>
                <select
                  value={editParentId}
                  onChange={(e) => setEditParentId(e.target.value)}
                  style={{
                    backgroundColor: "rgba(0,0,0,0.2)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    padding: "10px 12px",
                    color: "var(--bone)",
                    fontSize: "13px",
                    outline: "none",
                    fontFamily: "var(--font-primary)",
                    cursor: "pointer"
                  }}
                >
                  <option value="" style={{ backgroundColor: "#1c202a" }}>
                    {isGeo ? "-- აირჩიეთ მშობელი (ან დატოვეთ მთავარ შტოდ) --" : "-- Select Parent (or keep Root) --"}
                  </option>
                  {(validParents || []).map(node => (
                    <option key={node?.id} value={node?.id} style={{ backgroundColor: "#1c202a" }}>
                      {node?.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: "var(--emerald)",
                  color: "#121418",
                  border: "none",
                  borderRadius: "6px",
                  padding: "12px",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "all 0.2s",
                  opacity: isSubmitting ? 0.6 : 1,
                }}
                className="btn-glow-emerald"
              >
                {isSubmitting ? (
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                ) : (
                  <i className="fa-solid fa-floppy-disk"></i>
                )}
                <span>{isSubmitting ? (isGeo ? "ინახება..." : "Saving...") : (isGeo ? "შენახვა" : "Save Changes")}</span>
              </button>
            </form>
          )}

          {/* Preset list display for reference */}
          <div 
            style={{ 
              borderTop: "1px solid rgba(255,255,255,0.06)", 
              paddingTop: "16px",
              marginTop: "4px"
            }}
          >
            <div style={{ fontSize: "11px", color: "var(--silver)", lineHeight: "1.5" }}>
              <strong style={{ color: "var(--bone)", display: "block", marginBottom: "6px" }}>
                {isGeo ? "💡 რჩევა სტრუქტურირებისთვის:" : "💡 Structuring Tip:"}
              </strong>
              {isGeo 
                ? "ყველა საჭირო ძირითადი რგოლი (ყრილობა, გამგეობა, პრეზიდენტი, კომისიები) უკვე ჩატვირთულია წინასწარ. თქვენ შეგიძლიათ შეცვალოთ მათი მშობლები ან დაამატოთ ნებისმიერი ახალი დარგობრივი თუ ადმინისტრაციული ერთეული."
                : "All primary governance presets (Assembly, Board, President, Committees) have been auto-seeded. You can drag, reparent, or rename them as you see fit."}
            </div>
          </div>

        </div>

        {/* Right column: Hierarchy Tree Display */}
        <div 
          style={{ 
            backgroundColor: "rgba(24, 28, 36, 0.4)", 
            border: "1px solid rgba(255, 255, 255, 0.06)", 
            borderRadius: "10px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            minHeight: "450px",
            maxHeight: "750px",
            overflowY: "auto"
          }}
          className="custom-scrollbar"
        >
          {(!treeData || treeData.length === 0) ? (
            <div style={{ display: "flex", flex: 1, justifyContent: "center", alignItems: "center", flexDirection: "column", color: "var(--silver)", gap: "10px" }}>
              <i className="fa-solid fa-folder-open" style={{ fontSize: "40px", opacity: 0.3 }}></i>
              <span>{isGeo ? "სტრუქტურა ცარიელია" : "Hierarchy structure is empty"}</span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {safeRenderTree()}
            </div>
          )}
        </div>

      {/* Full-Screen Canvas Modal / Overlay Layer */}
      {isFullScreen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: '#0d1117',
            display: 'flex',
            flexDirection: 'column',
            color: 'var(--bone)',
            fontFamily: 'var(--font-primary)'
          }}
        >
          {/* Full Screen Header */}
          <div 
            style={{
              padding: '16px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              backgroundColor: '#161b22',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 10
            }}
          >
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', margin: 0, fontWeight: '700', color: 'var(--bone)' }}>
                {isGeo ? "მმართველობითი სტრუქტურა — სრული ეკრანის ხედვა" : "Governance Structure — Full Screen View"}
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--silver)', margin: '4px 0 0 0' }}>
                {isGeo 
                  ? "მართეთ და მოდელირეთ იერარქია მასშტაბურ რეჟიმში. გამოიყენეთ მაუსის გორგოლაჭი ან სლაიდერი მასშტაბირებისთვის. გადააადგილეთ კოდების დაფა მაუსის ჩაჭიდებით." 
                  : "Manage and model the hierarchy at scale. Use mouse wheel or slider to zoom. Drag to pan the canvas."}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Modeling Mode Toggle */}
              <button 
                onClick={() => {
                  setIsModelingMode(!isModelingMode);
                  setInlineEditingId(null);
                  setMovingNodeId(null);
                }}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  backgroundColor: isModelingMode ? "#00E676" : "rgba(0, 230, 118, 0.05)",
                  color: isModelingMode ? "#121418" : "rgba(0, 230, 118, 0.8)",
                  border: isModelingMode ? "1px solid #00E676" : "1px solid rgba(0, 230, 118, 0.2)",
                  textTransform: "uppercase",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: isModelingMode ? "0 0 15px rgba(0, 230, 118, 0.6)" : "none",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  outline: "none"
                }}
              >
                <i className={`fa-solid ${isModelingMode ? 'fa-toggle-on' : 'fa-toggle-off'}`}></i>
                {isGeo ? "მოდელირების რეჟიმი" : "Modeling Mode"}
              </button>

              {/* Close button */}
              <button
                onClick={() => setIsFullScreen(false)}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  color: 'var(--bone)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  outline: 'none'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.12)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.06)'}
              >
                <i className="fa-solid fa-xmark"></i>
                <span>{isGeo ? "დახურვა" : "Close"}</span>
              </button>
            </div>
          </div>

          {/* Floating alerts in full screen */}
          <div style={{ position: 'absolute', top: '90px', left: '50%', transform: 'translateX(-50%)', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '10px', width: '90%', maxWidth: '500px' }}>
            {error && (
              <div style={{ padding: "12px 16px", borderRadius: "6px", backgroundColor: "rgba(244, 67, 54, 0.95)", border: "1px solid rgba(244, 67, 54, 0.2)", color: "#fff", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", boxShadow: '0 4px 12px rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
                <i className="fa-solid fa-triangle-exclamation"></i>
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div style={{ padding: "12px 16px", borderRadius: "6px", backgroundColor: "rgba(0, 230, 118, 0.95)", border: "1px solid rgba(0, 230, 118, 0.2)", color: "#121418", fontWeight: '600', fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", boxShadow: '0 4px 12px rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
                <i className="fa-solid fa-circle-check"></i>
                <span>{success}</span>
              </div>
            )}
          </div>

          {/* Zoom & Pan Canvas Container */}
          <div
            ref={canvasContainerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            style={{
              flex: 1,
              overflow: 'hidden',
              position: 'relative',
              cursor: isDragging ? 'grabbing' : 'grab',
              backgroundColor: '#0d1117',
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          >
            {/* Interactive Transform Node Canvas */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '10%',
                transform: `translate(-50%, 0) translate(${pan?.x ?? 0}px, ${pan?.y ?? 0}px) scale(${zoom ?? 1})`,
                transformOrigin: 'top center',
                width: 'fit-content',
                minWidth: '600px',
                maxWidth: '1200px',
                padding: '40px',
                userSelect: 'none',
                pointerEvents: 'auto'
              }}
            >
              {(!treeData || treeData.length === 0) ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", color: "var(--silver)", gap: "10px" }}>
                  <i className="fa-solid fa-folder-open" style={{ fontSize: "40px", opacity: 0.3 }}></i>
                  <span>{isGeo ? "სტრუქტურა ცარიელია" : "Hierarchy structure is empty"}</span>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {safeRenderCanvas()}
                </div>
              )}
            </div>

            {/* Floating Canvas Controls (Slider Widget and Buttons) */}
            <div
              style={{
                position: 'absolute',
                bottom: '24px',
                right: '24px',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                backgroundColor: 'rgba(22, 27, 34, 0.85)',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '12px 20px',
                borderRadius: '10px',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                userSelect: 'none'
              }}
            >
              {/* Zoom Out Button */}
              <button
                onClick={() => setZoom(prev => Math.max(Number(((prev ?? 1) - 0.1).toFixed(2)), 0.3))}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: 'none',
                  color: 'var(--bone)',
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px'
                }}
                title={isGeo ? "დაპატარავება" : "Zoom Out"}
              >
                <i className="fa-solid fa-minus"></i>
              </button>

              {/* Zoom Slider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="range"
                  min="0.3"
                  max="3"
                  step="0.05"
                  value={zoom ?? 1}
                  onChange={(e) => setZoom(parseFloat(e.target.value) || 1)}
                  style={{
                    width: '120px',
                    accentColor: 'var(--emerald)',
                    cursor: 'pointer'
                  }}
                />
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', minWidth: '40px', textAlign: 'right' }}>
                  {Math.round((zoom ?? 1) * 100)}%
                </span>
              </div>

              {/* Zoom In Button */}
              <button
                onClick={() => setZoom(prev => Math.min(Number(((prev ?? 1) + 0.1).toFixed(2)), 3))}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: 'none',
                  color: 'var(--bone)',
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px'
                }}
                title={isGeo ? "გადიდება" : "Zoom In"}
              >
                <i className="fa-solid fa-plus"></i>
              </button>

              <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255,255,255,0.1)' }} />

              {/* Fit to Center / Reset Button */}
              <button
                onClick={() => {
                  setPan({ x: 0, y: 0 });
                  setZoom(1);
                }}
                style={{
                  background: 'rgba(0, 230, 118, 0.1)',
                  border: '1px solid rgba(0, 230, 118, 0.2)',
                  color: 'var(--emerald)',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title={isGeo ? "ხედვის გასწორება" : "Reset View"}
              >
                <i className="fa-solid fa-compress"></i>
                <span>{isGeo ? "ცენტრში გასწორება" : "Reset"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded CSS for Hover Effects & Micro-animations */}
      <style>{`
        .governance-node-hover:hover {
          border-color: rgba(0, 230, 118, 0.35) !important;
          background-color: rgba(36, 42, 52, 0.8) !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 230, 118, 0.08) !important;
        }
        .action-btn-hover:hover {
          background-color: rgba(255, 255, 255, 0.08) !important;
          color: var(--emerald) !important;
        }
        .action-btn-hover-danger:hover {
          background-color: rgba(244, 67, 54, 0.1) !important;
          color: #f44336 !important;
        }
        .btn-glow-emerald:hover {
          background-color: #00b0ff !important;
          box-shadow: 0 0 12px rgba(0, 230, 118, 0.4);
        }
      `}</style>

    </div>
  </div>
  );
};

export default GovernanceHierarchyTab;
