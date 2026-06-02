import React from 'react';
import { useTranslation } from '../../context/LanguageContext.jsx';

const menuItems = [
  // 570 Tab items
  { id: 'dashboard',    node: '570',  label: 'მთავარი',                icon: 'fa-solid fa-chart-line' },
  { id: 'management',   node: '570',  label: 'მენეჯმენტი',             icon: 'fa-solid fa-sitemap' },
  { id: 'calendar',     node: '570',  label: 'აქტივობის კალენდარი',    icon: 'fa-solid fa-calendar-days' },
  { id: 'partnerships', node: '570',  label: 'პარტნიორობა',           icon: 'fa-solid fa-handshake-angle' },
  { id: 'warehouse',    node: '570',  label: 'საწყობი (Warehouse)',    icon: 'fa-solid fa-box' },
  { id: 'spaces',       node: '570',  label: 'სავარჯიშო სივრცე',       icon: 'fa-solid fa-map-location-dot' },
  { id: 'medianews',    node: '570',  label: 'მედიანიუსი',             icon: 'fa-solid fa-photo-film' },
  { id: 'incidents',    node: '570',  label: 'ინციდენტი',              icon: 'fa-solid fa-triangle-exclamation' },
  { id: 'settings',     node: '570',  label: 'ფედერაციის პარამეტრები', icon: 'fa-solid fa-gear' },

  // 8849 Tab items
  { id: 'athletes',  node: '8849', label: 'სპორტსმენი',              icon: 'fa-solid fa-person-running' },
  { id: 'mentors',   node: '8849', label: 'მენტორები',               icon: 'fa-solid fa-user-graduate' },
  { id: 'memorial',  node: '8849', label: 'ლეგენდარული სპორტსმენები', icon: 'fa-solid fa-award' },
  { id: 'clubs',     node: '8849', label: 'კლუბების რეესტრი',         icon: 'fa-solid fa-building-flag' },
  { id: 'routes',    node: '8849', label: 'მარშრუტის დაგეგმვა',       icon: 'fa-solid fa-mountain' },
  { id: 'peaks',     node: '8849', label: 'მწვერვალები',              icon: 'fa-solid fa-mountain-sun' },
];

const getViewTab = (view) => {
  const resolvedView = view === 'add_athlete' ? 'athletes' :
                       view === 'add_incident' ? 'incidents' :
                       view === 'add_mentor' ? 'mentors' : view;
  const item = menuItems.find(i => i.id === resolvedView);
  return item ? item.node : '570';
};

