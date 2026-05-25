import React from 'react';

const SpaceEditForm = ({
  handleEditSubmit,
  handleCloseEditModal,
  editName, setEditName,
  editOwnerType, setEditOwnerType,
  editArea, setEditArea,
  editCapacity, setEditCapacity,
  editStatus, setEditStatus
}) => {
  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backdropFilter: "blur(5px)"
  };

  const modalStyle = {
    width: "100%",
    maxWidth: "600px",
    maxHeight: "90vh",
    backgroundColor: "#161b22",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
    fontFamily: "sans-serif"
  };

  return (
    <div style={modalOverlayStyle} onClick={handleCloseEditModal}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 30px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <h2 style={{ color: "#fff", margin: 0, fontSize: "18px" }}>სავარჯიშო სივრცის რედაქტირება</h2>
          <button onClick={handleCloseEditModal} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "20px" }}><i className="fa-solid fa-xmark"></i></button>
        </div>
        
        <form onSubmit={handleEditSubmit} style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "25px" }}>
          <div>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", marginBottom: "5px", display: "block" }}>სივრცის დასახელება *</label>
            <input type="text" placeholder="მაგ: მეკლდეურობის ზონა" value={editName} onChange={e => setEditName(e.target.value)} required style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.02)", color: "#fff", boxSizing: "border-box" }} />
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", marginBottom: "5px", display: "block" }}>ტიპი *</label>
            <div style={{ display: "flex", gap: "0", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden", backgroundColor: "rgba(255,255,255,0.02)" }}>
              <button type="button" onClick={() => setEditOwnerType('FEDERATION')} style={{ flex: 1, padding: "12px", backgroundColor: editOwnerType === 'FEDERATION' ? "rgba(15, 23, 42, 0.8)" : "transparent", color: editOwnerType === 'FEDERATION' ? "var(--color-emerald-core)" : "rgba(255,255,255,0.5)", border: "none", cursor: "pointer", transition: "all 0.3s" }}>საჯარო სივრცე</button>
              <button type="button" onClick={() => setEditOwnerType('PRIVATE')} style={{ flex: 1, padding: "12px", backgroundColor: editOwnerType === 'PRIVATE' ? "rgba(15, 23, 42, 0.8)" : "transparent", color: editOwnerType === 'PRIVATE' ? "var(--color-emerald-core)" : "rgba(255,255,255,0.5)", border: "none", cursor: "pointer", transition: "all 0.3s" }}>კერძო საკუთრება</button>
            </div>
          </div>
          
          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", marginBottom: "5px", display: "block" }}>ფართობი (კვ.მ)</label>
              <div style={{ position: "relative" }}>
                <input type="number" placeholder="120" value={editArea} onChange={e => setEditArea(e.target.value)} style={{ width: "100%", padding: "12px 55px 12px 12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.02)", color: "#fff", boxSizing: "border-box" }} />
                <span style={{ position: "absolute", right: "12px", top: "12px", color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>კვ.მ</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", marginBottom: "5px", display: "block" }}>მოცულობა (მაქს. სპორტსმენი)</label>
              <div style={{ position: "relative" }}>
                <input type="number" placeholder="25" value={editCapacity} onChange={e => setEditCapacity(e.target.value)} style={{ width: "100%", padding: "12px 55px 12px 12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.02)", color: "#fff", boxSizing: "border-box" }} />
                <span style={{ position: "absolute", right: "12px", top: "12px", color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>სპორტ.</span>
              </div>
            </div>
          </div>
          
          <div>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", marginBottom: "5px", display: "block" }}>მიმდინარე სტატუსი</label>
            <div style={{ display: "flex", gap: "0", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden", backgroundColor: "rgba(255,255,255,0.02)" }}>
              <button type="button" onClick={() => setEditStatus('OPEN')} style={{ flex: 1, padding: "12px", backgroundColor: editStatus === 'OPEN' ? "rgba(16, 185, 129, 0.15)" : "transparent", color: editStatus === 'OPEN' ? "#10b981" : "rgba(255,255,255,0.5)", border: "none", cursor: "pointer", transition: "all 0.3s", fontWeight: editStatus === 'OPEN' ? "bold" : "normal" }}>✓ აქტიური</button>
              <button type="button" onClick={() => setEditStatus('CLOSED')} style={{ flex: 1, padding: "12px", backgroundColor: editStatus === 'CLOSED' ? "rgba(245, 158, 11, 0.15)" : "transparent", color: editStatus === 'CLOSED' ? "#f59e0b" : "rgba(255,255,255,0.5)", border: "none", cursor: "pointer", transition: "all 0.3s", fontWeight: editStatus === 'CLOSED' ? "bold" : "normal" }}>⚠️ ტექნიკური შესვენება</button>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "15px", marginTop: "10px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px" }}>
            <button type="button" onClick={handleCloseEditModal} style={{ padding: "12px 24px", backgroundColor: "rgba(255,255,255,0.05)", border: "none", color: "#fff", borderRadius: "24px", cursor: "pointer", transition: "all 0.3s" }}>გაუქმება</button>
            <button type="submit" style={{ padding: "12px 30px", backgroundColor: "var(--color-emerald-core)", border: "none", color: "#121418", borderRadius: "24px", cursor: "pointer", fontWeight: "bold", transition: "all 0.3s" }}>შენახვა</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpaceEditForm;
