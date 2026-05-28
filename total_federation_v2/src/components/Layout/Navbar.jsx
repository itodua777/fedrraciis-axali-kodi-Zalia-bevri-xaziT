import React from 'react';
import UserHeaderWidget from './UserHeaderWidget.jsx';
import { useTranslation } from '../../context/LanguageContext.jsx';

const Navbar = ({ federation, onLogout }) => {
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

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
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
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
        console.error("Failed to fetch notifications:", err);
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

  const headerStyle = {
    height: "70px",
    backgroundColor: "var(--color-iron)",
    borderBottom: "1px solid var(--color-iron-border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 30px",
    color: "var(--color-bone-light)",
    position: "relative"
  };

  const searchContainerStyle = {
    position: "relative",
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    alignItems: "center"
  };

  const searchInputStyle = {
    width: "100%",
    backgroundColor: "var(--color-iron)",
    color: "var(--color-bone-light)",
    paddingLeft: "40px",
    paddingRight: "16px",
    paddingTop: "8px",
    paddingBottom: "8px",
    borderRadius: "8px",
    border: `1px solid ${isFocused ? 'var(--color-emerald-core)' : 'var(--color-iron-border)'}`,
    boxShadow: isFocused ? "0 0 10px var(--color-emerald-core)" : "none",
    outline: "none",
    fontSize: "14px",
    transition: "all 0.2s ease-in-out",
    fontFamily: "sans-serif"
  };

  const svgColor = isFocused ? "var(--color-emerald-core)" : "var(--color-silver-structure)";

  const logoIconStyle = {
    position: "absolute",
    left: "12px",
    display: "flex",
    alignItems: "center",
    pointerEvents: "none",
    transition: "color 0.2s ease-in-out",
    color: svgColor
  };

  const userStyle = {
    color: "var(--color-emerald-core)",
    textShadow: "0 0 5px var(--color-emerald-core)",
    fontWeight: "bold",
    fontFamily: "sans-serif",
    display: "flex",
    alignItems: "center",
    gap: "15px"
  };

  // Bell container styles
  const bellContainerStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: `1px solid ${isBellHovered || isDropdownOpen ? 'var(--color-emerald-core)' : 'var(--color-iron-border)'}`,
    backgroundColor: isDropdownOpen ? 'color-mix(in oklab, var(--color-emerald-core) 10%, transparent)' : 'transparent',
    color: isBellHovered || isDropdownOpen ? 'var(--color-emerald-core)' : 'var(--color-silver-structure)',
    boxShadow: isBellHovered || isDropdownOpen ? '0 0 10px var(--color-emerald-core)' : 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    textShadow: 'none', // Strip glow from bell icon
  };

  const dotStyle = {
    position: 'absolute',
    top: '2px',
    right: '2px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-emerald-core)', // bg-emerald-core
    boxShadow: '0 0 8px var(--color-emerald-core)',
  };

  const dropdownStyle = {
    position: 'absolute',
    right: 0,
    top: '100%',
    marginTop: '8px',
    width: '340px',
    backgroundColor: '#09090b', // bg-zinc-950
    border: '1px solid #27272a', // border-zinc-800
    borderRadius: '8px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(0, 0, 0, 0.7)',
    zIndex: 100,
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    boxSizing: 'border-box',
    height: 'auto', // h-auto
    textShadow: 'none', // Remove neon glow
  };

  const dropdownHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '8px',
    borderBottom: '1px solid #27272a',
    color: 'var(--color-bone-light)',
    fontSize: '13px',
    fontWeight: '600',
    fontFamily: 'sans-serif',
  };

  const countBadgeStyle = {
    backgroundColor: 'color-mix(in oklab, var(--color-emerald-core) 15%, transparent)',
    color: 'var(--color-emerald-core)',
    padding: '2px 6px',
    borderRadius: '10px',
    fontSize: '10px',
    fontWeight: 'bold',
  };

  const dropdownListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '300px',
    overflowY: 'auto',
  };

  const emptyStateStyle = {
    padding: '20px 10px',
    textAlign: 'center',
    color: 'var(--color-silver-structure)',
    fontSize: '12px',
    fontFamily: 'sans-serif',
  };

  const getNotificationItemStyle = (type) => ({
    display: 'flex',
    gap: '10px',
    padding: '10px',
    borderRadius: '6px',
    backgroundColor: type === 'critical' 
      ? 'rgba(239, 68, 68, 0.08)' // Subtle red bg
      : 'rgba(217, 119, 54, 0.08)', // Subtle orange bg (--color-copper)
    border: type === 'critical'
      ? '1px solid rgba(239, 68, 68, 0.2)'
      : '1px solid rgba(217, 119, 54, 0.2)',
    fontSize: '11px',
    lineHeight: '1.4',
    fontFamily: 'sans-serif',
    alignItems: 'flex-start',
    boxSizing: 'border-box'
  });

  const notifIconStyle = (type) => ({
    color: type === 'critical' ? '#ef4444' : 'var(--color-copper)',
    fontSize: '14px',
    marginTop: '1px',
  });

  const notifTextStyle = {
    color: 'var(--color-bone-light)',
    flex: 1,
    textShadow: 'none',
    fontWeight: 'normal',
    textAlign: 'left'
  };

  return (
    <div style={headerStyle}>
      <div style={searchContainerStyle}>
        <div style={logoIconStyle}>
          <svg 
            style={{ width: "20px", height: "20px" }}
            viewBox="0 0 24 24"
          >
            <defs>
              <filter id="neon-glow-focus" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="neon-glow-blur" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* 8 white outer dots */}
            <circle cx="5" cy="5" r="2" fill={isFocused ? "var(--color-bone-light)" : "var(--color-silver-structure)"} style={{ transition: "all 0.2s" }} />
            <circle cx="12" cy="5" r="2" fill={isFocused ? "var(--color-bone-light)" : "var(--color-silver-structure)"} style={{ transition: "all 0.2s" }} />
            <circle cx="19" cy="5" r="2" fill={isFocused ? "var(--color-bone-light)" : "var(--color-silver-structure)"} style={{ transition: "all 0.2s" }} />
            
            <circle cx="5" cy="12" r="2" fill={isFocused ? "var(--color-bone-light)" : "var(--color-silver-structure)"} style={{ transition: "all 0.2s" }} />
            <circle cx="19" cy="12" r="2" fill={isFocused ? "var(--color-bone-light)" : "var(--color-silver-structure)"} style={{ transition: "all 0.2s" }} />
            
            <circle cx="5" cy="19" r="2" fill={isFocused ? "var(--color-bone-light)" : "var(--color-silver-structure)"} style={{ transition: "all 0.2s" }} />
            <circle cx="12" cy="19" r="2" fill={isFocused ? "var(--color-bone-light)" : "var(--color-silver-structure)"} style={{ transition: "all 0.2s" }} />
            <circle cx="19" cy="19" r="2" fill={isFocused ? "var(--color-bone-light)" : "var(--color-silver-structure)"} style={{ transition: "all 0.2s" }} />
            
            {/* 1 neon middle dot */}
            <circle 
              cx="12" 
              cy="12" 
              r="2" 
              fill="var(--color-emerald-core)" 
              filter={isFocused ? "url(#neon-glow-focus)" : "url(#neon-glow-blur)"}
              style={{ transition: "all 0.2s" }}
            />
          </svg>
        </div>
        <input
          type="text"
          style={searchInputStyle}
          placeholder={t('navbar.search_placeholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
      
      <div style={userStyle}>
        {/* Notification Bell Widget */}
        <div ref={bellRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <div 
            style={bellContainerStyle}
            onClick={toggleDropdown}
            onMouseEnter={() => setIsBellHovered(true)}
            onMouseLeave={() => setIsBellHovered(false)}
            title={t('navbar.notifications')}
          >
            <i className="fa-solid fa-bell" style={{ fontSize: "16px" }}></i>
            {hasUnread && <div style={dotStyle}></div>}
          </div>

          {isDropdownOpen && (
            <div style={dropdownStyle}>
              <div style={dropdownHeaderStyle}>
                <span>{t('navbar.notifications')}</span>
                {notifications.length > 0 && (
                  <span style={countBadgeStyle}>
                    {notifications.length}
                  </span>
                )}
              </div>
              
              <div style={dropdownListStyle}>
                {notifications.length === 0 ? (
                  <div style={emptyStateStyle}>
                    {t('navbar.no_notifications')}
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notif) => (
                    <div key={notif.id} style={getNotificationItemStyle(notif.type)}>
                      <div style={notifIconStyle(notif.type)}>
                        {notif.type === 'critical' ? (
                          <i className="fa-solid fa-triangle-exclamation"></i>
                        ) : (
                          <i className="fa-solid fa-circle-exclamation"></i>
                        )}
                      </div>
                      <div style={notifTextStyle}>
                        {notif.text}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <UserHeaderWidget onLogout={onLogout} />
      </div>
    </div>
  );
};

export default Navbar;
