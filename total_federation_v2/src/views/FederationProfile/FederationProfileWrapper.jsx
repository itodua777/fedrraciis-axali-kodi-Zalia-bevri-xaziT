import React from '../../utils/react-shim.js';
import { useTranslation } from '../../context/LanguageContext.jsx';
import GeneralInfoTab from './GeneralInfoTab.jsx';
import StructureTab from './StructureTab.jsx';
import BankingRequisitesTab from './BankingRequisitesTab.jsx';
import LegalDocumentsTab from './LegalDocumentsTab.jsx';
import GovernanceHierarchyTab from './GovernanceHierarchyTab.jsx';
import FoundersTab from './FoundersTab.jsx';
import StatusRegistryTab from './StatusRegistryTab.jsx';

const FederationProfileWrapper = ({ isProfileComplete, onProfileUpdate, currentSubView = "general_info" }) => {
  const { t, i18n } = useTranslation();
  const activeTab = currentSubView || "general_info";

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

      {/* Full-width Content Panel */}
      <div style={contentStyle}>
        {activeTab === "general_info" && (
          <GeneralInfoTab 
            isProfileComplete={isProfileComplete} 
            onProfileUpdate={onProfileUpdate} 
          />
        )}
        {activeTab === "org_roles" && <StructureTab />}
        {activeTab === "bank_details" && (
          <BankingRequisitesTab 
            isProfileComplete={isProfileComplete} 
            onProfileUpdate={onProfileUpdate} 
          />
        )}
        {activeTab === "governance" && (
          <GovernanceHierarchyTab />
        )}
        {activeTab === "founders" && (
          <FoundersTab />
        )}
        {activeTab === "status_registry" && (
          <StatusRegistryTab />
        )}
        {activeTab === "legal_docs" && (
          <LegalDocumentsTab 
            isProfileComplete={isProfileComplete} 
            onProfileUpdate={onProfileUpdate} 
          />
        )}
      </div>
    </div>
  );
};

export default FederationProfileWrapper;
