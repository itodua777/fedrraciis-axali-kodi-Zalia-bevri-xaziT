import React from '../../../utils/react-shim.js';
import SearchableDropdown from '../../../components/ui/SearchableDropdown.jsx';
import Timeline from '../../../components/ui/Timeline.jsx';
import { checkAndApplyRankUp } from '../../../utils/helpers.js';

const FullscreenFederationHistory = ({
  athlete,
  editForm,
  setEditForm,
  isEditing,
  isDeceased,
  isVotingDisabled,
  isMinor,
  clubs,
  onClubClick,
  setIsFullscreenOpen,
  onUpdateAthlete
}) => {
  const labelStyle = { fontSize: "11px", color: "rgba(255, 255, 255, 0.4)", textTransform: "uppercase", display: "block", marginBottom: "4px" };
  const inputStyle = { width: "100%", padding: "6px 10px", backgroundColor: "#1e222b", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "6px", color: "#fff", fontSize: "12px", outline: "none", boxSizing: "border-box" };

  return (
    <div style={{
      gridColumn: "span 6",
      display: "flex",
      flexDirection: "column",
      gap: "24px"
    }}>
      {/* Federation status & roles (Col-Span 6 inside left col) */}
      <div style={{
        backgroundColor: "rgba(255, 255, 255, 0.02)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }}>
        <h4 style={{ margin: 0, color: "#22d3ee", fontSize: "14px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          🛡️ ფედერაციული სტატუსი & როლები
        </h4>

        {isEditing ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
            <div style={{ marginBottom: "5px" }}>
              <label style={labelStyle}>* სპორტის სახეობა:</label>
              <input 
                type="text" 
                value={editForm.sportsDiscipline || ''} 
                onChange={e => setEditForm(prev => ({ ...prev, sportsDiscipline: e.target.value }))}
                style={inputStyle}
                placeholder="ალპინიზმი, მეკლდეურობა..."
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "8px" }}>
              <span style={{ fontSize: "13px", color: "#fff", fontWeight: "bold" }}>არის თუ არა კლუბის წევრი?</span>
              <div style={{ display: "flex", gap: "5px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setEditForm(prev => ({ ...prev, isClubMember: true }));
                  }}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "6px",
                    border: editForm.isClubMember ? "1px solid #22d3ee" : "1px solid rgba(255,255,255,0.1)",
                    backgroundColor: editForm.isClubMember ? "rgba(34, 211, 238, 0.15)" : "transparent",
                    color: editForm.isClubMember ? "#22d3ee" : "rgba(255,255,255,0.6)",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "12px",
                    transition: "all 0.2s"
                  }}
                >
                  კი
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditForm(prev => ({ ...prev, isClubMember: false, clubId: null }));
                  }}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "6px",
                    border: !editForm.isClubMember ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.1)",
                    backgroundColor: !editForm.isClubMember ? "rgba(239, 68, 68, 0.15)" : "transparent",
                    color: !editForm.isClubMember ? "#ef4444" : "rgba(255,255,255,0.6)",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "12px",
                    transition: "all 0.2s"
                  }}
                >
                  არა
                </button>
              </div>
            </div>

            {editForm.isClubMember && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", borderTop: "1px dashed rgba(30, 41, 59, 0.8)", paddingTop: "8px" }}>
                <label style={labelStyle}>* აირჩიეთ კლუბი რეესტრიდან:</label>
                <SearchableDropdown
                  value={editForm.clubId ? String(editForm.clubId) : ''}
                  options={clubs ? clubs.map(c => ({ code: String(c.id), name: c.name })) : []}
                  onChange={(val) => {
                    setEditForm(prev => ({ ...prev, clubId: val || null }));
                  }}
                  placeholder="აირჩიეთ კლუბი..."
                />
                {editForm.clubId && (
                  <div style={{ fontSize: "11px", color: "#10b981", display: "flex", alignItems: "center", gap: "4px" }}>
                    <i className="fa-solid fa-circle-check"></i>
                    <span>✓ სისტემამ გადაამოწმა: კლუბი აქტიურია, ID: #{editForm.clubId}</span>
                  </div>
                )}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "8px" }}>
              <span style={{ fontSize: "13px", color: "#fff", fontWeight: "bold" }}>ფедераციის წევრი:</span>
              <div style={{ display: "flex", gap: "5px" }}>
                <button
                  type="button"
                  onClick={() => {
                    if (!isDeceased) {
                      setEditForm(prev => ({ ...prev, isFederationMember: true }));
                    }
                  }}
                  disabled={isDeceased}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "6px",
                    border: editForm.isFederationMember ? "1px solid #22d3ee" : "1px solid rgba(255,255,255,0.1)",
                    backgroundColor: editForm.isFederationMember ? "rgba(34, 211, 238, 0.15)" : "transparent",
                    color: editForm.isFederationMember ? "#22d3ee" : "rgba(255,255,255,0.6)",
                    cursor: isDeceased ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                    fontSize: "12px",
                    transition: "all 0.2s"
                  }}
                >
                  კი
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!isDeceased) {
                      setEditForm(prev => ({ ...prev, isFederationMember: false }));
                    }
                  }}
                  disabled={isDeceased}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "6px",
                    border: !editForm.isFederationMember ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.1)",
                    backgroundColor: !editForm.isFederationMember ? "rgba(239, 68, 68, 0.15)" : "transparent",
                    color: !editForm.isFederationMember ? "#ef4444" : "rgba(255,255,255,0.6)",
                    cursor: isDeceased ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                    fontSize: "12px",
                    transition: "all 0.2s"
                  }}
                >
                  არა
                </button>
              </div>
            </div>

            {editForm.isFederationMember && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px dashed rgba(30, 41, 59, 0.8)", paddingTop: "12px" }}>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {/* Status Select */}
                  <div>
                    <label style={labelStyle}>წევრობის სტატუსი</label>
                    <select
                      value={editForm.membershipStatus || 'Active'}
                      onChange={e => {
                        const val = e.target.value;
                        setEditForm(prev => {
                          const newStatus = val;
                          const newVoting = (newStatus === 'Suspended' || newStatus === 'Terminated' || newStatus === 'Deceased') ? false : prev.hasVotingRight;
                          return {
                            ...prev,
                            membershipStatus: newStatus,
                            hasVotingRight: newVoting
                          };
                        });
                      }}
                      style={{ ...inputStyle, cursor: "pointer", opacity: 1 }}
                      onFocus={e => e.target.style.borderColor = '#22d3ee'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    >
                      <option value="Active">მოქმედი</option>
                      <option value="Suspended">შეჩერებული</option>
                      <option value="Terminated">შეწყვეტილი</option>
                      <option value="Deceased">გარდაცვალება</option>
                    </select>
                  </div>

                  {/* Fee Paid Select */}
                  <div>
                    <label style={labelStyle}>საწევრო</label>
                    <select
                      value={editForm.membershipFeePaid ? "paid" : "unpaid"}
                      disabled={isDeceased}
                      onChange={e => {
                        const val = e.target.value === "paid";
                        setEditForm(prev => {
                          let updatedStatus = prev.membershipStatus;
                          let updatedVoting = prev.hasVotingRight;
                          if (!val) {
                            updatedStatus = 'Suspended';
                            updatedVoting = false;
                          }
                          return {
                            ...prev,
                            membershipFeePaid: val,
                            membershipStatus: updatedStatus,
                            hasVotingRight: updatedVoting
                          };
                        });
                      }}
                      style={{
                        ...inputStyle,
                        cursor: isDeceased ? "not-allowed" : "pointer"
                      }}
                      onFocus={e => { if (!isDeceased) e.target.style.borderColor = '#22d3ee'; }}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    >
                      <option value="paid">გადახდილი</option>
                      <option value="unpaid">გადაუხდელი</option>
                    </select>
                  </div>
                </div>

                {/* Rating Points Input */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={labelStyle}>რეიტინგი (ქულა)</label>
                    <input
                      type="number"
                      placeholder="რეიტინგის ქულა"
                      value={editForm.referral ?? 0}
                      disabled={isDeceased}
                      onChange={e => {
                        const newVal = parseInt(e.target.value) || 0;
                        const oldVal = editForm.referral ?? 0;
                        setEditForm(prev => {
                          const newAchievements = checkAndApplyRankUp(prev, oldVal, newVal);
                          return {
                            ...prev,
                            referral: newVal,
                            achievements: newAchievements
                          };
                        });
                      }}
                      style={inputStyle}
                      onFocus={e => { if (!isDeceased) e.target.style.borderColor = '#22d3ee'; }}
                      onBlur={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                    />
                  </div>
                </div>

                {/* Deceased deathYear input */}
                {editForm.membershipStatus === 'Deceased' && (
                  <div style={{ animation: "fadeIn 0.3s ease" }}>
                    <label style={{ ...labelStyle, color: "#f87171" }}>გარდაცვალების წელი *</label>
                    <input
                      type="number"
                      placeholder="მაგ: 2024"
                      value={editForm.deathYear || ''}
                      onChange={e => setEditForm(prev => ({ ...prev, deathYear: e.target.value }))}
                      style={{ ...inputStyle, opacity: 1, cursor: "text", borderColor: "rgba(239, 68, 68, 0.4)", boxShadow: "0 0 5px rgba(239, 68, 68, 0.1)" }}
                      onFocus={e => { e.target.style.borderColor = '#ef4444'; e.target.style.boxShadow = '0 0 8px rgba(239, 68, 68, 0.3)'; }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(239, 68, 68, 0.4)'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                )}

                {/* Rights and Roles checkboxes */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "5px" }}>
                  {/* Founder */}
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: isDeceased ? "not-allowed" : "pointer", fontSize: "13px", color: "#fff" }}>
                    <input
                      type="checkbox"
                      checked={editForm.isFounder || false}
                      disabled={isDeceased}
                      onChange={e => setEditForm(prev => ({ ...prev, isFounder: e.target.checked }))}
                      style={{ width: "16px", height: "16px", cursor: isDeceased ? "not-allowed" : "pointer" }}
                    />
                    დამფუძნებელი
                  </label>

                  {/* Voting Right */}
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: (isDeceased || isVotingDisabled) ? "not-allowed" : "pointer",
                    fontSize: "13px",
                    color: (isDeceased || isVotingDisabled) ? "rgba(255,255,255,0.3)" : "#fff"
                  }}>
                    <input
                      type="checkbox"
                      checked={editForm.hasVotingRight || false}
                      disabled={isDeceased || isVotingDisabled}
                      onChange={e => setEditForm(prev => ({ ...prev, hasVotingRight: e.target.checked }))}
                      style={{ width: "16px", height: "16px", cursor: (isDeceased || isVotingDisabled) ? "not-allowed" : "pointer" }}
                    />
                    ხმის უფლება
                  </label>

                  {/* National Team */}
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: isDeceased ? "not-allowed" : "pointer", fontSize: "13px", color: "#fff" }}>
                    <input
                      type="checkbox"
                      checked={editForm.isNationalTeamMember || false}
                      disabled={isDeceased}
                      onChange={e => setEditForm(prev => ({ ...prev, isNationalTeamMember: e.target.checked }))}
                      style={{ width: "16px", height: "16px", cursor: isDeceased ? "not-allowed" : "pointer" }}
                    />
                    ეროვნული ნაკრები
                  </label>

                  {/* Veteran */}
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: isDeceased ? "not-allowed" : "pointer", fontSize: "13px", color: "#fff" }}>
                    <input
                      type="checkbox"
                      checked={editForm.isVeteran || false}
                      disabled={isDeceased}
                      onChange={e => setEditForm(prev => ({ ...prev, isVeteran: e.target.checked }))}
                      style={{ width: "16px", height: "16px", cursor: isDeceased ? "not-allowed" : "pointer" }}
                    />
                    ვეტერანი ათლეტი
                  </label>

                  {/* Mentor */}
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: isDeceased ? "not-allowed" : "pointer", fontSize: "13px", color: "#fff" }}>
                    <input
                      type="checkbox"
                      checked={editForm.isMentor || false}
                      disabled={isDeceased}
                      onChange={e => setEditForm(prev => ({ ...prev, isMentor: e.target.checked }))}
                      style={{ width: "16px", height: "16px", cursor: isDeceased ? "not-allowed" : "pointer" }}
                    />
                    პარალელურად მენტორი
                  </label>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <span style={{ color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontSize: "11px", display: "block", marginBottom: "4px" }}>სპორტის სახეობა</span>
                <span style={{ fontWeight: "bold", color: "#fff", fontSize: "13px" }}>
                  {athlete.sportsDiscipline || "მიუთითებელი"}
                </span>
              </div>
              <div>
                <span style={{ color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontSize: "11px", display: "block", marginBottom: "4px" }}>კლუბის წევრი</span>
                <span style={{ fontWeight: "bold", color: athlete.isClubMember ? "#22d3ee" : "rgba(255,255,255,0.5)", fontSize: "13px" }}>
                  {athlete.isClubMember ? "კი" : "არა"}
                </span>
              </div>
            </div>

            {athlete.isClubMember && athlete.clubId && (
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontSize: "11px" }}>მიკუთვნებული კლუბი</span>
                <span 
                  onClick={() => {
                    setIsFullscreenOpen(false);
                    if (onClubClick) {
                      onClubClick(athlete.clubId);
                    }
                  }}
                  style={{ 
                    cursor: "pointer", 
                    color: "#22d3ee",
                    textDecoration: "underline",
                    fontSize: "13px"
                  }}
                >
                  {clubs && clubs.find(c => c.id === athlete.clubId)?.name || athlete.clubId}
                </span>
              </div>
            )}

            {athlete.isFederationMember ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "12px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <span style={{ color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontSize: "11px", display: "block", marginBottom: "4px" }}>წევრობის სტატუსი</span>
                    <div>
                      {athlete.membershipStatus === 'Active' && (
                        <span style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" }}>
                          მოქმედი
                        </span>
                      )}
                      {athlete.membershipStatus === 'Suspended' && (
                        <span style={{ backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#f59e0b", border: "1px solid rgba(245, 158, 11, 0.3)", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" }}>
                          შეჩერებული
                        </span>
                      )}
                      {athlete.membershipStatus === 'Terminated' && (
                        <span style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" }}>
                          შეწყვეტილი
                        </span>
                      )}
                      {athlete.membershipStatus === 'Deceased' && (
                        <span style={{ backgroundColor: "rgba(148, 163, 184, 0.15)", color: "#94a3b8", border: "1px solid rgba(148, 163, 184, 0.3)", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" }}>
                          გარდაცვალება {athlete.deathYear ? `(${athlete.deathYear})` : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontSize: "11px", display: "block", marginBottom: "4px" }}>საწევრო გადასახადი</span>
                    <div>
                      {athlete.membershipFeePaid ? (
                        <span style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" }}>
                          გადახდილი
                        </span>
                      ) : (
                        <span style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" }}>
                          გადაუხდელი
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Roles */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}>
                  {athlete.isFounder && (
                    <span style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "4px 10px", borderRadius: "6px", fontSize: "12px" }}>
                      👑 დამფუძნებელი
                    </span>
                  )}
                  {athlete.hasVotingRight ? (
                    <span style={{ backgroundColor: "rgba(34, 211, 238, 0.1)", border: "1px solid rgba(34, 211, 238, 0.3)", color: "#22d3ee", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "500" }}>
                      🗳️ ხმის უფლებით
                    </span>
                  ) : (
                    <span style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", padding: "4px 10px", borderRadius: "6px", fontSize: "12px" }}>
                      🗳️ ხმის უფლების გარეშე
                    </span>
                  )}
                  {athlete.isNationalTeamMember && (
                    <span style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#f87171", padding: "4px 10px", borderRadius: "6px", fontSize: "12px" }}>
                      🇬🇪 ეროვნული ნაკრები
                    </span>
                  )}
                  {athlete.isVeteran && (
                    <span style={{ backgroundColor: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.3)", color: "#f59e0b", padding: "4px 10px", borderRadius: "6px", fontSize: "12px" }}>
                      🎖️ ვეტერანი
                    </span>
                  )}
                  {athlete.isMentor && (
                    <span style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#10b981", padding: "4px 10px", borderRadius: "6px", fontSize: "12px" }}>
                      🎓 მენტორი
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", fontStyle: "italic", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "8px" }}>
                სპორტსმენი არ არის ფედერაციის წევრი.
              </div>
            )}
          </div>
        )}

        {/* Minor Representative details */}
        {isMinor && (athlete.representativeName || athlete.representativePhone) && (
          <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "12px", marginTop: "4px", fontSize: "13px" }}>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
              👤 წარმომადგენელი ({athlete.representativeType === 'parent' ? 'მშობელი' : 'მეურვე'})
            </span>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#fff" }}>
              <span>{athlete.representativeName || '-'}</span>
              <span style={{ color: "#22d3ee", fontWeight: "bold" }}>{athlete.representativePhone || '-'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Sporting History & Achievements (Col-Span 6 inside left col) */}
      <div style={{
        backgroundColor: "rgba(255, 255, 255, 0.02)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        flex: 1
      }}>
        <h4 style={{ margin: 0, color: "#22d3ee", fontSize: "14px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          🏆 სპორტული ისტორია & მიღწევები
        </h4>
        <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "12px", flex: 1 }}>
          <Timeline 
            athlete={athlete} 
            onUpdateAthlete={onUpdateAthlete} 
          />
        </div>
      </div>
    </div>
  );
};

export default FullscreenFederationHistory;
