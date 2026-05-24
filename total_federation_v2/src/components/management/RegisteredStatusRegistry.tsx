import React from 'react';

// Re-implement BrandSearchIcon locally for isolation
interface BrandSearchIconProps {
  isFocused: boolean;
  className?: string;
  style?: React.CSSProperties;
  size?: number;
}

const BrandSearchIcon: React.FC<BrandSearchIconProps> = ({ isFocused, className, style, size = 16 }) => {
  const [filterId] = React.useState(() => "neon-glow-" + Math.random().toString(36).substr(2, 9));
  const width = size;
  const height = size;
  
  return (
    <svg 
      className={className}
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
        fill="#22d3ee" 
        filter={isFocused ? `url(#${filterId}-focus)` : `url(#${filterId}-blur)`}
        style={{ transition: "all 0.2s" }}
      />
    </svg>
  );
};

export interface Athlete {
  id: string;
  firstName: string;
  lastName: string;
  personalId: string;
  status?: string;
  memberSince?: string;
  photo?: string;
  isFederationMember?: boolean;
  membershipStatus?: string;
  isVeteran?: boolean;
  isMentor?: boolean;
  isNationalTeamMember?: boolean;
  sportsDiscipline?: string;
  isClubMember?: boolean;
  clubId?: string | null;
}

interface RegisteredStatusRegistryProps {
  athletes: Athlete[];
}

