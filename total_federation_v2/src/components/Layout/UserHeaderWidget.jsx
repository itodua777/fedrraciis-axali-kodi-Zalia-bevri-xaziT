import React from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from '../../context/LanguageContext.jsx';
import ProfileSettings from '../../views/Profile/Settings.jsx';

const UserHeaderWidget = ({ onLogout }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [showSettingsModal, setShowSettingsModal] = React.useState(false);
  const [showLogsModal, setShowLogsModal] = React.useState(false);

  const [activeUser, setActiveUser] = React.useState(null);

  React.useEffect(() => {
    const loadUser = () => {
      try {
        const stored = localStorage.getItem('activeUser');
        if (stored) {
          setActiveUser(JSON.parse(stored));
        } else {
          setActiveUser({});
        }
      } catch (e) {
        setActiveUser({});
      }
    };
    loadUser();

    window.addEventListener('storage', loadUser);
    
    // Polling to keep the login state reactive in real-time
    const interval = setInterval(loadUser, 300);

    return () => {
      window.removeEventListener('storage', loadUser);
      clearInterval(interval);
    };
  }, []);

  const displayName = `${activeUser?.firstName || ''} ${activeUser?.lastName || ''}`.trim();
  const positionSubtitle = activeUser?.position || '';
  const hasUser = !!displayName;

  const widgetRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (activeUser === null) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '5px 10px',
        borderRadius: '4px',
        border: '1px solid var(--iron-line)',
        backgroundColor: 'transparent',
      }}>
        <div style={{
          width: '28px', height: '28px',
          borderRadius: '50%',
          backgroundColor: 'var(--iron-line)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <i className="fa-solid fa-circle-notch fa-spin" style={{ color: 'var(--silver)', fontSize: '12px' }} />
        </div>
        <span style={{ fontSize: '13px', color: 'var(--silver)', fontFamily: 'var(--font-heading)' }}>
          Loading...
        </span>
      </div>
    );
  }

  const toggleDropdown = () => setIsOpen(!isOpen);

  const isActive = isHovered || isOpen;

  /* ── Dropdown item hover helpers ── */
  const handleItemEnter = (e) => {
    e.currentTarget.style.backgroundColor = 'rgba(8,133,237,.08)';
    e.currentTarget.style.color = 'var(--fed-blue)';
  };
  const handleItemLeave = (e) => {
    e.currentTarget.style.backgroundColor = 'transparent';
    e.currentTarget.style.color = 'var(--silver)';
  };
  const handleLogoutEnter = (e) => {
    e.currentTarget.style.backgroundColor = 'rgba(180,3,7,.12)';
    e.currentTarget.style.color = 'var(--crisis-from)';
  };
  const handleLogoutLeave = (e) => {
    e.currentTarget.style.backgroundColor = 'transparent';
    e.currentTarget.style.color = 'var(--copper)';
  };

  /* ── Shared menu item base ── */
  const menuItemBase = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    padding: '8px 10px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '3px',
    color: 'var(--silver)',
    fontSize: '13px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s',
    outline: 'none',
    fontFamily: 'var(--font-heading)',
  };

  /* ── Overlay + modal ── */
  const overlayStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,.75)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  };

  const modalBase = {
    backgroundColor: 'var(--iron-1)',
    border: '1px solid var(--iron-line)',
    borderRadius: '6px',
    boxShadow: '0 20px 50px rgba(0,0,0,.7)',
    overflow: 'hidden',
    position: 'relative',
  };

  const modalHeaderStyle = {
    padding: '14px 20px',
    borderBottom: '1px solid var(--iron-line)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  };

  return (
    <div ref={widgetRef} style={{ position: 'relative' }}>

      {/* ── Widget button ── */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '5px 10px',
          borderRadius: '4px',
          border: `1px solid ${isActive ? 'var(--fed-blue)' : 'var(--iron-line)'}`,
          backgroundColor: isOpen ? 'rgba(8,133,237,.08)' : 'transparent',
          boxShadow: isActive ? '0 0 10px rgba(8,133,237,.2)' : 'none',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          userSelect: 'none',
        }}
        onClick={toggleDropdown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Avatar */}
        <div style={{
          width: '28px', height: '28px',
          borderRadius: '50%',
          border: '1px solid var(--iron-line)',
          overflow: 'hidden',
          flexShrink: 0,
          backgroundColor: 'var(--iron-line)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {hasUser ? (
            <img
              src="https://i.pravatar.cc/150?img=12"
              alt={displayName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <i className="fa-solid fa-user" style={{ color: 'var(--silver)', fontSize: '13px' }} />
          )}
        </div>

        <span style={{ fontSize: '13px', color: 'var(--bone)', fontFamily: 'var(--font-heading)', fontWeight: '500' }}>
          {`${activeUser?.firstName || ''} ${activeUser?.lastName || ''}`.trim() || 'მომხმარებელი'}
        </span>
        <i
          className="fa-solid fa-chevron-down"
          style={{
            fontSize: '10px',
            color: 'var(--silver)',
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s',
          }}
        />
      </div>

      {/* ── Dropdown ── */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          right: 0, top: '100%',
          marginTop: '8px',
          width: '220px',
          backgroundColor: 'var(--iron-1)',
          border: '1px solid var(--iron-line)',
          borderRadius: '6px',
          boxShadow: '0 16px 40px rgba(0,0,0,.6)',
          zIndex: 50,
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}>
          {/* Accent bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, var(--fed-blue) 0%, transparent 100%)' }} />

          {/* User info */}
          <div style={{ padding: '4px 8px 8px', borderBottom: '1px solid var(--iron-line)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ color: 'var(--bone)', fontWeight: '600', fontSize: '13px', fontFamily: 'var(--font-heading)' }}>
              {`${activeUser?.firstName || ''} ${activeUser?.lastName || ''}`.trim() || 'მომხმარებელი'}
            </span>
            {activeUser?.position && (
              <span style={{
                backgroundColor: 'var(--iron)',
                color: 'var(--silver)',
                fontSize: '10px',
                padding: '2px 7px',
                borderRadius: '3px',
                width: 'fit-content',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.5px',
              }}>
                {activeUser?.position}
              </span>
            )}
          </div>

          {/* Settings */}
          <button
            style={menuItemBase}
            onClick={() => { setShowSettingsModal(true); setIsOpen(false); }}
            onMouseOver={handleItemEnter}
            onMouseOut={handleItemLeave}
          >
            <i className="fa-solid fa-gear" style={{ width: '14px', fontSize: '13px', transition: 'color 0.15s' }} />
            <span>{t('user.profile_settings')}</span>
          </button>

          {/* Logs */}
          <button
            style={menuItemBase}
            onClick={() => { setShowLogsModal(true); setIsOpen(false); }}
            onMouseOver={handleItemEnter}
            onMouseOut={handleItemLeave}
          >
            <i className="fa-solid fa-scroll" style={{ width: '14px', fontSize: '13px', transition: 'color 0.15s' }} />
            <span>{t('user.security_logs')}</span>
          </button>

          <hr style={{ border: '0', borderTop: '1px solid var(--iron-line)', margin: '2px 0' }} />

          {/* Logout */}
          <button
            style={{ ...menuItemBase, color: 'var(--copper)' }}
            onClick={onLogout}
            onMouseOver={handleLogoutEnter}
            onMouseOut={handleLogoutLeave}
          >
            <i className="fa-solid fa-right-from-bracket" style={{ width: '14px', fontSize: '13px' }} />
            <span>{t('user.logout')}</span>
          </button>
        </div>
      )}

      {/* ── Settings Modal ── */}
      {showSettingsModal && ReactDOM.createPortal(
        <div style={overlayStyle}>
          <div style={{ ...modalBase, width: '90%', maxWidth: '700px' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, var(--fed-blue) 0%, transparent 100%)' }} />
            <div style={{ padding: '16px' }}>
              <ProfileSettings onClose={() => setShowSettingsModal(false)} />
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── Security Logs Modal ── */}
      {showLogsModal && ReactDOM.createPortal(
        <div style={overlayStyle}>
          <div style={{ ...modalBase, width: '600px' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, var(--fed-blue) 0%, transparent 100%)' }} />
            <div style={modalHeaderStyle}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--fed-blue)', marginBottom: '2px' }}>
                  // SECURITY
                </div>
                <h3 style={{ color: 'var(--bone)', margin: 0, fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '700' }}>
                  {t('logs.title')}
                </h3>
              </div>
              <button
                onClick={() => setShowLogsModal(false)}
                style={{ backgroundColor: 'transparent', border: '1px solid var(--iron-line)', borderRadius: '4px', color: 'var(--silver)', cursor: 'pointer', fontSize: '16px', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--fed-blue)'; e.currentTarget.style.color = 'var(--fed-blue)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--iron-line)'; e.currentTarget.style.color = 'var(--silver)'; }}
              >
                &times;
              </button>
            </div>

            <div style={{ padding: '16px', maxHeight: '400px', overflowY: 'auto' }} className="custom-scrollbar">
              <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--silver)', fontSize: '12px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--iron-line)' }}>
                    <th style={{ padding: '8px 10px', color: 'var(--fed-blue)', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: '700' }}>{t('logs.date_time')}</th>
                    <th style={{ padding: '8px 10px', color: 'var(--fed-blue)', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: '700' }}>{t('logs.action')}</th>
                    <th style={{ padding: '8px 10px', color: 'var(--fed-blue)', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: '700' }}>{t('logs.status')}</th>
                    <th style={{ padding: '8px 10px', color: 'var(--fed-blue)', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: '700' }}>{t('logs.ip')}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { date: '2026-05-22 21:15:46', action: 'სისტემაში ავტორიზაცია',                    status: t('logs.success'), ip: '192.168.1.15' },
                    { date: '2026-05-22 17:11:34', action: 'სპორტსმენის რედაქტირება (გიორგი ბერიძე)', status: t('logs.success'), ip: '192.168.1.15' },
                    { date: '2026-05-22 15:48:49', action: 'ექსპორტი (სპორტსმენები)',                 status: t('logs.success'), ip: '192.168.1.15' },
                    { date: '2026-05-21 16:24:30', action: 'სისტემაში შესვლა',                        status: t('logs.success'), ip: '192.168.1.15' },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--iron-line)' }}>
                      <td style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--bone-60)' }}>{row.date}</td>
                      <td style={{ padding: '8px 10px', color: 'var(--bone-60)' }}>{row.action}</td>
                      <td style={{ padding: '8px 10px', color: 'var(--emerald)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{row.status}</td>
                      <td style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--bone-60)' }}>{row.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--iron-line)', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowLogsModal(false)}
                style={{
                  padding: '8px 20px',
                  backgroundColor: 'var(--fed-blue)',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'var(--iron)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  letterSpacing: '0.5px',
                  transition: 'all 0.2s',
                }}
                onMouseOver={e => { e.currentTarget.style.boxShadow = '0 0 14px rgba(8,133,237,.5)'; }}
                onMouseOut={e => { e.currentTarget.style.boxShadow = 'none'; }}
              >
                {t('user.close')}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default UserHeaderWidget;
