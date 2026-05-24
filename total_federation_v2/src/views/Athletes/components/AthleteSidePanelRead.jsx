import React from '../../../utils/react-shim.js';

const AthleteSidePanelRead = ({
  athlete,
  isMinor,
  clubs,
  onClubClick,
  setIsEditing
}) => {
  return (
    <>
      {/* ICE (Emergency Contact) Block */}
      <div style={{ backgroundColor: "rgba(239, 68, 68, 0.04)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "10px", padding: "15px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <h4 style={{ margin: 0, color: "#ef4444", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          🚨 საგანგებო კონტაქტი (ICE)
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px solid rgba(30, 41, 59, 0.8)", paddingTop: "10px", fontSize: "13px", color: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "rgba(255,255,255,0.6)" }}>
              {athlete.emergencyContactName || '-'} {athlete.emergencyContactRelation ? `(${athlete.emergencyContactRelation})` : ''}
            </span>
            <span style={{ color: "#ef4444", fontWeight: "bold" }}>
              {athlete.emergencyContactPhone || '-'}
            </span>
          </div>
        </div>
      </div>

      {/* Block: Federation Membership & Rights Status */}
      <div style={{ backgroundColor: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "10px", padding: "15px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <h4 style={{ margin: 0, color: "#22d3ee", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          🛡️ ფედერაციული სტატუსი & უფლებამოსილება
        </h4>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px solid rgba(30, 41, 59, 0.8)", paddingTop: "10px", fontSize: "13px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "rgba(255,255,255,0.5)" }}>სპორტის სახეობა:</span>
            <span style={{ fontWeight: "bold", color: "#fff" }}>
              {athlete.sportsDiscipline || "მიუთითებელი"}
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "8px" }}>
            <span style={{ color: "rgba(255,255,255,0.5)" }}>ფедераციის წევრი:</span>
            <span style={{ fontWeight: "bold", color: athlete.isFederationMember ? "#22d3ee" : "rgba(255,255,255,0.5)" }}>
              {athlete.isFederationMember ? "კი" : "არა"}
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "8px" }}>
            <span style={{ color: "rgba(255,255,255,0.5)" }}>კლუბის წევრი:</span>
            <span style={{ fontWeight: "bold", color: athlete.isClubMember ? "#22d3ee" : "rgba(255,255,255,0.5)" }}>
              {athlete.isClubMember ? "კი" : "არა"}
            </span>
          </div>

          {athlete.isClubMember && athlete.clubId && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "8px" }}>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>კლუბი:</span>
              <span 
                onClick={() => onClubClick && onClubClick(athlete.clubId)}
                style={{ 
                  cursor: "pointer", 
                  color: "#22d3ee", 
                  textDecoration: "underline", 
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <i className="fa-solid fa-building" style={{ fontSize: "11px" }}></i>
                {clubs?.find(c => String(c.id) === String(athlete.clubId))?.name || `კლუბი ID: #${athlete.clubId}`}
              </span>
            </div>
          )}
          
          {athlete.isFederationMember && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", borderTop: "1px solid rgba(30, 41, 59, 0.8)", paddingTop: "8px" }}>
                <div>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>სტატუსი</span>
                  <div style={{ marginTop: "4px" }}>
                    {athlete.membershipStatus === 'Active' && (
                      <span style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "3px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" }}>
                        მოქმედი
                      </span>
                    )}
                    {athlete.membershipStatus === 'Suspended' && (
                      <span style={{ backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#f59e0b", border: "1px solid rgba(245, 158, 11, 0.3)", padding: "3px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" }}>
                        შეჩერებული
                      </span>
                    )}
                    {athlete.membershipStatus === 'Terminated' && (
                      <span style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)", padding: "3px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" }}>
                        შეწყვეტილი
                      </span>
                    )}
                    {athlete.membershipStatus === 'Deceased' && (
                      <span style={{ backgroundColor: "rgba(148, 163, 184, 0.15)", color: "#94a3b8", border: "1px solid rgba(148, 163, 184, 0.3)", padding: "3px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" }}>
                        გარდაცვალება {athlete.deathYear ? `(${athlete.deathYear})` : ''}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>საწევრო</span>
                  <div style={{ marginTop: "4px" }}>
                    {athlete.membershipFeePaid ? (
                      <span style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "3px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" }}>
                        გადახდილი
                      </span>
                    ) : (
                      <span style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)", padding: "3px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" }}>
                        გადაუხდელი
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Rights and Roles list */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", borderTop: "1px solid rgba(30, 41, 59, 0.8)", paddingTop: "8px", marginTop: "4px" }}>
                {athlete.isFounder && (
                  <span style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "3px 8px", borderRadius: "4px", fontSize: "11px" }}>
                    დამფუძნებელი
                  </span>
                )}
                {athlete.hasVotingRight ? (
                  <span style={{ backgroundColor: "rgba(34, 211, 238, 0.1)", border: "1px solid rgba(34, 211, 238, 0.3)", color: "#22d3ee", padding: "3px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "500" }}>
                    ხმის უფლებით
                  </span>
                ) : (
                  <span style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", padding: "3px 8px", borderRadius: "4px", fontSize: "11px" }}>
                    ხმის უფლების გარეშე
                  </span>
                )}
                {athlete.isNationalTeamMember && (
                  <span style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#f87171", padding: "3px 8px", borderRadius: "4px", fontSize: "11px" }}>
                    ეროვნული ნაკრები
                  </span>
                )}
                {athlete.isVeteran && (
                  <span style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)", color: "#f59e0b", padding: "3px 8px", borderRadius: "4px", fontSize: "11px" }}>
                    ვეტერანი
                  </span>
                )}
                {athlete.isMentor && (
                  <span style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#10b981", padding: "3px 8px", borderRadius: "4px", fontSize: "11px" }}>
                    მენტორი
                  </span>
                )}
              </div>
            </>
          )}

          {/* Minor Representative details */}
          {isMinor && (athlete.representativeName || athlete.representativePhone) && (
            <div style={{ borderTop: "1px solid rgba(30, 41, 59, 0.8)", paddingTop: "8px", marginTop: "4px", fontSize: "12px" }}>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", display: "block" }}>
                👤 წარმომადგენელი ({athlete.representativeType === 'parent' ? 'მშობელი' : 'მეურვე'})
              </span>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px", color: "#fff" }}>
                <span>{athlete.representativeName || '-'}</span>
                <span style={{ color: "#22d3ee" }}>{athlete.representativePhone || '-'}</span>
              </div>
            </div>
          )}

          {/* Documents Section */}
          {(athlete.idCardDoc || athlete.healthDoc || athlete.insuranceDoc || athlete.dopingDoc || athlete.representativeDoc) && (
            <div style={{ borderTop: "1px solid rgba(30, 41, 59, 0.8)", paddingTop: "8px", marginTop: "4px" }}>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                📄 დოკუმენტები
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {[
                  { key: 'idCardDoc', label: 'ID ბარათი / პასპორტი' },
                  { key: 'healthDoc', label: 'ჯანმრთელობის ცნობა' },
                  { key: 'insuranceDoc', label: 'დაზღვევის დოკუმენტაცია' },
                  { key: 'dopingDoc', label: 'დოპინგ ტესტის დოკუმენტი' },
                  { key: 'representativeDoc', label: 'მშობლის/მეურვის თანხმობა' }
                ].map(item => {
                  const doc = athlete[item.key];
                  if (!doc) return null;
                  const isPdf = doc.name?.endsWith('.pdf') || doc.type === 'application/pdf';
                  const docIcon = isPdf ? "fa-solid fa-file-pdf" : "fa-solid fa-file-image";
                  const docColor = isPdf ? "#ef4444" : "#10b981";
                  return (
                    <div 
                      key={item.key} 
                      style={{ 
                        backgroundColor: "rgba(0,0,0,0.2)", 
                        border: "1px solid rgba(255,255,255,0.05)", 
                        borderRadius: "8px", 
                        padding: "8px 10px", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "space-between", 
                        gap: "8px" 
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0, flex: 1 }}>
                        <i className={docIcon} style={{ color: docColor, fontSize: "16px", flexShrink: 0 }}></i>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontSize: "11px", fontWeight: "bold", color: "#fff", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                            {item.label}
                          </div>
                          <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.5)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                            {doc.name} ({(doc.size / 1024 / 1024).toFixed(2)} MB)
                          </div>
                        </div>
                      </div>
                      <a 
                        href={doc.data} 
                        download={doc.name}
                        style={{ 
                          background: "rgba(34, 211, 238, 0.1)", 
                          border: "1px solid rgba(34, 211, 238, 0.3)", 
                          color: "#22d3ee", 
                          width: "24px", 
                          height: "24px", 
                          borderRadius: "4px", 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center", 
                          transition: "all 0.2s"
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(34, 211, 238, 0.2)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(34, 211, 238, 0.1)"; }}
                      >
                        <i className="fa-solid fa-download" style={{ fontSize: "10px" }}></i>
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Checked-out Inventory Section */}
      <div style={{ backgroundColor: "rgba(34, 211, 238, 0.02)", border: "1px solid rgba(34, 211, 238, 0.15)", borderRadius: "10px", padding: "15px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <h4 style={{ margin: 0, color: "#22d3ee", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          📦 გაცემული ინვენტარი
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px solid rgba(30, 41, 59, 0.8)", paddingTop: "10px", fontSize: "13px" }}>
          {(!athlete.issuedItems || athlete.issuedItems.filter(item => item.status === 'issued').length === 0) ? (
            <div style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "12px", fontStyle: "italic" }}>
              გაცემული ნივთები არ ფიქსირდება
            </div>
          ) : (
            athlete.issuedItems.filter(item => item.status === 'issued').map(item => {
              const isOverdue = item.expectedReturnDate && new Date(item.expectedReturnDate) < new Date();
              return (
                <div key={item.id} style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "8px", backgroundColor: "rgba(255,255,255,0.02)", border: `1px solid ${isOverdue ? "#ef4444" : "rgba(255,255,255,0.05)"}`, borderRadius: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span style={{ fontWeight: "bold", color: "#fff", fontSize: "12px" }}>
                      {item.itemName} {item.type === 'bundle' ? ' (კომპლექტი)' : ''}
                    </span>
                    <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", backgroundColor: isOverdue ? "rgba(239, 68, 68, 0.15)" : "rgba(245, 158, 11, 0.15)", color: isOverdue ? "#ef4444" : "#f59e0b", border: `1px solid ${isOverdue ? "rgba(239, 68, 68, 0.3)" : "rgba(245, 158, 11, 0.3)"}` }}>
                      {isOverdue ? "ვადაგადაცილებული" : "გაცემული"}
                    </span>
                  </div>
                  {item.components && (
                    <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", margin: "2px 0" }}>
                      შემადგენლობა: {item.components}
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.5)", fontSize: "11px", marginTop: "2px" }}>
                    <span>კოდი: {item.itemCode}</span>
                    <span>ვადა: <span style={{ color: isOverdue ? "#ef4444" : "#fff", fontWeight: "bold" }}>{item.expectedReturnDate || 'უვადო'}</span></span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Edit Button for Read Mode */}
      {athlete.membershipStatus !== 'Deceased' && (
        <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid rgba(30, 41, 59, 0.8)", paddingTop: "15px" }}>
          <button
            onClick={() => setIsEditing(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              backgroundColor: "rgba(34, 211, 238, 0.1)",
              border: "1px solid rgba(34, 211, 238, 0.3)",
              color: "#22d3ee",
              padding: "8px 16px",
              borderRadius: "20px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "all 0.3s",
              boxShadow: "0 0 10px rgba(34, 211, 238, 0.1)"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = "rgba(34, 211, 238, 0.2)";
              e.currentTarget.style.boxShadow = "0 0 15px rgba(34, 211, 238, 0.4)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = "rgba(34, 211, 238, 0.1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <i className="fa-regular fa-pen-to-square"></i> რედაქტირება
          </button>
        </div>
      )}

      {/* Block H: Locked Profile message */}
      {athlete.membershipStatus === 'Deceased' && (
        <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid rgba(30, 41, 59, 0.8)", paddingTop: "15px", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#f87171", fontSize: "13px", fontWeight: "bold" }}>
            🕯️ პროფილი არქივშია (ლეგენდარული სპორტსმენები)
          </div>
        </div>
      )}
    </>
  );
};

export default AthleteSidePanelRead;
