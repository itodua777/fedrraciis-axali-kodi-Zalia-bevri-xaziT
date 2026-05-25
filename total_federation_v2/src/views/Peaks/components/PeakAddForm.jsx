import React from 'react';

const PeakAddForm = ({
  formData,
  setFormData,
  handlePhotoUpload,
  toggleBorderCountry,
  handleSave,
  setIsAdding
}) => {
  const availableSystems = ["კავკასიონი", "ჰიმალაი", "ალპები", "ანდები", "კორდილიერები", "პამირი", "ტიან-შანი"];
  const availableContinents = ["ევროპა", "აზია", "აფრიკა", "ჩრდ. ამერიკა", "სამხრ. ამერიკა", "ანტარქტიდა", "ოკეანეთი"];
  const availableDifficulties = ["1B", "2A", "2B", "3A", "3B", "4A", "4B", "5A", "5B", "6A", "6B"];
  const availableCountries = ["საქართველო", "რუსეთი", "თურქეთი", "სომხეთი", "აზერბაიჯანი", "ჩინეთი", "ნეპალი", "ინდოეთი"];

  const inputStyle = { width: "100%", padding: "10px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", outline: "none", boxSizing: "border-box", marginBottom: "15px" };
  const labelStyle = { fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "5px" };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ backgroundColor: "rgba(0,0,0,0.3)", padding: "15px", borderRadius: "8px", marginBottom: "15px", border: "1px solid rgba(255,255,255,0.05)" }}>
        <h4 style={{ color: "#fff", margin: "0 0 15px 0" }}>🏔️ ბლოკი A: იდენტობა</h4>
        <label style={labelStyle}>სახელი</label>
        <input type="text" style={inputStyle} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="მაგ. უშბა" />
        
        <label style={labelStyle}>სიმაღლე (მ)</label>
        <input type="number" style={inputStyle} value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} placeholder="მაგ. 4710" />
        
        <label style={labelStyle}>მთათა სისტემა / ქედი</label>
        <select style={inputStyle} value={formData.system} onChange={e => setFormData({...formData, system: e.target.value})}>
          <option value="">აირჩიეთ...</option>
          {availableSystems.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <label style={labelStyle}>კონტინენტი</label>
        <select style={inputStyle} value={formData.continent} onChange={e => setFormData({...formData, continent: e.target.value})}>
          <option value="">აირჩიეთ...</option>
          {availableContinents.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <label style={labelStyle}>მდებარეობა / რეგიონი</label>
        <input type="text" style={inputStyle} value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} placeholder="მაგ. სვანეთი" />

        <label style={labelStyle}>სირთულის კატეგორია</label>
        <select style={inputStyle} value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})}>
          <option value="">აირჩიეთ...</option>
          {availableDifficulties.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div style={{ backgroundColor: "rgba(0,0,0,0.3)", padding: "15px", borderRadius: "8px", marginBottom: "15px", border: "1px solid rgba(255,255,255,0.05)" }}>
        <h4 style={{ color: "#fff", margin: "0 0 15px 0" }}>🪪 ბლოკი B: სასაზღვრო სტატუსი</h4>
        <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", marginBottom: formData.isBorderZone ? "15px" : "0" }}>
          <input type="checkbox" checked={formData.isBorderZone} onChange={e => setFormData({...formData, isBorderZone: e.target.checked, borderCountries: []})} style={{ width: "16px", height: "16px", accentColor: "var(--color-emerald-core)" }} />
          <span style={{ color: "#fff" }}>სასაზღვრო ზონა</span>
        </label>
        
        {formData.isBorderZone && (
          <div>
            <label style={labelStyle}>მოსაზღვრე ქვეყნები</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {availableCountries.map(c => (
                <div key={c} onClick={() => toggleBorderCountry(c)} style={{ padding: "6px 12px", borderRadius: "16px", fontSize: "12px", cursor: "pointer", border: `1px solid ${formData.borderCountries.includes(c) ? '#f59e0b' : 'rgba(255,255,255,0.2)'}`, backgroundColor: formData.borderCountries.includes(c) ? "rgba(245, 158, 11, 0.1)" : "transparent", color: formData.borderCountries.includes(c) ? "#f59e0b" : "rgba(255,255,255,0.5)", transition: "all 0.2s" }}>
                  {c}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ backgroundColor: "rgba(0,0,0,0.3)", padding: "15px", borderRadius: "8px", marginBottom: "15px", border: "1px solid rgba(255,255,255,0.05)" }}>
        <h4 style={{ color: "#fff", margin: "0 0 15px 0" }}>📍 ბლოკი C: ლოკაცია & მედია</h4>
        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Latitude (განედი)</label>
            <input type="number" step="0.0001" style={inputStyle} value={formData.lat} onChange={e => setFormData({...formData, lat: e.target.value})} placeholder="43.1242" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Longitude (გრძედი)</label>
            <input type="number" step="0.0001" style={inputStyle} value={formData.lng} onChange={e => setFormData({...formData, lng: e.target.value})} placeholder="42.6421" />
          </div>
        </div>
        <label style={labelStyle}>პროფილის ფოტო</label>
        <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{...inputStyle, padding: "5px"}} />
        {formData.photo && <img src={formData.photo} style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }} />}
      </div>

      <div style={{ backgroundColor: "rgba(0,0,0,0.3)", padding: "15px", borderRadius: "8px", marginBottom: "20px", border: "1px solid rgba(255,255,255,0.05)" }}>
        <h4 style={{ color: "#fff", margin: "0 0 15px 0" }}>📜 ბლოკი D: ისტორია</h4>
        <label style={labelStyle}>პირველი ასვლა</label>
        <textarea style={{...inputStyle, resize: "vertical", height: "60px"}} value={formData.firstAscent} onChange={e => setFormData({...formData, firstAscent: e.target.value})} placeholder="ვინ, როდის..."></textarea>
        
        <label style={labelStyle}>ვრცელი აღწერა</label>
        <textarea style={{...inputStyle, resize: "vertical", height: "100px"}} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
      </div>

      <button onClick={handleSave} style={{ width: "100%", padding: "15px", background: "var(--color-emerald-core)", color: "#121418", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 0 15px color-mix(in oklab, var(--color-emerald-core) 40%, transparent)", transition: "all 0.3s" }}>
        შენახვა ბაზაში
      </button>
    </div>
  );
};

export default PeakAddForm;
