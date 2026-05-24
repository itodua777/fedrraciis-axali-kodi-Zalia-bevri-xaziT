import React from '../../../utils/react-shim.js';
import AthleteAvatarWrapper from './AthleteAvatarWrapper.jsx';

const FullscreenBioMedical = ({
  athlete,
  editForm,
  setEditForm,
  isEditing,
  isDeceased,
  flag,
  countryName,
  ageText,
  phoneVal,
  emailVal,
  bloodTypeVal,
  heightWeightText,
  isAsthmaActive,
  isDiabetesActive,
  allergiesVal
}) => {
  const labelStyle = { fontSize: "11px", color: "rgba(255, 255, 255, 0.4)", textTransform: "uppercase", display: "block", marginBottom: "4px" };
  const inputStyle = { width: "100%", padding: "6px 10px", backgroundColor: "#1e222b", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "6px", color: "#fff", fontSize: "12px", outline: "none", boxSizing: "border-box" };

  return (
    <div style={{
      gridColumn: "span 12",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "24px",
      backgroundColor: "rgba(255, 255, 255, 0.02)",
      border: "1px solid rgba(255, 255, 255, 0.06)",
      borderRadius: "12px",
      padding: "24px"
    }}>
      {/* [👤 პერსონალური ბირთვი] (Left side) */}
      <div style={{ display: "flex", gap: "20px", minWidth: 0 }}>
        <AthleteAvatarWrapper athlete={athlete} size={88} />
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: 0, flex: 1 }}>
          <h3 style={{
            margin: 0,
            color: "#fff",
            fontSize: "22px",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            {athlete.firstName} {athlete.lastName}
            {athlete.membershipStatus === 'Deceased' && <span title="ლეგენდარული სპორტსმენები">🕯️</span>}
          </h3>
          
          <div style={{
            color: "#cbd5e1",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            {flag && <span style={{ fontSize: "18px" }}>{flag}</span>}
            <span>
              {countryName || 'საქართველო'}{ageText}
            </span>
            <span style={{
              fontSize: "12px",
              fontWeight: "600",
              color: athlete.isFederationMember ? "#22d3ee" : "#64748b",
              backgroundColor: athlete.isFederationMember ? "rgba(34, 211, 238, 0.1)" : "rgba(100, 116, 139, 0.1)",
              padding: "3px 10px",
              borderRadius: "6px"
            }}>
              {athlete.isFederationMember ? "მოქმედი წევრი" : "არაწევრი"}
            </span>
          </div>

          {/* Contacts (Read / Edit mode) */}
          {isEditing ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "12px" }}>
              <div>
                <label style={labelStyle}>მობილური ტელეფონი</label>
                <input
                  type="text"
                  disabled={isDeceased}
                  value={editForm.phone || ''}
                  onChange={e => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => { if (!isDeceased) { e.target.style.borderColor = '#22d3ee'; e.target.style.boxShadow = '0 0 8px rgba(34, 211, 238, 0.2)'; } }}
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
                  onFocus={e => { if (!isDeceased) { e.target.style.borderColor = '#22d3ee'; e.target.style.boxShadow = '0 0 8px rgba(34, 211, 238, 0.2)'; } }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>
          ) : (
            (phoneVal || emailVal) && (
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px", color: "#94a3b8", marginTop: "8px" }}>
                {phoneVal && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <i className="fa-solid fa-phone" style={{ color: "#22d3ee", width: "16px", textAlign: "center" }}></i>
                    <span>{phoneVal}</span>
                  </div>
                )}
                {emailVal && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <i className="fa-solid fa-envelope" style={{ color: "#22d3ee", width: "16px", textAlign: "center" }}></i>
                    <span>{emailVal}</span>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* [🩸 ფიზიკური & სამედიცინო მატრიცა] (Right side) */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
        paddingLeft: "24px",
        position: "relative"
      }}>
        <h4 style={{ margin: 0, color: "#22d3ee", fontSize: "14px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          🩸 ფიზიკური და სამედიცინო მატრიცა
        </h4>

        {isEditing ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "10px" }}>
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
                    onFocus={e => { if (!isDeceased) { e.target.style.borderColor = '#22d3ee'; e.target.style.boxShadow = '0 0 8px rgba(34, 211, 238, 0.2)'; } }}
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
                    onFocus={e => { if (!isDeceased) { e.target.style.borderColor = '#22d3ee'; e.target.style.boxShadow = '0 0 8px rgba(34, 211, 238, 0.2)'; } }}
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
                  onFocus={e => { if (!isDeceased) e.target.style.borderColor = '#22d3ee'; }}
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: isDeceased ? "not-allowed" : "pointer", fontSize: "13px", color: "#fff" }}>
                  <input
                    type="checkbox"
                    disabled={isDeceased}
                    checked={editForm.asthma === true || editForm.asthma === 'true' || editForm.asthma === 'კი' || editForm.asthma === 'yes'}
                    onChange={e => setEditForm(prev => ({ ...prev, asthma: e.target.checked }))}
                    style={{ width: "16px", height: "16px", cursor: isDeceased ? "not-allowed" : "pointer" }}
                  />
                  ასთმა: კი
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
                  დიაბეტი: კი
                </label>
              </div>
            </div>

            <div>
              <label style={labelStyle}>ალერგიები</label>
              <input
                type="text"
                disabled={isDeceased}
                value={editForm.allergies || ''}
                onChange={e => setEditForm(prev => ({ ...prev, allergies: e.target.value }))}
                style={inputStyle}
                placeholder="მაგ: თხილის ალერგია"
                onFocus={e => { if (!isDeceased) { e.target.style.borderColor = '#22d3ee'; e.target.style.boxShadow = '0 0 8px rgba(34, 211, 238, 0.2)'; } }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "#e2e8f0" }}>
                <span>სისხლის ჯგუფი:</span>
                <span style={{
                  fontWeight: "bold",
                  backgroundColor: "#ef4444",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  color: "#fff"
                }}>
                  {bloodTypeVal}
                </span>
              </div>
              <div style={{ fontSize: "14px", color: "#cbd5e1" }}>
                📏 {heightWeightText}
              </div>
            </div>

            {/* Badges for Asthma & Diabetes */}
            <div style={{ display: "flex", gap: "10px" }}>
              <span style={{
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "600",
                backgroundColor: isAsthmaActive ? "rgba(245, 158, 11, 0.15)" : "rgba(30, 41, 59, 0.5)",
                color: isAsthmaActive ? "#f59e0b" : "#94a3b8",
                border: isAsthmaActive ? "1px solid rgba(245, 158, 11, 0.3)" : "1px solid rgba(255, 255, 255, 0.05)"
              }}>
                ასთმა: {isAsthmaActive ? "კი" : "არა"}
              </span>
              <span style={{
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "600",
                backgroundColor: isDiabetesActive ? "rgba(239, 68, 68, 0.15)" : "rgba(30, 41, 59, 0.5)",
                color: isDiabetesActive ? "#ef4444" : "#94a3b8",
                border: isDiabetesActive ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(255, 255, 255, 0.05)"
              }}>
                დიაბეტი: {isDiabetesActive ? "კი" : "არა"}
              </span>
            </div>

            {/* Allergies details */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginTop: "4px" }}>
              <span style={{ color: "#f59e0b", fontWeight: "600", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}>
                ⚠️ ალერგია:
              </span>
              <span style={{ color: "#e2e8f0", fontSize: "13px" }}>
                {allergiesVal || "არ ფიქსირდება"}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FullscreenBioMedical;
