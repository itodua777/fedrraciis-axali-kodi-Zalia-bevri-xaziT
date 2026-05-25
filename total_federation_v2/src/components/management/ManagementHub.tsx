import React from 'react';
import { StaffRegistry } from './StaffRegistry';
import { FoundersRegistry } from './FoundersRegistry';
import { RegisteredStatusRegistry, Athlete } from './RegisteredStatusRegistry';

interface ManagementHubProps {
  athletes: Athlete[];
}

export const ManagementHub: React.FC<ManagementHubProps> = ({ athletes }) => {
  const [activeTab, setActiveTab] = React.useState<'staff' | 'founders' | 'status'>('staff');

  const containerStyle = {
    flex: 1,
    padding: "30px",
    backgroundColor: "#121418",
    color: "#e2e8f0",
    fontFamily: "sans-serif",
    overflowY: "auto" as const,
    display: "flex",
    flexDirection: "column" as const,
    gap: "25px"
  };

  const tabStyle = (tab: 'staff' | 'founders' | 'status') => ({
    color: activeTab === tab ? "var(--color-emerald-core)" : "rgba(255,255,255,0.5)",
    fontWeight: activeTab === tab ? "bold" : "normal",
    borderBottom: activeTab === tab ? "2px solid var(--color-emerald-core)" : "2px solid transparent",
    padding: "12px 20px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textShadow: activeTab === tab ? "0 0 10px color-mix(in oklab, var(--color-emerald-core) 30%, transparent)" : "none",
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    fontSize: "14px"
  });

  return (
    <div style={containerStyle}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0, color: "#fff", fontSize: "22px", fontWeight: "bold" }}>
            <i className="fa-solid fa-sitemap" style={{ marginRight: "10px", color: "var(--color-emerald-core)" }}></i>
            მენეჯმენტი და იურიდიული რეესტრი (Node 570)
          </h2>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
            ფედერაციის საშტატო, დამფუძნებელთა და კომპლიენსის მართვის პანელი
          </span>
        </div>
      </div>

      {/* Tabs list (Brutalist style) */}
      <div style={{
        display: "flex",
        gap: "10px",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        marginBottom: "10px"
      }}>
        <button style={tabStyle('staff')} onClick={() => setActiveTab('staff')}>
          <i className="fa-solid fa-users-gear" style={{ marginRight: "8px" }}></i>
          საშტატო ერთეულები
        </button>
        <button style={tabStyle('founders')} onClick={() => setActiveTab('founders')}>
          <i className="fa-solid fa-gavel" style={{ marginRight: "8px" }}></i>
          დამფუძნებლები
        </button>
        <button style={tabStyle('status')} onClick={() => setActiveTab('status')}>
          <i className="fa-solid fa-address-book" style={{ marginRight: "8px" }}></i>
          სტატუსის რეესტრი
        </button>
      </div>

      {/* Content panel */}
      <div style={{ animation: "fadeIn 0.3s ease" }}>
        {activeTab === 'staff' && <StaffRegistry />}
        {activeTab === 'founders' && <FoundersRegistry />}
        {activeTab === 'status' && <RegisteredStatusRegistry athletes={athletes} />}
      </div>
    </div>
  );
};
