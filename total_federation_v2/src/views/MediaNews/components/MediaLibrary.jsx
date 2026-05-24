import React from 'react';

const MediaLibrary = ({
  assets,
  setAssets,
  albums,
  setAlbums,
  selectedAlbum,
  setSelectedAlbum,
  selectedAsset,
  setSelectedAsset,
  newAlbumName,
  setNewAlbumName,
  isCreatingAlbum,
  setIsCreatingAlbum,
  handleMediaUpload,
  handleDragOver,
  handleDragLeave,
  handleDrop
}) => {
  const panelStyle = {
    backgroundColor: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(34, 211, 238, 0.1)",
    borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
    overflowY: "auto"
  };

  const inputStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px", padding: "12px", color: "#fff", outline: "none", width: "100%", boxSizing: "border-box",
    transition: "all 0.3s"
  };

  const focusStyle = (e) => {
    e.target.style.borderColor = "#22d3ee";
    e.target.style.boxShadow = "0 0 8px rgba(34, 211, 238, 0.3)";
  };

  const blurStyle = (e) => {
    e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
    e.target.style.boxShadow = "none";
  };

  const primaryBtnStyle = {
    backgroundColor: "#22d3ee", color: "#121418", border: "none", padding: "12px 20px",
    borderRadius: "8px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.3s"
  };

  const filteredAssets = assets.filter(asset => asset.album === selectedAlbum);

  return (
    <div style={{ ...panelStyle, flex: 2, display: "flex", flexDirection: "row", gap: "20px", backgroundColor: "transparent", border: "none", boxShadow: "none", padding: 0 }}>
      <div style={{ flex: selectedAsset ? 2 : 1, display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ ...panelStyle, flex: "none" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", flexWrap: "wrap", gap: "10px" }}>
            <h2 style={{ color: "#fff", margin: 0 }}>მედია ბიბლიოთეკა</h2>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {isCreatingAlbum ? (
                <div style={{ display: "flex", gap: "6px", alignItems: "center", animation: "fadeIn 0.2s ease" }}>
                  <input
                    type="text"
                    placeholder="ალბომის სახელი..."
                    style={{ ...inputStyle, padding: "6px 10px", width: "150px", fontSize: "13px" }}
                    value={newAlbumName}
                    onChange={e => setNewAlbumName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        const name = newAlbumName.trim();
                        if (name && !albums.includes(name)) {
                          setAlbums([...albums, name]);
                          setSelectedAlbum(name);
                          setNewAlbumName("");
                          setIsCreatingAlbum(false);
                        }
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const name = newAlbumName.trim();
                      if (name && !albums.includes(name)) {
                        setAlbums([...albums, name]);
                        setSelectedAlbum(name);
                        setNewAlbumName("");
                        setIsCreatingAlbum(false);
                      }
                    }}
                    style={{ ...primaryBtnStyle, padding: "6px 10px" }}
                  >
                    <i className="fa-solid fa-check"></i>
                  </button>
                  <button
                    onClick={() => {
                      setNewAlbumName("");
                      setIsCreatingAlbum(false);
                    }}
                    style={{ ...primaryBtnStyle, padding: "6px 10px", backgroundColor: "rgba(239, 68, 68, 0.2)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)" }}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsCreatingAlbum(true)}
                  style={{ ...primaryBtnStyle, backgroundColor: "transparent", border: "1px solid #22d3ee", color: "#22d3ee", padding: "6px 12px", fontSize: "13px" }}
                  onMouseOver={e => e.target.style.backgroundColor = "rgba(34, 211, 238, 0.1)"}
                  onMouseOut={e => e.target.style.backgroundColor = "transparent"}
                >
                  <i className="fa-solid fa-folder-plus"></i> ახალი ალბომი
                </button>
              )}

              <button style={primaryBtnStyle} onClick={() => document.getElementById('media-library-upload-input').click()}>
                <i className="fa-solid fa-cloud-arrow-up"></i> მედიის ატვირთვა
              </button>
              <input
                type="file"
                id="media-library-upload-input"
                multiple
                accept="image/*"
                style={{ display: "none" }}
                onChange={e => handleMediaUpload(e.target.files)}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "10px", marginBottom: "15px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            {albums.map((name, idx) => {
              const isActive = selectedAlbum === name;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedAlbum(name);
                    setSelectedAsset(null);
                  }}
                  style={{
                    backgroundColor: isActive ? "#22d3ee" : "rgba(255, 255, 255, 0.05)",
                    color: isActive ? "#121418" : "#fff",
                    border: isActive ? "none" : "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "20px",
                    padding: "6px 14px",
                    fontSize: "13px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.3s",
                    whiteSpace: "nowrap"
                  }}
                >
                  <i className={`fa-solid ${isActive ? 'fa-folder-open' : 'fa-folder'}`} style={{ color: isActive ? "#121418" : "#22d3ee" }}></i>
                  {name}
                </button>
              );
            })}
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('media-library-upload-input').click()}
            style={{
              border: "2px dashed rgba(34, 211, 238, 0.3)",
              borderRadius: "12px",
              padding: "30px",
              textAlign: "center",
              color: "rgba(255,255,255,0.5)",
              cursor: "pointer",
              transition: "all 0.3s"
            }}
          >
            <i className="fa-solid fa-folder-open" style={{ fontSize: "28px", marginBottom: "8px", color: "#22d3ee" }} ></i>
            <div style={{ fontSize: "14px" }}>Drag-and-drop ზონა მასიური ატვირთვისთვის</div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "4px" }}>
              ატვირთული ფაილები დაჯგუფდება ალბომში: <strong style={{ color: "#22d3ee" }}>{selectedAlbum}</strong>
            </div>
          </div>
        </div>

        <div style={{ ...panelStyle, flex: 1 }}>
          <h3 style={{ margin: "0 0 15px 0", color: "#fff", fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>ფაილები ალბომში: <strong style={{ color: "#22d3ee" }}>{selectedAlbum}</strong></span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{filteredAssets.length} ფაილი</span>
          </h3>

          {filteredAssets.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "150px", color: "rgba(255,255,255,0.2)" }}>
              <i className="fa-regular fa-image" style={{ fontSize: "40px", marginBottom: "8px" }}></i>
              <span style={{ fontSize: "13px" }}>ამ ალბომში ფაილები ჯერ არ არის</span>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "15px" }}>
              {filteredAssets.map(asset => (
                <div
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  style={{
                    backgroundColor: "#121418",
                    borderRadius: "8px",
                    overflow: "hidden",
                    cursor: "pointer",
                    border: selectedAsset?.id === asset.id ? "2px solid #22d3ee" : "2px solid transparent",
                    transition: "all 0.3s"
                  }}
                  onMouseOver={e => e.currentTarget.style.borderColor = selectedAsset?.id === asset.id ? "#22d3ee" : "rgba(34, 211, 238, 0.5)"}
                  onMouseOut={e => e.currentTarget.style.borderColor = selectedAsset?.id === asset.id ? "#22d3ee" : "transparent"}
                >
                  <div style={{ height: "90px", backgroundColor: "rgba(255,255,255,0.05)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {asset.url ? (
                      <img src={asset.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={asset.name} />
                    ) : (
                      <i className="fa-solid fa-image" style={{ fontSize: "28px", color: "rgba(255,255,255,0.2)" }}></i>
                    )}
                  </div>
                  <div style={{ padding: "8px", fontSize: "11px", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {asset.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedAsset && (
        <div style={{ ...panelStyle, flex: 1, minWidth: "250px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ margin: 0, color: "#22d3ee" }}>დეტალები</h3>
            <i className="fa-solid fa-xmark" style={{ cursor: "pointer", color: "#fff" }} onClick={() => setSelectedAsset(null)}></i>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div style={{ height: "130px", backgroundColor: "rgba(0,0,0,0.3)", borderRadius: "8px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {selectedAsset.url ? (
                <img src={selectedAsset.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={selectedAsset.name} />
              ) : (
                <i className="fa-solid fa-image" style={{ fontSize: "40px", color: "rgba(255,255,255,0.2)" }}></i>
              )}
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>დასახელება</label>
              <input type="text" style={inputStyle} value={selectedAsset.name} onChange={e => {
                const newAssets = assets.map(a => a.id === selectedAsset.id ? { ...a, name: e.target.value } : a);
                setAssets(newAssets);
                setSelectedAsset({ ...selectedAsset, name: e.target.value });
              }} onFocus={focusStyle} onBlur={blurStyle} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>კატეგორია / ალბომი</label>
              <select style={inputStyle} value={selectedAsset.album} onChange={e => {
                const newAssets = assets.map(a => a.id === selectedAsset.id ? { ...a, album: e.target.value } : a);
                setAssets(newAssets);
                setSelectedAsset({ ...selectedAsset, album: e.target.value });
              }} onFocus={focusStyle} onBlur={blurStyle}>
                <option value="">აირჩიეთ ალბომი</option>
                {albums.map((alb, index) => (
                  <option key={index} value={alb}>{alb}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>ტეგები</label>
              <input type="text" style={inputStyle} placeholder="მაგ: #თოკი, #მწვერვალი" value={selectedAsset.tags} onChange={e => {
                const newAssets = assets.map(a => a.id === selectedAsset.id ? { ...a, tags: e.target.value } : a);
                setAssets(newAssets);
                setSelectedAsset({ ...selectedAsset, tags: e.target.value });
              }} onFocus={focusStyle} onBlur={blurStyle} />
            </div>
            <button style={{ ...primaryBtnStyle, backgroundColor: "transparent", border: "1px solid #22d3ee", color: "#22d3ee" }} onMouseOver={e => { e.target.style.backgroundColor = "rgba(34, 211, 238, 0.1)"; e.target.style.boxShadow = "0 0 10px rgba(34, 211, 238, 0.3)"; }} onMouseOut={e => { e.target.style.backgroundColor = "transparent"; e.target.style.boxShadow = "none"; }} onClick={() => setSelectedAsset(null)}>
              <i className="fa-solid fa-floppy-disk"></i> შენახვა
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
