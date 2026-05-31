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
      backgroundColor: "color-mix(in oklab, var(--color-gold-raw) 15%, transparent)", // Muted gold
      color: "var(--color-gold-raw)", // Gold
      border: "1px solid var(--color-gold-raw)",
      icon: "fa-solid fa-crown"
    };
  } else if (labelLower.includes('თანრიგი')) {
    if (labelLower.includes('i თანრიგი')) {
      return {
        label: displayLabel,
        backgroundColor: "color-mix(in oklab, var(--color-sapphire) 15%, transparent)", // Muted blue
        color: "var(--color-sapphire)",
        border: "1px solid var(--color-sapphire)",
        icon: "fa-solid fa-medal"
      };
    } else if (labelLower.includes('ii თანრიგი')) {
      return {
        label: displayLabel,
        backgroundColor: "color-mix(in oklab, var(--color-emerald-core) 15%, transparent)", // Muted green
        color: "var(--color-emerald-core)",
        border: "1px solid var(--color-emerald-core)",
        icon: "fa-solid fa-medal"
      };
    } else {
      // III თანრიგი or any other
      return {
        label: displayLabel,
        backgroundColor: "color-mix(in oklab, var(--color-silver-structure) 15%, transparent)", // Muted slate/gray
        color: "var(--color-silver-structure)",
        border: "1px solid var(--color-silver-structure)",
        icon: "fa-solid fa-medal"
      };
    }
  } else if (labelLower.includes('ალპინისტი') || labelLower.includes('badge')) {
    return {
      label: displayLabel,
      backgroundColor: "color-mix(in oklab, var(--color-emerald-core) 15%, transparent)", // Muted cyan
      color: "var(--color-emerald-core)",
      border: "1px solid var(--color-emerald-core)",
      icon: "fa-solid fa-certificate"
    };
  }

  return {
    label: displayLabel,
    backgroundColor: "var(--color-iron-surface)",
    color: "var(--color-silver-structure)",
    border: "1px solid var(--color-iron-border)",
    icon: "fa-solid fa-award"
  };
};

const getStatusBadge = (status) => {
  if (status === 'Active') {
    return {
      label: 'მოქმედი',
      backgroundColor: "color-mix(in oklab, var(--color-emerald-core) 10%, transparent)",
      color: "var(--color-emerald-core)",
      border: "1px solid color-mix(in oklab, var(--color-emerald-core) 30%, transparent)",
    };
  } else if (status === 'Suspended') {
    return {
      label: 'შეჩერებული',
      backgroundColor: "color-mix(in oklab, var(--color-copper) 10%, transparent)",
      color: "var(--color-copper)",
      border: "1px solid color-mix(in oklab, var(--color-copper) 30%, transparent)",
    };
  } else if (status === 'Terminated') {
    return {
      label: 'შეწყვეტილი',
      backgroundColor: "color-mix(in oklab, #ef4444 10%, transparent)",
      color: "#ef4444",
      border: "1px solid color-mix(in oklab, #ef4444 30%, transparent)",
    };
  } else if (status === 'Deceased') {
    return {
      label: 'გარდაცვლილი',
      backgroundColor: "color-mix(in oklab, var(--color-silver-structure) 10%, transparent)",
      color: "var(--color-silver-structure)",
      border: "1px solid color-mix(in oklab, var(--color-silver-structure) 30%, transparent)",
    };
  }
  return {
    label: status || '—',
    backgroundColor: "var(--color-iron-surface)",
    color: "var(--color-silver-structure)",
    border: "1px solid var(--color-iron-border)",
  };
};

