import React from 'react';

const MemorialFullscreenEdit = ({ editForm, setEditForm, newEditTitle, setNewEditTitle }) => {
  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, profilePhoto: reader.result }));
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
      setEditForm(prev => ({ ...prev, galleryPhotos: [...(prev.galleryPhotos || []), ...results] }));
    });
  };

  const handleRemoveTitle = (idx) => {
    setEditForm(prev => ({
      ...prev,
      titles: prev.titles.filter((_, i) => i !== idx)
    }));
  };

  const handleAddTitle = () => {
    if (newEditTitle) {
      setEditForm(prev => ({
        ...prev,
        titles: [...prev.titles, newEditTitle]
      }));
      setNewEditTitle('');
    }
  };

  const handleRemoveGalleryPhoto = (idx) => {
    setEditForm(prev => ({
      ...prev,
      galleryPhotos: prev.galleryPhotos.filter((_, i) => i !== idx)
    }));
  };

  return (
    <>
      {/* Profile Card Header Inside Modal */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "24px",
        padding: "20px",
        backgroundColor: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(212, 175, 55, 0.2)",
        borderRadius: "12px"
      }}>
        {/* Photo Frame */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
          <div style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "3px solid #d4af37",
            boxShadow: "0 0 15px rgba(212, 175, 55, 0.4)",
            position: "relative"
          }}>
            {editForm.profilePhoto ? (
              <img src={editForm.profilePhoto} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Profile" />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="fa-solid fa-user" style={{ color: "#d4af37", fontSize: "32px" }}></i>
              </div>
            )}
          </div>
          <input type="file" accept="image/*" onChange={handleProfilePhotoChange} style={{ fontSize: "11px", width: "180px" }} />
        </div>

        {/* Name & Basic details */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>სახელი</label>
              <input type="text" value={editForm.firstName || ''} onChange={e => setEditForm({...editForm, firstName: e.target.value})} style={{ width: "100%", padding: "8px", background: "#1e222b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>გვარი</label>
              <input type="text" value={editForm.lastName || ''} onChange={e => setEditForm({...editForm, lastName: e.target.value})} style={{ width: "100%", padding: "8px", background: "#1e222b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff" }} />
            </div>
          </div>

          {/* Life years */}
          <div style={{ display: "flex", gap: "30px", marginTop: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: "15px" }}>
              <div>
                <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>დაბადების წელი</label>
                <input type="number" value={editForm.birthYear || ''} onChange={e => setEditForm({...editForm, birthYear: parseInt(e.target.value) || ''})} style={{ width: "100px", padding: "8px", background: "#1e222b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff" }} />
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>გარდაცვალების წელი</label>
                <input type="number" value={editForm.deathYear || ''} onChange={e => setEditForm({...editForm, deathYear: parseInt(e.target.value) || ''})} style={{ width: "100px", padding: "8px", background: "#1e222b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Body Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", flex: 1 }}>
        
        {/* Left Column: Historical Achievements */}
        <div style={{
          backgroundColor: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(212, 175, 55, 0.15)",
          borderRadius: "12px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "15px"
        }}>
          <h3 style={{ margin: 0, color: "#d4af37", borderBottom: "1px solid rgba(212, 175, 55, 0.2)", paddingBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
            🏛️ ისტორიული მიღწევები
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "15px", flex: 1 }}>
            {/* Dynamic Chips list with delete */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", maxHeight: "200px", overflowY: "auto" }}>
              {(editForm.titles || []).map((t, idx) => (
                <div key={idx} style={{ padding: "6px 12px", background: "rgba(212, 175, 55, 0.1)", border: "1px solid #d4af37", borderRadius: "16px", fontSize: "13px", color: "#d4af37", display: "flex", alignItems: "center", gap: "8px" }}>
                  {t}
                  <i className="fa-solid fa-xmark" style={{ cursor: "pointer", color: "#ef4444" }} onClick={() => handleRemoveTitle(idx)}></i>
                </div>
              ))}
            </div>
            
            {/* Add new title inputs */}
            <div style={{ display: "flex", gap: "10px", marginTop: "auto" }}>
              <input
                type="text"
                placeholder="ახალი მიღწევა / ტიტული"
                value={newEditTitle}
                onChange={e => setNewEditTitle(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#1e222b",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#fff"
                }}
              />
              <button
                type="button"
                onClick={handleAddTitle}
                style={{
                  background: "transparent",
                  border: "1px solid #d4af37",
                  color: "#d4af37",
                  borderRadius: "8px",
                  padding: "0 16px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                + დამატება
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Biography & Narrative */}
        <div style={{
          backgroundColor: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(212, 175, 55, 0.15)",
          borderRadius: "12px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "15px"
        }}>
          <h3 style={{ margin: 0, color: "#d4af37", borderBottom: "1px solid rgba(212, 175, 55, 0.2)", paddingBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
            📝 ბიოგრაფია & TIMELINE ნარატივი
          </h3>

          <textarea
            value={editForm.biography || ''}
            onChange={e => setEditForm({...editForm, biography: e.target.value})}
            style={{
              flex: 1,
              padding: "15px",
              background: "#1e222b",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "#fff",
              resize: "none",
              fontFamily: "inherit",
              lineHeight: "1.6",
              minHeight: "300px"
            }}
            placeholder="აღწერეთ ლეგენდის ბიოგრაფია..."
          />
        </div>

      </div>

      {/* Gallery Section inside Modal */}
      <div style={{
        backgroundColor: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(212, 175, 55, 0.15)",
        borderRadius: "12px",
        padding: "24px"
      }}>
        <h4 style={{ color: "rgba(255,255,255,0.5)", borderBottom: "1px solid rgba(212, 175, 55, 0.2)", paddingBottom: "10px", marginBottom: "15px" }}>ფოტო მასალა / გალერეა</h4>
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "15px" }}>
          {editForm.galleryPhotos && editForm.galleryPhotos.map((photo, idx) => (
            <div key={idx} style={{ position: "relative", width: "100px", height: "100px", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
              <img src={photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={`Gallery ${idx}`} />
              <i className="fa-solid fa-xmark" style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(0,0,0,0.6)", color: "#fff", borderRadius: "50%", padding: "4px", cursor: "pointer", fontSize: "12px" }} onClick={() => handleRemoveGalleryPhoto(idx)}></i>
            </div>
          ))}
        </div>
        <input type="file" accept="image/*" multiple onChange={handleGalleryPhotosChange} style={{ width: "100%", padding: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", outline: "none", fontSize: "13px", boxSizing: "border-box" }} />
      </div>
    </>
  );
};

export default MemorialFullscreenEdit;
