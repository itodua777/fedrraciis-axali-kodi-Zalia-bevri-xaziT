import React from 'react';
import { useRatingSettingsStore, calculateRating } from '../../context/ratingSettingsStore.js';
import { useRanksStore } from '../../context/ranksStore.js';
import { generateUUID, checkAndApplyRankUp } from '../../utils/helpers.js';
import { getPersistedPeaks } from '../../utils/peaks.js';
import PeakAddForm from './components/PeakAddForm.jsx';

const PeaksDashboard = ({ athletes = [], onUpdateAthlete }) => {
  const { uiaaDictionary = {}, uiaaStyleMultipliers = {} } = useRatingSettingsStore();
  const uiaaOptions = Object.keys(uiaaDictionary);
  const styleOptions = Object.keys(uiaaStyleMultipliers);

  const [regAthleteId, setRegAthleteId] = React.useState('');
  const [regRoute, setRegRoute] = React.useState('');
  const [regYear, setRegYear] = React.useState(new Date().getFullYear());
  const [regDate, setRegDate] = React.useState('');
  const [regCategory, setRegCategory] = React.useState('');
  const [regStyle, setRegStyle] = React.useState('');
  const [regResultText, setRegResultText] = React.useState('');

  const handleClimbRegister = () => {
    if (!regAthleteId || !regYear || !regCategory || !regStyle) {
      alert("გთხოვთ შეავსოთ აუცილებელი ველები (სპორტსმენი, წელი, კატეგორია, სტილი)!");
      return;
    }

    const athlete = athletes.find(a => a.id === regAthleteId);
    if (!athlete) {
      alert("არჩეული სპორტსმენი ვერ მოიძებნა!");
      return;
    }

    const points = calculateRating(selectedPeak.height, regCategory, regStyle);
    const oldReferral = Number(athlete.referral || 0);
    const newReferral = oldReferral + points;

    const newActivity = {
      id: generateUUID(),
      year: parseInt(regYear),
      date: regDate || undefined,
      title: selectedPeak.name,
      peak: selectedPeak.name,
      route: regRoute || undefined,
      achievement: `${regResultText || 'წარმატებული ასვლა'} (+${points} რეიტინგი, სტილი: ${regStyle}, კატეგორია: ${regCategory})`,
      result: `${regResultText || 'წარმატებული ასვლა'} (+${points} რეიტინგი, სტილი: ${regStyle}, კატეგორია: ${regCategory})`,
      type: 'expedition'
    };

    const updatedAchievements = athlete.achievements ? [...athlete.achievements, newActivity] : [newActivity];
    const finalAchievements = checkAndApplyRankUp({ ...athlete, achievements: updatedAchievements }, oldReferral, newReferral);

    onUpdateAthlete({
      ...athlete,
      referral: newReferral,
      achievements: finalAchievements
    });

    alert(`ასვლა წარმატებით დარეგისტრირდა! სპორტსმენს დაერიცხა ${points} ქულა.`);
    
    // Reset form fields
    setRegAthleteId('');
    setRegRoute('');
    setRegYear(new Date().getFullYear());
    setRegDate('');
    setRegCategory('');
    setRegStyle('');
    setRegResultText('');
  };

  const [peaks, setPeaks] = React.useState(getPersistedPeaks());
  const [selectedPeak, setSelectedPeak] = React.useState(null);
  const [isAdding, setIsAdding] = React.useState(false);
  const [viewMode, setViewMode] = React.useState('map'); // 'map' or 'table'
  const [isMapFullscreen, setIsMapFullscreen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [systemFilter, setSystemFilter] = React.useState('');
  const [heightFilter, setHeightFilter] = React.useState('');
  const mapRef = React.useRef(null);
  const mapInstanceRef = React.useRef(null);
  const markersRef = React.useRef({});
  
  const [formData, setFormData] = React.useState({
    name: '', height: '', system: '', continent: '', region: '', difficulty: '',
    isBorderZone: false, borderCountries: [], lat: '', lng: '', firstAscent: '', description: '', photo: null
  });

  const availableSystems = ["კავკასიონი", "ჰიმალაი", "ალპები", "ანდები", "კორდილიერები", "პამირი", "ტიან-შანი"];
  const availableContinents = ["ევროპა", "აზია", "აფრიკა", "ჩრდ. ამერიკა", "სამხრ. ამერიკა", "ანტარქტიდა", "ოკეანეთი"];
  const availableDifficulties = ["1B", "2A", "2B", "3A", "3B", "4A", "4B", "5A", "5B", "6A", "6B"];
  const availableCountries = ["საქართველო", "რუსეთი", "თურქეთი", "სომხეთი", "აზერბაიჯანი", "ჩინეთი", "ნეპალი", "ინდოეთი"];

  // ESC key listener to exit fullscreen
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMapFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Invalidate Leaflet map size when fullscreen changes
  React.useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 100);
    }
  }, [isMapFullscreen]);

  // Filtered Peaks computation
  const filteredPeaks = peaks.filter(p => {
    const nameMatch = p.name ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    const regionMatch = p.region ? p.region.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    const difficultyMatch = p.difficulty ? p.difficulty.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    const matchesSearch = searchQuery ? (nameMatch || regionMatch || difficultyMatch) : true;
    
    const matchesSystem = systemFilter ? p.system === systemFilter : true;
    
    let matchesHeight = true;
    if (heightFilter === 'high') {
      matchesHeight = Number(p.height) > 4000;
    } else if (heightFilter === 'medium') {
      matchesHeight = Number(p.height) >= 3000 && Number(p.height) <= 4000;
    } else if (heightFilter === 'low') {
      matchesHeight = Number(p.height) < 3000;
    }
    
    return matchesSearch && matchesSystem && matchesHeight;
  });

  React.useEffect(() => {
    const L = window.L;
    if (viewMode === 'map' && mapRef.current && !mapInstanceRef.current && L) {
      mapInstanceRef.current = L.map(mapRef.current).setView([42.3154, 43.3569], 7);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
      }).addTo(mapInstanceRef.current);
    }
    
    if (mapInstanceRef.current && L) {
      Object.values(markersRef.current).forEach(m => m.remove());
      markersRef.current = {};
      
      filteredPeaks.forEach(peak => {
        if (peak.lat && peak.lng) {
          const color = peak.isBorderZone ? '#f59e0b' : 'var(--color-emerald-core)';
          const markerHtml = `<div style="width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 20px solid ${color}; filter: drop-shadow(0 0 5px ${color});"></div>`;
          const icon = L.divIcon({ html: markerHtml, className: 'custom-peak-icon', iconSize: [20, 20], iconAnchor: [10, 20] });
          const marker = L.marker([peak.lat, peak.lng], { icon }).addTo(mapInstanceRef.current);
          marker.bindPopup(`<b>${peak.name}</b><br/>${peak.height} მ`);
          marker.on('click', () => { setSelectedPeak(peak); setIsAdding(false); });
          markersRef.current[peak.id] = marker;
        }
      });
    }
  }, [viewMode, filteredPeaks]);

  React.useEffect(() => {
    if (selectedPeak && mapInstanceRef.current && selectedPeak.lat && selectedPeak.lng) {
      mapInstanceRef.current.flyTo([selectedPeak.lat, selectedPeak.lng], 12, { duration: 1.5 });
    }
  }, [selectedPeak]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setFormData({...formData, photo: reader.result});
      reader.readAsDataURL(file);
    }
  };

  const toggleBorderCountry = (country) => {
    if (formData.borderCountries.includes(country)) {
      setFormData({...formData, borderCountries: formData.borderCountries.filter(c => c !== country)});
    } else {
      setFormData({...formData, borderCountries: [...formData.borderCountries, country]});
    }
  };

  const handleSave = () => {
    const newPeak = { ...formData, id: Date.now() };
    const updatedPeaks = [...peaks, newPeak];
    setPeaks(updatedPeaks);
    localStorage.setItem('peaksStore', JSON.stringify(updatedPeaks));
    setIsAdding(false);
    setSelectedPeak(newPeak);
    setFormData({ name: '', height: '', system: '', continent: '', region: '', difficulty: '', isBorderZone: false, borderCountries: [], lat: '', lng: '', firstAscent: '', description: '', photo: null });
  };

  const inputStyle = { width: "100%", padding: "10px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", outline: "none", boxSizing: "border-box", marginBottom: "15px" };
  const labelStyle = { fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "5px" };

  return (
    <div style={{ flex: 1, padding: "20px", backgroundColor: "#121418", color: "#e2e8f0", display: "flex", gap: "20px", overflow: "hidden", fontFamily: "sans-serif" }}>
      {/* Left Panel: List */}
      <div style={isMapFullscreen ? {
        position: "fixed",
        top: "80px",
        left: "20px",
        bottom: "20px",
        width: "300px",
        backgroundColor: "rgba(13, 15, 18, 0.85)",
        backdropFilter: "blur(12px)",
        borderRadius: "12px",
        border: "1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)",
        display: "flex",
        flexDirection: "column",
        padding: "15px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6)",
        zIndex: 10000
      } : {
        width: "300px",
        backgroundColor: "rgba(15, 23, 42, 0.6)",
        borderRadius: "12px",
        border: "1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)",
        display: "flex",
        flexDirection: "column",
        padding: "15px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <h3 style={{ margin: 0, color: "var(--color-emerald-core)", textShadow: "0 0 10px color-mix(in oklab, var(--color-emerald-core) 50%, transparent)" }}>მწვერვალები</h3>
          <button onClick={() => { setIsAdding(true); setSelectedPeak(null); }} style={{ background: "var(--color-emerald-core)", color: "#121418", border: "none", padding: "6px 12px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 0 15px color-mix(in oklab, var(--color-emerald-core) 50%, transparent)" }}>
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>

        {/* Search and Filters */}
        <div style={{ marginBottom: "15px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="ძებნა..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px 8px 32px",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                border: "1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)",
                borderRadius: "6px",
                color: "#fff",
                fontSize: "13px",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
            <i className="fa-solid fa-magnifying-glass" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "rgba(255, 255, 255, 0.4)", fontSize: "12px" }}></i>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <select
              value={systemFilter}
              onChange={(e) => setSystemFilter(e.target.value)}
              style={{
                flex: 1,
                padding: "6px 8px",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "6px",
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "11px",
                outline: "none"
              }}
            >
              <option value="">ყველა ქედი</option>
              {availableSystems.map(sys => <option key={sys} value={sys}>{sys}</option>)}
            </select>

            <select
              value={heightFilter}
              onChange={(e) => setHeightFilter(e.target.value)}
              style={{
                flex: 1,
                padding: "6px 8px",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "6px",
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "11px",
                outline: "none"
              }}
            >
              <option value="">სიმაღლე</option>
              <option value="high">&gt; 4000მ</option>
              <option value="medium">3000მ-4000მ</option>
              <option value="low">&lt; 3000მ</option>
            </select>
          </div>
        </div>
        
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
          {filteredPeaks.map(p => (
            <div key={p.id} onClick={() => { setSelectedPeak(p); setIsAdding(false); }} style={{ padding: "10px", backgroundColor: selectedPeak?.id === p.id ? "color-mix(in oklab, var(--color-emerald-core) 10%, transparent)" : "rgba(255,255,255,0.05)", border: `1px solid ${selectedPeak?.id === p.id ? 'var(--color-emerald-core)' : 'transparent'}`, borderRadius: "8px", cursor: "pointer", transition: "all 0.3s" }}>
              <div style={{ fontWeight: "bold", color: "#fff" }}>{p.name} {p.isBorderZone && <i className="fa-solid fa-shield-halved" style={{ color: "#f59e0b", fontSize: "10px", marginLeft: "5px" }}></i>}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>{p.height} მ | {p.continent}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Center Panel: Map/Table View */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "15px", position: "relative" }}>
        {!isMapFullscreen && (
          <div style={{ display: "flex", gap: "10px", position: "absolute", top: "10px", left: "10px", zIndex: 1000 }}>
            <button onClick={() => setViewMode('map')} style={{ padding: "8px 16px", backgroundColor: viewMode === 'map' ? "var(--color-emerald-core)" : "rgba(15, 23, 42, 0.8)", color: viewMode === 'map' ? "#121418" : "#fff", border: "1px solid var(--color-emerald-core)", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", transition: "all 0.3s" }}>
              <i className="fa-solid fa-map"></i> რუკა
            </button>
            <button onClick={() => setViewMode('table')} style={{ padding: "8px 16px", backgroundColor: viewMode === 'table' ? "var(--color-emerald-core)" : "rgba(15, 23, 42, 0.8)", color: viewMode === 'table' ? "#121418" : "#fff", border: "1px solid var(--color-emerald-core)", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", transition: "all 0.3s" }}>
              <i className="fa-solid fa-table"></i> ცხრილი
            </button>
          </div>
        )}
        
        {viewMode === 'map' && (
          <div 
            className={isMapFullscreen ? "is-fullscreen-map" : ""}
            style={isMapFullscreen ? {
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 9998,
              margin: 0,
              padding: 0,
              borderRadius: 0,
              border: "none",
              boxShadow: "none"
            } : {
              flex: 1,
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
              position: "relative"
            }}
          >
            {/* Fullscreen header controls */}
            {isMapFullscreen && (
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "60px",
                backgroundColor: "rgba(13, 15, 18, 0.85)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderBottom: "1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 20px",
                zIndex: 9999,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)"
              }}>
                <button 
                  onClick={() => setIsMapFullscreen(false)}
                  style={{
                    background: "rgba(15, 23, 42, 0.9)",
                    border: "1px solid color-mix(in oklab, var(--color-emerald-core) 40%, transparent)",
                    color: "#e2e8f0",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.3s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = "var(--color-emerald-core)"; e.currentTarget.style.borderColor = "var(--color-emerald-core)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#e2e8f0"; e.currentTarget.style.borderColor = "color-mix(in oklab, var(--color-emerald-core) 40%, transparent)"; }}
                >
                  <i className="fa-solid fa-compress"></i> პატარა ფანჯარაში დაბრუნება
                </button>

                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#fff", textShadow: "0 0 10px color-mix(in oklab, var(--color-emerald-core) 30%, transparent)" }}>
                  მწვერვალების გეო-რეესტრი
                </div>

                <button 
                  onClick={() => setIsMapFullscreen(false)}
                  style={{
                    background: "rgba(15, 23, 42, 0.9)",
                    border: "1px solid rgba(239, 68, 68, 0.4)",
                    color: "#e2e8f0",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.3s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.borderColor = "#ef4444"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#e2e8f0"; e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.4)"; }}
                >
                  <i className="fa-solid fa-xmark"></i> დახურვა
                </button>
              </div>
            )}

            {/* Maximize trigger button */}
            {!isMapFullscreen && (
              <button 
                onClick={() => setIsMapFullscreen(true)}
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  zIndex: 1000,
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  border: "1px solid color-mix(in oklab, var(--color-emerald-core) 40%, transparent)",
                  padding: "10px",
                  borderRadius: "8px",
                  color: "rgba(255, 255, 255, 0.7)",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                  transition: "all 0.3s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                title="რუკის მთელ ეკრანზე გაშლა"
                onMouseEnter={e => { e.currentTarget.style.color = "var(--color-emerald-core)"; e.currentTarget.style.borderColor = "var(--color-emerald-core)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)"; e.currentTarget.style.borderColor = "color-mix(in oklab, var(--color-emerald-core) 40%, transparent)"; }}
              >
                <i className="fa-solid fa-expand" style={{ fontSize: "14px" }}></i>
              </button>
            )}

            <div ref={mapRef} style={{ width: "100%", height: "100%" }}></div>
          </div>
        )}
        
        {viewMode === 'table' && (
          <div style={{ flex: 1, backgroundColor: "rgba(15, 23, 42, 0.6)", borderRadius: "12px", border: "1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)", padding: "20px", overflowY: "auto", marginTop: "50px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)" }}>
             <table style={{ width: "100%", borderCollapse: "collapse" }}>
               <thead>
                 <tr>
                   <th style={{ textAlign: "left", padding: "10px", color: "var(--color-emerald-core)", borderBottom: "1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)", fontSize: "14px", textTransform: "uppercase" }}>სახელი</th>
                   <th style={{ textAlign: "left", padding: "10px", color: "var(--color-emerald-core)", borderBottom: "1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)", fontSize: "14px", textTransform: "uppercase" }}>სიმაღლე</th>
                   <th style={{ textAlign: "left", padding: "10px", color: "var(--color-emerald-core)", borderBottom: "1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)", fontSize: "14px", textTransform: "uppercase" }}>სისტემა</th>
                   <th style={{ textAlign: "left", padding: "10px", color: "var(--color-emerald-core)", borderBottom: "1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)", fontSize: "14px", textTransform: "uppercase" }}>სირთულე</th>
                 </tr>
               </thead>
               <tbody>
                 {peaks.map(p => (
                   <tr key={p.id} onClick={() => { setSelectedPeak(p); setIsAdding(false); }} style={{ cursor: "pointer", backgroundColor: selectedPeak?.id === p.id ? "color-mix(in oklab, var(--color-emerald-core) 10%, transparent)" : "transparent", transition: "all 0.2s" }}>
                     <td style={{ padding: "15px 10px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{p.name} {p.isBorderZone && <i className="fa-solid fa-shield-halved" style={{ color: "#f59e0b", marginLeft: "5px" }}></i>}</td>
                     <td style={{ padding: "15px 10px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{p.height} მ</td>
                     <td style={{ padding: "15px 10px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{p.system}</td>
                     <td style={{ padding: "15px 10px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{p.difficulty}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}
      </div>

      {/* Right Panel: Detail / Form */}
      {(selectedPeak || isAdding) && (
        <div style={isMapFullscreen ? {
          position: "fixed",
          top: "80px",
          right: "20px",
          bottom: "20px",
          width: "400px",
          backgroundColor: "rgba(13, 15, 18, 0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRadius: "12px",
          border: "1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)",
          padding: "20px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6)",
          zIndex: 10000
        } : {
          width: "400px",
          backgroundColor: "rgba(15, 23, 42, 0.6)",
          borderRadius: "12px",
          border: "1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)",
          padding: "20px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)"
        }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ margin: 0, color: "var(--color-emerald-core)", textShadow: "0 0 10px color-mix(in oklab, var(--color-emerald-core) 30%, transparent)" }}>{isAdding ? "ახალი მწვერვალი" : "მწვერვალის პროფილი"}</h3>
            <i className="fa-solid fa-xmark" style={{ cursor: "pointer", color: "#fff", fontSize: "18px" }} onClick={() => { setSelectedPeak(null); setIsAdding(false); }}></i>
          </div>

          {isAdding ? (
            <PeakAddForm
              formData={formData}
              setFormData={setFormData}
              handlePhotoUpload={handlePhotoUpload}
              toggleBorderCountry={toggleBorderCountry}
              handleSave={handleSave}
              setIsAdding={setIsAdding}
            />
          ) : (
            selectedPeak && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ position: "relative", width: "100%", height: "200px", borderRadius: "12px", overflow: "hidden", border: `2px solid ${selectedPeak.isBorderZone ? '#f59e0b' : 'var(--color-emerald-core)'}`, boxShadow: `0 0 15px ${selectedPeak.isBorderZone ? 'rgba(245, 158, 11, 0.3)' : 'color-mix(in oklab, var(--color-emerald-core) 30%, transparent)'}` }}>
                  <img src={selectedPeak.photo || "https://via.placeholder.com/400x200"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", padding: "40px 20px 20px 20px", background: "linear-gradient(transparent, rgba(0,0,0,0.9))", display: "flex", flexDirection: "column" }}>
                    <h2 style={{ margin: 0, color: "#fff", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>{selectedPeak.name}</h2>
                    <div style={{ color: "var(--color-emerald-core)", fontWeight: "bold", textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}>{selectedPeak.height} მ</div>
                  </div>
                </div>

                {selectedPeak.isBorderZone && (
                  <div style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", border: "1px solid #f59e0b", padding: "15px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#f59e0b", fontWeight: "bold" }}>
                      <i className="fa-solid fa-triangle-exclamation"></i> სასაზღვრო ზონა გაფრთხილება
                    </div>
                    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                      {selectedPeak.borderCountries.map(c => (
                        <span key={c} style={{ backgroundColor: "#f59e0b", color: "#000", padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold" }}>{c}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                  <div style={{ backgroundColor: "rgba(0,0,0,0.3)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginBottom: "4px" }}>სისტემა</div>
                    <div style={{ color: "#fff", fontSize: "14px", fontWeight: "bold" }}>{selectedPeak.system}</div>
                  </div>
                  <div style={{ backgroundColor: "rgba(0,0,0,0.3)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginBottom: "4px" }}>კონტინენტი</div>
                    <div style={{ color: "#fff", fontSize: "14px", fontWeight: "bold" }}>{selectedPeak.continent}</div>
                  </div>
                  <div style={{ backgroundColor: "rgba(0,0,0,0.3)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginBottom: "4px" }}>რეგიონი</div>
                    <div style={{ color: "#fff", fontSize: "14px", fontWeight: "bold" }}>{selectedPeak.region}</div>
                  </div>
                  <div style={{ backgroundColor: "rgba(0,0,0,0.3)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginBottom: "4px" }}>სირთულე</div>
                    <div style={{ color: "var(--color-emerald-core)", fontSize: "16px", fontWeight: "bold", textShadow: "0 0 5px color-mix(in oklab, var(--color-emerald-core) 40%, transparent)" }}>{selectedPeak.difficulty}</div>
                  </div>
                </div>

                <div style={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: "8px", padding: "15px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <h4 style={{ color: "var(--color-emerald-core)", margin: "0 0 15px 0", borderBottom: "1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)", paddingBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <i className="fa-solid fa-book-open"></i> ისტორიული ანალები
                  </h4>
                  <div style={{ marginBottom: "15px" }}>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "5px" }}>პირველი ასვლა</div>
                    <p style={{ fontSize: "14px", color: "#fff", margin: 0, fontWeight: "500", backgroundColor: "rgba(255,255,255,0.05)", padding: "10px", borderRadius: "6px", borderLeft: "3px solid var(--color-emerald-core)" }}>
                      {selectedPeak.firstAscent}
                    </p>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "5px" }}>აღწერა</div>
                    <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", margin: 0, lineHeight: "1.6" }}>{selectedPeak.description}</p>
                  </div>
                </div>

                {/* Ascent Registration Form */}
                {onUpdateAthlete && (
                  <div style={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: "8px", padding: "15px", border: "1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)", display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px" }}>
                    <h4 style={{ color: "var(--color-emerald-core)", margin: "0 0 10px 0", borderBottom: "1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)", paddingBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                      🧗 ასვლის რეგისტრაცია
                    </h4>
                    
                    <div>
                      <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "4px" }}>სპორტსმენი *</label>
                      <select
                        value={regAthleteId}
                        onChange={e => setRegAthleteId(e.target.value)}
                        style={{ ...inputStyle, marginBottom: 0 }}
                      >
                        <option value="">აირჩიეთ სპორტსმენი...</option>
                        {athletes
                          .filter(a => a.isFederationMember && a.membershipStatus === 'Active')
                          .map(a => (
                            <option key={a.id} value={a.id}>{a.firstName} {a.lastName} (ID: {a.id})</option>
                          ))
                        }
                      </select>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      <div>
                        <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "4px" }}>წელი *</label>
                        <input
                          type="number"
                          value={regYear}
                          onChange={e => setRegYear(e.target.value)}
                          style={{ ...inputStyle, marginBottom: 0 }}
                          placeholder="2025"
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "4px" }}>თარიღი</label>
                        <input
                          type="text"
                          value={regDate}
                          onChange={e => setRegDate(e.target.value)}
                          style={{ ...inputStyle, marginBottom: 0 }}
                          placeholder="მაგ: 15 მაისი"
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "4px" }}>მარშრუტი</label>
                      <input
                        type="text"
                        value={regRoute}
                        onChange={e => setRegRoute(e.target.value)}
                        style={{ ...inputStyle, marginBottom: 0 }}
                        placeholder="მაგ: სამხრეთ ქედი"
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      <div>
                        <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "4px" }}>UIAA კატეგორია *</label>
                        <select
                          value={regCategory}
                          onChange={e => setRegCategory(e.target.value)}
                          style={{ ...inputStyle, marginBottom: 0 }}
                        >
                          <option value="">აირჩიეთ...</option>
                          {uiaaOptions.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "4px" }}>ასვლის სტილი *</label>
                        <select
                          value={regStyle}
                          onChange={e => setRegStyle(e.target.value)}
                          style={{ ...inputStyle, marginBottom: 0 }}
                        >
                          <option value="">აირჩიეთ...</option>
                          {styleOptions.map(st => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "4px" }}>შედეგი / მიღწევა</label>
                      <textarea
                        value={regResultText}
                        onChange={e => setRegResultText(e.target.value)}
                        style={{ ...inputStyle, marginBottom: 0, height: "50px", resize: "none" }}
                        placeholder="მაგ: ჟანგბადის გარეშე, ოქროს ყინულცული"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleClimbRegister}
                      style={{
                        backgroundColor: "var(--color-emerald-core)",
                        color: "#121418",
                        border: "none",
                        padding: "10px",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        boxShadow: "0 0 10px color-mix(in oklab, var(--color-emerald-core) 30%, transparent)",
                        transition: "all 0.3s",
                        marginTop: "5px"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 15px color-mix(in oklab, var(--color-emerald-core) 50%, transparent)"; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 10px color-mix(in oklab, var(--color-emerald-core) 30%, transparent)"; }}
                    >
                      რეგისტრაცია
                    </button>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default PeaksDashboard;
