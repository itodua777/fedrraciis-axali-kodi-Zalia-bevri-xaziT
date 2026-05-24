import React from 'react';

const IncidentsDashboard = ({ onViewChange, incidents = [], athletes = [] }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const containerStyle = {
    flex: 1, padding: "30px", backgroundColor: "#121418", color: "#e2e8f0",
    fontFamily: "sans-serif", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px"
  };

  const topCardStyle = {
    backgroundColor: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(34, 211, 238, 0.1)",
    borderRadius: "12px", padding: "20px", display: "flex", alignItems: "center", gap: "15px", flex: 1,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)"
  };

  const total = incidents.length;
  const critical = incidents.filter(i => i.severity === "მაღალი").length;
  const active = incidents.filter(i => i.status !== "დასრულებული").length;
  const closed = incidents.filter(i => i.status === "დასრულებული").length;

  const filteredIncidents = incidents.filter(i => {
    const athlete = athletes.find(a => a.id === i.athleteId);
    const athleteName = athlete ? `${athlete.firstName} ${athlete.lastName}`.toLowerCase() : '';
    const location = i.location ? i.location.toLowerCase() : '';
    const desc = i.description ? i.description.toLowerCase() : '';
    const q = searchQuery.toLowerCase();
    return athleteName.includes(q) || location.includes(q) || desc.includes(q);
  });

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(15, 23, 42, 0.4)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(34, 211, 238, 0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div style={{ width: "40px", height: "40px", backgroundColor: "#f59e0b", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="fa-solid fa-shield-halved" style={{ color: "#000", fontSize: "20px" }}></i>
          </div>
          <div>
            <h2 style={{ margin: 0, color: "#fff", fontSize: "20px" }}>ინციდენტების მართვა</h2>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>ალპინიზმისა და სპორტის დეპარტამენტის შემთხვევათა რეესტრი</div>
          </div>
        </div>
        <button 
          onClick={() => onViewChange('add_incident')}
          style={{ backgroundColor: "#f59e0b", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "20px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 15px rgba(245, 158, 11, 0.3)" }}>
          <i className="fa-solid fa-plus"></i> ინციდენტის დამატება
        </button>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={topCardStyle}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="fa-solid fa-heart-pulse" style={{ color: "#fff" }}></i>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>სულ ინციდენტი</div>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>{total}</div>
          </div>
        </div>
        <div style={topCardStyle}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "rgba(239, 68, 68, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ color: "#ef4444" }}></i>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#ef4444", fontWeight: "bold" }}>კრიტიკული</div>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>{critical}</div>
          </div>
        </div>
        <div style={topCardStyle}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "rgba(249, 115, 22, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="fa-solid fa-magnifying-glass" style={{ color: "#f97316" }}></i>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#f97316", fontWeight: "bold" }}>მიმდინარე ძიება</div>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>{active}</div>
          </div>
        </div>
        <div style={topCardStyle}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="fa-solid fa-check-double" style={{ color: "#10b981" }}></i>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#10b981", fontWeight: "bold" }}>დასრულებული</div>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>{closed}</div>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(34, 211, 238, 0.1)", borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <h3 style={{ margin: 0, color: "#fff", fontSize: "16px" }}>инциდენტების რეესტრი</h3>
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "5px 15px", display: "flex", alignItems: "center", gap: "10px" }}>
              <i className="fa-solid fa-magnifying-glass" style={{ color: "rgba(255,255,255,0.5)" }}></i>
              <input type="text" placeholder="ძიება..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ background: "none", border: "none", color: "#fff", outline: "none", fontSize: "14px" }} />
            </div>
            <button style={{ backgroundColor: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className="fa-solid fa-filter"></i>
            </button>
          </div>
        </div>
        
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
              <th style={{ padding: "15px", textAlign: "left", color: "rgba(255,255,255,0.5)", fontWeight: "normal", fontSize: "12px" }}>თანამშრომელი</th>
              <th style={{ padding: "15px", textAlign: "left", color: "rgba(255,255,255,0.5)", fontWeight: "normal", fontSize: "12px" }}>თარიღი / დრო</th>
              <th style={{ padding: "15px", textAlign: "left", color: "rgba(255,255,255,0.5)", fontWeight: "normal", fontSize: "12px" }}>ადგილმდებარეობა</th>
              <th style={{ padding: "15px", textAlign: "left", color: "rgba(255,255,255,0.5)", fontWeight: "normal", fontSize: "12px" }}>სიმძიმე</th>
              <th style={{ padding: "15px", textAlign: "left", color: "rgba(255,255,255,0.5)", fontWeight: "normal", fontSize: "12px" }}>სტატუსი</th>
              <th style={{ padding: "15px", textAlign: "center", color: "rgba(255,255,255,0.5)", fontWeight: "normal", fontSize: "12px" }}>ფაილები</th>
            </tr>
          </thead>
          <tbody>
            {filteredIncidents.map((incident, idx) => {
              const athlete = athletes.find(a => a.id === incident.athleteId);
              const name = athlete ? `${athlete.firstName} ${athlete.lastName}` : incident.athleteId;
              const severityColor = incident.severity === 'მაღალი' ? '#ef4444' : incident.severity === 'საშუალო' ? '#f97316' : '#eab308';
              
              return (
                <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "15px", color: "#e2e8f0" }}>{name}</td>
                  <td style={{ padding: "15px", color: "#e2e8f0" }}>{incident.date} {incident.time}</td>
                  <td style={{ padding: "15px", color: "#e2e8f0" }}>{incident.location}</td>
                  <td style={{ padding: "15px" }}>
                    <span style={{ color: severityColor, border: `1px solid ${severityColor}`, padding: "4px 8px", borderRadius: "12px", fontSize: "12px" }}>
                      {incident.severity}
                    </span>
                  </td>
                  <td style={{ padding: "15px", color: "#e2e8f0" }}>{incident.status}</td>
                  <td style={{ padding: "15px", textAlign: "center", color: "rgba(34, 211, 238, 0.8)", cursor: "pointer" }}>
                    <i className="fa-solid fa-paperclip"></i> {incident.attachments?.length || 0}
                  </td>
                </tr>
              )
            })}
            {filteredIncidents.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
                  <i className="fa-solid fa-shield-halved" style={{ fontSize: "32px", marginBottom: "10px", display: "block" }}></i>
                  ინციდენტები არ მოიძებნა
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncidentsDashboard;
