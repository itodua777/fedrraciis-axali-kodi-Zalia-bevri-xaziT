import React from 'react';

const menuItems = [
  // 570 Tab items
  {
    id: 'dashboard',
    node: '570',
    label: 'მთავარი',
    icon: 'fa-solid fa-chart-line'
  },
  {
    id: 'management',
    node: '570',
    label: 'მენეჯმენტი',
    icon: 'fa-solid fa-sitemap'
  },
  {
    id: 'calendar',
    node: '570',
    label: 'აქტივობის კალენდარი',
    icon: 'fa-solid fa-calendar-days',
    iconStyle: { textShadow: "0 0 8px color-mix(in oklab, var(--color-emerald-core) 80%, transparent)", color: "var(--color-emerald-core)" }
  },
  {
    id: 'partnerships',
    node: '570',
    label: 'პარტნიორობა',
    icon: 'fa-solid fa-handshake-angle'
  },
  {
    id: 'warehouse',
    node: '570',
    label: 'საწყობი (Warehouse)',
    icon: 'fa-solid fa-box'
  },
  {
    id: 'spaces',
    node: '570',
    label: 'სავარჯიშო სივრცე',
    icon: 'fa-solid fa-map-location-dot',
    iconStyle: { textShadow: "0 0 8px color-mix(in oklab, var(--color-emerald-core) 80%, transparent)", color: "var(--color-emerald-core)" }
  },
  {
    id: 'medianews',
    node: '570',
    label: 'მედიანიუსი',
    icon: 'fa-solid fa-photo-film',
    iconStyle: { textShadow: "0 0 8px color-mix(in oklab, var(--color-emerald-core) 80%, transparent)", color: "var(--color-emerald-core)" }
  },
  {
    id: 'incidents',
    node: '570',
    label: 'ინციდენტი',
    icon: 'fa-solid fa-triangle-exclamation'
  },
  {
    id: 'settings',
    node: '570',
    label: 'ფედერაციის პარამეტრები',
    icon: 'fa-solid fa-gear',
    iconStyle: { textShadow: "0 0 8px color-mix(in oklab, var(--color-emerald-core) 80%, transparent)", color: "var(--color-emerald-core)" }
  },

  // 8849 Tab items
  {
    id: 'athletes',
    node: '8849',
    label: 'სპორტსმენი',
    icon: 'fa-solid fa-person-running'
  },
  {
    id: 'mentors',
    node: '8849',
    label: 'მენტორები',
    icon: 'fa-solid fa-user-graduate'
  },
  {
    id: 'memorial',
    node: '8849',
    label: 'ლეგენდარული სპორტსმენები',
    icon: 'fa-solid fa-award'
  },
  {
    id: 'clubs',
    node: '8849',
    label: 'კლუბების რეესტრი',
    icon: 'fa-solid fa-building-flag',
    iconStyle: { textShadow: "0 0 8px color-mix(in oklab, var(--color-emerald-core) 80%, transparent)", color: "var(--color-emerald-core)" }
  },

  {
    id: 'routes',
    node: '8849',
    label: 'მარშრუტის დაგეგმვა',
    icon: 'fa-solid fa-mountain',
    iconStyle: { textShadow: "0 0 8px color-mix(in oklab, var(--color-emerald-core) 80%, transparent)", color: "var(--color-emerald-core)" }
  },
  {
    id: 'peaks',
    node: '8849',
    label: 'მწვერვალები',
    icon: 'fa-solid fa-mountain-sun',
    iconStyle: { textShadow: "0 0 8px color-mix(in oklab, var(--color-emerald-core) 80%, transparent)", color: "var(--color-emerald-core)" }
  }
];

const getViewTab = (view) => {
  const resolvedView = view === 'add_athlete' ? 'athletes' :
                       view === 'add_incident' ? 'incidents' :
                       view === 'add_mentor' ? 'mentors' : view;
  const item = menuItems.find(i => i.id === resolvedView);
  return item ? item.node : '570';
};

