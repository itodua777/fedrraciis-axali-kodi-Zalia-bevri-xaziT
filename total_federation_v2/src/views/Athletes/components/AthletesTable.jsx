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
  const { ranksEnabled } = useRatingSettingsStore();

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse"
  };

  const thStyle = {
    color: "var(--color-emerald-core)",
    textAlign: "left",
    padding: "8px 12px",
    borderBottom: "1px solid var(--color-iron-border)",
    textTransform: "uppercase",
    fontSize: "12px",
    letterSpacing: "1px",
    whiteSpace: "nowrap"
  };

  const tdStyle = {
    padding: "8px 12px",
    borderBottom: "1px solid var(--color-iron-border)",
    color: "var(--color-bone-light)",
    verticalAlign: "middle"
  };

  const avatarContainerStyle = {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    border: "1.5px solid var(--color-iron-border)",
    boxShadow: "none",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--color-iron-surface)",
    flexShrink: 0
  };

  return (
    <div className="inner-table-container custom-scrollbar" style={{ width: "100%", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
      <table style={{ ...tableStyle, minWidth: "100%" }}>
        <thead>
          <tr>
            <th style={{ ...thStyle, width: "60px" }}>ფოტო</th>
            <th style={{ ...thStyle, width: "auto" }}>სახელი / გვარი</th>
            {isExpanded && <th style={{ ...thStyle, width: "130px" }}>პირადი ნომერი</th>}
            <th style={{ ...thStyle, width: "60px" }}>ასაკი</th>
            <th style={{ ...thStyle, width: "150px" }}>სპორტის სახეობა</th>
            {ranksEnabled && <th style={{ ...thStyle, width: "140px" }}>თანრიგი</th>}
            {isExpanded && <th style={{ ...thStyle, width: "120px" }}>სტატუსი</th>}
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
                  backgroundColor: selectedAthlete?.id === athlete.id ? "color-mix(in oklab, var(--color-emerald-core) 10%, transparent)" : "transparent",
                  transition: "background-color 0.2s"
                }}
                onMouseOver={(e) => {
                  if (selectedAthlete?.id !== athlete.id) {
                    e.currentTarget.style.backgroundColor = "color-mix(in oklab, var(--color-bone-light) 5%, transparent)";
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
                        <i className="fa-solid fa-user" style={{ color: "var(--color-silver-structure)", fontSize: "12px" }}></i>
                      </div>
                    )}
                  </div>
                </td>

                {/* 2. Name / Surname */}
                <td style={{ ...tdStyle, fontWeight: "500", whiteSpace: "nowrap" }}>
                  {athlete.firstName} {athlete.lastName}
                </td>

                {/* 2.5 Personal ID */}
                {isExpanded && (
                  <td style={{ ...tdStyle, whiteSpace: "nowrap", fontFamily: "monospace", letterSpacing: "0.5px" }}>
                    {athlete.personalId || <span style={{ color: "var(--color-silver-structure)" }}>—</span>}
                  </td>
                )}

                {/* 3. Age */}
                <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                  {age !== '' ? age : <span style={{ color: "var(--color-silver-structure)" }}>—</span>}
                </td>

                {/* 4. Sport */}
                <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                  {athlete.sportsDiscipline ? (
                    athlete.sportsDiscipline
                  ) : (
                    <span style={{ color: "var(--color-silver-structure)" }}>—</span>
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
                      <span style={{ color: "var(--color-silver-structure)" }}>—</span>
                    )}
                  </td>
                )}

                {/* 5.5 Status */}
                {isExpanded && (
                  <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                    {(() => {
                      const badge = getStatusBadge(athlete.membershipStatus);
                      return (
                        <span style={{
                          backgroundColor: badge.backgroundColor,
                          color: badge.color,
                          border: badge.border,
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          display: "inline-flex",
                          alignItems: "center"
                        }}>
                          {badge.label}
                        </span>
                      );
                    })()}
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
                            color: "var(--color-emerald-core)",
                            textShadow: "0 0 8px var(--color-emerald-core)",
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
                      <span style={{ color: "var(--color-silver-structure)" }}>—</span>
                    );
                  })()}
                </td>
              </tr>
            );
          })}
          {filteredAthletes.length === 0 && (
            <tr>
              <td 
                colSpan={(ranksEnabled ? 6 : 5) + (isExpanded ? 2 : 0)} 
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