const AthletesTable = ({
  filteredAthletes,
  selectedAthlete,
  setSelectedAthlete,
  clubs,
  onClubClick,
  isExpanded
}) => {
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse"
  };

  const thStyle = {
    color: "var(--color-emerald-core)",
    textAlign: "left",
    padding: "6px 12px",
    borderBottom: "1px solid var(--color-iron-border)",
    textTransform: "uppercase",
    fontSize: "12px",
    letterSpacing: "1px",
    whiteSpace: "nowrap"
  };

  const tdStyle = {
    padding: "6px 12px",
    borderBottom: "1px solid var(--color-iron-border)",
    color: "var(--color-bone-light)",
    verticalAlign: "middle",
    fontSize: "13px"
  };

  const getStatusColor = (status) => {
    if (status === 'Active' || status === 'მოქმედი') return '#00E676'; // Emerald Core
    if (status === 'Suspended' || status === 'შეჩერებული') return '#f59e0b'; // Amber/Yellow
    if (status === 'Terminated' || status === 'შეწყვეტილი') return '#ef4444'; // Rose/Red
    if (status === 'Deceased' || status === 'გარდაცვლილი') return '#71717a'; // Zinc/Gray
    return '#71717a';
  };

  return (
    <div className="inner-table-container custom-scrollbar" style={{ width: "100%", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
      <table style={{ ...tableStyle, minWidth: "100%" }}>
        <thead>
          <tr>
            <th style={{ ...thStyle, width: "40px", textAlign: "center" }}>#</th>
            <th style={{ ...thStyle, width: "50px", textAlign: "center" }}>ავატარი</th>
            <th style={{ ...thStyle, width: "auto" }}>სახელი / გვარი</th>
            <th style={{ ...thStyle, width: "130px" }}>პირადი ნომერი</th>
            <th style={{ ...thStyle, width: "150px" }}>სპორტის სახეობა</th>
            <th style={{ ...thStyle, width: "140px" }}>სპორტული თანრიგი</th>
          </tr>
        </thead>
        <tbody>
          {filteredAthletes.map((athlete, index) => {
            const rankBadge = getRankBadgeContent(athlete.rank || athlete.mountaineerRank);
            
            return (
              <tr 
                key={athlete.id} 
                onClick={() => setSelectedAthlete(athlete)}
                style={{ 
                  cursor: "pointer", 
                  backgroundColor: selectedAthlete?.id === athlete.id ? "color-mix(in oklab, var(--color-emerald-core) 10%, transparent)" : "transparent",
                  transition: "background-color 0.2s"
                }}
                onMouseOver={(e) => {
                  if (selectedAthlete?.id !== athlete.id) {
                    e.currentTarget.style.backgroundColor = "rgba(24, 24, 27, 0.5)";
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedAthlete?.id !== athlete.id) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {/* 1. Numbering (#) */}
                <td style={{ ...tdStyle, width: "40px", textAlign: "center", color: "var(--color-silver-structure)" }}>
                  {index + 1}
                </td>

                {/* 2. Avatar + Status Dot */}
                <td style={{ ...tdStyle, width: "50px", textAlign: "center" }}>
                  <div style={{ position: "relative", display: "inline-block", flexShrink: 0 }}>
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      border: "1.5px solid var(--color-iron-border)",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "var(--color-iron-surface)"
                    }}>
                      {athlete.photo ? (
                        <img src={athlete.photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                      ) : (
                        <i className="fa-solid fa-user" style={{ color: "var(--color-silver-structure)", fontSize: "12px" }}></i>
                      )}
                    </div>
                    <div style={{
                      position: "absolute",
                      bottom: "-1px",
                      right: "-1px",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      border: "1.5px solid #121418",
                      backgroundColor: getStatusColor(athlete.membershipStatus),
                      boxShadow: "0 0 4px rgba(0,0,0,0.5)"
                    }} title={
                      athlete.membershipStatus === 'Active' ? 'მოქმედი' :
                      athlete.membershipStatus === 'Suspended' ? 'შეჩერებული' :
                      athlete.membershipStatus === 'Terminated' ? 'შეწყვეტილი' :
                      athlete.membershipStatus === 'Deceased' ? 'გარდაცვლილი' : athlete.membershipStatus || '—'
                    } />
                  </div>
                </td>

                {/* 3. Name / Surname */}
                <td style={tdStyle}>
                  <span style={{ fontWeight: "700", color: "var(--color-bone-light)", whiteSpace: "nowrap" }}>
                    {athlete.firstName} {athlete.lastName}
                  </span>
                </td>

                {/* 4. Personal ID */}
                <td style={{ ...tdStyle, whiteSpace: "nowrap", fontFamily: "monospace", letterSpacing: "0.5px" }}>
                  {athlete.personalId || <span style={{ color: "var(--color-silver-structure)" }}>-</span>}
                </td>

                {/* 5. Sport */}
                <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                  {athlete.sportsDiscipline ? (
                    athlete.sportsDiscipline
                  ) : (
                    <span style={{ color: "var(--color-silver-structure)" }}>-</span>
                  )}
                </td>

                {/* 6. Rank (Only if exists) */}
                <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                  {rankBadge ? (
                    <span style={{ 
                      backgroundColor: rankBadge.backgroundColor, 
                      color: rankBadge.color, 
                      border: rankBadge.border, 
                      padding: "2px 8px", 
                      borderRadius: "12px", 
                      fontSize: "11px", 
                      fontWeight: "bold",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px"
                    }}>
                      <i className={rankBadge.icon} style={{ fontSize: "10px" }}></i>
                      {rankBadge.label}
                    </span>
                  ) : null}
                </td>
              </tr>
            );
          })}
          {filteredAthletes.length === 0 && (
            <tr>
              <td 
                colSpan={6} 
                style={{ ...tdStyle, textAlign: "center", color: "var(--color-silver-structure)" }}
              >
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