const Sidebar = ({ currentView, onViewChange, federation }) => {
  const [activeNode, setActiveNode] = React.useState(() => getViewTab(currentView));
  const [isCollapsed, setIsCollapsed] = React.useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });

  React.useEffect(() => {
    const resolvedTab = getViewTab(currentView);
    if (resolvedTab !== activeNode) {
      setActiveNode(resolvedTab);
    }
  }, [currentView]);

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const nextVal = !prev;
      localStorage.setItem('sidebar_collapsed', String(nextVal));
      return nextVal;
    });
  };

  const containerStyle = {
    position: "relative",
    width: isCollapsed ? "80px" : "250px",
    backgroundColor: "var(--color-iron)",
    borderRight: "1px solid var(--color-iron-border)",
    padding: isCollapsed ? "20px 10px" : "20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    boxSizing: "border-box",
    flexShrink: 0,
    transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
  };

  const identityBlockStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: isCollapsed ? "0px" : "12px",
    marginBottom: "10px",
    paddingBottom: isCollapsed ? "10px" : "20px",
    borderBottom: "1px solid var(--color-iron-border)",
    flexShrink: 0,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
  };

  const logoStyle = {
    width: isCollapsed ? "40px" : "72px",
    height: isCollapsed ? "40px" : "72px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid var(--color-iron-border)",
    backgroundColor: "var(--color-bone-light)",
    transition: "width 0.3s ease, height 0.3s ease"
  };

  const federationNameStyle = {
    display: isCollapsed ? "none" : "block",
    color: "var(--color-bone-light)",
    fontFamily: "'FiraGO', 'Lato', 'Poppins', sans-serif",
    fontWeight: "700",
    fontSize: "14px",
    textAlign: "center",
    lineHeight: "1.4"
  };

  const FEDERATIONS = {
    mountaineering: { name: "საქართველოს მთასვლელთა გაერთიანებული ფედერაცია", logo: "../logo.jpg" },
    judo: { name: "საქართველოს ძიუდოს ფედერაცია", logo: "../logo.jpg" },
    rugby: { name: "საქართველოს რაგბის კავშირი", logo: "../logo.jpg" }
  };
  
  const fedInfo = FEDERATIONS[federation] || { name: "საქართველოს მთასვლელთა გაერთიანებული ფედერაცია", logo: "../logo.jpg" };

  const toggleContainerStyle = {
    display: "flex",
    flexDirection: isCollapsed ? "column" : "row",
    width: "100%",
    backgroundColor: "var(--color-iron)",
    border: "1px solid var(--color-iron-border)",
    borderRadius: "8px",
    overflow: "hidden",
    flexShrink: 0,
    gap: isCollapsed ? "4px" : "0px",
    padding: isCollapsed ? "4px" : "0px"
  };

  const toggleButtonStyle = (node) => ({
    flex: 1,
    padding: isCollapsed ? "6px 0" : "10px 0",
    backgroundColor: "transparent",
    color: activeNode === node ? "var(--color-emerald-core)" : "var(--color-silver-structure)",
    border: "none",
    borderBottom: (!isCollapsed && activeNode === node) ? "2px solid var(--color-emerald-core)" : "2px solid transparent",
    textShadow: activeNode === node ? "0 0 10px var(--color-emerald-core)" : "none",
    fontFamily: "'FiraGO', 'Poppins', sans-serif",
    fontWeight: "700",
    fontSize: isCollapsed ? "12px" : "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    borderRadius: isCollapsed ? "4px" : "0px"
  });

  const isViewActive = (itemId) => {
    if (currentView === itemId) return true;
    if (itemId === 'athletes' && currentView === 'add_athlete') return true;
    if (itemId === 'incidents' && currentView === 'add_incident') return true;
    if (itemId === 'mentors' && currentView === 'add_mentor') return true;
    return false;
  };

  const buttonStyle = (view) => {
    const isActive = isViewActive(view);
    return {
      backgroundColor: isActive ? "color-mix(in oklab, var(--color-emerald-core) 10%, transparent)" : "transparent",
      color: isActive ? "var(--color-bone-light)" : "var(--color-emerald-core)",
      border: isActive ? "1px solid var(--color-emerald-core)" : "1px solid var(--color-iron-border)",
      padding: isCollapsed ? "12px 0px" : "12px",
      borderRadius: "8px",
      cursor: "pointer",
      boxShadow: isActive ? "0 0 12px var(--color-emerald-core)" : "none",
      transition: "all 0.3s ease",
      textAlign: isCollapsed ? "center" : "left",
      display: "flex",
      alignItems: "center",
      justifyContent: isCollapsed ? "center" : "flex-start",
      gap: isCollapsed ? "0px" : "10px",
      fontFamily: "'FiraGO', 'Lato', 'Poppins', sans-serif",
      fontSize: "14px",
      fontWeight: "500",
      lineHeight: "1.4"
    };
  };

  const navListStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    animation: "fadeIn 0.2s ease-in-out",
    overflowY: "auto",
    flex: 1,
    paddingRight: "5px"
  };

  return (
    <div style={containerStyle}>
      <button 
        className="sidebar-toggle-btn" 
        onClick={toggleCollapse} 
        title={isCollapsed ? "გაშლა" : "შეკეცვა"}
      >
        <i className={`fa-solid ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
      </button>

      <div style={identityBlockStyle}>
        <img src={fedInfo.logo} alt="Federation Logo" style={logoStyle} />
        <div style={federationNameStyle}>{fedInfo.name}</div>
      </div>

      <div style={toggleContainerStyle}>
        <button 
          style={toggleButtonStyle('570')} 
          onClick={() => { 
            setActiveNode('570'); 
            if (getViewTab(currentView) !== '570') {
              onViewChange('dashboard'); 
            }
          }}
        >
          570
        </button>
        <button 
          style={toggleButtonStyle('8849')} 
          onClick={() => { 
            setActiveNode('8849'); 
            if (getViewTab(currentView) !== '8849') {
              onViewChange('athletes'); 
            }
          }}
        >
          8849
        </button>
      </div>

      <div key={activeNode} style={navListStyle}>
        {menuItems
          .filter(item => item.node === activeNode)
          .map(item => (
            <button
              key={item.id}
              style={buttonStyle(item.id)}
              onClick={() => onViewChange(item.id)}
              title={item.label}
            >
              <i className={item.icon} style={item.iconStyle}></i>
              <span style={{ display: isCollapsed ? "none" : "inline" }}> {item.label}</span>
            </button>
          ))
        }
      </div>
    </div>
  );
};

export default Sidebar;
