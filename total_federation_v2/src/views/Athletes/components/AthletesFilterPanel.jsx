import React from '../../../utils/react-shim.js';
import SearchableDropdown from '../../../components/ui/SearchableDropdown.jsx';
import { COUNTRIES } from '../../../utils/countries.js';
import { useRanksStore } from '../../../context/ranksStore.js';

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

  const ranksStore = useRanksStore();
  const activeRanks = (ranksStore?.ranks || []).filter(r => r.status === 'აქტიური');

  const [dbTitles, setDbTitles] = React.useState([]);
  const [dbAwards, setDbAwards] = React.useState([]);
  const [localFilters, setLocalFilters] = React.useState({ ...filters });

  React.useEffect(() => {
    setLocalFilters({ ...filters });
  }, [filters]);

  React.useEffect(() => {
    fetch('/api/v1/honorary-titles')
      .then(res => res.json())
      .then(data => setDbTitles(data))
      .catch(err => console.error(err));

    fetch('/api/v1/federation-awards')
      .then(res => res.json())
      .then(data => setDbAwards(data))
      .catch(err => console.error(err));
  }, []);

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

  const getDropdownStyle = (val) => {
    const isActive = val !== 'all' && val !== '';
    return {
      ...dropdownStyle,
      border: isActive ? "1px solid var(--color-emerald-core)" : "1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)",
      boxShadow: isActive ? "0 0 10px rgba(0, 230, 118, 0.15)" : "none"
    };
  };

  const getInputStyle = (val) => {
    const isActive = val !== '';
    return {
      ...inputStyle,
      border: isActive ? "1px solid var(--color-emerald-core)" : "1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)",
      boxShadow: isActive ? "0 0 10px rgba(0, 230, 118, 0.15)" : "none"
    };
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

  const handleApply = () => {
    setFilters(localFilters);
    setIsFilterOpen(false);
  };

  return (
    <div ref={popoverRef} style={{
      position: "absolute",
      top: "45px",
      right: 0,
      width: "550px",
      maxHeight: "calc(100vh - 160px)",
      backgroundColor: "#161920",
      border: "1px solid var(--color-emerald-core)",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.7), 0 0 15px rgba(0, 230, 118, 0.15)",
      zIndex: 200,
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      boxSizing: "border-box",
      overflow: "hidden"
    }}>
      <style>{`
        .filter-select:focus, .filter-input:focus {
          border-color: var(--color-emerald-core) !important;
          box-shadow: 0 0 15px rgba(0, 230, 118, 0.25) !important;
        }
      `}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "8px" }}>
        <span style={{ fontWeight: "bold", color: "var(--color-emerald-core)" }}>🎛️ გაფართოებული ფილტრაცია</span>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button 
            onClick={() => setLocalFilters(initialFilters)}
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

      <div 
        className="custom-scrollbar scrollbar-thin scrollbar-thumb-zinc-800"
        style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "12px", 
          overflowY: "auto", 
          paddingRight: "5px",
          flex: 1,
          minHeight: 0
        }}
      >
        {/* Section 1: Sport & Status */}
        <div>
          <div style={{ fontSize: "12px", color: "color-mix(in oklab, var(--color-emerald-core) 70%, transparent)", fontWeight: "bold", marginBottom: "8px", textTransform: "uppercase" }}>
            სპორტული და იურიდიული სტატუსი
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", display: "block", marginBottom: "4px" }}>წევრობის სტატუსი</label>
              <select 
                value={localFilters.status}
                onChange={(e) => setLocalFilters({ ...localFilters, status: e.target.value })}
                style={getDropdownStyle(localFilters.status)}
                className="filter-select"
              >
                <option value="all">ყველა</option>
                <option value="Active">მოქმედი</option>
                <option value="Suspended">შეჩერებული</option>
                <option value="Terminated">შეწყვეტილი</option>
                <option value="Deceased">გარდაცვლილი</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", display: "block", marginBottom: "4px" }}>საწევრო გადასახადი</label>
              <select 
                value={localFilters.feePaid}
                onChange={(e) => setLocalFilters({ ...localFilters, feePaid: e.target.value })}
                style={getDropdownStyle(localFilters.feePaid)}
                className="filter-select"
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
                value={localFilters.clubId}
                onChange={(e) => setLocalFilters({ ...localFilters, clubId: e.target.value })}
                style={getDropdownStyle(localFilters.clubId)}
                className="filter-select"
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
                value={localFilters.discipline}
                onChange={(e) => setLocalFilters({ ...localFilters, discipline: e.target.value })}
                style={getDropdownStyle(localFilters.discipline)}
                className="filter-select"
              >
                <option value="all">ყველა დისციპლინა</option>
                {uniqueDisciplines.map(disc => (
                  <option key={disc} value={disc}>{disc}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 1b: Ranks, Titles, Awards & Gender */}
        <div>
          <div style={{ fontSize: "12px", color: "color-mix(in oklab, var(--color-emerald-core) 70%, transparent)", fontWeight: "bold", marginBottom: "8px", textTransform: "uppercase", marginTop: "4px" }}>
            სპორტული მიღწევები და სქესი
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", display: "block", marginBottom: "4px" }}>🚻 სქესი</label>
              <select 
                value={localFilters.gender}
                onChange={(e) => setLocalFilters({ ...localFilters, gender: e.target.value })}
                style={getDropdownStyle(localFilters.gender)}
                className="filter-select"
              >
                <option value="all">ყველა</option>
                <option value="male">მამრობითი</option>
                <option value="female">მდედრობითი</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", display: "block", marginBottom: "4px" }}>🎖️ სპორტული თანრიგი</label>
              <select 
                value={localFilters.rankId}
                onChange={(e) => setLocalFilters({ ...localFilters, rankId: e.target.value })}
                style={getDropdownStyle(localFilters.rankId)}
                className="filter-select"
              >
                <option value="all">ყველა</option>
                {activeRanks.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", display: "block", marginBottom: "4px" }}>🏅 საპატიო წოდება</label>
              <select 
                value={localFilters.titleId}
                onChange={(e) => setLocalFilters({ ...localFilters, titleId: e.target.value })}
                style={getDropdownStyle(localFilters.titleId)}
                className="filter-select"
              >
                <option value="all">ყველა</option>
                {dbTitles.map(t => (
                  <option key={t.id} value={t.id}>{t.title_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", display: "block", marginBottom: "4px" }}>🏆 ჯილდო</label>
              <select 
                value={localFilters.awardId}
                onChange={(e) => setLocalFilters({ ...localFilters, awardId: e.target.value })}
                style={getDropdownStyle(localFilters.awardId)}
                className="filter-select"
              >
                <option value="all">ყველა</option>
                {dbAwards.map(aw => (
                  <option key={aw.id} value={aw.id}>{aw.award_name}</option>
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
                checked={localFilters.roles.isFounder} 
                onChange={(e) => setLocalFilters({
                  ...localFilters,
                  roles: { ...localFilters.roles, isFounder: e.target.checked }
                })} 
                style={checkboxStyle}
              />
              დამფუძნებელი
            </label>
            <label style={checkboxLabelStyle}>
              <input 
                type="checkbox" 
                checked={localFilters.roles.hasVotingRight} 
                onChange={(e) => setLocalFilters({
                  ...localFilters,
                  roles: { ...localFilters.roles, hasVotingRight: e.target.checked }
                })} 
                style={checkboxStyle}
              />
              ხმის უფლება
            </label>
            <label style={checkboxLabelStyle}>
              <input 
                type="checkbox" 
                checked={localFilters.roles.isNationalTeamMember} 
                onChange={(e) => setLocalFilters({
                  ...localFilters,
                  roles: { ...localFilters.roles, isNationalTeamMember: e.target.checked }
                })} 
                style={checkboxStyle}
              />
              ნაკრების წევრი
            </label>
            <label style={checkboxLabelStyle}>
              <input 
                type="checkbox" 
                checked={localFilters.roles.isMentorOrVeteran} 
                onChange={(e) => setLocalFilters({
                  ...localFilters,
                  roles: { ...localFilters.roles, isMentorOrVeteran: e.target.checked }
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
                value={localFilters.bloodType}
                onChange={(e) => setLocalFilters({ ...localFilters, bloodType: e.target.value })}
                style={getDropdownStyle(localFilters.bloodType)}
                className="filter-select"
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
                value={localFilters.asthma}
                onChange={(e) => setLocalFilters({ ...localFilters, asthma: e.target.value })}
                style={getDropdownStyle(localFilters.asthma)}
                className="filter-select"
              >
                <option value="all">ყველა</option>
                <option value="yes">კი</option>
                <option value="no">არა</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", display: "block", marginBottom: "4px" }}>დიაბეტი</label>
              <select 
                value={localFilters.diabetes}
                onChange={(e) => setLocalFilters({ ...localFilters, diabetes: e.target.value })}
                style={getDropdownStyle(localFilters.diabetes)}
                className="filter-select"
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
                value={localFilters.allergy}
                onChange={(e) => setLocalFilters({ ...localFilters, allergy: e.target.value })}
                style={getDropdownStyle(localFilters.allergy)}
                className="filter-select"
              >
                <option value="all">ყველა</option>
                <option value="yes">აქვს</option>
                <option value="no">არ აქვს</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", display: "block", marginBottom: "4px" }}>ქვეყანა</label>
              <SearchableDropdown
                value={localFilters.countryCode}
                onChange={(val) => setLocalFilters({ ...localFilters, countryCode: val })}
                options={[{ code: 'all', name: 'ყველა ქვეყანა' }, ...COUNTRIES]}
                placeholder="ქვეყანა..."
                style={getDropdownStyle(localFilters.countryCode)}
                className="filter-select"
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
                value={localFilters.minAge}
                onChange={(e) => setLocalFilters({ ...localFilters, minAge: e.target.value })}
                style={getInputStyle(localFilters.minAge)}
                className="filter-input"
              />
            </div>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", display: "block", marginBottom: "4px" }}>მაქს. ასაკი</label>
              <input 
                type="number"
                placeholder="მაგ. 60"
                value={localFilters.maxAge}
                onChange={(e) => setLocalFilters({ ...localFilters, maxAge: e.target.value })}
                style={getInputStyle(localFilters.maxAge)}
                className="filter-input"
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        paddingTop: "12px",
        marginTop: "5px"
      }}>
        <button
          onClick={() => {
            setLocalFilters(initialFilters);
          }}
          style={{
            padding: "8px 16px",
            backgroundColor: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "6px",
            color: "#fff",
            cursor: "pointer",
            fontSize: "12px",
            transition: "all 0.2s"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = "#ef4444";
            e.currentTarget.style.color = "#ef4444";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
            e.currentTarget.style.color = "#fff";
          }}
        >
          გასუფთავება
        </button>
        <button
          onClick={handleApply}
          style={{
            padding: "8px 16px",
            backgroundColor: "var(--color-emerald-core)",
            border: "none",
            borderRadius: "6px",
            color: "#121418",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "12px",
            boxShadow: "0 0 15px rgba(0, 230, 118, 0.25)",
            transition: "all 0.2s"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.boxShadow = "0 0 20px #00E676";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.boxShadow = "0 0 15px rgba(0, 230, 118, 0.25)";
          }}
        >
          გამოყენება
        </button>
      </div>
    </div>
  );
};

export default AthletesFilterPanel;
