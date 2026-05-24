import React from 'react';

const MentorsDashboard = ({ onViewChange, athletes = [] }) => {
  const [mentors, setMentors] = React.useState([
    { id: "M-101", firstName: "ზურაბ", lastName: "კიკნაძე", personalId: "01010101011", status: "მწვრთნელი", sportType: "ალპინიზმი", height: 182, weight: 80, bloodType: "O+", phone: "555112233", email: "z.k@example.com", category: "I კატეგორია", photo: "https://i.pravatar.cc/150?img=33", certificates: [], awards: [], biography: "სპორტის დამსახურებული მწვრთნელი. მრავალწლიანი გამოცდილება მაღალმთიან ექსპედიციებში." }
  ]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('');
  const [sportFilter, setSportFilter] = React.useState('');
  const [selectedMentor, setSelectedMentor] = React.useState(null);

  React.useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await fetch('/api/mentors');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            // Keep the default mock if not present in fetched
            const hasDefaultMock = data.some(m => m.id === "M-101");
            if (!hasDefaultMock) {
              setMentors([
                { id: "M-101", firstName: "ზურაბ", lastName: "კიკნაძე", personalId: "01010101011", status: "მწვრთნელი", sportType: "ალპინიზმი", height: 182, weight: 80, bloodType: "O+", phone: "555112233", email: "z.k@example.com", category: "I კატეგორია", photo: "https://i.pravatar.cc/150?img=33", certificates: [], awards: [], biography: "სპორტის დამსახურებული მწვრთნელი. მრავალწლიანი გამოცდილება მაღალმთიან ექსპედიციებში." },
                ...data
              ]);
            } else {
              setMentors(data);
            }
            return;
          }
        }
      } catch (e) {
        console.warn("Failed to fetch mentors from API, loading local storage:", e);
      }

      // Local storage fallback
      const stored = localStorage.getItem('mentorsStore');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setMentors(prev => {
              const defaultMock = prev.filter(m => m.id === "M-101");
              // Deduplicate
              const filteredStored = parsed.filter(pm => pm.id !== "M-101");
              return [...defaultMock, ...filteredStored];
            });
          }
        } catch (e) {
          console.error("Error parsing mentorsStore", e);
        }
      }
    };

    fetchMentors();
  }, []);

  const dynamicMentors = React.useMemo(() => {
    return athletes
      .filter(a => a.isFederationMember && a.isMentor && a.membershipStatus !== 'Deceased')
      .map(a => ({
        id: `dynamic-${a.id}`,
        firstName: a.firstName,
        lastName: a.lastName,
        personalId: a.personalId,
        status: "ინსტრუქტორი",
        sportType: "ალპინიზმი",
        height: a.height || '',
        weight: a.weight || '',
        bloodType: a.bloodType || '',
        phone: a.phone || '',
        email: a.email || '',
        category: a.isNationalTeamMember ? "ეროვნული ნაკრები" : "ფედერაციის წევრი",
        photo: a.photo,
        certificates: [],
        awards: a.achievements ? a.achievements.map(ach => ({ name: ach.result, year: ach.year })) : [],
        biography: a.biography || ''
      }));
  }, [athletes]);

  const combinedMentors = React.useMemo(() => {
    return [...mentors, ...dynamicMentors];
  }, [mentors, dynamicMentors]);

  const filteredMentors = combinedMentors.filter(m => {
    const fullName = `${m.firstName || ''} ${m.lastName || ''} ${m.personalId || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter ? m.status === categoryFilter : true;
    const matchesSport = sportFilter ? m.sportType === sportFilter : true;
    return matchesSearch && matchesCategory && matchesSport;
  });

  return (
    <div style={{ flex: 1, padding: "30px", backgroundColor: "#121418", color: "#e2e8f0", fontFamily: "sans-serif", display: "flex", gap: "20px", overflow: "hidden" }}>
      <div style={{ flex: selectedMentor ? 1 : 2, display: "flex", flexDirection: "column", gap: "20px", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ color: "#22d3ee", margin: 0, textShadow: "0 0 10px rgba(34, 211, 238, 0.5)" }}>მენტორები და ტექნიკური პერსონალი</h2>
          <button onClick={() => onViewChange('add_mentor')} style={{ backgroundColor: "#22d3ee", color: "#121418", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 0 15px rgba(34, 211, 238, 0.5)" }}>
            <i className="fa-solid fa-plus"></i> მენტორის დამატება
          </button>
        </div>

        <div style={{ display: "flex", gap: "10px", backgroundColor: "rgba(15, 23, 42, 0.6)", padding: "15px", borderRadius: "12px", border: "1px solid rgba(34, 211, 238, 0.1)" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <i className="fa-solid fa-magnifying-glass" style={{ position: "absolute", left: "10px", top: "10px", color: "rgba(255,255,255,0.5)" }}></i>
            <input type="text" placeholder="სახელი, გვარი, პირადი ნომერი..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: "100%", padding: "10px 10px 10px 35px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(34, 211, 238, 0.3)", borderRadius: "8px", color: "#fff", outline: "none", boxSizing: "border-box" }} />
          </div>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={{ padding: "10px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(34, 211, 238, 0.3)", borderRadius: "8px", color: "#fff", outline: "none" }}>
            <option value="">ყველა კატეგორია</option>
            <option value="მწვრთნელი">მწვრთნელები</option>
            <option value="ინსტრუქტორი">ინსტრუქტორები</option>
            <option value="ტრენერი">ტრენერები</option>
          </select>
          <select value={sportFilter} onChange={e => setSportFilter(e.target.value)} style={{ padding: "10px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(34, 211, 238, 0.3)", borderRadius: "8px", color: "#fff", outline: "none" }}>
            <option value="">ყველა სპორტი</option>
            <option value="ალპინიზმი">ალპინიზმი</option>
            <option value="მთის ტურიზმი">მთის ტურიზმი</option>
            <option value="კლდეზე ცოცვა">კლდეზე ცოცვა</option>
          </select>
        </div>

        <div style={{ flex: 1, overflowY: "auto", display: "grid", gridTemplateColumns: selectedMentor ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px", alignContent: "start" }}>
          {filteredMentors.map(m => (
            <div key={m.id} onClick={() => setSelectedMentor(m)} style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", borderRadius: "12px", padding: "20px", border: `1px solid ${selectedMentor?.id === m.id ? '#22d3ee' : 'rgba(34, 211, 238, 0.1)'}`, cursor: "pointer", display: "flex", gap: "15px", alignItems: "center", transition: "all 0.3s", boxShadow: selectedMentor?.id === m.id ? "0 0 15px rgba(34,211,238,0.2)" : "none" }}>
              <div style={{ width: "60px", height: "60px", borderRadius: "50%", overflow: "hidden", border: "2px solid #22d3ee", flexShrink: 0 }}>
                {m.photo ? <img src={m.photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Photo" /> : <div style={{ width: "100%", height: "100%", backgroundColor: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}><i className="fa-solid fa-user"></i></div>}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 5px 0", color: "#fff", fontSize: "16px" }}>{m.firstName} {m.lastName}</h3>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>{m.status} | {m.sportType}</div>
              </div>
              <div style={{ backgroundColor: "rgba(34, 211, 238, 0.1)", color: "#22d3ee", padding: "4px 8px", borderRadius: "8px", fontSize: "11px", fontWeight: "bold" }}>
                {m.category}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedMentor && (
        <div style={{ flex: 1, backgroundColor: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(34, 211, 238, 0.2)", borderRadius: "12px", padding: "30px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3 style={{ margin: 0, color: "#22d3ee" }}>დეტალური პროფილი</h3>
            <i className="fa-solid fa-xmark" style={{ cursor: "pointer", color: "#fff", fontSize: "18px" }} onClick={() => setSelectedMentor(null)}></i>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "20px" }}>
            <div style={{ width: "100px", height: "100px", borderRadius: "50%", overflow: "hidden", border: "3px solid #22d3ee", marginBottom: "15px" }}>
              {selectedMentor.photo ? <img src={selectedMentor.photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Photo" /> : <div style={{ width: "100%", height: "100%", backgroundColor: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px" }}><i className="fa-solid fa-user"></i></div>}
            </div>
            <h2 style={{ margin: "0 0 5px 0", color: "#fff" }}>{selectedMentor.firstName} {selectedMentor.lastName}</h2>
            <div style={{ color: "#22d3ee", fontWeight: "bold" }}>{selectedMentor.status}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <div><span style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", display: "block" }}>პირადი ნომერი</span>{selectedMentor.personalId}</div>
            <div><span style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", display: "block" }}>ტელეფონი</span>{selectedMentor.phone}</div>
            <div><span style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", display: "block" }}>სისხლის ჯგუფი</span>{selectedMentor.bloodType}</div>
            <div><span style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", display: "block" }}>სპორტი</span>{selectedMentor.sportType}</div>
          </div>

          <div>
            <h4 style={{ color: "rgba(255,255,255,0.7)", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "5px" }}>ბიოგრაფია</h4>
            <p style={{ fontSize: "14px", lineHeight: "1.6" }}>{selectedMentor.biography}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorsDashboard;
