import React from '../../../utils/react-shim.js';
import { useRatingSettingsStore } from '../../../context/ratingSettingsStore.js';

const computeAge = (birthDateStr) => {
  if (!birthDateStr) return '';
  const today = new Date();
  const birthDate = new Date(birthDateStr);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const getRankBadgeContent = (rankValue) => {
  if (!rankValue || rankValue === 'NONE' || rankValue === 'თანრიგის გარეშე') {
    return null;
  }

  let displayLabel = rankValue;
  const rankNames = {
    RANK_3: 'III თანრიგი',
    RANK_2: 'II თანრიგი',
    RANK_1: 'I თანრიგი',
    CANDIDATE: 'სპორტის ოსტატობის კანდიდატი',
    MASTER: 'სპორტის ოსტატი',
    INT_MASTER: 'საერთაშორისო კლასის სპორტის ოსტატი',
    BADGE: 'ალპინისტი'
  };

  if (rankNames[rankValue]) {
    displayLabel = rankNames[rankValue];
  }

  const labelLower = displayLabel.toLowerCase();
  
  if (labelLower.includes('ოსტატი')) {
    return {
      label: displayLabel,
      backgroundColor: "rgba(251, 191, 36, 0.15)", // Muted gold
      color: "#fbbf24", // Gold
      border: "1px solid rgba(251, 191, 36, 0.3)",
      icon: "fa-solid fa-crown"
    };
  } else if (labelLower.includes('თანრიგი')) {
    if (labelLower.includes('i თანრიგი')) {
      return {
        label: displayLabel,
        backgroundColor: "rgba(59, 130, 246, 0.15)", // Muted blue
        color: "#3b82f6",
        border: "1px solid rgba(59, 130, 246, 0.3)",
        icon: "fa-solid fa-medal"
      };
    } else if (labelLower.includes('ii თანრიგი')) {
      return {
        label: displayLabel,
        backgroundColor: "rgba(16, 185, 129, 0.15)", // Muted green
        color: "#10b981",
        border: "1px solid rgba(16, 185, 129, 0.3)",
        icon: "fa-solid fa-medal"
      };
    } else {
      // III თანრიგი or any other
      return {
        label: displayLabel,
        backgroundColor: "rgba(148, 163, 184, 0.15)", // Muted slate/gray
        color: "#94a3b8",
        border: "1px solid rgba(148, 163, 184, 0.3)",
        icon: "fa-solid fa-medal"
      };
    }
  } else if (labelLower.includes('ალპინისტი') || labelLower.includes('badge')) {
    return {
      label: displayLabel,
      backgroundColor: "rgba(34, 211, 238, 0.15)", // Muted cyan
      color: "#22d3ee",
      border: "1px solid rgba(34, 211, 238, 0.3)",
      icon: "fa-solid fa-certificate"
    };
  }

  return {
    label: displayLabel,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    color: "#e2e8f0",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    icon: "fa-solid fa-award"
  };
};

const AthletesTable = ({
  filteredAthletes,
  selectedAthlete,
  setSelectedAthlete,
  clubs,
  onClubClick
}) => {
  const { ranksEnabled } = useRatingSettingsStore();

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
    letterSpacing: "1px",
    whiteSpace: "nowrap"
  };

  const tdStyle = {
    padding: "15px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    color: "#e2e8f0",
    verticalAlign: "middle"
  };

  const avatarContainerStyle = {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    border: "1.5px solid #22d3ee",
    boxShadow: "0 0 8px rgba(34, 211, 238, 0.4)",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    flexShrink: 0
  };

  return (
    <div className="inner-table-container custom-scrollbar" style={{ width: "100%", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
      <table style={{ ...tableStyle, minWidth: "900px" }}>
        <thead>
          <tr>
            <th style={{ ...thStyle, width: "60px" }}>ფოტო</th>
            <th style={{ ...thStyle, width: "auto" }}>სახელი / გვარი</th>
            <th style={{ ...thStyle, width: "60px" }}>ასაკი</th>
            <th style={{ ...thStyle, width: "150px" }}>სპორტის სახეობა</th>
            {ranksEnabled && <th style={{ ...thStyle, width: "140px" }}>თანრიგი</th>}
            <th className="max-w-[180px]" style={{ ...thStyle, width: "180px", maxWidth: "180px" }}>კლუბი</th>
          </tr>
        </thead>
        <tbody>
          {filteredAthletes.map((athlete) => {
            const age = computeAge(athlete.birthday || athlete.birthDate);
            const rankBadge = ranksEnabled ? getRankBadgeContent(athlete.rank || athlete.mountaineerRank) : null;
            
            return (
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
                {/* 1. Photo */}
                <td style={tdStyle}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {athlete.photo ? (
                      <div style={avatarContainerStyle}>
                        <img src={athlete.photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                      </div>
                    ) : (
                      <div style={avatarContainerStyle}>
                        <i className="fa-solid fa-user" style={{ color: "rgba(226, 232, 240, 0.4)", fontSize: "14px" }}></i>
                      </div>
                    )}
                  </div>
                </td>

                {/* 2. Name / Surname */}
                <td style={{ ...tdStyle, fontWeight: "500", whiteSpace: "nowrap" }}>
                  {athlete.firstName} {athlete.lastName}
                </td>

                {/* 3. Age */}
                <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                  {age !== '' ? age : <span style={{ color: "rgba(255, 255, 255, 0.3)" }}>—</span>}
                </td>

                {/* 4. Sport */}
                <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                  {athlete.sportsDiscipline ? (
                    athlete.sportsDiscipline
                  ) : (
                    <span style={{ color: "rgba(255, 255, 255, 0.3)" }}>—</span>
                  )}
                </td>

                {/* 5. Rank */}
                {ranksEnabled && (
                  <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                    {rankBadge ? (
                      <span style={{ 
                        backgroundColor: rankBadge.backgroundColor, 
                        color: rankBadge.color, 
                        border: rankBadge.border, 
                        padding: "4px 10px", 
                        borderRadius: "12px", 
                        fontSize: "12px", 
                        fontWeight: "bold",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px"
                      }}>
                        <i className={rankBadge.icon} style={{ fontSize: "11px" }}></i>
                        {rankBadge.label}
                      </span>
                    ) : (
                      <span style={{ color: "rgba(255, 255, 255, 0.3)" }}>—</span>
                    )}
                  </td>
                )}

                {/* 6. Club */}
                <td className="max-w-[180px]" style={{ ...tdStyle, maxWidth: "180px" }}>
                  {(() => {
                    const clubName = athlete.clubName || (athlete.clubId ? (clubs?.find(c => String(c.id) === String(athlete.clubId))?.name || `კლუბი ID: #${athlete.clubId}`) : "");
                    const hasClub = athlete.isClubMember && clubName;
                    return hasClub ? (
                      <div 
                        className="truncate block max-w-[180px]"
                        title={athlete.club || clubName}
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "180px",
                          display: "block"
                        }}
                      >
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
                      </div>
                    ) : (
                      <span style={{ color: "rgba(255, 255, 255, 0.3)" }}>—</span>
                    );
                  })()}
                </td>
              </tr>
            );
          })}
          {filteredAthletes.length === 0 && (
            <tr>
              <td colSpan={ranksEnabled ? 6 : 5} style={{ ...tdStyle, textAlign: "center", color: "rgba(226, 232, 240, 0.5)" }}>
                ჩანაწერები არ მოიძებნა
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AthletesTable;
