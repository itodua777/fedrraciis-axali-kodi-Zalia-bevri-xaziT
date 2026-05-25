import React from '../../../utils/react-shim.js';
import SearchableDropdown from '../../../components/ui/SearchableDropdown.jsx';
import { checkAndApplyRankUp } from '../../../utils/helpers.js';

const AthleteSidePanelEdit = ({
  editForm,
  setEditForm,
  isDeceased,
  isVotingDisabled,
  clubs,
  handleSave,
  handleCancel
}) => {
  const labelStyle = { fontSize: "11px", color: "rgba(255, 255, 255, 0.4)", textTransform: "uppercase", display: "block", marginBottom: "4px" };
  const inputStyle = { width: "100%", padding: "6px 10px", backgroundColor: "#1e222b", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "6px", color: "#fff", fontSize: "12px", outline: "none", boxSizing: "border-box" };

  return (
    <>
      {/* Card 1: Physical & Medical Profile */}
      <div style={{ backgroundColor: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "10px", padding: "15px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <h4 style={{ margin: 0, color: "var(--color-emerald-core)", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          🩸 ფიზიკური და სამედიცინო
        </h4>
        
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "10px", borderTop: "1px solid rgba(30, 41, 59, 0.8)", paddingTop: "10px" }}>
          <div>
            <label style={labelStyle}>სიმაღლე/წონა</label>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <input
                type="number"
                placeholder="სმ"
                disabled={isDeceased}
                value={editForm.height || ''}
                onChange={e => setEditForm(prev => ({ ...prev, height: e.target.value }))}
                style={inputStyle}
                onFocus={e => { if (!isDeceased) { e.target.style.borderColor = 'var(--color-emerald-core)'; e.target.style.boxShadow = '0 0 8px color-mix(in oklab, var(--color-emerald-core) 20%, transparent)'; } }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.boxShadow = 'none'; }}
              />
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>სმ</span>
              <input
                type="number"
                placeholder="კგ"
                disabled={isDeceased}
                value={editForm.weight || ''}
                onChange={e => setEditForm(prev => ({ ...prev, weight: e.target.value }))}
                style={inputStyle}
                onFocus={e => { if (!isDeceased) { e.target.style.borderColor = 'var(--color-emerald-core)'; e.target.style.boxShadow = '0 0 8px color-mix(in oklab, var(--color-emerald-core) 20%, transparent)'; } }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.boxShadow = 'none'; }}
              />
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>კგ</span>
            </div>
          </div>
          <div>
            <label style={labelStyle}>სისხლი</label>
            <select
              disabled={isDeceased}
              value={editForm.bloodType || ''}
              onChange={e => setEditForm(prev => ({ ...prev, bloodType: e.target.value }))}
              style={{ ...inputStyle, cursor: isDeceased ? "not-allowed" : "pointer" }}
              onFocus={e => { if (!isDeceased) e.target.style.borderColor = 'var(--color-emerald-core)'; }}
              onBlur={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
            >
              <option value="">აირჩიეთ</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", borderTop: "1px solid rgba(30, 41, 59, 0.8)", paddingTop: "10px" }}>
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: isDeceased ? "not-allowed" : "pointer", fontSize: "13px", color: "#fff" }}>
              <input
                type="checkbox"
                disabled={isDeceased}
                checked={editForm.asthma === true || editForm.asthma === 'true' || editForm.asthma === 'კი' || editForm.asthma === 'yes'}
                onChange={e => setEditForm(prev => ({ ...prev, asthma: e.target.checked }))}
                style={{ width: "16px", height: "16px", cursor: isDeceased ? "not-allowed" : "pointer" }}
              />
              ⚠️ ასთმა
            </label>
          </div>
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: isDeceased ? "not-allowed" : "pointer", fontSize: "13px", color: "#fff" }}>
              <input
                type="checkbox"
                disabled={isDeceased}
                checked={editForm.diabetes === true || editForm.diabetes === 'true' || editForm.diabetes === 'კი' || editForm.diabetes === 'yes'}
                onChange={e => setEditForm(prev => ({ ...prev, diabetes: e.target.checked }))}
                style={{ width: "16px", height: "16px", cursor: isDeceased ? "not-allowed" : "pointer" }}
              />
              ⚠️ დიაბეტი
            </label>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(30, 41, 59, 0.8)", paddingTop: "10px" }}>
          <label style={labelStyle}>ალერგიები</label>
          <input
            type="text"
            disabled={isDeceased}
            value={editForm.allergies || ''}
            onChange={e => setEditForm(prev => ({ ...prev, allergies: e.target.value }))}
            style={inputStyle}
            placeholder="მაგ: თხილის ალერგია"
            onFocus={e => { if (!isDeceased) { e.target.style.borderColor = 'var(--color-emerald-core)'; e.target.style.boxShadow = '0 0 8px color-mix(in oklab, var(--color-emerald-core) 20%, transparent)'; } }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.boxShadow = 'none'; }}
          />
        </div>
      </div>

      {/* Card 2: Contact Card */}
      <div style={{ backgroundColor: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "10px", padding: "15px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <h4 style={{ margin: 0, color: "var(--color-emerald-core)", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          📞 საკონტაქტო მონაცემები
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid rgba(30, 41, 59, 0.8)", paddingTop: "8px" }}>
          <div>
            <label style={labelStyle}>მობილური ტელეფონი</label>
            <input
              type="text"
              disabled={isDeceased}
              value={editForm.phone || ''}
              onChange={e => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
              style={inputStyle}
              onFocus={e => { if (!isDeceased) { e.target.style.borderColor = 'var(--color-emerald-core)'; e.target.style.boxShadow = '0 0 8px color-mix(in oklab, var(--color-emerald-core) 20%, transparent)'; } }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <div>
            <label style={labelStyle}>ელ-ფოსტა</label>
            <input
              type="email"
              disabled={isDeceased}
              value={editForm.email || ''}
              onChange={e => setEditForm(prev => ({ ...prev, email: e.target.value }))}
              style={inputStyle}
              onFocus={e => { if (!isDeceased) { e.target.style.borderColor = 'var(--color-emerald-core)'; e.target.style.boxShadow = '0 0 8px color-mix(in oklab, var(--color-emerald-core) 20%, transparent)'; } }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
        </div>
      </div>

      {/* Card 3: ICE (Emergency Card) */}
      <div style={{ backgroundColor: "rgba(239, 68, 68, 0.04)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "10px", padding: "15px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <h4 style={{ margin: 0, color: "#ef4444", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "bold" }}>
          🚨 საგანგებო კონტაქტი (ICE)
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid rgba(30, 41, 59, 0.8)", paddingTop: "8px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ ...labelStyle, color: "rgba(239, 68, 68, 0.6)" }}>კავშირი</label>
              <input
                type="text"
                disabled={isDeceased}
                value={editForm.emergencyContactRelation || ''}
                onChange={e => setEditForm(prev => ({ ...prev, emergencyContactRelation: e.target.value }))}
                style={{ ...inputStyle, borderColor: "rgba(239, 68, 68, 0.2)" }}
                placeholder="მაგ: მამა"
                onFocus={e => { if (!isDeceased) { e.target.style.borderColor = '#ef4444'; e.target.style.boxShadow = '0 0 8px rgba(239, 68, 68, 0.2)'; } }}
                onBlur={e => { e.target.style.borderColor = 'rgba(239, 68, 68, 0.2)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <div>
              <label style={{ ...labelStyle, color: "rgba(239, 68, 68, 0.6)" }}>სახელი/გვარი</label>
              <input
                type="text"
                disabled={isDeceased}
                value={editForm.emergencyContactName || ''}
                onChange={e => setEditForm(prev => ({ ...prev, emergencyContactName: e.target.value }))}
                style={{ ...inputStyle, borderColor: "rgba(239, 68, 68, 0.2)" }}
                onFocus={e => { if (!isDeceased) { e.target.style.borderColor = '#ef4444'; e.target.style.boxShadow = '0 0 8px rgba(239, 68, 68, 0.2)'; } }}
                onBlur={e => { e.target.style.borderColor = 'rgba(239, 68, 68, 0.2)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          </div>
          <div>
            <label style={{ ...labelStyle, color: "rgba(239, 68, 68, 0.6)" }}>ტელეფონი</label>
            <input
              type="text"
              disabled={isDeceased}
              value={editForm.emergencyContactPhone || ''}
              onChange={e => setEditForm(prev => ({ ...prev, emergencyContactPhone: e.target.value }))}
              style={{ ...inputStyle, borderColor: "rgba(239, 68, 68, 0.2)", color: "#ef4444", fontWeight: "bold" }}
              onFocus={e => { if (!isDeceased) { e.target.style.borderColor = '#ef4444'; e.target.style.boxShadow = '0 0 8px rgba(239, 68, 68, 0.2)'; } }}
              onBlur={e => { e.target.style.borderColor = 'rgba(239, 68, 68, 0.2)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
        </div>
      </div>

      {/* Card 4: Federation status & checkboxes */}
      <div style={{ backgroundColor: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "10px", padding: "15px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <h4 style={{ margin: 0, color: "var(--color-emerald-core)", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          🛡️ ფედერაციული სტატუსი & უფლებამოსილება
        </h4>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid rgba(30, 41, 59, 0.8)", paddingTop: "10px" }}>
          
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
                  border: editForm.isFederationMember ? "1px solid var(--color-emerald-core)" : "1px solid rgba(255,255,255,0.1)",
                  backgroundColor: editForm.isFederationMember ? "color-mix(in oklab, var(--color-emerald-core) 15%, transparent)" : "transparent",
                  color: editForm.isFederationMember ? "var(--color-emerald-core)" : "rgba(255,255,255,0.6)",
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
                  border: editForm.isClubMember ? "1px solid var(--color-emerald-core)" : "1px solid rgba(255,255,255,0.1)",
                  backgroundColor: editForm.isClubMember ? "color-mix(in oklab, var(--color-emerald-core) 15%, transparent)" : "transparent",
                  color: editForm.isClubMember ? "var(--color-emerald-core)" : "rgba(255,255,255,0.6)",
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
                  <span>✓ ID: #{editForm.clubId}</span>
                </div>
              )}
            </div>
          )}

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
                    onFocus={e => e.target.style.borderColor = 'var(--color-emerald-core)'}
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
                    onFocus={e => { if (!isDeceased) e.target.style.borderColor = 'var(--color-emerald-core)'; }}
                    onBlur={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
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
                    onFocus={e => { if (!isDeceased) e.target.style.borderColor = 'var(--color-emerald-core)'; }}
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
      </div>

      {/* Card 5: Biography */}
      <div style={{ backgroundColor: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "10px", padding: "15px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <h4 style={{ margin: 0, color: "var(--color-emerald-core)", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          📝 ბიოგრაფია & Timeline ნარატივი
        </h4>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid rgba(30, 41, 59, 0.8)", paddingTop: "10px" }}>
          <textarea
            disabled={isDeceased}
            value={editForm.biography || ''}
            onChange={e => setEditForm(prev => ({ ...prev, biography: e.target.value }))}
            style={{
              ...inputStyle,
              minHeight: "100px",
              resize: "vertical",
              fontFamily: "sans-serif",
              lineHeight: "1.5"
            }}
            placeholder="აღწერეთ სპორტსმენის გზა..."
            onFocus={e => { if (!isDeceased) { e.target.style.borderColor = 'var(--color-emerald-core)'; e.target.style.boxShadow = '0 0 8px color-mix(in oklab, var(--color-emerald-core) 20%, transparent)'; } }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.boxShadow = 'none'; }}
          />
        </div>
      </div>

      {/* Edit Mode Buttons */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid rgba(30, 41, 59, 0.8)", paddingTop: "15px" }}>
        <button
          type="button"
          onClick={handleCancel}
          style={{
            backgroundColor: "transparent",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.6)",
            padding: "8px 16px",
            borderRadius: "20px",
            cursor: "pointer",
            fontSize: "13px",
            transition: "all 0.3s"
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
        >
          გაუქმება
        </button>
        <button
          type="button"
          onClick={handleSave}
          style={{
            backgroundColor: "var(--color-emerald-core)",
            border: "none",
            color: "#121418",
            padding: "8px 16px",
            borderRadius: "20px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "bold",
            transition: "all 0.3s",
            boxShadow: "0 0 10px color-mix(in oklab, var(--color-emerald-core) 30%, transparent)"
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 15px color-mix(in oklab, var(--color-emerald-core) 60%, transparent)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 10px color-mix(in oklab, var(--color-emerald-core) 30%, transparent)"; }}
        >
          <i className="fa-regular fa-floppy-disk"></i> ცვლილების შენახვა
        </button>
      </div>
    </>
  );
};

export default AthleteSidePanelEdit;