export const RegisteredStatusRegistry: React.FC<RegisteredStatusRegistryProps> = ({ athletes }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchFocused, setSearchFocused] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState<string>('all'); // all, member, veteran, mentor, national

  // Filter status holders
  const statusHolders = React.useMemo(() => {
    return athletes.filter(a => {
      // Must have at least one valid status
      const hasMember = a.isFederationMember === true || a.membershipStatus === 'Active';
      const hasVeteran = a.isVeteran === true;
      const hasMentor = a.isMentor === true;
      const hasNational = a.isNationalTeamMember === true;

      if (!hasMember && !hasVeteran && !hasMentor && !hasNational) {
        return false;
      }

      // Apply status tab filter
      if (statusFilter === 'member' && !hasMember) return false;
      if (statusFilter === 'veteran' && !hasVeteran) return false;
      if (statusFilter === 'mentor' && !hasMentor) return false;
      if (statusFilter === 'national' && !hasNational) return false;

      // Apply search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const fullName = `${a.firstName} ${a.lastName}`.toLowerCase();
        const persId = a.personalId.toLowerCase();
        const disc = (a.sportsDiscipline || '').toLowerCase();
        return fullName.includes(query) || persId.includes(query) || disc.includes(query);
      }

      return true;
    });
  }, [athletes, searchQuery, statusFilter]);

  const searchInputStyle = {
    background: "transparent",
    border: "none",
    borderBottom: `2px solid ${searchQuery ? '#22d3ee' : 'rgba(255,255,255,0.1)'}`,
    color: "#fff",
    outline: "none",
    padding: "12px 10px 12px 32px",
    fontSize: "15px",
    width: "100%",
    transition: "all 0.3s",
    boxSizing: "border-box" as const
  };

  const filterBtnStyle = (active: boolean) => ({
    backgroundColor: active ? "rgba(34, 211, 238, 0.12)" : "rgba(255, 255, 255, 0.02)",
    color: active ? "#22d3ee" : "rgba(255,255,255,0.6)",
    border: `1px solid ${active ? '#22d3ee' : 'rgba(255,255,255,0.1)'}`,
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold" as const,
    cursor: "pointer",
    transition: "all 0.3s",
    boxShadow: active ? "0 0 10px rgba(34, 211, 238, 0.15)" : "none"
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
      {/* Header description */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h3 style={{ margin: 0, color: "#fff", fontSize: "16px" }}>სტატუსმინიჭებულ პირთა არქივი</h3>
          <p style={{ margin: "5px 0 0 0", color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>
            ფედერაციის წევრების, საპატიო ვეტერანებისა და ოფიციალური სტატუსის მქონე პირთა სრული საარქივო რეესტრი (მხოლოდ წაკითხვადი).
          </p>
        </div>
        <div style={{
          backgroundColor: "rgba(34, 211, 238, 0.05)",
          border: "1px solid rgba(34, 211, 238, 0.2)",
          borderRadius: "8px",
          padding: "8px 16px",
          fontSize: "12px",
          color: "#22d3ee"
        }}>
          <i className="fa-solid fa-folder-open" style={{ marginRight: "6px" }}></i>
          სულ ნაპოვნია: {statusHolders.length} პირი
        </div>
      </div>

      {/* Filter and Search Box */}
      <div style={{
        backgroundColor: "rgba(30, 41, 59, 0.4)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "15px"
      }}>
        {/* Search input with BrandSearchIcon */}
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
            placeholder="სწრაფი ძებნა სახელით, გვარით, პირადი ნომრით ან დისციპლინით..."
            style={{
              ...searchInputStyle,
              boxShadow: searchFocused ? "0 4px 12px -4px rgba(34, 211, 238, 0.3)" : "none"
            }}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>

        {/* Filter tags */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginRight: "5px" }}>ფილტრაცია:</span>
          <button style={filterBtnStyle(statusFilter === 'all')} onClick={() => setStatusFilter('all')}>ყველა</button>
          <button style={filterBtnStyle(statusFilter === 'member')} onClick={() => setStatusFilter('member')}>მოქმედი წევრი</button>
          <button style={filterBtnStyle(statusFilter === 'veteran')} onClick={() => setStatusFilter('veteran')}>ვეტერანი</button>
          <button style={filterBtnStyle(statusFilter === 'mentor')} onClick={() => setStatusFilter('mentor')}>მენტორი</button>
          <button style={filterBtnStyle(statusFilter === 'national')} onClick={() => setStatusFilter('national')}>ნაკრების წევრი</button>
        </div>
      </div>

      {/* Archive Grid/Table */}
      <div style={{
        backgroundColor: "rgba(30, 41, 59, 0.2)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: "12px",
        padding: "24px",
        overflowX: "auto"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
              <th style={{ padding: "12px 8px", color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>სახელი და გვარი</th>
              <th style={{ padding: "12px 8px", color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>პირადი ნომერი</th>
              <th style={{ padding: "12px 8px", color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>სპორტის დისციპლინა</th>
              <th style={{ padding: "12px 8px", color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>სტატუსები</th>
              <th style={{ padding: "12px 8px", color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>გაწევრიანების თარიღი</th>
            </tr>
          </thead>
          <tbody>
            {statusHolders.map((a) => {
              const isMember = a.isFederationMember === true || a.membershipStatus === 'Active';
              return (
                <tr key={a.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background-color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)"} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                  <td style={{ padding: "12px 8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <img src={a.photo || "https://i.pravatar.cc/150?img=1"} alt={a.firstName} style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(34, 211, 238, 0.3)" }} />
                      <div style={{ color: "#fff", fontWeight: "500", fontSize: "14px" }}>{a.firstName} {a.lastName}</div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 8px", color: "#e2e8f0", fontSize: "13px", fontFamily: "monospace" }}>
                    {a.personalId}
                  </td>
                  <td style={{ padding: "12px 8px", color: "#22d3ee", fontSize: "13px", fontWeight: "500" }}>
                    {a.sportsDiscipline || "—"}
                  </td>
                  <td style={{ padding: "12px 8px" }}>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {isMember && (
                        <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", fontWeight: "bold", border: "1px solid rgba(34, 197, 94, 0.4)", backgroundColor: "rgba(34, 197, 94, 0.1)", color: "#22c55e" }}>
                          მოქმედი წევრი
                        </span>
                      )}
                      {a.isVeteran && (
                        <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", fontWeight: "bold", border: "1px solid rgba(245, 158, 11, 0.4)", backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" }}>
                          საპატიო ვეტერანი
                        </span>
                      )}
                      {a.isMentor && (
                        <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", fontWeight: "bold", border: "1px solid rgba(168, 85, 247, 0.4)", backgroundColor: "rgba(168, 85, 247, 0.1)", color: "#a855f7" }}>
                          მენტორი
                        </span>
                      )}
                      {a.isNationalTeamMember && (
                        <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", fontWeight: "bold", border: "1px solid rgba(239, 68, 68, 0.4)", backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}>
                          ეროვნული ნაკრები
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "12px 8px", color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
                    {a.memberSince || "—"}
                  </td>
                </tr>
              );
            })}
            {statusHolders.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "30px 0", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
                  მონაცემები ვერ მოიძებნა მითითებული კრიტერიუმებით.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
