import React from 'react';

const RouteForm = ({
  formData,
  setFormData,
  isEditMode,
  addWaypoint,
  removeWaypoint,
  updateWaypoint,
  toggleTag,
  handleSave,
  handleCancel
}) => {
  const inputStyle = { width: "100%", padding: "10px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", outline: "none", boxSizing: "border-box", marginBottom: "15px" };
  const labelStyle = { fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "5px" };
  const blockTitleStyle = { color: "#22d3ee", margin: "0 0 15px 0", fontSize: "16px", borderBottom: "1px dashed rgba(255,255,255,0.2)", paddingBottom: "5px", display: "flex", justifyContent: "space-between", alignItems: "center" };
  const availableTags = ['ნაშალი ქვები', 'კლდოვანი ქედი', 'თოვლის საფარი', 'მყინვარი', 'ყინულოვანი კედელი'];

  return (
    <div style={{ width: "450px", display: "flex", flexDirection: "column", borderRight: "1px solid rgba(34, 211, 238, 0.2)", backgroundColor: "rgba(15, 23, 42, 0.9)", padding: "20px", overflowY: "auto", zIndex: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "10px", border: "1px solid #22d3ee", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(34, 211, 238, 0.1)" }}>
          <i className="fa-solid fa-mountain" style={{ color: "#22d3ee", fontSize: "20px", textShadow: "0 0 10px #22d3ee" }}></i>
        </div>
        <div>
          <h2 style={{ margin: 0, color: "#fff", fontSize: "20px" }}>{isEditMode ? 'რედაქტირება' : 'ახალი მარშრუტი'}</h2>
          <div style={{ fontSize: "12px", color: "#22d3ee" }}>{isEditMode ? 'აქტიური ფორმა: Edit Mode' : 'აქტიური ფორმა: Create Mode'}</div>
        </div>
      </div>

      <h3 style={blockTitleStyle}>🏔️ ბლოკი A: საბაზისო & ტექნიკური</h3>
      <label style={labelStyle}>მარშრუტის დასახელება და ლოკაცია</label>
      <input type="text" style={inputStyle} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />

      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>კატეგორია</label>
          <select style={inputStyle} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
            <option value="1B">1B</option><option value="2A">2A</option><option value="2B">2B</option>
            <option value="3A">3A</option><option value="3B">3B</option><option value="4A">4A</option>
            <option value="4B">4B</option><option value="5A">5A</option><option value="5B">5B</option>
            <option value="6A">6A</option><option value="6B">6B</option>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>სიმაღლე (მ)</label>
          <input type="number" style={inputStyle} value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} />
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ flex: 2 }}>
          <label style={labelStyle}>საწყისი წერტილი</label>
          <input type="text" style={inputStyle} value={formData.startPoint} onChange={e => setFormData({...formData, startPoint: e.target.value})} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>ექსპედიციის დრო</label>
          <input type="text" style={inputStyle} value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
        </div>
      </div>

      <h3 style={blockTitleStyle}>
        📍 3D გზის წერტილები (Waypoints)
        <button onClick={addWaypoint} style={{ background: "rgba(34,211,238,0.1)", border: "1px solid #22d3ee", color: "#22d3ee", borderRadius: "4px", padding: "4px 8px", fontSize: "12px", cursor: "pointer" }}>+ დამატება</button>
      </h3>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "15px" }}>
        {formData.waypoints.map((wp, index) => (
          <div key={wp.id} style={{ backgroundColor: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", padding: "10px", borderRadius: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <span style={{ fontSize: "12px", color: "#22d3ee" }}>Point {index + 1}</span>
              <button onClick={() => removeWaypoint(index)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "12px" }}><i className="fa-solid fa-trash"></i></button>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ flex: 1 }}>
                <input type="number" step="0.0001" placeholder="Lat (X)" style={{ ...inputStyle, marginBottom: "5px", padding: "6px", fontSize: "12px" }} value={wp.lat} onChange={e => updateWaypoint(index, 'lat', e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <input type="number" step="0.0001" placeholder="Long (Y)" style={{ ...inputStyle, marginBottom: "5px", padding: "6px", fontSize: "12px" }} value={wp.lng} onChange={e => updateWaypoint(index, 'lng', e.target.value)} />
              </div>
            </div>
            <input type="text" placeholder="წერტილის სახელი / Z (Elevation)" style={{ ...inputStyle, marginBottom: 0, padding: "6px", fontSize: "12px" }} value={wp.label} onChange={e => updateWaypoint(index, 'label', e.target.value)} />
          </div>
        ))}
      </div>

      <h3 style={blockTitleStyle}>📋 ბლოკი B: რელიეფი & აღწერა</h3>
      <label style={labelStyle}>რელიეფის თავისებურებები</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "15px" }}>
        {availableTags.map(tag => (
          <div key={tag} onClick={() => toggleTag(tag)} style={{ padding: "6px 12px", borderRadius: "16px", fontSize: "12px", cursor: "pointer", border: `1px solid ${formData.terrainTags.includes(tag) ? '#22d3ee' : 'rgba(255,255,255,0.2)'}`, backgroundColor: formData.terrainTags.includes(tag) ? "rgba(34, 211, 238, 0.1)" : "transparent", color: formData.terrainTags.includes(tag) ? "#22d3ee" : "rgba(255,255,255,0.5)", transition: "all 0.2s" }}>
            {tag}
          </div>
        ))}
      </div>

      <label style={labelStyle}>მისასვლელი გზა (Base Camp)</label>
      <textarea style={{...inputStyle, resize: "vertical", height: "40px"}} value={formData.approach} onChange={e => setFormData({...formData, approach: e.target.value})}></textarea>
      
      <label style={labelStyle}>მარშრუტის გავლა</label>
      <textarea style={{...inputStyle, resize: "vertical", height: "40px"}} value={formData.routeDescription} onChange={e => setFormData({...formData, routeDescription: e.target.value})}></textarea>
      
      <label style={labelStyle}>დაშვება</label>
      <textarea style={{...inputStyle, resize: "vertical", height: "40px"}} value={formData.descent} onChange={e => setFormData({...formData, descent: e.target.value})}></textarea>

      <div style={{ display: "flex", gap: "10px", marginTop: "20px", marginBottom: "20px" }}>
        <button onClick={handleCancel} style={{ flex: 1, padding: "12px", background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", transition: "all 0.3s" }}>
          გაუქმება
        </button>
        <button onClick={handleSave} style={{ flex: 2, padding: "12px", background: "#22d3ee", color: "#121418", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 0 15px rgba(34, 211, 238, 0.3)", transition: "all 0.3s" }}>
          {isEditMode ? 'ცვლილებების შენახვა' : 'მარშრუტის შენახვა'}
        </button>
      </div>
    </div>
  );
};

export default RouteForm;
