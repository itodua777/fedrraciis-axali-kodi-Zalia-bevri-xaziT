import React from 'react';

const MapView = ({ clubs, onSelectClub }) => {
  const mapRef = React.useRef(null);
  const mapInstanceRef = React.useRef(null);
  const markersRef = React.useRef([]);

  React.useEffect(() => {
    if (!mapRef.current) return;
    const L = window.L;
    if (!L) {
      console.error("Leaflet not loaded on window.");
      return;
    }
    
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([42.3154, 43.3569], 7);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CartoDB',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    clubs.forEach(club => {
      if (club.lat && club.lng) {
        const markerHtml = `<div style="background-color: var(--color-emerald-core); width: 15px; height: 15px; border-radius: 50%; box-shadow: 0 0 10px var(--color-emerald-core), 0 0 20px var(--color-emerald-core); border: 2px solid #fff;"></div>`;
        const customIcon = L.divIcon({
          html: markerHtml,
          className: 'custom-leaflet-icon',
          iconSize: [15, 15],
          iconAnchor: [7.5, 7.5]
        });
        const marker = L.marker([club.lat, club.lng], { icon: customIcon }).addTo(map);
        
        marker.bindTooltip(`
          <div style="background: #121418; border: 1px solid var(--color-emerald-core); padding: 10px; border-radius: 8px; color: #fff;">
            <h4 style="margin: 0 0 5px 0; color: var(--color-emerald-core);">${club.name}</h4>
            <div style="font-size: 12px; color: rgba(255,255,255,0.7);">წევრები: ${club.members}</div>
            <div style="font-size: 12px; color: rgba(255,255,255,0.7);">ხელმძღვანელი: ${club.managerName}</div>
          </div>
        `);

        marker.on('click', () => onSelectClub(club));
        markersRef.current.push(marker);
      }
    });
  }, [clubs]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: '12px', border: '1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)' }}></div>;
};

