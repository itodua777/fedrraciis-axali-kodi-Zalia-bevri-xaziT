import React from '../../../utils/react-shim.js';
import SearchableDropdown from '../../../components/ui/SearchableDropdown.jsx';
import { COUNTRIES } from '../../../utils/countries.js';

const AthletesFilterPanel = ({
  filters,
  setFilters,
  initialFilters,
  clubs,
  uniqueDisciplines,
  isFilterOpen,
  setIsFilterOpen,
  popoverRef
}) => {
  if (!isFilterOpen) return null;

  const dropdownStyle = {
    width: "100%",
    padding: "8px 10px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)",
    borderRadius: "6px",
    color: "#fff",
    outline: "none",
    fontSize: "12px",
    boxSizing: "border-box"
  };

  const inputStyle = {
    width: "100%",
    padding: "8px 10px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)",
    borderRadius: "6px",
    color: "#fff",
    outline: "none",
    fontSize: "12px",
    boxSizing: "border-box"
  };

  const checkboxLabelStyle = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    color: "#cbd5e1",
    cursor: "pointer",
    userSelect: "none"
  };

  const checkboxStyle = {
    accentColor: "var(--color-emerald-core)",
    width: "14px",
    height: "14px",
    cursor: "pointer"
  };

  return (
    <div ref={popoverRef} style={{
      position: "absolute",
      top: "45px",
      right: 0,
      width: "550px",
      backgroundColor: "#161920",
      border: "1px solid color-mix(in oklab, var(--color-emerald-core) 40%, transparent)",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.7)",
      zIndex: 200,
      display: "flex",
      flexDirection: "column",
      gap: "15px"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "8px" }}>
        <span style={{ fontWeight: "bold", color: "var(--color-emerald-core)" }}>🎛️ გაფართოებული ფილტრაცია</span>
        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            onClick={() => setFilters(initialFilters)}
            style={{ background: "none", border: "none", color: "rgba(255, 255, 255, 0.5)", cursor: "pointer", fontSize: "12px" }}
            onMouseOver={(e) => { e.currentTarget.style.color = "#ef4444"; }}
            onMouseOut={(e) => { e.currentTarget.style.color = "rgba(255, 255, 255, 0.5)"; }}
          >
            გასუფთავება
          </button>
          <button 
            onClick={() => setIsFilterOpen(false)}
            style={{ background: "none", border: "none", color: "#cbd5e1", cursor: "pointer", fontSize: "14px" }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "400px", overflowY: "auto", paddingRight: "5px" }}>
        {/* Section 1: Sport & Status */}
        <div>
          <div style={{ fontSize: "12px", color: "color-mix(in oklab, var(--color-emerald-core) 70%, transparent)", fontWeight: "bold", marginBottom: "8px", textTransform: "uppercase" }}>
            სპორტული და იურიდიული სტატუსი
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", display: "block", marginBottom: "4px" }}>წევრობის სტატუსი</label>
              <select 
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                style={dropdownStyle}
              >
                <option value="all">ყველა</option>
                <option value="active">მოქმედი</option>
                <option value="suspended">შეჩერებული</option>
                <option value="inactive">არაქტიური</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", display: "block", marginBottom: "4px" }}>საწევრო გადასახადი</label>
              <select 
                value={filters.feePaid}
                onChange={(e) => setFilters({ ...filters, feePaid: e.target.value })}
                style={dropdownStyle}
              >
                <option value="all">ყველა</option>
                <option value="paid">გადახდილი</option>
                <option value="unpaid">გადაუხდელი</option>
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", display: "block", marginBottom: "4px" }}>კლუბური კავშირი</label>
              <select 
                value={filters.clubId}
                onChange={(e) => setFilters({ ...filters, clubId: e.target.value })}
                style={dropdownStyle}
              >
                <option value="all">ყველა კლუბი</option>
                <option value="none">კლუბის გარეშე</option>
                {clubs?.map(club => (
                  <option key={club.id} value={club.id}>{club.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", display: "block", marginBottom: "4px" }}>სპორტის სახეობა</label>
              <select 
                value={filters.discipline}
                onChange={(e) => setFilters({ ...filters, discipline: e.target.value })}
                style={dropdownStyle}
              >
                <option value="all">ყველა დისციპლინა</option>
                {uniqueDisciplines.map(disc => (
                  <option key={disc} value={disc}>{disc}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Checkboxes: Roles */}
        <div style={{ margin: "5px 0" }}>
          <label style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", display: "block", marginBottom: "6px" }}>ფედერაციული როლები</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <label style={checkboxLabelStyle}>
              <input 
                type="checkbox" 
                checked={filters.roles.isFounder} 
                onChange={(e) => setFilters({
                  ...filters,
                  roles: { ...filters.roles, isFounder: e.target.checked }
                })} 
                style={checkboxStyle}
              />
              დამფუძნებელი
            </label>
            <label style={checkboxLabelStyle}>
              <input 
                type="checkbox" 
                checked={filters.roles.hasVotingRight} 
                onChange={(e) => setFilters({
                  ...filters,
                  roles: { ...filters.roles, hasVotingRight: e.target.checked }
                })} 
                style={checkboxStyle}
              />
              ხმის უფლება
            </label>
            <label style={checkboxLabelStyle}>
              <input 
                type="checkbox" 
                checked={filters.roles.isNationalTeamMember} 
                onChange={(e) => setFilters({
                  ...filters,
                  roles: { ...filters.roles, isNationalTeamMember: e.target.checked }
                })} 
                style={checkboxStyle}
              />
              ნაკრების წევრი
            </label>
            <label style={checkboxLabelStyle}>
              <input 
                type="checkbox" 
                checked={filters.roles.isMentorOrVeteran} 
                onChange={(e) => setFilters({
                  ...filters,
                  roles: { ...filters.roles, isMentorOrVeteran: e.target.checked }
                })} 
                style={checkboxStyle}
              />
              მენტორი/ვეტერანი
            </label>
          </div>
        </div>

        {/* Section 2: Medical & Demographics */}
        <div>
          <div style={{ fontSize: "12px", color: "color-mix(in oklab, var(--color-emerald-core) 70%, transparent)", fontWeight: "bold", marginBottom: "8px", textTransform: "uppercase", marginTop: "5px" }}>
            პერსონალური და სამედიცინო მონაცემები
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "10px" }}>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", display: "block", marginBottom: "4px" }}>სისხლის ჯგუფი</label>
              <select 
                value={filters.bloodType}
                onChange={(e) => setFilters({ ...filters, bloodType: e.target.value })}
                style={dropdownStyle}
              >
                <option value="all">ყველა</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", display: "block", marginBottom: "4px" }}>ასთმა</label>
              <select 
                value={filters.asthma}
                onChange={(e) => setFilters({ ...filters, asthma: e.target.value })}
                style={dropdownStyle}
              >
                <option value="all">ყველა</option>
                <option value="yes">კი</option>
                <option value="no">არა</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", display: "block", marginBottom: "4px" }}>დიაბეტი</label>
              <select 
                value={filters.diabetes}
                onChange={(e) => setFilters({ ...filters, diabetes: e.target.value })}
                style={dropdownStyle}
              >
                <option value="all">ყველა</option>
                <option value="yes">კი</option>
                <option value="no">არა</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", display: "block", marginBottom: "4px" }}>ალერგია</label>
              <select 
                value={filters.allergy}
                onChange={(e) => setFilters({ ...filters, allergy: e.target.value })}
                style={dropdownStyle}
              >
                <option value="all">ყველა</option>
                <option value="yes">აქვს</option>
                <option value="no">არ აქვს</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", display: "block", marginBottom: "4px" }}>ქვეყანა</label>
              <SearchableDropdown
                value={filters.countryCode}
                onChange={(val) => setFilters({ ...filters, countryCode: val })}
                options={[{ code: 'all', name: 'ყველა ქვეყანა' }, ...COUNTRIES]}
                placeholder="ქვეყანა..."
                style={dropdownStyle}
                showFlags={true}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", display: "block", marginBottom: "4px" }}>მინ. ასაკი</label>
              <input 
                type="number"
                placeholder="მაგ. 18"
                value={filters.minAge}
                onChange={(e) => setFilters({ ...filters, minAge: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", display: "block", marginBottom: "4px" }}>მაქს. ასაკი</label>
              <input 
                type="number"
                placeholder="მაგ. 60"
                value={filters.maxAge}
                onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AthletesFilterPanel;
