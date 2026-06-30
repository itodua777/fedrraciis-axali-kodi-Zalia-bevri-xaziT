import React from '../../utils/react-shim.js';
import { useTranslation } from '../../context/LanguageContext.jsx';

// Re-implement BrandSearchIcon locally for self-containment
const BrandSearchIcon = ({ isFocused, size = 16, style }) => {
  const [filterId] = React.useState(() => "neon-glow-" + Math.random().toString(36).substr(2, 9));
  const width = size;
  const height = size;
  
  return (
    <svg 
      style={{ width: `${width}px`, height: `${height}px`, display: "inline-block", verticalAlign: "middle", ...style }}
      viewBox="0 0 24 24"
    >
      <defs>
        <filter id={`${filterId}-focus`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={`${filterId}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx="5" cy="5" r="2" fill={isFocused ? "#ffffff" : "rgba(255, 255, 255, 0.4)"} style={{ transition: "all 0.2s" }} />
      <circle cx="12" cy="5" r="2" fill={isFocused ? "#ffffff" : "rgba(255, 255, 255, 0.4)"} style={{ transition: "all 0.2s" }} />
      <circle cx="19" cy="5" r="2" fill={isFocused ? "#ffffff" : "rgba(255, 255, 255, 0.4)"} style={{ transition: "all 0.2s" }} />
      
      <circle cx="5" cy="12" r="2" fill={isFocused ? "#ffffff" : "rgba(255, 255, 255, 0.4)"} style={{ transition: "all 0.2s" }} />
      <circle cx="19" cy="12" r="2" fill={isFocused ? "#ffffff" : "rgba(255, 255, 255, 0.4)"} style={{ transition: "all 0.2s" }} />
      
      <circle cx="5" cy="19" r="2" fill={isFocused ? "#ffffff" : "rgba(255, 255, 255, 0.4)"} style={{ transition: "all 0.2s" }} />
      <circle cx="12" cy="19" r="2" fill={isFocused ? "#ffffff" : "rgba(255, 255, 255, 0.4)"} style={{ transition: "all 0.2s" }} />
      <circle cx="19" cy="19" r="2" fill={isFocused ? "#ffffff" : "rgba(255, 255, 255, 0.4)"} style={{ transition: "all 0.2s" }} />
      
      <circle 
        cx="12" 
        cy="12" 
        r="2" 
        fill="var(--color-emerald-core)" 
        filter={isFocused ? `url(#${filterId}-focus)` : `url(#${filterId}-blur)`}
        style={{ transition: "all 0.2s" }}
      />
    </svg>
  );
};

const StatusRegistryTab = () => {
  const { i18n } = useTranslation();
  const isGeo = i18n.language === 'GEO';

  const [athletes, setAthletes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchFocused, setSearchFocused] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState('all'); // all, member, veteran, mentor, national

  // Load athletes from centralized API scoped to active companyId
  React.useEffect(() => {
    const fetchAthletes = async () => {
      try {
        setLoading(true);
        const activeUserStr = localStorage.getItem('activeUser');
        const activeUser = activeUserStr ? JSON.parse(activeUserStr) : null;
        const companyId = activeUser?.companyId || '';

        const response = await fetch('/api/v1/athletes', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
            'x-company-id': companyId,
            'company-id': companyId
          }
        });
        if (!response.ok) throw new Error("ათლეტების ჩატვირთვა ვერ მოხერხდა");
        const data = await response.json();
        setAthletes(data || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAthletes();
  }, []);

  // Filter listed athletes
  const filteredAthletes = React.useMemo(() => {
    return athletes.filter(a => {
      // Must have at least one valid status
      const hasMember = a.isFederationMember === true || a.membershipStatus === 'Active';
      const hasVeteran = a.isVeteran === true;
      const hasMentor = a.isMentor === true;
      const hasNational = a.isNationalTeamMember === true;

      if (!hasMember && !hasVeteran && !hasMentor && !hasNational) {
        return false;
      }

      // Apply designation filter
      if (statusFilter === 'member' && !hasMember) return false;
      if (statusFilter === 'veteran' && !hasVeteran) return false;
      if (statusFilter === 'mentor' && !hasMentor) return false;
      if (statusFilter === 'national' && !hasNational) return false;

      // Real-time index filtering across 4 parameters: firstName, lastName, personalId, sportsDiscipline
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const fName = (a.firstName || '').toLowerCase();
        const lName = (a.lastName || '').toLowerCase();
        const persId = (a.personalId || '').toLowerCase();
        const disc = (a.sportsDiscipline || '').toLowerCase();
        
        const matchFirstName = fName.includes(query);
        const matchLastName = lName.includes(query);
        const matchPersonalId = persId.includes(query);
        const matchDiscipline = disc.includes(query);

        return matchFirstName || matchLastName || matchPersonalId || matchDiscipline;
      }

      return true;
    });
  }, [athletes, searchQuery, statusFilter]);

  const searchInputStyle = {
    background: "transparent",
    border: "none",
    borderBottom: `2px solid ${searchFocused || searchQuery ? 'var(--color-emerald-core)' : 'rgba(255,255,255,0.1)'}`,
    color: "#fff",
    outline: "none",
    padding: "12px 10px 12px 36px",
    fontSize: "14px",
    width: "100%",
    transition: "all 0.3s",
    boxSizing: "border-box"
  };

  const filterBtnStyle = (active, color) => ({
    backgroundColor: active ? `color-mix(in oklab, ${color} 15%, transparent)` : "rgba(255, 255, 255, 0.02)",
    color: active ? color : "rgba(255,255,255,0.6)",
    border: `1px solid ${active ? color : "rgba(255,255,255,0.1)"}`,
    padding: "10px 18px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: active ? `0 0 12px color-mix(in oklab, ${color} 20%, transparent)` : "none"
  });

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "350px", color: "var(--silver)" }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: "10px", fontSize: "20px" }}></i>
        <span>{isGeo ? "მონაცემები იტვირთება..." : "Loading registry..."}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "30px", textAlign: "center", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "12px", backgroundColor: "rgba(239, 68, 68, 0.05)" }}>
        <i className="fa-solid fa-triangle-exclamation" style={{ color: "#ef4444", fontSize: "32px", marginBottom: "12px" }}></i>
        <h4 style={{ margin: "0 0 8px 0", color: "#fff" }}>{isGeo ? "ჩატვირთვა ვერ მოხერხდა" : "Loading Failed"}</h4>
        <p style={{ margin: 0, color: "rgba(255, 255, 255, 0.5)", fontSize: "13px" }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header Info */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
        <div>
          <h3 style={{ margin: 0, color: "#fff", fontSize: "18px", fontFamily: "var(--font-heading)" }}>
            {isGeo ? "სტატუსის რეესტრი" : "Registered Status Registry"}
          </h3>
          <p style={{ margin: "5px 0 0 0", color: "var(--silver)", fontSize: "12px" }}>
            {isGeo 
              ? "ფედერაციაში რეგისტრირებული ათლეტების სპეციალიზებული ქვესტატუსებისა და დისციპლინების საარქივო რეესტრი."
              : "Compliance archive for registered athletes, specialized sub-statuses, and sports discipline filters."}
          </p>
        </div>
        <div style={{
          backgroundColor: "color-mix(in oklab, var(--color-emerald-core) 6%, transparent)",
          border: "1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)",
          borderRadius: "8px",
          padding: "8px 16px",
          fontSize: "12px",
          fontWeight: "600",
          color: "var(--color-emerald-core)",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <i className="fa-solid fa-id-card"></i>
          <span>{isGeo ? "სულ:" : "Total:"} {filteredAthletes.length}</span>
        </div>
      </div>

      {/* Filter and Search Bar Container */}
      <div style={{
        backgroundColor: "rgba(30, 41, 59, 0.3)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        backdropFilter: "blur(10px)"
      }}>
        {/* Neon Glow Search Input */}
        <div style={{ position: "relative", width: "100%" }}>
          <BrandSearchIcon
            isFocused={searchFocused || !!searchQuery}
            size={18}
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              transition: "all 0.3s"
            }}
          />
          <input
            type="text"
            placeholder={isGeo 
              ? "სწრაფი ძებნა სახელით, გვარით, პირადი ნომრით ან დისციპლინით..." 
              : "Search by name, personal ID, or discipline..."}
            style={{
              ...searchInputStyle,
              boxShadow: searchFocused ? "0 0 15px -3px color-mix(in oklab, var(--color-emerald-core) 40%, transparent)" : "none"
            }}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>

        {/* Designation Filter Buttons */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: "var(--silver)", marginRight: "5px", fontWeight: "600" }}>
            {isGeo ? "ფილტრაცია:" : "Designation:"}
          </span>
          <button style={filterBtnStyle(statusFilter === 'all', '#38bdf8')} onClick={() => setStatusFilter('all')}>
            {isGeo ? "ყველა" : "All"}
          </button>
          <button style={filterBtnStyle(statusFilter === 'member', '#22c55e')} onClick={() => setStatusFilter('member')}>
            {isGeo ? "ფედერაციის წევრი" : "Federation Member"}
          </button>
          <button style={filterBtnStyle(statusFilter === 'veteran', '#f59e0b')} onClick={() => setStatusFilter('veteran')}>
            {isGeo ? "ვეტერანი" : "Veteran"}
          </button>
          <button style={filterBtnStyle(statusFilter === 'mentor', '#a855f7')} onClick={() => setStatusFilter('mentor')}>
            {isGeo ? "მენტორი" : "Mentor"}
          </button>
          <button style={filterBtnStyle(statusFilter === 'national', '#ef4444')} onClick={() => setStatusFilter('national')}>
            {isGeo ? "ეროვნული ნაკრების წევრი" : "National Team Member"}
          </button>
        </div>
      </div>

      {/* Athletes List Table */}
      <div style={{
        backgroundColor: "rgba(30, 41, 59, 0.15)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: "12px",
        overflowX: "auto",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.01)" }}>
              <th style={{ padding: "16px 20px", color: "var(--silver)", fontSize: "12px", textAlign: "left", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {isGeo ? "სახელი და გვარი" : "Athlete Name"}
              </th>
              <th style={{ padding: "16px 20px", color: "var(--silver)", fontSize: "12px", textAlign: "left", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {isGeo ? "პირადი ნომერი" : "Personal ID"}
              </th>
              <th style={{ padding: "16px 20px", color: "var(--silver)", fontSize: "12px", textAlign: "left", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {isGeo ? "სპორტის დისციპლინა" : "Discipline Category"}
              </th>
              <th style={{ padding: "16px 20px", color: "var(--silver)", fontSize: "12px", textAlign: "left", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {isGeo ? "სტატუსები" : "Designations"}
              </th>
              <th style={{ padding: "16px 20px", color: "var(--silver)", fontSize: "12px", textAlign: "left", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {isGeo ? "თარიღი" : "Registered Since"}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAthletes.map((a) => {
              const isMember = a.isFederationMember === true || a.membershipStatus === 'Active';
              return (
                <tr key={a.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "all 0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)"} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden"
                      }}>
                        {a.photo ? (
                          <img src={a.photo} alt={a.firstName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <i className="fa-solid fa-user" style={{ color: "rgba(255,255,255,0.3)" }}></i>
                        )}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ color: "#fff", fontWeight: "600", fontSize: "14px" }}>{a.firstName} {a.lastName}</span>
                        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>ID: {a.id.split('-')[0]}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", color: "var(--bone)", fontSize: "13px", fontFamily: "monospace", letterSpacing: "0.5px" }}>
                    {a.personalId}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{
                      backgroundColor: "rgba(34, 197, 94, 0.05)",
                      border: "1px solid rgba(34, 197, 94, 0.15)",
                      borderRadius: "6px",
                      padding: "4px 10px",
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "var(--color-emerald-core)"
                    }}>
                      {a.sportsDiscipline || (isGeo ? "ალპინიზმი" : "Mountaineering")}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {isMember && (
                        <span style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "6px", fontWeight: "bold", border: "1px solid rgba(34, 197, 94, 0.3)", backgroundColor: "rgba(34, 197, 94, 0.08)", color: "#22c55e" }}>
                          {isGeo ? "ფედერაციის წევრი" : "Federation Member"}
                        </span>
                      )}
                      {a.isVeteran && (
                        <span style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "6px", fontWeight: "bold", border: "1px solid rgba(245, 158, 11, 0.3)", backgroundColor: "rgba(245, 158, 11, 0.08)", color: "#f59e0b" }}>
                          {isGeo ? "ვეტერანი" : "Veteran"}
                        </span>
                      )}
                      {a.isMentor && (
                        <span style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "6px", fontWeight: "bold", border: "1px solid rgba(168, 85, 247, 0.3)", backgroundColor: "rgba(168, 85, 247, 0.08)", color: "#a855f7" }}>
                          {isGeo ? "მენტორი" : "Mentor"}
                        </span>
                      )}
                      {a.isNationalTeamMember && (
                        <span style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "6px", fontWeight: "bold", border: "1px solid rgba(239, 68, 68, 0.3)", backgroundColor: "rgba(239, 68, 68, 0.08)", color: "#ef4444" }}>
                          {isGeo ? "ეროვნული ნაკრები" : "National Team"}
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", color: "var(--silver)", fontSize: "13px" }}>
                    {a.memberSince || "—"}
                  </td>
                </tr>
              );
            })}
            
            {filteredAthletes.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "40px 0", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
                  <i className="fa-solid fa-magnifying-glass" style={{ display: "block", fontSize: "20px", marginBottom: "10px", opacity: 0.5 }}></i>
                  {isGeo ? "მონაცემები ვერ მოიძებნა მითითებული ფილტრებით." : "No records found matching search filters."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatusRegistryTab;
