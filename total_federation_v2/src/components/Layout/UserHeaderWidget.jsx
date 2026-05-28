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

  const widgetRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const widgetStyle = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "6px 12px",
    borderRadius: "24px",
    border: `1px solid ${isHovered || isOpen ? "var(--color-emerald-core)" : "var(--color-iron-border)"}`,
    backgroundColor: isOpen ? "color-mix(in oklab, var(--color-emerald-core) 10%, transparent)" : "transparent",
    boxShadow: isHovered || isOpen ? "0 0 10px var(--color-emerald-core)" : "none",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    userSelect: "none"
  };

  const avatarStyle = {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: "var(--color-iron-surface)",
    border: "1.5px solid var(--color-iron-border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  };

  const dropdownMenuStyle = {
    position: "absolute",
    right: 0,
    top: "100%",
    marginTop: "8px",
    width: "224px",
    backgroundColor: "var(--color-iron-surface)",
    border: "1px solid var(--color-iron-border)",
    borderRadius: "12px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    zIndex: 50,
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    boxSizing: "border-box"
  };

  const dropdownItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    padding: "8px 10px",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "6px",
    color: "var(--color-silver-structure)",
    fontSize: "13px",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.2s",
    outline: "none",
    fontFamily: "sans-serif"
  };

  const handleItemMouseOver = (e) => {
    e.currentTarget.style.backgroundColor = "color-mix(in oklab, var(--color-emerald-core) 8%, transparent)";
    e.currentTarget.style.color = "var(--color-emerald-core)";
    if (e.currentTarget.firstElementChild) {
      e.currentTarget.firstElementChild.style.color = "var(--color-emerald-core)";
    }
  };

  const handleItemMouseOut = (e) => {
    e.currentTarget.style.backgroundColor = "transparent";
    e.currentTarget.style.color = "var(--color-silver-structure)";
    if (e.currentTarget.firstElementChild) {
      e.currentTarget.firstElementChild.style.color = "var(--color-silver-structure)";
    }
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999
  };

  const modalStyle = {
    backgroundColor: "var(--color-iron-surface)",
    border: "1px solid var(--color-iron-border)",
    borderRadius: "12px",
    width: "450px",
    boxShadow: "0 0 30px var(--color-iron-border)",
    overflow: "hidden"
  };

  const modalHeaderStyle = {
    padding: "15px 20px",
    borderBottom: "1px solid var(--color-iron-border)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  };

  const modalContentStyle = {
    padding: "20px"
  };

  return (
    <div ref={widgetRef} style={{ position: "relative" }}>
      <div 
        style={widgetStyle}
        onClick={toggleDropdown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={avatarStyle}>
          <img 
            src="https://i.pravatar.cc/150?img=12" 
            alt="დავით მაისურაძე" 
            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
          />
        </div>
        <span style={{ fontSize: "14px", color: "var(--color-bone-light)", fontWeight: "normal" }}>დავით მ.</span>
        <i className="fa-solid fa-chevron-down" style={{ fontSize: "10px", color: "var(--color-silver-structure)", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}></i>
      </div>

      {isOpen && (
        <div style={dropdownMenuStyle}>
          <div style={{ padding: "4px 8px 8px 8px", borderBottom: "1px solid var(--color-iron-border)", display: "flex", flexDirection: "column" }}>
            <span style={{ color: "var(--color-bone-light)", fontWeight: "500", fontSize: "13px" }}>დავით მაისურაძე</span>
            <span style={{
              backgroundColor: "var(--color-iron)",
              color: "var(--color-silver-structure)",
              fontSize: "10px",
              padding: "2px 6px",
              borderRadius: "4px",
              width: "fit-content",
              fontWeight: "normal",
              marginTop: "4px"
            }}>
              {t('user.role')}
            </span>
          </div>

          <button 
            style={dropdownItemStyle}
            onClick={() => { setShowSettingsModal(true); setIsOpen(false); }}
            onMouseOver={handleItemMouseOver}
            onMouseOut={handleItemMouseOut}
          >
            <i className="fa-solid fa-gear" style={{ width: "14px", color: "var(--color-silver-structure)", fontSize: "14px", transition: "color 0.2s" }}></i>
            <span>{t('user.profile_settings')}</span>
          </button>

          <button 
            style={dropdownItemStyle}
            onClick={() => { setShowLogsModal(true); setIsOpen(false); }}
            onMouseOver={handleItemMouseOver}
            onMouseOut={handleItemMouseOut}
          >
            <i className="fa-solid fa-scroll" style={{ width: "14px", color: "var(--color-silver-structure)", fontSize: "14px", transition: "color 0.2s" }}></i>
            <span>{t('user.security_logs')}</span>
          </button>

          <hr style={{ border: "0", borderTop: "1px solid var(--color-iron-border)", margin: "4px 0" }} />
          <button 
            style={{
              ...dropdownItemStyle,
              color: "var(--color-copper)"
            }}
            onClick={onLogout}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "color-mix(in oklab, var(--color-copper) 20%, transparent)";
              e.currentTarget.style.color = "var(--color-copper)";
              if (e.currentTarget.firstElementChild) {
                e.currentTarget.firstElementChild.style.color = "var(--color-copper)";
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--color-copper)";
              if (e.currentTarget.firstElementChild) {
                e.currentTarget.firstElementChild.style.color = "var(--color-silver-structure)";
              }
            }}
          >
            <i className="fa-solid fa-right-from-bracket" style={{ width: "14px", color: "var(--color-silver-structure)", fontSize: "14px", transition: "color 0.2s" }}></i>
            <span>{t('user.logout')}</span>
          </button>
        </div>
      )}

      {showSettingsModal && ReactDOM.createPortal(
        <div style={overlayStyle}>
          <div style={{ ...modalStyle, width: "90%", maxWidth: "700px" }}>
            <div style={modalContentStyle}>
              <ProfileSettings onClose={() => setShowSettingsModal(false)} />
            </div>
          </div>
        </div>,
        document.body
      )}

      {showLogsModal && ReactDOM.createPortal(
        <div style={overlayStyle}>
          <div style={{ ...modalStyle, width: "600px" }}>
            <div style={modalHeaderStyle}>
              <h3 style={{ color: "var(--color-emerald-core)", margin: 0, textShadow: "0 0 10px color-mix(in oklab, var(--color-emerald-core) 30%, transparent)" }}>{t('logs.title')}</h3>
              <button 
                onClick={() => setShowLogsModal(false)}
                style={{ backgroundColor: "transparent", border: "none", color: "#64748b", cursor: "pointer", fontSize: "18px" }}
              >
                &times;
              </button>
            </div>
            <div style={{ ...modalContentStyle, maxHeight: "400px", overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", color: "var(--color-silver-structure)", fontSize: "12px", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--color-iron-border)" }}>
                    <th style={{ padding: "10px 5px", color: "var(--color-emerald-core)" }}>{t('logs.date_time')}</th>
                    <th style={{ padding: "10px 5px", color: "var(--color-emerald-core)" }}>{t('logs.action')}</th>
                    <th style={{ padding: "10px 5px", color: "var(--color-emerald-core)" }}>{t('logs.status')}</th>
                    <th style={{ padding: "10px 5px", color: "var(--color-emerald-core)" }}>{t('logs.ip')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid var(--color-iron-border)" }}>
                    <td style={{ padding: "10px 5px" }}>2026-05-22 21:15:46</td>
                    <td style={{ padding: "10px 5px" }}>სისტემაში ავტორიზაცია</td>
                    <td style={{ padding: "10px 5px", color: "var(--color-emerald-core)" }}>{t('logs.success')}</td>
                    <td style={{ padding: "10px 5px" }}>192.168.1.15</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--color-iron-border)" }}>
                    <td style={{ padding: "10px 5px" }}>2026-05-22 17:11:34</td>
                    <td style={{ padding: "10px 5px" }}>სპორტსმენის რედაქტირება (გიორგი ბერიძე)</td>
                    <td style={{ padding: "10px 5px", color: "var(--color-emerald-core)" }}>{t('logs.success')}</td>
                    <td style={{ padding: "10px 5px" }}>192.168.1.15</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--color-iron-border)" }}>
                    <td style={{ padding: "10px 5px" }}>2026-05-22 15:48:49</td>
                    <td style={{ padding: "10px 5px" }}>ექსპორტი (სპორტსმენები)</td>
                    <td style={{ padding: "10px 5px", color: "var(--color-emerald-core)" }}>{t('logs.success')}</td>
                    <td style={{ padding: "10px 5px" }}>192.168.1.15</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--color-iron-border)" }}>
                    <td style={{ padding: "10px 5px" }}>2026-05-21 16:24:30</td>
                    <td style={{ padding: "10px 5px" }}>სისტემაში შესვლა</td>
                    <td style={{ padding: "10px 5px", color: "var(--color-emerald-core)" }}>{t('logs.success')}</td>
                    <td style={{ padding: "10px 5px" }}>192.168.1.15</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ padding: "15px 20px", borderTop: "1px solid var(--color-iron-border)", display: "flex", justifyContent: "flex-end" }}>
              <button 
                onClick={() => setShowLogsModal(false)}
                style={{ padding: "8px 16px", backgroundColor: "var(--color-emerald-core)", border: "none", borderRadius: "6px", color: "var(--color-iron)", fontWeight: "bold", cursor: "pointer" }}
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
