import React from '../../utils/react-shim.js';
import { useTranslation } from '../../context/LanguageContext.jsx';

const TreeNode = ({ node, activeUnit, onSelect, onMove, expandedNodes, toggleExpand, level = 0 }) => {
  const { i18n } = useTranslation();
  const isGeo = i18n.language === 'GEO';

  const isExpanded = !!expandedNodes[node.id];
  const isActive = activeUnit && activeUnit.id === node.id;
  const hasChildren = node.children && node.children.length > 0;

  const handleDragStart = (e) => {
    e.stopPropagation();
    e.dataTransfer.setData("text/plain", node.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const draggedId = e.dataTransfer.getData("text/plain");
    if (draggedId && draggedId !== node.id) {
      onMove(draggedId, node.id);
    }
  };

  const nodeStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    backgroundColor: isActive ? "rgba(0, 230, 118, 0.08)" : "transparent",
    border: isActive ? "1px solid rgba(0, 230, 118, 0.2)" : "1px solid transparent",
    color: isActive ? "var(--emerald)" : "var(--bone)",
    fontFamily: "var(--font-primary)",
    fontSize: "13px",
    fontWeight: isActive ? "700" : "500",
    transition: "all 0.15s ease-in-out",
    userSelect: "none"
  };

  const iconStyle = {
    fontSize: "12px",
    color: isActive ? "var(--emerald)" : "var(--silver)",
    width: "16px",
    textAlign: "center"
  };

  const pillStyle = {
    marginLeft: "auto",
    fontSize: "10px",
    fontWeight: "700",
    backgroundColor: isActive ? "rgba(0, 230, 118, 0.2)" : "rgba(255, 255, 255, 0.05)",
    border: `1px solid ${isActive ? "rgba(0, 230, 118, 0.3)" : "rgba(255, 255, 255, 0.1)"}`,
    color: isActive ? "var(--emerald)" : "var(--silver)",
    borderRadius: "10px",
    padding: "2px 8px",
    fontFamily: "var(--font-mono)"
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'ფილიალი':
        return "fa-building-shield";
      case 'დეპარტამენტი':
        return "fa-folder-open";
      case 'კომიტეტი':
        return "fa-users-line";
      case 'კომისია':
        return "fa-scale-balanced";
      default:
        return "fa-network-wired";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      {/* Node Element */}
      <div 
        style={nodeStyle}
        onClick={() => onSelect(node)}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onMouseEnter={e => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.02)";
          }
        }}
        onMouseLeave={e => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = "transparent";
          }
        }}
      >
        {/* Toggle Expand Button */}
        <span 
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          onClick={(e) => {
            e.stopPropagation();
            toggleExpand(node.id);
          }}
        >
          {hasChildren ? (
            <i className={`fa-solid ${isExpanded ? "fa-chevron-down" : "fa-chevron-right"}`} style={{ fontSize: "10px", marginRight: "4px", color: "var(--silver)" }}></i>
          ) : (
            <span style={{ width: "14px" }} />
          )}
        </span>

        {/* Unit Icon */}
        <i className={`fa-solid ${getTypeIcon(node.unitType)}`} style={iconStyle}></i>

        {/* Node Name */}
        <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "160px" }}>
          {node.name}
        </span>

        {/* Member Count Indicator */}
        {node.memberCount > 0 && (
          <span style={pillStyle} title={isGeo ? `${node.memberCount} თანამშრომელი` : `${node.memberCount} Members`}>
            {node.memberCount}
          </span>
        )}
      </div>

      {/* Children list */}
      {isExpanded && hasChildren && (
        <div style={{ paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "2px", borderLeft: "1px dashed rgba(255, 255, 255, 0.05)", marginLeft: "18px", marginTop: "2px" }}>
          {node.children.map(child => (
            <TreeNode 
              key={child.id}
              node={child}
              activeUnit={activeUnit}
              onSelect={onSelect}
              onMove={onMove}
              expandedNodes={expandedNodes}
              toggleExpand={toggleExpand}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const DepartmentTree = ({ treeData, activeUnit, onSelect, onMove, onAddClick }) => {
  const { i18n } = useTranslation();
  const isGeo = i18n.language === 'GEO';

  const [expandedNodes, setExpandedNodes] = React.useState({});

  const toggleExpand = (id) => {
    setExpandedNodes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Expand all roots on initial mount
  React.useEffect(() => {
    if (treeData && treeData.length > 0) {
      const initial = {};
      treeData.forEach(root => {
        initial[root.id] = true;
      });
      setExpandedNodes(prev => ({ ...initial, ...prev }));
    }
  }, [treeData]);

  const handleContainerDragOver = (e) => {
    e.preventDefault();
  };

  const handleContainerDrop = (e) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    if (draggedId) {
      // Find if draggedId is already a top-level unit
      const isTopLevel = treeData.some(root => root.id === draggedId);
      if (!isTopLevel) {
        onMove(draggedId, null);
      }
    }
  };

  const containerStyle = {
    width: "280px",
    borderRight: "1px solid var(--iron-line)",
    paddingRight: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    height: "100%",
    overflowY: "auto",
    flexShrink: 0
  };

  const scrollableAreaStyle = {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  };

  const addBtnStyle = {
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
  };

  return (
    <div style={containerStyle}>
      {/* Search/Filter placeholder or section label */}
      <div style={{
        fontFamily: "var(--font-heading)",
        fontSize: "11px",
        color: "var(--silver)",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: "1px"
      }}>
        {isGeo ? "სტრუქტურული ხე" : "Structural Hierarchy"}
      </div>

      {/* Tree list area */}
      <div 
        style={scrollableAreaStyle} 
        className="custom-scrollbar"
        onDragOver={handleContainerDragOver}
        onDrop={handleContainerDrop}
      >
        {treeData.length === 0 ? (
          <div style={{
            padding: "20px 0",
            textAlign: "center",
            color: "var(--silver)",
            fontSize: "12px",
            fontStyle: "italic"
          }}>
            {isGeo ? "ქვედანაყოფები არ არის" : "No structure units"}
          </div>
        ) : (
          treeData.map(root => (
            <TreeNode 
              key={root.id}
              node={root}
              activeUnit={activeUnit}
              onSelect={onSelect}
              onMove={onMove}
              expandedNodes={expandedNodes}
              toggleExpand={toggleExpand}
            />
          ))
        )}
      </div>

      {/* Add Button */}
      <button 
        style={addBtnStyle}
        onClick={onAddClick}
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
        <span>{isGeo ? "ქვედანაყოფის დამატება" : "Add Sub-Unit"}</span>
      </button>
    </div>
  );
};

export default DepartmentTree;
