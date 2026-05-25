import React from '../../utils/react-shim.js';
import ReactDOM from '../../utils/react-dom-shim.js';
import AthletesFilterPanel from './components/AthletesFilterPanel.jsx';
import AthletesTable from './components/AthletesTable.jsx';
import BulkPrintDoc from './components/BulkPrintDoc.jsx';
import AthleteDetailView from './AthleteDetailView.jsx';
import Timeline from '../../components/ui/Timeline.jsx';
import { calculateAge } from '../../utils/helpers.js';
import { COUNTRIES } from '../../utils/countries.js';

const AthletesLibrary = ({ onViewChange, athletes = [], onUpdateAthlete, clubs, onClubClick }) => {
  const [selectedAthlete, setSelectedAthlete] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [isPrintingBulk, setIsPrintingBulk] = React.useState(false);

  const initialFilters = React.useMemo(() => ({
    status: 'all',
    feePaid: 'all',
    clubId: 'all',
    discipline: 'all',
    roles: {
      isFounder: false,
      hasVotingRight: false,
      isNationalTeamMember: false,
      isMentorOrVeteran: false
    },
    bloodType: 'all',
    asthma: 'all',
    diabetes: 'all',
    allergy: 'all',
    countryCode: 'all',
    minAge: '',
    maxAge: ''
  }), []);

  const [filters, setFilters] = React.useState({ ...initialFilters });

  const uniqueDisciplines = React.useMemo(() => {
    return Array.from(new Set(athletes.map(a => a.sportsDiscipline).filter(Boolean)));
  }, [athletes]);

  const activeCount = React.useMemo(() => {
    let count = 0;
    if (filters.status !== 'all') count++;
    if (filters.feePaid !== 'all') count++;
    if (filters.clubId !== 'all') count++;
    if (filters.discipline !== 'all') count++;
    if (filters.roles.isFounder) count++;
    if (filters.roles.hasVotingRight) count++;
    if (filters.roles.isNationalTeamMember) count++;
    if (filters.roles.isMentorOrVeteran) count++;
    if (filters.bloodType !== 'all') count++;
    if (filters.asthma !== 'all') count++;
    if (filters.diabetes !== 'all') count++;
    if (filters.allergy !== 'all') count++;
    if (filters.countryCode !== 'all') count++;
    if (filters.minAge !== '') count++;
    if (filters.maxAge !== '') count++;
    return count;
  }, [filters]);

  const filteredAthletes = React.useMemo(() => {
    return athletes.filter(athlete => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const fullName = `${athlete.firstName || ''} ${athlete.lastName || ''}`.toLowerCase();
        const personalId = (athlete.personalId || '').toLowerCase();
        const phone = (athlete.phone || '').toLowerCase();
        const email = (athlete.email || '').toLowerCase();
        if (!fullName.includes(q) && !personalId.includes(q) && !phone.includes(q) && !email.includes(q)) {
          return false;
        }
      }

      if (filters.status !== 'all') {
        if (filters.status === 'active') {
          if (!athlete.isFederationMember || athlete.membershipStatus !== 'Active') return false;
        } else if (filters.status === 'suspended') {
          if (!athlete.isFederationMember || athlete.membershipStatus !== 'Suspended') return false;
        } else if (filters.status === 'inactive') {
          const isActiveOrSuspended = athlete.isFederationMember && (athlete.membershipStatus === 'Active' || athlete.membershipStatus === 'Suspended');
          if (isActiveOrSuspended) return false;
        }
      }

      if (filters.feePaid !== 'all') {
        const paid = athlete.membershipFeePaid === true;
        if (filters.feePaid === 'paid' && !paid) return false;
        if (filters.feePaid === 'unpaid' && paid) return false;
      }

      if (filters.clubId !== 'all') {
        if (filters.clubId === 'none') {
          if (athlete.isClubMember && athlete.clubId) return false;
        } else {
          if (String(athlete.clubId) !== String(filters.clubId)) return false;
        }
      }

      if (filters.discipline !== 'all') {
        if (athlete.sportsDiscipline !== filters.discipline) return false;
      }

      if (filters.roles.isFounder && !athlete.isFounder) return false;
      if (filters.roles.hasVotingRight && !athlete.hasVotingRight) return false;
      if (filters.roles.isNationalTeamMember && !athlete.isNationalTeamMember) return false;
      if (filters.roles.isMentorOrVeteran && !(athlete.isMentor || athlete.isVeteran)) return false;

      if (filters.bloodType !== 'all') {
        if (athlete.bloodType !== filters.bloodType) return false;
      }

      if (filters.asthma !== 'all') {
        const hasAsthma = athlete.asthma === true || athlete.asthma === 'true' || athlete.asthma === 'კი' || athlete.asthma === 'yes';
        if (filters.asthma === 'yes' && !hasAsthma) return false;
        if (filters.asthma === 'no' && hasAsthma) return false;
      }

      if (filters.diabetes !== 'all') {
        const hasDiabetes = athlete.diabetes === true || athlete.diabetes === 'true' || athlete.diabetes === 'კი' || athlete.diabetes === 'yes';
        if (filters.diabetes === 'yes' && !hasDiabetes) return false;
        if (filters.diabetes === 'no' && hasDiabetes) return false;
      }

      if (filters.allergy !== 'all') {
        const hasAllergy = athlete.allergies && athlete.allergies !== "არ აქვს" && athlete.allergies.trim() !== "";
        if (filters.allergy === 'yes' && !hasAllergy) return false;
        if (filters.allergy === 'no' && hasAllergy) return false;
      }

      if (filters.countryCode !== 'all') {
        if (athlete.nationality !== filters.countryCode) return false;
      }

      if (filters.minAge !== '' || filters.maxAge !== '') {
        if (athlete.birthDate) {
          const age = calculateAge(athlete.birthDate);
          if (age !== '') {
            if (filters.minAge !== '' && age < parseInt(filters.minAge)) return false;
            if (filters.maxAge !== '' && age > parseInt(filters.maxAge)) return false;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }

      return true;
    });
  }, [athletes, searchQuery, filters]);

  const popoverRef = React.useRef(null);
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        const toggleButton = document.getElementById("filter-toggle-btn");
        if (toggleButton && toggleButton.contains(e.target)) return;
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    const handleAfterPrint = () => {
      document.body.classList.remove('printing-bulk');
      setIsPrintingBulk(false);
    };
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  React.useEffect(() => {
    if (isPrintingBulk) {
      document.body.classList.add('printing-bulk');
      const timer = setTimeout(() => {
        window.print();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isPrintingBulk]);

  const badgeStyle = {
    backgroundColor: "rgba(34, 211, 238, 0.1)",
    color: "#22d3ee",
    border: "1px solid rgba(34, 211, 238, 0.3)",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    boxShadow: "0 0 5px rgba(34, 211, 238, 0.15)"
  };

  const badgeCloseStyle = {
    cursor: "pointer",
    opacity: 0.7,
    fontSize: "11px",
    transition: "opacity 0.2s"
  };

  return (
    <div style={{ 
      height: "calc(100vh - 70px)", 
      boxSizing: "border-box", 
      padding: "30px", 
      backgroundColor: "#121418", 
      color: "#e2e8f0", 
      fontFamily: "sans-serif", 
      overflow: "hidden", 
      display: "grid", 
      gridTemplateColumns: "repeat(12, 1fr)", 
      gap: "20px" 
    }}>
      <div style={{ 
        gridColumn: "span 8", 
        display: "flex", 
        flexDirection: "column", 
        gap: "20px", 
        height: "100%", 
        overflowY: "auto", 
        minWidth: 0,
        boxSizing: "border-box"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ color: "#22d3ee", margin: 0, textShadow: "0 0 10px rgba(34, 211, 238, 0.5)" }}>
            სპორტსმენები
          </h2>
          <div style={{ display: "flex", gap: "10px" }}>
            <button 
              style={{
                backgroundColor: "transparent",
                color: "#22d3ee",
                border: "1px solid #22d3ee",
                boxShadow: "0 0 10px rgba(34, 211, 238, 0.2)",
                padding: "6px 12px",
                fontSize: "12px",
                whiteSpace: "nowrap",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
              onClick={() => setIsPrintingBulk(true)}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "rgba(34, 211, 238, 0.1)"; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              <i className="fa-solid fa-print"></i> გაფილტრულის ამობეჭდვა
            </button>
            <button 
              style={{
                backgroundColor: "#22d3ee",
                color: "#121418",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 0 15px rgba(34, 211, 238, 0.5)",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }} 
              onClick={() => onViewChange('add_athlete')}
            >
              <i className="fa-solid fa-plus"></i> სპორტსმენის დამატება
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: "15px", alignItems: "center", position: "relative" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <i className="fa-solid fa-magnifying-glass" style={{ position: "absolute", left: "12px", top: "12px", color: searchQuery ? "#22d3ee" : "rgba(226, 232, 240, 0.4)" }}></i>
            <input
              type="text"
              placeholder="მოძებნე სპორტსმენი..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 10px 10px 35px",
                backgroundColor: "rgba(15, 23, 42, 0.6)",
                border: "1px solid rgba(34, 211, 238, 0.2)",
                borderRadius: "8px",
                color: "#fff",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>
          
          <button
            id="filter-toggle-btn"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            style={{
              backgroundColor: isFilterOpen ? "rgba(34, 211, 238, 0.15)" : "rgba(15, 23, 42, 0.6)",
              color: "#22d3ee",
              border: "1px solid rgba(34, 211, 238, 0.3)",
              padding: "10px 15px",
              borderRadius: "8px",
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: "500",
              transition: "all 0.2s"
            }}
          >
            <i className="fa-solid fa-sliders"></i> ფილტრები {activeCount > 0 ? `(${activeCount})` : ''}
          </button>

          <AthletesFilterPanel
            filters={filters}
            setFilters={setFilters}
            initialFilters={initialFilters}
            clubs={clubs}
            uniqueDisciplines={uniqueDisciplines}
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
            popoverRef={popoverRef}
          />
        </div>

        {/* Active Badges */}
        {activeCount > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center", padding: "5px 0" }}>
            <span style={{ fontSize: "12px", color: "rgba(226, 232, 240, 0.6)" }}>აქტიური ფილტრები:</span>
            {filters.status !== 'all' && (
              <span style={badgeStyle}>
                სტატუსი: {filters.status === 'active' ? 'მოქმედი' : filters.status === 'suspended' ? 'შეჩერებული' : 'არაქტიური'}
                <i className="fa-solid fa-xmark" style={badgeCloseStyle} onClick={() => setFilters({ ...filters, status: 'all' })}></i>
              </span>
            )}
            {filters.feePaid !== 'all' && (
              <span style={badgeStyle}>
                საწევრო: {filters.feePaid === 'paid' ? 'გადახდილი' : 'გადაუხდელი'}
                <i className="fa-solid fa-xmark" style={badgeCloseStyle} onClick={() => setFilters({ ...filters, feePaid: 'all' })}></i>
              </span>
            )}
            {filters.clubId !== 'all' && (
              <span style={badgeStyle}>
                კლუბი: {filters.clubId === 'none' ? 'კლუბის გარეშე' : (clubs?.find(c => String(c.id) === String(filters.clubId))?.name || filters.clubId)}
                <i className="fa-solid fa-xmark" style={badgeCloseStyle} onClick={() => setFilters({ ...filters, clubId: 'all' })}></i>
              </span>
            )}
            {filters.discipline !== 'all' && (
              <span style={badgeStyle}>
                სპორტი: {filters.discipline}
                <i className="fa-solid fa-xmark" style={badgeCloseStyle} onClick={() => setFilters({ ...filters, discipline: 'all' })}></i>
              </span>
            )}
            {filters.roles.isFounder && (
              <span style={badgeStyle}>
                როლი: დამფუძნებელი
                <i className="fa-solid fa-xmark" style={badgeCloseStyle} onClick={() => setFilters({ ...filters, roles: { ...filters.roles, isFounder: false } })}></i>
              </span>
            )}
            {filters.roles.hasVotingRight && (
              <span style={badgeStyle}>
                როლი: ხმის უფლება
                <i className="fa-solid fa-xmark" style={badgeCloseStyle} onClick={() => setFilters({ ...filters, roles: { ...filters.roles, hasVotingRight: false } })}></i>
              </span>
            )}
            {filters.roles.isNationalTeamMember && (
              <span style={badgeStyle}>
                როლი: ნაკრების წევრი
                <i className="fa-solid fa-xmark" style={badgeCloseStyle} onClick={() => setFilters({ ...filters, roles: { ...filters.roles, isNationalTeamMember: false } })}></i>
              </span>
            )}
            {filters.roles.isMentorOrVeteran && (
              <span style={badgeStyle}>
                როლი: მენტორი/ვეტერანი
                <i className="fa-solid fa-xmark" style={badgeCloseStyle} onClick={() => setFilters({ ...filters, roles: { ...filters.roles, isMentorOrVeteran: false } })}></i>
              </span>
            )}
            {filters.bloodType !== 'all' && (
              <span style={badgeStyle}>
                სისხლი: {filters.bloodType}
                <i className="fa-solid fa-xmark" style={badgeCloseStyle} onClick={() => setFilters({ ...filters, bloodType: 'all' })}></i>
              </span>
            )}
            {filters.asthma !== 'all' && (
              <span style={badgeStyle}>
                ასთმა: {filters.asthma === 'yes' ? 'კი' : 'არა'}
                <i className="fa-solid fa-xmark" style={badgeCloseStyle} onClick={() => setFilters({ ...filters, asthma: 'all' })}></i>
              </span>
            )}
            {filters.diabetes !== 'all' && (
              <span style={badgeStyle}>
                დიაბეტი: {filters.diabetes === 'yes' ? 'კი' : 'არა'}
                <i className="fa-solid fa-xmark" style={badgeCloseStyle} onClick={() => setFilters({ ...filters, diabetes: 'all' })}></i>
              </span>
            )}
            {filters.allergy !== 'all' && (
              <span style={badgeStyle}>
                ალერგია: {filters.allergy === 'yes' ? 'აქვს' : 'არ აქვს'}
                <i className="fa-solid fa-xmark" style={badgeCloseStyle} onClick={() => setFilters({ ...filters, allergy: 'all' })}></i>
              </span>
            )}
            {filters.countryCode !== 'all' && (
              <span style={badgeStyle}>
                ქვეყანა: {COUNTRIES.find(c => c.code === filters.countryCode)?.name || filters.countryCode}
                <i className="fa-solid fa-xmark" style={badgeCloseStyle} onClick={() => setFilters({ ...filters, countryCode: 'all' })}></i>
              </span>
            )}
            {filters.minAge !== '' && (
              <span style={badgeStyle}>
                ასაკი &gt;= {filters.minAge}
                <i className="fa-solid fa-xmark" style={badgeCloseStyle} onClick={() => setFilters({ ...filters, minAge: '' })}></i>
              </span>
            )}
            {filters.maxAge !== '' && (
              <span style={badgeStyle}>
                ასაკი &lt;= {filters.maxAge}
                <i className="fa-solid fa-xmark" style={badgeCloseStyle} onClick={() => setFilters({ ...filters, maxAge: '' })}></i>
              </span>
            )}
            <button
              onClick={() => setFilters(initialFilters)}
              style={{ background: "none", border: "none", color: "#ef4444", fontSize: "11px", cursor: "pointer", textDecoration: "underline", padding: "2px 5px" }}
            >
              ყველას გასუფთავება
            </button>
          </div>
        )}
        
        <div style={{ 
          backgroundColor: "rgba(15, 23, 42, 0.6)", 
          border: "1px solid rgba(34, 211, 238, 0.1)", 
          borderRadius: "12px", 
          padding: "20px", 
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
          width: "100%",
          overflowX: "auto",
          display: "block",
          boxSizing: "border-box"
        }}>
          <AthletesTable
            filteredAthletes={filteredAthletes}
            selectedAthlete={selectedAthlete}
            setSelectedAthlete={setSelectedAthlete}
            clubs={clubs}
            onClubClick={onClubClick}
          />

          <div style={{ marginTop: "15px", fontSize: "12px", color: "rgba(226, 232, 240, 0.5)", textAlign: "left" }}>
            ნაჩვენებია {filteredAthletes.length} ჩანაწერი (სულ {athletes.length}-დან)
          </div>
        </div>

        {selectedAthlete ? (
          <div style={{ flex: 1, backgroundColor: "#16191f", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "12px", padding: "20px", marginTop: "10px", overflowY: "auto", maxHeight: "600px", display: "flex", flexDirection: "column", gap: "15px" }}>
            <Timeline 
              athlete={athletes.find(a => a.id === selectedAthlete.id) || selectedAthlete} 
              onUpdateAthlete={(updated) => {
                if (onUpdateAthlete) {
                  onUpdateAthlete(updated);
                }
                setSelectedAthlete(updated);
              }} 
            />
          </div>
        ) : (
          <div style={{ flex: 1, border: "1px dashed rgba(34, 211, 238, 0.2)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(34, 211, 238, 0.5)", marginTop: "10px", minHeight: "150px" }}>
            სპორტსმენის აქტივობების Timeline მოთავსდება აქ
          </div>
        )}
      </div>

      <AthleteDetailView 
        athlete={selectedAthlete ? (athletes.find(a => a.id === selectedAthlete.id) || selectedAthlete) : null} 
        onClose={() => setSelectedAthlete(null)} 
        onUpdateAthlete={(updated) => {
          if (onUpdateAthlete) {
            onUpdateAthlete(updated);
          }
          setSelectedAthlete(updated);
        }} 
        clubs={clubs}
        onClubClick={onClubClick}
      />

      <BulkPrintDoc
        filteredAthletes={filteredAthletes}
        clubs={clubs}
        isPrintingBulk={isPrintingBulk}
      />
    </div>
  );
};

export default AthletesLibrary;