const Sidebar = ({ currentView, onViewChange, federation }) => {
  const { t } = useTranslation();
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

  const isViewActive = (itemId) => {
    if (currentView === itemId) return true;
    if (itemId === 'athletes'  && currentView === 'add_athlete')  return true;
    if (itemId === 'incidents' && currentView === 'add_incident') return true;
    if (itemId === 'mentors'   && currentView === 'add_mentor')   return true;
    return false;
  };

  const FEDERATIONS = {
    mountaineering: { name: t('federation.mountaineering') },
    judo:           { name: t('federation.judo') },
    rugby:          { name: t('federation.rugby') },
  };
  const fedInfo = FEDERATIONS[federation] || { name: t('federation.mountaineering') };

  /* ── Inline styles ── */
  const W = isCollapsed ? 72 : 248;

  const sidebarStyle = {
    position: 'relative',
    width: `${W}px`,
    minWidth: `${W}px`,
    backgroundColor: 'var(--iron)',
    borderRight: '1px solid var(--iron-line)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    flexShrink: 0,
    transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1), min-width 0.3s cubic-bezier(0.4,0,0.2,1)',
    overflow: 'hidden',
  };

  /* 9-Node Grid */
  const nodeSize    = isCollapsed ? 7  : 11;
  const nodeGap     = isCollapsed ? 5  : 10;
  const gridSize    = isCollapsed ? 39 : 63;

  const nodeBaseStyle = {
    width: `${nodeSize}px`, height: `${nodeSize}px`,
    borderRadius: '50%',
    backgroundColor: 'rgba(245,245,247,.7)',
    transition: 'all 0.3s ease',
    flexShrink: 0,
  };
  const nodeCoreStyle = {
    ...nodeBaseStyle,
    backgroundColor: 'var(--fed-blue)',
    boxShadow: '0 0 14px var(--fed-blue), 0 0 28px rgba(8,133,237,.35)',
  };

  /* Tab toggle */
  const tabStyle = (node) => ({
    flex: 1,
    padding: isCollapsed ? '8px 0' : '9px 0',
    backgroundColor: 'transparent',
    color: activeNode === node ? 'var(--fed-blue)' : 'var(--silver)',
    border: 'none',
    borderBottom: activeNode === node
      ? '2px solid var(--fed-blue)'
      : '2px solid transparent',
    fontFamily: 'var(--font-heading)',
    fontWeight: '800',
    fontSize: isCollapsed ? '11px' : '14px',
    letterSpacing: '1px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderRadius: '0',
    outline: 'none',
    textShadow: activeNode === node ? '0 0 10px rgba(8,133,237,.6)' : 'none',
  });

  /* Nav item */
  const navItemStyle = (itemId) => {
    const active = isViewActive(itemId);
    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: isCollapsed ? 'center' : 'flex-start',
      gap: isCollapsed ? '0' : '12px',
      padding: isCollapsed ? '11px 0' : '10px 14px',
      backgroundColor: active ? 'rgba(8,133,237,.08)' : 'transparent',
      color: active ? 'var(--bone)' : 'var(--silver)',
      border: 'none',
      borderLeft: active ? '2px solid var(--fed-blue)' : '2px solid transparent',
      borderRadius: '0 4px 4px 0',
      cursor: 'pointer',
      transition: 'all 0.18s ease',
      fontFamily: 'var(--font-heading)',
      fontSize: '13px',
      fontWeight: '500',
      lineHeight: '1.4',
      outline: 'none',
      width: '100%',
      textAlign: isCollapsed ? 'center' : 'left',
      boxShadow: active ? 'inset 0 0 12px rgba(8,133,237,.05)' : 'none',
    };
  };

  return (
    <div style={sidebarStyle}>
      {/* Blue top accent bar */}
      <div className="pg-accent-bar" />

      {/* Collapse toggle */}
      <button
        className="sidebar-toggle-btn"
        onClick={toggleCollapse}
        title={isCollapsed ? t('sidebar.expand') : t('sidebar.collapse')}
      >
        <i className={`fa-solid ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`} style={{ fontSize: '10px' }} />
      </button>

      {/* ── Identity block ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0',
        padding: isCollapsed ? '20px 8px 14px' : '24px 16px 16px',
        borderBottom: '1px solid var(--iron-line)',
        flexShrink: 0,
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Blue radial glow */}
        <div style={{
          position: 'absolute', top: '-20px', left: '50%',
          transform: 'translateX(-50%)',
          width: '140px', height: '140px',
          background: 'radial-gradient(circle, rgba(8,133,237,.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* 9-Node Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(3, ${nodeSize}px)`,
          gap: `${nodeGap}px`,
          width: `${gridSize}px`,
          height: `${gridSize}px`,
          marginBottom: isCollapsed ? '0' : '10px',
          transition: 'all 0.3s ease',
          position: 'relative',
          zIndex: 1,
        }}>
          <div style={nodeBaseStyle}/><div style={nodeBaseStyle}/><div style={nodeBaseStyle}/>
          <div style={nodeBaseStyle}/><div style={nodeCoreStyle}/><div style={nodeBaseStyle}/>
          <div style={nodeBaseStyle}/><div style={nodeBaseStyle}/><div style={nodeBaseStyle}/>
        </div>

        {/* Wordmark (only expanded) */}
        {!isCollapsed && (
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '22px',
              fontWeight: '900',
              letterSpacing: '5px',
              textTransform: 'uppercase',
              color: 'var(--bone)',
              lineHeight: '1',
            }}>
              ART<span style={{ color: 'var(--fed-blue)' }}>R</span>ON
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '8px',
              fontWeight: '400',
              letterSpacing: '6px',
              textTransform: 'uppercase',
              color: 'var(--bone-30)',
              marginTop: '3px',
            }}>
              FEDERATION
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              color: 'var(--bone-60)',
              marginTop: '8px',
              paddingTop: '8px',
              borderTop: '1px solid var(--iron-line)',
              letterSpacing: '0.3px',
            }}>
              {fedInfo.name}
            </div>
          </div>
        )}
      </div>

      {/* ── Tab toggle: 570 / 8849 ── */}
      <div style={{
        display: 'flex',
        flexDirection: isCollapsed ? 'column' : 'row',
        flexShrink: 0,
        borderBottom: '1px solid var(--iron-line)',
        gap: isCollapsed ? '0' : '0',
      }}>
        <button
          style={tabStyle('570')}
          onClick={() => {
            setActiveNode('570');
            if (getViewTab(currentView) !== '570') onViewChange('dashboard');
          }}
        >
          570
        </button>
        <button
          style={tabStyle('8849')}
          onClick={() => {
            setActiveNode('8849');
            if (getViewTab(currentView) !== '8849') onViewChange('athletes');
          }}
        >
          8849
        </button>
      </div>

      {/* ── Nav list ── */}
      <div
        key={activeNode}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          overflowY: 'auto',
          flex: 1,
          padding: isCollapsed ? '8px 4px' : '8px 8px',
          animation: 'fadeIn 0.2s ease-in-out',
        }}
        className="custom-scrollbar"
      >
        {menuItems
          .filter(item => item.node === activeNode)
          .map(item => {
            const active = isViewActive(item.id);
            return (
              <button
                key={item.id}
                style={navItemStyle(item.id)}
                onClick={() => onViewChange(item.id)}
                title={isCollapsed ? t('sidebar.' + item.id) : undefined}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'rgba(8,133,237,.05)';
                    e.currentTarget.style.color = 'var(--bone)';
                    e.currentTarget.style.borderLeftColor = 'rgba(8,133,237,.3)';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--silver)';
                    e.currentTarget.style.borderLeftColor = 'transparent';
                  }
                }}
              >
                <i
                  className={item.icon}
                  style={{
                    color: active ? 'var(--fed-blue)' : 'inherit',
                    fontSize: '15px',
                    width: '18px',
                    textAlign: 'center',
                    flexShrink: 0,
                    transition: 'color 0.18s',
                  }}
                />
                {!isCollapsed && (
                  <span style={{ fontSize: '13px', lineHeight: '1.3' }}>
                    {t('sidebar.' + item.id)}
                  </span>
                )}
              </button>
            );
          })}
      </div>

      {/* ── Footer system info (only expanded) ── */}
      {!isCollapsed && (
        <div style={{
          borderTop: '1px solid var(--iron-line)',
          padding: '10px 14px',
          flexShrink: 0,
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '8px',
            color: 'var(--bone-30)',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}>
            ARTRON // FEDERATION SYS
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
