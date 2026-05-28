import React from '../../utils/react-shim.js';
import { useTranslation } from '../../context/LanguageContext.jsx';

const ProfileSettings = ({ onClose, onSave }) => {
  const { t, i18n } = useTranslation();
  
  // State for Personal Info
  const [firstName, setFirstName] = React.useState("დავით");
  const [lastName, setLastName] = React.useState("მაისურაძე");
  const [email, setEmail] = React.useState("d.maisuradze@artron.ge");

  // State for Passwords
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [isSuccess, setIsSuccess] = React.useState(false);

  // Hover states for language buttons
  const [geoHover, setGeoHover] = React.useState(false);
  const [engHover, setEngHover] = React.useState(false);

  const activeLang = i18n.language; // 'GEO' or 'ENG'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      setIsSuccess(false);
      setMessage(t('user.error_message'));
      return;
    }
    
    // Simulate save
    setIsSuccess(true);
    setMessage(t('user.success_message'));
    
    setTimeout(() => {
      setMessage("");
      if (onSave) {
        onSave();
      }
      if (onClose) {
        onClose();
      }
    }, 1500);
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid var(--color-iron-border)",
    borderRadius: "8px",
    color: "var(--color-bone-light)",
    outline: "none",
    boxSizing: "border-box",
    marginBottom: "15px",
    fontSize: "13px",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease"
  };

  const labelStyle = {
    display: "block",
    color: "var(--color-silver-structure)",
    fontSize: "12px",
    marginBottom: "5px",
    fontWeight: "500"
  };

  // Segmented control styling
  const segmentContainerStyle = {
    display: "flex",
    backgroundColor: "#09090b", // zinc-950
    border: "1px solid var(--color-iron-border)",
    borderRadius: "8px",
    padding: "4px",
    gap: "6px",
    marginBottom: "20px",
    height: "auto"
  };

  const segmentButtonStyle = (isActive, isHovered) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    flex: 1,
    padding: "4px 8px", // Slim padding
    fontSize: "12px", // Compact size
    fontWeight: "600",
    borderRadius: "6px",
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.2s ease-in-out",
    outline: "none",
    fontFamily: "sans-serif",
    
    // Active style (ARTRON Palette)
    // Active: border-emerald-core, text: var(--color-emerald-core), bg: dark iron
    // Passive: bg-zinc-950, border-zinc-800, text: var(--color-silver-structure)
    backgroundColor: isActive ? "var(--color-iron)" : (isHovered ? "rgba(255, 255, 255, 0.03)" : "#09090b"),
    color: isActive ? "var(--color-emerald-core)" : (isHovered ? "var(--color-bone-light)" : "var(--color-silver-structure)"),
    border: isActive ? "1px solid var(--color-emerald-core)" : (isHovered ? "1px solid #3f3f46" : "1px solid #27272a"),
    boxShadow: isActive ? "0 0 8px color-mix(in oklab, var(--color-emerald-core) 20%, transparent)" : "none"
  });

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      {/* Header with Title and Back button */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px", borderBottom: "1px solid var(--color-iron-border)", paddingBottom: "12px" }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "transparent",
            border: "none",
            color: "var(--color-silver-structure)",
            cursor: "pointer",
            fontSize: "12px",
            padding: "4px 8px",
            borderRadius: "4px",
            transition: "all 0.2s ease-in-out",
            outline: "none"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--color-emerald-core)";
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--color-silver-structure)";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <i className="fa-solid fa-arrow-left"></i>
          <span>{t('user.back')}</span>
        </button>
        <h3 style={{ color: "var(--color-emerald-core)", margin: 0, fontSize: "16px", fontWeight: "bold", textShadow: "0 0 10px color-mix(in oklab, var(--color-emerald-core) 30%, transparent)" }}>
          {t('user.profile_settings')}
        </h3>
      </div>

      {/* Two Column Layout Container */}
      <div className="settings-dual-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "24px",
        alignItems: "start",
        width: "100%"
      }}>
        {/* Left Column: Personal Info & Language Switcher */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h4 style={{ color: "var(--color-emerald-core)", margin: "0 0 10px 0", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {t('user.personal_info')}
          </h4>
          
          <label style={labelStyle}>{t('user.first_name')}</label>
          <input 
            type="text" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            style={inputStyle} 
            required
          />

          <label style={labelStyle}>{t('user.last_name')}</label>
          <input 
            type="text" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
            style={inputStyle} 
            required
          />

          <label style={labelStyle}>{t('user.email')}</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={inputStyle} 
            required
          />

          <h4 style={{ color: "var(--color-emerald-core)", margin: "15px 0 10px 0", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {t('user.system_language')}
          </h4>
          
          <div style={segmentContainerStyle}>
            <button
              type="button"
              style={segmentButtonStyle(activeLang === 'GEO', geoHover)}
              onMouseEnter={() => setGeoHover(true)}
              onMouseLeave={() => setGeoHover(false)}
              onClick={() => i18n.changeLanguage('GEO')}
            >
              <span style={{ fontSize: "14px", lineHeight: "1", display: "inline-flex", alignItems: "center" }}>🇬🇪</span>
              <span>GEO</span>
            </button>
            <button
              type="button"
              style={segmentButtonStyle(activeLang === 'ENG', engHover)}
              onMouseEnter={() => setEngHover(true)}
              onMouseLeave={() => setEngHover(false)}
              onClick={() => i18n.changeLanguage('ENG')}
            >
              <span style={{ fontSize: "14px", lineHeight: "1", display: "inline-flex", alignItems: "center" }}>🇬🇧</span>
              <span>ENG</span>
            </button>
          </div>
        </div>

        {/* Right Column: Password Change */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h4 style={{ color: "var(--color-emerald-core)", margin: "0 0 10px 0", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {t('user.password_change')}
          </h4>
          
          <label style={labelStyle}>{t('user.current_password')}</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={inputStyle} 
          />

          <label style={labelStyle}>{t('user.new_password')}</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={inputStyle} 
          />

          <label style={labelStyle}>{t('user.confirm_password')}</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={inputStyle} 
          />
        </div>
      </div>

      {message && (
        <div style={{ 
          color: isSuccess ? "var(--color-emerald-core)" : "var(--color-copper)", 
          fontSize: "12px", 
          marginTop: "15px",
          textAlign: "center",
          fontWeight: "500"
        }}>
          {message}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "15px", borderTop: "1px solid var(--color-iron-border)", paddingTop: "15px" }}>
        <button 
          type="button" 
          onClick={onClose}
          style={{ padding: "8px 16px", backgroundColor: "transparent", border: "1px solid var(--color-iron-border)", borderRadius: "6px", color: "var(--color-silver-structure)", cursor: "pointer", transition: "all 0.2s" }}
        >
          {t('user.cancel')}
        </button>
        <button 
          type="submit"
          style={{ padding: "8px 16px", backgroundColor: "var(--color-emerald-core)", border: "none", borderRadius: "6px", color: "var(--color-iron)", fontWeight: "bold", cursor: "pointer", boxShadow: "0 0 10px var(--color-emerald-core)", transition: "all 0.2s" }}
        >
          {t('user.save')}
        </button>
      </div>
    </form>
  );
};

export default ProfileSettings;