const ClubsRegistryDashboard = ({ clubs, setClubs, selectedClubId, setSelectedClubId }) => {
  React.useEffect(() => {
    if (selectedClubId) {
      const match = clubs.find(c => String(c.id) === String(selectedClubId));
      if (match) {
        setSelectedClub(match);
        setViewMode('table');
        setIsFormOpen(false);
      }
    }
  }, [selectedClubId, clubs]);

  const [viewMode, setViewMode] = React.useState('table');
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedClub, setSelectedClub] = React.useState(null);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [regionFilter, setRegionFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [memberRange, setMemberRange] = React.useState(0);

  const [formData, setFormData] = React.useState({
    name: '', status: '', regNo: '', date: '', members: '', region: '', lat: '', lng: '',
    managerName: '', managerId: '', managerPhone: '', managerEmail: ''
  });
  const [error, setError] = React.useState('');

  const regions = ["თბილისი", "აჭარა", "გურია", "იმერეთი", "კახეთი", "მცხეთა-მთიანეთი", "რაჭა-ლეჩხუმი და ქვემო სვანეთი", "სამეგრელო-ზემო სვანეთი", "სამცხე-ჯავახეთი", "ქვემო ქართლი", "შიდა ქართლი"];
  const statuses = ["ააიპ", "შპს", "სკოლა", "სასწავლო ცენტრი"];

  const filteredClubs = clubs.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.regNo.includes(searchQuery);
    const matchesRegion = regionFilter ? c.region === regionFilter : true;
    const matchesStatus = statusFilter ? c.status === statusFilter : true;
    const matchesMembers = c.members >= memberRange;
    return matchesSearch && matchesRegion && matchesStatus && matchesMembers;
  });

  const handleSave = () => {
    if (!formData.name || !formData.status || !formData.regNo || !formData.date || !formData.region || !formData.managerName || !formData.managerId || !formData.managerPhone || !formData.managerEmail) {
      setError('გთხოვთ შეავსოთ ყველა სავალდებულო ველი.');
      return;
    }
    setClubs([...clubs, { ...formData, id: Date.now(), members: parseInt(formData.members) || 0, lat: parseFloat(formData.lat), lng: parseFloat(formData.lng) }]);
    setIsFormOpen(false);
    setFormData({ name: '', status: '', regNo: '', date: '', members: '', region: '', lat: '', lng: '', managerName: '', managerId: '', managerPhone: '', managerEmail: '' });
    setError('');
  };

  const inputStyle = { backgroundColor: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", padding: "10px", color: "#fff", outline: "none", width: "100%", boxSizing: "border-box", transition: "all 0.3s" };

  return (
    <div style={{ flex: 1, padding: "30px", display: "flex", gap: "20px", backgroundColor: "#121418", color: "#e2e8f0", overflow: "hidden", fontFamily: "sans-serif" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(15, 23, 42, 0.6)", padding: "20px", borderRadius: "12px", border: "1px solid color-mix(in oklab, var(--color-emerald-core) 10%, transparent)", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "color-mix(in oklab, var(--color-emerald-core) 10%, transparent)", border: "1px solid var(--color-emerald-core)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className="fa-solid fa-building-flag" style={{ color: "var(--color-emerald-core)", fontSize: "20px", textShadow: "0 0 10px var(--color-emerald-core)" }}></i>
            </div>
            <div>
              <h2 style={{ margin: 0, color: "#fff", fontSize: "20px" }}>კლუბების რეესტრი</h2>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>ფედერაციის წევრი ორგანიზაციების გეო-რუკა და ბაზა</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ display: "flex", backgroundColor: "rgba(0,0,0,0.3)", borderRadius: "8px", padding: "4px", border: "1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)" }}>
              <button onClick={() => setViewMode('table')} style={{ padding: "8px 16px", borderRadius: "6px", border: "none", background: viewMode === 'table' ? "var(--color-emerald-core)" : "transparent", color: viewMode === 'table' ? "#121418" : "#fff", fontWeight: "bold", cursor: "pointer", transition: "0.2s" }}>ცხრილი</button>
              <button onClick={() => setViewMode('map')} style={{ padding: "8px 16px", borderRadius: "6px", border: "none", background: viewMode === 'map' ? "var(--color-emerald-core)" : "transparent", color: viewMode === 'map' ? "#121418" : "#fff", fontWeight: "bold", cursor: "pointer", transition: "0.2s" }}>რუკა</button>
            </div>
            <button onClick={() => { setIsFormOpen(true); setSelectedClub(null); }} style={{ backgroundColor: "var(--color-emerald-core)", color: "#121418", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 15px color-mix(in oklab, var(--color-emerald-core) 30%, transparent)" }}>
              <i className="fa-solid fa-plus"></i> კლუბის დამატება
            </button>
          </div>
        </div>

        <div style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", padding: "15px", borderRadius: "12px", border: "1px solid color-mix(in oklab, var(--color-emerald-core) 10%, transparent)", display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "5px" }}>ძებნა (სახელი, ID)</label>
            <div style={{ position: "relative" }}>
              <i className="fa-solid fa-magnifying-glass" style={{ position: "absolute", left: "10px", top: "12px", color: "rgba(255,255,255,0.5)" }}></i>
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ ...inputStyle, paddingLeft: "35px" }} placeholder="ძებნა..." />
            </div>
          </div>
          <div style={{ width: "150px" }}>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "5px" }}>რეგიონი</label>
            <select value={regionFilter} onChange={e => setRegionFilter(e.target.value)} style={inputStyle}>
              <option value="">ყველა</option>
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div style={{ width: "150px" }}>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "5px" }}>სტატუსი</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={inputStyle}>
              <option value="">ყველა</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ width: "200px", paddingBottom: "5px" }}>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "5px" }}>მინ. წევრები: {memberRange}</label>
            <input type="range" min="0" max="1000" step="10" value={memberRange} onChange={e => setMemberRange(parseInt(e.target.value))} style={{ width: "100%", accentColor: "var(--color-emerald-core)" }} />
          </div>
        </div>

        <div style={{ flex: 1, backgroundColor: "rgba(15, 23, 42, 0.6)", borderRadius: "12px", border: "1px solid color-mix(in oklab, var(--color-emerald-core) 10%, transparent)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {viewMode === 'table' ? (
            <div style={{ flex: 1, overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead style={{ backgroundColor: "rgba(0,0,0,0.3)", position: "sticky", top: 0, zIndex: 10 }}>
                  <tr>
                    <th style={{ padding: "15px", textAlign: "left", color: "var(--color-emerald-core)", fontWeight: "bold" }}>დასახელება</th>
                    <th style={{ padding: "15px", textAlign: "left", color: "var(--color-emerald-core)", fontWeight: "bold" }}>სტატუსი / ID</th>
                    <th style={{ padding: "15px", textAlign: "left", color: "var(--color-emerald-core)", fontWeight: "bold" }}>რეგიონი</th>
                    <th style={{ padding: "15px", textAlign: "center", color: "var(--color-emerald-core)", fontWeight: "bold" }}>წევრები</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClubs.map(c => (
                    <tr key={c.id} onClick={() => { setSelectedClub(c); setIsFormOpen(false); setSelectedClubId(c.id); }} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer", backgroundColor: selectedClub?.id === c.id ? "color-mix(in oklab, var(--color-emerald-core) 10%, transparent)" : "transparent", transition: "0.2s" }} onMouseOver={e => { if(selectedClub?.id !== c.id) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)" }} onMouseOut={e => { if(selectedClub?.id !== c.id) e.currentTarget.style.backgroundColor = "transparent" }}>
                      <td style={{ padding: "15px", color: "#fff", fontWeight: "bold" }}>{c.name}</td>
                      <td style={{ padding: "15px", color: "rgba(255,255,255,0.7)" }}>
                        <span style={{ backgroundColor: "color-mix(in oklab, var(--color-emerald-core) 10%, transparent)", color: "var(--color-emerald-core)", padding: "2px 8px", borderRadius: "10px", fontSize: "12px", marginRight: "8px" }}>{c.status}</span>
                        {c.regNo}
                      </td>
                      <td style={{ padding: "15px", color: "rgba(255,255,255,0.7)" }}>{c.region}</td>
                      <td style={{ padding: "15px", textAlign: "center", color: "#10b981", fontWeight: "bold" }}>{c.members}</td>
                    </tr>
                  ))}
                  {filteredClubs.length === 0 && (
                    <tr><td colSpan="4" style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.4)" }}>მონაცემები ვერ მოიძებნა</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ flex: 1, position: "relative" }}>
              <MapView clubs={filteredClubs} onSelectClub={(club) => { setSelectedClub(club); setIsFormOpen(false); setSelectedClubId(club.id); }} />
            </div>
          )}
        </div>
      </div>

      {(isFormOpen || selectedClub) && (
        <div style={{ width: "400px", minWidth: "400px", backgroundColor: "rgba(15, 23, 42, 0.8)", borderRadius: "12px", padding: "25px", border: "1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)", display: "flex", flexDirection: "column", gap: "20px", overflowY: "auto", boxShadow: "-5px 0 25px rgba(0,0,0,0.5)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "15px" }}>
            <h3 style={{ margin: 0, color: "var(--color-emerald-core)", fontSize: "18px" }}>{isFormOpen ? "რეგისტრაცია" : "კლუბის დოსიე"}</h3>
            <i className="fa-solid fa-xmark" style={{ cursor: "pointer", fontSize: "18px", color: "rgba(255,255,255,0.5)" }} onClick={() => { setIsFormOpen(false); setSelectedClub(null); setSelectedClubId(null); }}></i>
          </div>

          {isFormOpen ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {error && <div style={{ color: "#ef4444", fontSize: "13px", background: "rgba(239, 68, 68, 0.1)", padding: "10px", borderRadius: "8px" }}>{error}</div>}
              
              <h4 style={{ margin: "10px 0 5px", color: "#fff", borderBottom: "1px dashed rgba(255,255,255,0.2)", paddingBottom: "5px" }}>🏢 ბლოკი A: იურიდიული მონაცემები</h4>
              <div>
                <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "5px" }}>დასახელება <span style={{color: '#ef4444'}}>*</span></label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} />
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "5px" }}>სტატუსი <span style={{color: '#ef4444'}}>*</span></label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={inputStyle}>
                    <option value="">აირჩიეთ</option>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "5px" }}>საიდენტ. ნომერი <span style={{color: '#ef4444'}}>*</span></label>
                  <input type="text" value={formData.regNo} onChange={e => setFormData({...formData, regNo: e.target.value})} style={inputStyle} maxLength="9" />
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "5px" }}>დაარსების თარიღი <span style={{color: '#ef4444'}}>*</span></label>
                  <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "5px" }}>წევრთა რ-ბა <span style={{color: '#ef4444'}}>*</span></label>
                  <input type="number" value={formData.members} onChange={e => setFormData({...formData, members: e.target.value})} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "5px" }}>რეგიონი <span style={{color: '#ef4444'}}>*</span></label>
                <select value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} style={inputStyle}>
                  <option value="">აირჩიეთ რეგიონი</option>
                  {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "5px" }}>Latitude (Lat)</label>
                  <input type="number" step="0.0001" value={formData.lat} onChange={e => setFormData({...formData, lat: e.target.value})} style={inputStyle} placeholder="41.7151" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "5px" }}>Longitude (Lng)</label>
                  <input type="number" step="0.0001" value={formData.lng} onChange={e => setFormData({...formData, lng: e.target.value})} style={inputStyle} placeholder="44.8271" />
                </div>
              </div>

              <h4 style={{ margin: "20px 0 5px", color: "#fff", borderBottom: "1px dashed rgba(255,255,255,0.2)", paddingBottom: "5px" }}>👤 ბლოკი B: ხელმძღვანელი</h4>
              <div>
                <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "5px" }}>სახელი და გვარი <span style={{color: '#ef4444'}}>*</span></label>
                <input type="text" value={formData.managerName} onChange={e => setFormData({...formData, managerName: e.target.value})} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "5px" }}>პირადი ნომერი <span style={{color: '#ef4444'}}>*</span></label>
                <input type="text" value={formData.managerId} onChange={e => setFormData({...formData, managerId: e.target.value})} style={inputStyle} maxLength="11" />
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "5px" }}>ტელეფონი <span style={{color: '#ef4444'}}>*</span></label>
                <input type="text" value={formData.managerPhone} onChange={e => setFormData({...formData, managerPhone: e.target.value})} style={inputStyle} placeholder="+995..." />
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "5px" }}>ელ-ფოსტა <span style={{color: '#ef4444'}}>*</span></label>
                <input type="email" value={formData.managerEmail} onChange={e => setFormData({...formData, managerEmail: e.target.value})} style={inputStyle} />
              </div>

              <button onClick={handleSave} style={{ background: "var(--color-emerald-core)", color: "#121418", border: "none", padding: "15px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", marginTop: "10px", boxShadow: "0 0 15px color-mix(in oklab, var(--color-emerald-core) 40%, transparent)" }}>შენახვა</button>
            </div>
          ) : selectedClub ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: "80px", height: "80px", margin: "0 auto 15px", backgroundColor: "color-mix(in oklab, var(--color-emerald-core) 10%, transparent)", border: "2px solid var(--color-emerald-core)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className="fa-solid fa-building" style={{ fontSize: "32px", color: "var(--color-emerald-core)" }}></i>
                </div>
                <h3 style={{ margin: "0 0 5px 0", color: "#fff", fontSize: "22px" }}>{selectedClub.name}</h3>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>{selectedClub.region}</div>
              </div>
              
              <div style={{ backgroundColor: "rgba(0,0,0,0.3)", borderRadius: "12px", padding: "15px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px" }}>
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>სტატუსი:</span>
                  <span style={{ color: "#fff", fontWeight: "bold" }}>{selectedClub.status}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px" }}>
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>საიდენტ. კოდი:</span>
                  <span style={{ color: "#fff", fontWeight: "bold" }}>{selectedClub.regNo}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px" }}>
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>დაარსდა:</span>
                  <span style={{ color: "#fff", fontWeight: "bold" }}>{selectedClub.date}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>წევრები:</span>
                  <span style={{ color: "#10b981", fontWeight: "bold", fontSize: "16px" }}>{selectedClub.members}</span>
                </div>
              </div>

              <h4 style={{ margin: "10px 0 0", color: "var(--color-emerald-core)", borderBottom: "1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)", paddingBottom: "5px" }}>ხელმძღვანელი</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <i className="fa-solid fa-user-tie" style={{ color: "rgba(255,255,255,0.5)", width: "20px" }}></i>
                  <span style={{ color: "#fff", fontWeight: "bold" }}>{selectedClub.managerName}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
                  <i className="fa-regular fa-id-card" style={{ color: "rgba(255,255,255,0.5)", width: "20px" }}></i>
                  <span style={{ color: "rgba(255,255,255,0.8)" }}>{selectedClub.managerId}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
                  <i className="fa-solid fa-phone" style={{ color: "rgba(255,255,255,0.5)", width: "20px" }}></i>
                  <span style={{ color: "rgba(255,255,255,0.8)" }}>{selectedClub.managerPhone}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
                  <i className="fa-solid fa-envelope" style={{ color: "rgba(255,255,255,0.5)", width: "20px" }}></i>
                  <span style={{ color: "rgba(255,255,255,0.8)" }}>{selectedClub.managerEmail}</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ClubsRegistryDashboard;
