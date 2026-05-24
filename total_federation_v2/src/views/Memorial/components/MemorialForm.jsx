import React from 'react';

const MemorialForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    birthYear: '',
    deathYear: '',
    biography: '',
    titles: [],
    profilePhoto: null,
    galleryPhotos: []
  });
  const [newTitle, setNewTitle] = React.useState('');
  const [error, setError] = React.useState('');

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryPhotosChange = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(
      files.map(file => new Promise(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      }))
    ).then(results => {
      setFormData(prev => ({ ...prev, galleryPhotos: [...prev.galleryPhotos, ...results] }));
    });
  };

  const handleSaveClick = () => {
    if (!formData.firstName || !formData.lastName || !formData.birthYear || !formData.deathYear) {
      setError('შეავსეთ სავალდებულო ველები');
      return;
    }
    if (parseInt(formData.deathYear) < parseInt(formData.birthYear)) {
      setError('გარდაცვალების წელი არ შეიძლება იყოს დაბადების წელზე ნაკლები');
      return;
    }
    onSave(formData);
    setError('');
  };

  return (
    <div style={{ flex: 1, backgroundColor: "rgba(15, 23, 42, 0.6)", borderRadius: "12px", padding: "20px", border: "1px solid rgba(212, 175, 55, 0.15)", display: "flex", flexDirection: "column", gap: "15px", overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, color: "#d4af37" }}>ახალი ჩანაწერის შექმნა</h3>
        <i className="fa-solid fa-xmark" style={{ cursor: "pointer", fontSize: "18px" }} onClick={onCancel}></i>
      </div>
      {error && (
        <div style={{ color: "#ef4444", fontSize: "14px", backgroundColor: "rgba(239, 68, 68, 0.1)", padding: "10px", borderRadius: "8px" }}>
          {error}
        </div>
      )}
      
      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "5px" }}>სახელი</label>
          <input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} style={{ width: "100%", padding: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "5px" }}>გვარი</label>
          <input type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} style={{ width: "100%", padding: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", outline: "none", boxSizing: "border-box" }} />
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "5px" }}>დაბადების წელი</label>
          <input type="number" value={formData.birthYear} onChange={e => setFormData({...formData, birthYear: e.target.value})} style={{ width: "100%", padding: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "5px" }}>გარდაცვალების წელი</label>
          <input type="number" value={formData.deathYear} onChange={e => setFormData({...formData, deathYear: e.target.value})} style={{ width: "100%", padding: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", outline: "none", boxSizing: "border-box" }} />
        </div>
      </div>

      <div>
        <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "5px" }}>ტიტულები (Dynamic Chips)</label>
        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "10px" }}>
          {formData.titles.map((t, idx) => (
            <div key={idx} style={{ padding: "4px 8px", background: "rgba(212, 175, 55, 0.1)", border: "1px solid #d4af37", borderRadius: "16px", fontSize: "12px", color: "#d4af37", display: "flex", alignItems: "center", gap: "5px" }}>
              {t} <i className="fa-solid fa-xmark" style={{ cursor: "pointer" }} onClick={() => setFormData({...formData, titles: formData.titles.filter((_, i) => i !== idx)})}></i>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <input type="text" placeholder="მაგ. სპორტის ოსტატი" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ flex: 1, padding: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", outline: "none" }} />
          <button onClick={() => { if(newTitle) { setFormData({...formData, titles: [...formData.titles, newTitle]}); setNewTitle(''); } }} style={{ background: "transparent", border: "1px solid #d4af37", color: "#d4af37", borderRadius: "8px", padding: "0 15px", cursor: "pointer" }}>+ დამატება</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "15px" }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "5px" }}>პროფილის ფოტო</label>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px dashed rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
              {formData.profilePhoto ? <img src={formData.profilePhoto} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Profile" /> : <i className="fa-solid fa-user" style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px" }}></i>}
            </div>
            <input type="file" accept="image/*" onChange={handleProfilePhotoChange} style={{ flex: 1, padding: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", outline: "none", fontSize: "12px", width: "100%" }} />
          </div>
        </div>
        
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "5px" }}>ფოტო მასალა / გალერეა</label>
          <input type="file" accept="image/*" multiple onChange={handleGalleryPhotosChange} style={{ width: "100%", padding: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", outline: "none", fontSize: "12px", boxSizing: "border-box" }} />
        </div>
      </div>

      {formData.galleryPhotos.length > 0 && (
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: "8px" }}>
          {formData.galleryPhotos.map((photo, idx) => (
            <div key={idx} style={{ position: "relative", width: "50px", height: "50px", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
              <img src={photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={`Gallery ${idx}`} />
              <i className="fa-solid fa-xmark" style={{ position: "absolute", top: "2px", right: "2px", background: "rgba(0,0,0,0.6)", color: "#fff", borderRadius: "50%", padding: "2px", cursor: "pointer", fontSize: "10px" }} onClick={() => setFormData(prev => ({ ...prev, galleryPhotos: prev.galleryPhotos.filter((_, i) => i !== idx) }))}></i>
            </div>
          ))}
        </div>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "5px" }}>ისტორიის აღწერა</label>
        <textarea value={formData.biography} onChange={e => setFormData({...formData, biography: e.target.value})} style={{ flex: 1, width: "100%", padding: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", outline: "none", resize: "none", boxSizing: "border-box", minHeight: "150px" }}></textarea>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={handleSaveClick} style={{ background: "#d4af37", color: "#121418", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>შენახვა</button>
      </div>
    </div>
  );
};

export default MemorialForm;
