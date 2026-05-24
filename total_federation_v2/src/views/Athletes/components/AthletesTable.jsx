import React from '../../../utils/react-shim.js';

const AthletesTable = ({
  filteredAthletes,
  selectedAthlete,
  setSelectedAthlete,
  clubs,
  onClubClick
}) => {
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse"
  };

  const thStyle = {
    color: "#22d3ee",
    textAlign: "left",
    padding: "15px",
    borderBottom: "1px solid rgba(34, 211, 238, 0.2)",
    textTransform: "uppercase",
    fontSize: "12px",
    letterSpacing: "1px"
  };

  const tdStyle = {
    padding: "15px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    color: "#e2e8f0"
  };

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={thStyle}>სახელი / გვარი</th>
          <th style={thStyle}>სპორტის სახეობა</th>
          <th style={thStyle}>კლუბი</th>
          <th style={thStyle}>სტატუსი</th>
        </tr>
      </thead>
      <tbody>
        {filteredAthletes.map((athlete) => (
          <tr 
            key={athlete.id} 
            onClick={() => setSelectedAthlete(athlete)}
            style={{ 
              cursor: "pointer", 
              backgroundColor: selectedAthlete?.id === athlete.id ? "rgba(34, 211, 238, 0.1)" : "transparent",
              transition: "background-color 0.2s"
            }}
            onMouseOver={(e) => {
              if (selectedAthlete?.id !== athlete.id) {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
              }
            }}
            onMouseOut={(e) => {
              if (selectedAthlete?.id !== athlete.id) {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            <td style={tdStyle}>{athlete.firstName} {athlete.lastName}</td>
            <td style={tdStyle}>
              {athlete.sportsDiscipline ? (
                athlete.sportsDiscipline
              ) : (
                <span style={{ color: "rgba(255, 255, 255, 0.3)" }}>—</span>
              )}
            </td>
            <td style={tdStyle}>
              {(() => {
                const clubName = athlete.clubName || (athlete.clubId ? (clubs?.find(c => String(c.id) === String(athlete.clubId))?.name || `კლუბი ID: #${athlete.clubId}`) : "");
                const hasClub = athlete.isClubMember && clubName;
                return hasClub ? (
                  <a 
                    href={`/clubs/${athlete.clubId || ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (onClubClick && athlete.clubId) {
                        onClubClick(athlete.clubId);
                      }
                    }}
                    style={{
                      color: "#22d3ee",
                      textShadow: "0 0 8px rgba(34, 211, 238, 0.4)",
                      textDecoration: "none",
                      fontWeight: "500",
                      cursor: "pointer"
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
                    onMouseOut={(e) => { e.currentTarget.style.textDecoration = "none"; }}
                  >
                    {clubName}
                  </a>
                ) : (
                  <span style={{ color: "rgba(255, 255, 255, 0.3)" }}>—</span>
                );
              })()}
            </td>
            <td style={tdStyle}>
              {athlete.isFederationMember ? (
                <>
                  {athlete.membershipStatus === 'Active' && (
                    <span style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>
                      მოქმედი
                    </span>
                  )}
                  {athlete.membershipStatus === 'Suspended' && (
                    <span style={{ backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#f59e0b", border: "1px solid rgba(245, 158, 11, 0.3)", padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>
                      შეჩერებული
                    </span>
                  )}
                  {athlete.membershipStatus === 'Terminated' && (
                    <span style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)", padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>
                      შეწყვეტილი
                    </span>
                  )}
                  {athlete.membershipStatus === 'Deceased' && (
                    <span style={{ backgroundColor: "rgba(148, 163, 184, 0.15)", color: "#94a3b8", border: "1px solid rgba(148, 163, 184, 0.3)", padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>
                      გარდაცვლილი
                    </span>
                  )}
                </>
              ) : (
                <span style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", color: "rgba(255, 255, 255, 0.4)", border: "1px solid rgba(255, 255, 255, 0.1)", padding: "4px 8px", borderRadius: "12px", fontSize: "12px" }}>
                  არა-წევრი
                </span>
              )}
            </td>
          </tr>
        ))}
        {filteredAthletes.length === 0 && (
          <tr>
            <td colSpan="4" style={{ ...tdStyle, textAlign: "center", color: "rgba(226, 232, 240, 0.5)" }}>
              ჩანაწერები არ მოიძებნა
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default AthletesTable;
