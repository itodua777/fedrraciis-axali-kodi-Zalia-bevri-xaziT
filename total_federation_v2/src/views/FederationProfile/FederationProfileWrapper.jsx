import React from '../../utils/react-shim.js';
import { useTranslation } from '../../context/LanguageContext.jsx';
import GeneralInfoTab from './GeneralInfoTab.jsx';
import StructureTab from './StructureTab.jsx';

const FederationProfileWrapper = ({ isProfileComplete, onProfileUpdate }) => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = React.useState("general");

  const isGeo = i18n.language === 'GEO';

  const containerStyle = {
    flex: 1,
    padding: "30px",
    backgroundColor: "#121418", // var(--iron)
    color: "var(--bone)",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  };

  const headerStyle = {
    borderBottom: "1px solid var(--iron-line)",
    paddingBottom: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  };

  const titleStyle = {
    fontFamily: "var(--font-heading)",
    fontSize: "24px",
    fontWeight: "800",
    color: "var(--bone)",
    margin: 0,
    letterSpacing: "0.5px"
  };

  const subtitleStyle = {
    fontFamily: "var(--font-primary)",
    fontSize: "13px",
    color: "var(--silver)",
    margin: 0
  };

  const splitContainerStyle = {
    display: "flex",
    gap: "30px",
    alignItems: "flex-start",
    flex: 1
  };

  const sidebarStyle = {
    width: "240px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flexShrink: 0
  };

  const tabButtonStyle = (tabId, disabled = false) => {
    const isActive = activeTab === tabId;
    return {
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "12px 16px",
      backgroundColor: isActive ? "rgba(0, 230, 118, 0.08)" : "transparent",
      color: isActive ? "var(--emerald)" : (disabled ? "var(--bone-30)" : "var(--silver)"),
      border: "none",
      borderLeft: isActive ? "3px solid var(--emerald)" : "3px solid transparent",
      borderRadius: "0 6px 6px 0",
      fontFamily: "var(--font-heading)",
      fontSize: "14px",
      fontWeight: isActive ? "700" : "500",
      cursor: disabled ? "not-allowed" : "pointer",
      textAlign: "left",
      transition: "all 0.2s ease-in-out",
      outline: "none"
    };
  };

  const contentStyle = {
    flex: 1,
    backgroundColor: "var(--iron-1)",
    border: "1px solid var(--iron-line)",
    borderRadius: "8px",
    padding: "30px",
    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.4)",
    position: "relative"
  };

  return (
    <div style={containerStyle} className="custom-scrollbar">
      {/* Page Header */}
      <div style={headerStyle}>
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: "9px",
          letterSpacing: "3px",
          color: "var(--emerald)",
          textTransform: "uppercase",
          fontWeight: "700"
        }}>
          {isGeo ? "ორგანიზაციის ციფრული პასპორტი" : "ORGANIZATION DIGITAL PASSPORT"}
        </div>
        <h1 style={titleStyle}>
          {isGeo ? "ფედერაციის პროფილი" : "Federation Profile"}
        </h1>
        <p style={subtitleStyle}>
          {isGeo 
            ? "მართეთ ფედერაციის ოფიციალური რეკვიზიტები, ლიცენზიები, საბანკო ანგარიშები და ბრენდინგი." 
            : "Manage official federation requisites, licenses, bank accounts, and branding."}
        </p>
      </div>

      {/* Split Tab View */}
      <div style={splitContainerStyle}>
        {/* Left Tabs Sidebar */}
        <div style={sidebarStyle}>
          <button 
            style={tabButtonStyle("general")} 
            onClick={() => setActiveTab("general")}
          >
            <i className="fa-solid fa-circle-info" style={{ fontSize: "16px" }}></i>
            <span>{isGeo ? "ზოგადი ინფორმაცია" : "General Information"}</span>
          </button>
          
          <button 
            style={tabButtonStyle("structure")} 
            onClick={() => setActiveTab("structure")}
          >
            <i className="fa-solid fa-sitemap" style={{ fontSize: "16px" }}></i>
            <span>{isGeo ? "ორგანიზაციული სტრუქტურა" : "Organizational Structure"}</span>
          </button>
          
          <button 
            style={tabButtonStyle("banking", true)} 
            disabled 
            title={isGeo ? "ხელმისაწვდომია შემდეგ ფაზაში" : "Available in next phase"}
          >
            <i className="fa-solid fa-credit-card" style={{ fontSize: "16px" }}></i>
            <span>{isGeo ? "საბანკო ანგარიშები" : "Banking Accounts"}</span>
            <i className="fa-solid fa-lock" style={{ marginLeft: "auto", fontSize: "11px", opacity: 0.5 }}></i>
          </button>

          <button 
            style={tabButtonStyle("officers", true)} 
            disabled 
            title={isGeo ? "ხელმისაწვდომია შემდეგ ფაზაში" : "Available in next phase"}
          >
            <i className="fa-solid fa-users-gear" style={{ fontSize: "16px" }}></i>
            <span>{isGeo ? "ხელმძღვანელი პირები" : "Executive Officers"}</span>
            <i className="fa-solid fa-lock" style={{ marginLeft: "auto", fontSize: "11px", opacity: 0.5 }}></i>
          </button>

          <button 
            style={tabButtonStyle("compliance", true)} 
            disabled 
            title={isGeo ? "ხელმისაწვდომია შემდეგ ფაზაში" : "Available in next phase"}
          >
            <i className="fa-solid fa-gavel" style={{ fontSize: "16px" }}></i>
            <span>{isGeo ? "იურიდიული დოკუმენტები" : "Legal Documents"}</span>
            <i className="fa-solid fa-lock" style={{ marginLeft: "auto", fontSize: "11px", opacity: 0.5 }}></i>
          </button>
        </div>

        {/* Right Content Panel */}
        <div style={contentStyle}>
          {activeTab === "general" && (
            <GeneralInfoTab 
              isProfileComplete={isProfileComplete} 
              onProfileUpdate={onProfileUpdate} 
            />
          )}
          {activeTab === "structure" && <StructureTab />}
        </div>
      </div>
    </div>
  );
};

export default FederationProfileWrapper;
