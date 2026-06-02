import React from 'react';
import UserHeaderWidget from './UserHeaderWidget.jsx';
import { useTranslation } from '../../context/LanguageContext.jsx';

const Navbar = ({ federation, onLogout }) => {
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Notification engine states
  const [notifications, setNotifications] = React.useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isBellHovered, setIsBellHovered] = React.useState(false);
  const [lastChecked, setLastChecked] = React.useState(() => {
    return Number(localStorage.getItem('notifications_last_checked') || 0);
  });

  const bellRef = React.useRef(null);

  // Click outside to close notifications dropdown
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Fetch notifications
  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/v1/notifications');
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        }
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const hasUnread = notifications.some(n => n.timestamp > lastChecked);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => {
      const nextState = !prev;
      if (nextState) {
        const now = Date.now();
        localStorage.setItem('notifications_last_checked', String(now));
        setLastChecked(now);
      }
      return nextState;
    });
  };

  const bellActive = isBellHovered || isDropdownOpen;

  return (
    <div style={{
      position: 'relative',
      height: '64px',
      backgroundColor: 'var(--iron)',
      borderBottom: '1px solid var(--iron-line)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      flexShrink: 0,
    }}>
      {/* Blue top accent bar */}
      <div className="pg-accent-bar" />

      {/* ── Search ── */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '380px', display: 'flex', alignItems: 'center' }}>
        {/* 9-node SVG icon */}
        <div style={{
          position: 'absolute', left: '12px',
          display: 'flex', alignItems: 'center',
          pointerEvents: 'none',
          transition: 'color 0.2s',
          color: isFocused ? 'var(--fed-blue)' : 'var(--silver)',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <defs>
              <filter id="neon-glow-focus" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            {[
              [5,5],[12,5],[19,5],
              [5,12],       [19,12],
              [5,19],[12,19],[19,19],
            ].map(([cx,cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="2"
                fill={isFocused ? 'var(--bone)' : 'var(--silver)'}
                style={{ transition: 'fill 0.2s' }}
              />
            ))}
            <circle cx="12" cy="12" r="2"
              fill="var(--fed-blue)"
              filter={isFocused ? 'url(#neon-glow-focus)' : 'none'}
              style={{ transition: 'all 0.2s' }}
            />
          </svg>
        </div>

        <input
          type="text"
          style={{
            width: '100%',
            backgroundColor: 'var(--iron-1)',
            color: 'var(--bone)',
            paddingLeft: '40px',
            paddingRight: '16px',
            paddingTop: '8px',
            paddingBottom: '8px',
            borderRadius: '4px',
            border: `1px solid ${isFocused ? 'var(--fed-blue)' : 'var(--iron-line)'}`,
            boxShadow: isFocused ? '0 0 10px rgba(8,133,237,.25)' : 'none',
            outline: 'none',
            fontSize: '13px',
            transition: 'all 0.2s ease',
            fontFamily: 'var(--font-primary)',
          }}
          placeholder={t('navbar.search_placeholder')}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>

      {/* ── Right side controls ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

        {/* Notification Bell */}
        <div ref={bellRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '34px',
              height: '34px',
              borderRadius: '4px',
              border: `1px solid ${bellActive ? 'var(--fed-blue)' : 'var(--iron-line)'}`,
              backgroundColor: isDropdownOpen ? 'rgba(8,133,237,.10)' : 'transparent',
              color: bellActive ? 'var(--fed-blue)' : 'var(--silver)',
              boxShadow: bellActive ? '0 0 10px rgba(8,133,237,.25)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onClick={toggleDropdown}
            onMouseEnter={() => setIsBellHovered(true)}
            onMouseLeave={() => setIsBellHovered(false)}
            title={t('navbar.notifications')}
          >
            <i className="fa-solid fa-bell" style={{ fontSize: '14px' }} />
            {hasUnread && (
              <div style={{
                position: 'absolute',
                top: '4px', right: '4px',
                width: '7px', height: '7px',
                borderRadius: '50%',
                backgroundColor: 'var(--fed-blue)',
                boxShadow: '0 0 6px var(--fed-blue)',
              }} />
            )}
          </div>

          {/* Notifications dropdown */}
          {isDropdownOpen && (
            <div style={{
              position: 'absolute',
              right: 0, top: '100%',
              marginTop: '8px',
              width: '340px',
              backgroundColor: 'var(--iron-1)',
              border: '1px solid var(--iron-line)',
              borderRadius: '6px',
              boxShadow: '0 12px 32px -4px rgba(0,0,0,.7)',
              zIndex: 100,
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              boxSizing: 'border-box',
            }}>
              {/* Dropdown accent bar */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, var(--fed-blue) 0%, transparent 100%)', borderRadius: '6px 6px 0 0' }} />

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--iron-line)',
                color: 'var(--bone)',
                fontSize: '12px',
                fontFamily: 'var(--font-heading)',
                fontWeight: '700',
                letterSpacing: '0.5px',
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--fed-blue)' }}>
                  // {t('navbar.notifications')}
                </span>
                {notifications.length > 0 && (
                  <span style={{
                    backgroundColor: 'rgba(8,133,237,.15)',
                    color: 'var(--fed-blue)',
                    padding: '2px 7px',
                    borderRadius: '3px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {notifications.length}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '280px', overflowY: 'auto' }} className="custom-scrollbar">
                {notifications.length === 0 ? (
                  <div style={{
                    padding: '20px 10px',
                    textAlign: 'center',
                    color: 'var(--bone-30)',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.5px',
                  }}>
                    {t('navbar.no_notifications')}
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notif) => (
                    <div key={notif.id} style={{
                      display: 'flex',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '4px',
                      backgroundColor: notif.type === 'critical'
                        ? 'rgba(180,3,7,.08)'
                        : 'rgba(217,119,54,.08)',
                      border: notif.type === 'critical'
                        ? '1px solid rgba(180,3,7,.25)'
                        : '1px solid rgba(217,119,54,.25)',
                      fontSize: '12px',
                      lineHeight: '1.5',
                      fontFamily: 'var(--font-primary)',
                      alignItems: 'flex-start',
                      boxSizing: 'border-box',
                    }}>
                      <div style={{ color: notif.type === 'critical' ? 'var(--crisis-from)' : 'var(--copper)', fontSize: '13px', marginTop: '1px' }}>
                        {notif.type === 'critical'
                          ? <i className="fa-solid fa-triangle-exclamation" />
                          : <i className="fa-solid fa-circle-exclamation" />
                        }
                      </div>
                      <div style={{ color: 'var(--bone-60)', flex: 1 }}>
                        {notif.text}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User widget */}
        <UserHeaderWidget onLogout={onLogout} />
      </div>
    </div>
  );
};

export default Navbar;
