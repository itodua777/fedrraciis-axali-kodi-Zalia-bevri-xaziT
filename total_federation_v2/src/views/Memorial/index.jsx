import React from 'react';
import MemorialForm from './components/MemorialForm.jsx';
import MemorialFullscreen from './components/MemorialFullscreen.jsx';

const MemorialRegistryDashboard = ({ athletes = [], onUpdateAthlete }) => {
  const [records, setRecords] = React.useState([
    {
      id: 1,
      firstName: 'მიხეილ',
      lastName: 'ხერგიანი',
      birthYear: 1932,
      deathYear: 1969,
      titles: ['სპორტის დამსახურებული ოსტატი', 'საბჭოთა კავშირის ჩემპიონი'],
      biography: 'ლეგენდარული ქართველი ალპინისტი...',
      profilePhoto: 'https://i.pravatar.cc/150?img=68',
      galleryPhotos: []
    }
  ]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [periodStart, setPeriodStart] = React.useState('');
  const [periodEnd, setPeriodEnd] = React.useState('');
  const [titleFilter, setTitleFilter] = React.useState('');
  const [selectedRecord, setSelectedRecord] = React.useState(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = React.useState(false);

  const deceasedAthletes = React.useMemo(() => {
    return athletes
      .filter(a => a.isFederationMember && a.membershipStatus === 'Deceased')
      .map(a => {
        const birthYear = a.birthDate ? (
          /^\d{4}/.test(a.birthDate) 
            ? parseInt(a.birthDate.substring(0, 4)) 
            : new Date(a.birthDate).getFullYear()
        ) : null;
        const deathYear = a.deathYear ? parseInt(a.deathYear) : null;
        const titles = [];
        if (a.isFounder) titles.push('დამფუძნებელი');
        if (a.isNationalTeamMember) titles.push('ეროვნული ნაკრები');
        if (a.isVeteran) titles.push('ვეტერანი ათლეტი');
        if (a.isMentor) titles.push('მენტორი');
        if (a.achievements) {
          a.achievements.forEach(ach => {
            if (ach.result) titles.push(ach.result);
          });
        }
        return {
          id: `dynamic-${a.id}`,
          firstName: a.firstName,
          lastName: a.lastName,
          birthYear,
          deathYear,
          titles,
          biography: a.biography || '',
          profilePhoto: a.photo,
          galleryPhotos: []
        };
      });
  }, [athletes]);

  const combinedRecords = React.useMemo(() => {
    return [...records, ...deceasedAthletes];
  }, [records, deceasedAthletes]);

  const allTitles = Array.from(new Set(combinedRecords.flatMap(r => r.titles)));

  const filteredRecords = combinedRecords.filter(r => {
    const matchesSearch = (r.firstName + ' ' + r.lastName).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTitle = titleFilter ? r.titles.includes(titleFilter) : true;
    const start = periodStart ? parseInt(periodStart) : 0;
    const end = periodEnd ? parseInt(periodEnd) : 9999;
    const matchesPeriod = r.birthYear >= start && r.deathYear <= end;
    return matchesSearch && matchesTitle && matchesPeriod;
  });

  const handleSave = (newRecord) => {
    setRecords([...records, { ...newRecord, id: Date.now() }]);
    setIsFormOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleFullscreenSave = (updatedRecord) => {
    if (String(updatedRecord.id).startsWith('dynamic-')) {
      const originalId = String(updatedRecord.id).replace('dynamic-', '');
      const originalAthlete = athletes.find(ath => String(ath.id) === originalId);
      if (originalAthlete) {
        const updated = {
          ...originalAthlete,
          firstName: updatedRecord.firstName,
          lastName: updatedRecord.lastName,
          biography: updatedRecord.biography,
          photo: updatedRecord.profilePhoto,
          deathYear: String(updatedRecord.deathYear),
          birthDate: (() => {
            if (updatedRecord.birthYear) {
              const birthYearStr = String(updatedRecord.birthYear);
              if (originalAthlete.birthDate) {
                const parts = originalAthlete.birthDate.split('-');
                if (parts.length === 3) {
                  return `${birthYearStr}-${parts[1]}-${parts[2]}`;
                }
              }
              return `${birthYearStr}-01-01`;
            }
            return originalAthlete.birthDate;
          })(),
          isFounder: updatedRecord.titles.includes('დამფუძნებელი'),
          isNationalTeamMember: updatedRecord.titles.includes('ეროვნული ნაკრები'),
          isVeteran: updatedRecord.titles.includes('ვეტერანი ათლეტი'),
          isMentor: updatedRecord.titles.includes('მენტორი'),
          achievements: updatedRecord.titles
            .filter(t => !['დამფუძნებელი', 'ეროვნული ნაკრები', 'ვეტერანი ათლეტი', 'მენტორი'].includes(t))
            .map((t, idx) => ({ id: `ach-${idx}`, date: '', result: t, description: '' }))
        };
        if (onUpdateAthlete) {
          onUpdateAthlete(updated);
        }
      }
    } else {
      setRecords(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
    }
    setSelectedRecord(updatedRecord);
  };

  return (
    <div style={{ flex: 1, display: "flex", backgroundColor: "#121418", color: "#e2e8f0", overflow: "hidden" }}>
      
      {/* Print Template (Hidden normally) */}
      <div className="print-only memorial-print-doc" style={{ width: "100%" }}>
        {selectedRecord && (
          <>
            <div style={{ textAlign: "center", marginBottom: "30px", borderBottom: "2px solid black", paddingBottom: "20px" }}>
              <h1 className="memorial-print-title">ოფიციალური მემორიალური ამონაწერი</h1>
              {selectedRecord.profilePhoto && (
                <div style={{ margin: "15px auto", width: "120px", height: "120px", borderRadius: "8px", overflow: "hidden", border: "1px solid black" }}>
                  <img src={selectedRecord.profilePhoto} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Profile" />
                </div>
              )}
              <h2 style={{ margin: "5px 0" }}>{selectedRecord.firstName} {selectedRecord.lastName}</h2>
              <div style={{ fontSize: "18px" }}>{selectedRecord.birthYear} - {selectedRecord.deathYear}</div>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <h3>ტიტულები:</h3>
              {selectedRecord.titles.map((t, i) => <span key={i} className="memorial-print-badge">{t}</span>)}
            </div>
            <div style={{ marginBottom: "20px" }}>
              <h3>ბიოგრაფია:</h3>
              <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>{selectedRecord.biography}</p>
            </div>
            {selectedRecord.galleryPhotos && selectedRecord.galleryPhotos.length > 0 && (
              <div>
                <h3>ფოტო მასალა:</h3>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {selectedRecord.galleryPhotos.map((photo, idx) => (
                    <div key={idx} style={{ width: "150px", height: "150px", border: "1px solid black", overflow: "hidden", pageBreakInside: "avoid" }}>
                      <img src={photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={`Gallery ${idx}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="no-print" style={{ flex: 1, padding: "30px", display: "flex", gap: "20px", overflow: "hidden" }}>
        
        {/* Left Panel: Filters & List */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "15px", backgroundColor: "rgba(15, 23, 42, 0.6)", borderRadius: "12px", padding: "20px", border: "1px solid rgba(212, 175, 55, 0.15)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ color: "#d4af37", margin: 0 }}><i className="fa-solid fa-award" style={{ marginRight: "10px" }}></i> ლეგენდარული სპორტსმენები</h2>
            <button onClick={() => { setIsFormOpen(true); setSelectedRecord(null); }} style={{ background: "#d4af37", color: "#121418", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
              <i className="fa-solid fa-plus"></i> დამატება
            </button>
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "15px" }}>
            <input type="text" placeholder="ძებნა..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ flex: 1, minWidth: "150px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212, 175, 55, 0.3)", padding: "8px", borderRadius: "8px", color: "#fff", outline: "none" }} />
            <input type="number" placeholder="წელი (დან)" value={periodStart} onChange={e => setPeriodStart(e.target.value)} style={{ width: "90px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212, 175, 55, 0.3)", padding: "8px", borderRadius: "8px", color: "#fff", outline: "none" }} />
            <input type="number" placeholder="წელი (მდე)" value={periodEnd} onChange={e => setPeriodEnd(e.target.value)} style={{ width: "90px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212, 175, 55, 0.3)", padding: "8px", borderRadius: "8px", color: "#fff", outline: "none" }} />
            <select value={titleFilter} onChange={e => setTitleFilter(e.target.value)} style={{ width: "150px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212, 175, 55, 0.3)", padding: "8px", borderRadius: "8px", color: "#fff", outline: "none" }}>
              <option value="">ყველა ტიტული</option>
              {allTitles.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Grid/List */}
          <div style={{ flex: 1, overflowY: "auto", display: "grid", gridTemplateColumns: "1fr", gap: "10px", alignContent: "start" }}>
            {filteredRecords.map(r => (
              <div key={r.id} onClick={() => { setSelectedRecord(r); setIsFormOpen(false); setIsFullscreenOpen(true); }} style={{ display: "flex", alignItems: "center", gap: "15px", padding: "15px", borderRadius: "8px", background: selectedRecord?.id === r.id ? "rgba(212, 175, 55, 0.1)" : "rgba(0,0,0,0.2)", border: `1px solid ${selectedRecord?.id === r.id ? '#d4af37' : 'rgba(255,255,255,0.05)'}`, cursor: "pointer", transition: "0.2s" }}>
                {r.profilePhoto ? (
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", border: selectedRecord?.id === r.id ? "1.5px solid #d4af37" : "1.5px solid rgba(212, 175, 55, 0.4)" }}>
                    <img src={r.profilePhoto} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Profile" />
                  </div>
                ) : (
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: selectedRecord?.id === r.id ? "1.5px solid #d4af37" : "1.5px solid rgba(212, 175, 55, 0.4)" }}>
                    <i className="fa-solid fa-user" style={{ color: selectedRecord?.id === r.id ? "#d4af37" : "rgba(255,255,255,0.3)" }}></i>
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "16px", color: "#fff" }}>{r.firstName} {r.lastName}</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>{r.birthYear} - {r.deathYear}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Detail OR Form */}
        {isFormOpen && (
          <MemorialForm
            onSave={handleSave}
            onCancel={() => setIsFormOpen(false)}
          />
        )}

        {selectedRecord && !isFormOpen && (
          <div style={{ flex: 1, backgroundColor: "rgba(15, 23, 42, 0.6)", borderRadius: "12px", padding: "30px", border: "1px solid rgba(212, 175, 55, 0.15)", overflowY: "auto", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                {selectedRecord.profilePhoto ? (
                  <div style={{ width: "80px", height: "80px", borderRadius: "50%", overflow: "hidden", border: "3px solid #d4af37", boxShadow: "0 0 15px rgba(212, 175, 55, 0.4)" }}>
                    <img src={selectedRecord.profilePhoto} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Profile" />
                  </div>
                ) : (
                  <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid #d4af37", boxShadow: "0 0 15px rgba(212, 175, 55, 0.4)" }}>
                    <i className="fa-solid fa-user" style={{ color: "#d4af37", fontSize: "24px" }}></i>
                  </div>
                )}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <h2 style={{ margin: "0 0 5px 0", color: "#fff", fontSize: "28px" }}>{selectedRecord.firstName} {selectedRecord.lastName}</h2>
                    <span style={{
                      backgroundColor: "rgba(212, 175, 55, 0.1)",
                      border: "1px solid #d4af37",
                      color: "#d4af37",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: "bold"
                    }}>
                      ლეგენდარული სპორტსმენები
                    </span>
                  </div>
                  <div style={{ color: "#d4af37", fontSize: "16px", marginTop: "5px", fontWeight: "bold" }}>ცხოვრების წლები: {selectedRecord.birthYear} - {selectedRecord.deathYear}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={handlePrint} style={{ background: "transparent", border: "1px solid #d4af37", color: "#d4af37", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", transition: "all 0.3s" }} onMouseOver={e => { e.currentTarget.style.background = "rgba(212, 175, 55, 0.1)"; e.currentTarget.style.boxShadow = "0 0 10px rgba(212, 175, 55, 0.3)"; }} onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}>
                  <i className="fa-solid fa-print"></i> ამობეჭდვა / PDF
                </button>
                <button onClick={() => setIsFullscreenOpen(true)} style={{ background: "transparent", border: "1px solid #d4af37", color: "#d4af37", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", transition: "all 0.3s" }} onMouseOver={e => { e.currentTarget.style.background = "rgba(212, 175, 55, 0.1)"; e.currentTarget.style.boxShadow = "0 0 10px rgba(212, 175, 55, 0.3)"; }} onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}>
                  <i className="fa-solid fa-expand"></i> გაფართოება
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "30px" }}>
              {selectedRecord.titles.map((t, i) => (
                <div key={i} style={{ padding: "6px 12px", background: "rgba(212, 175, 55, 0.05)", border: "1px solid #d4af37", borderRadius: "16px", fontSize: "13px", color: "#d4af37" }}>
                  {t}
                </div>
              ))}
            </div>

            <div>
              <h4 style={{ color: "rgba(255,255,255,0.5)", borderBottom: "1px solid rgba(212, 175, 55, 0.2)", paddingBottom: "10px", marginBottom: "15px" }}>ბიოგრაფია & მიღწევები</h4>
              <p style={{ color: "#e2e8f0", lineHeight: "1.8", whiteSpace: "pre-wrap" }}>
                {selectedRecord.biography}
              </p>
            </div>
            
            {selectedRecord.galleryPhotos && selectedRecord.galleryPhotos.length > 0 && (
              <div style={{ marginTop: "30px" }}>
                <h4 style={{ color: "rgba(255,255,255,0.5)", borderBottom: "1px solid rgba(212, 175, 55, 0.2)", paddingBottom: "10px", marginBottom: "15px" }}>ფოტო მასალა</h4>
                <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                  {selectedRecord.galleryPhotos.map((photo, idx) => (
                    <div key={idx} style={{ width: "120px", height: "120px", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", transition: "0.3s" }} onMouseOver={e => e.currentTarget.style.borderColor = "#d4af37"} onMouseOut={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}>
                      <img src={photo} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "0.3s" }} onMouseOver={e => e.currentTarget.style.transform = "scale(1.1)"} onMouseOut={e => e.currentTarget.style.transform = "scale(1)"} alt={`Gallery ${idx}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fullscreen modal overlay */}
      {isFullscreenOpen && selectedRecord && (
        <MemorialFullscreen
          record={selectedRecord}
          onClose={() => setIsFullscreenOpen(false)}
          onSave={handleFullscreenSave}
          onPrint={handlePrint}
        />
      )}
    </div>
  );
};

export default MemorialRegistryDashboard;
