import React from 'react';
import MemorialFullscreenRead from './MemorialFullscreenRead.jsx';
import MemorialFullscreenEdit from './MemorialFullscreenEdit.jsx';

const MemorialFullscreen = ({ record, onClose, onSave, onPrint }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editForm, setEditForm] = React.useState(null);
  const [newEditTitle, setNewEditTitle] = React.useState('');

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleStartEdit = () => {
    setEditForm({ ...record });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm(null);
    setNewEditTitle('');
  };

  const handleSaveEdit = () => {
    if (!editForm.firstName || !editForm.lastName || !editForm.birthYear || !editForm.deathYear) {
      alert('შეავსეთ სავალდებულო ველები');
      return;
    }
    if (parseInt(editForm.deathYear) < parseInt(editForm.birthYear)) {
      alert('გარდაცვალების წელი არ შეიძლება იყოს დაბადების წელზე ნაკლები');
      return;
    }
    onSave(editForm);
    setIsEditing(false);
    setEditForm(null);
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 999,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      boxSizing: "border-box"
    }}>
      {/* Modal Card */}
      <div style={{
        width: "92vw",
        height: "90vh",
        backgroundColor: "#0d0f12",
        border: "1.5px solid #d4af37",
        boxShadow: "0 0 25px rgba(212, 175, 55, 0.25)",
        borderRadius: "16px",
        padding: "24px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        boxSizing: "border-box",
        position: "relative",
        color: "#e2e8f0"
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(212, 175, 55, 0.2)",
          paddingBottom: "16px"
        }}>
          {/* Left Side: return button */}
          <button
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              backgroundColor: "rgba(30, 41, 59, 0.5)",
              border: "1px solid rgba(212, 175, 55, 0.3)",
              color: "#d4af37",
              padding: "6px 12px",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = "rgba(212, 175, 55, 0.1)";
              e.currentTarget.style.borderColor = "#d4af37";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = "rgba(30, 41, 59, 0.5)";
              e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.3)";
            }}
          >
            <i className="fa-solid fa-compress"></i> პატარა ფანჯარაში დაბრუნება
          </button>

          {/* Center: Title */}
          <h2 style={{
            margin: 0,
            color: "#d4af37",
            fontSize: "20px",
            fontWeight: "700",
            letterSpacing: "0.5px"
          }}>
            ლეგენდარული სპორტსმენები (Legend View)
          </h2>

          {/* Right Side: Print/Edit */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {!isEditing ? (
              <>
                <button
                  onClick={onPrint}
                  title="ამობეჭდვა"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(30, 41, 59, 0.5)",
                    border: "1px solid rgba(212, 175, 55, 0.3)",
                    color: "#d4af37",
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = "rgba(212, 175, 55, 0.1)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = "rgba(30, 41, 59, 0.5)";
                  }}
                >
                  <i className="fa-solid fa-print" style={{ fontSize: "16px" }}></i>
                </button>
                <button
                  onClick={handleStartEdit}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                    backgroundColor: "rgba(212, 175, 55, 0.1)",
                    border: "1px solid #d4af37",
                    color: "#d4af37",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = "rgba(212, 175, 55, 0.2)";
                    e.currentTarget.style.boxShadow = "0 0 10px rgba(212, 175, 55, 0.3)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = "rgba(212, 175, 55, 0.1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <i className="fa-regular fa-pen-to-square" style={{ fontSize: "14px" }}></i>
                  რედაქტირება
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleCancelEdit}
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "rgba(255,255,255,0.6)",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "13px",
                    transition: "all 0.3s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
                >
                  გაუქმება
                </button>
                <button
                  onClick={handleSaveEdit}
                  style={{
                    backgroundColor: "#d4af37",
                    border: "none",
                    color: "#121418",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "bold",
                    transition: "all 0.3s",
                    boxShadow: "0 0 10px rgba(212, 175, 55, 0.3)"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#fbbf24"; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#d4af37"; }}
                >
                  შენახვა
                </button>
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <MemorialFullscreenEdit
            editForm={editForm}
            setEditForm={setEditForm}
            newEditTitle={newEditTitle}
            setNewEditTitle={setNewEditTitle}
          />
        ) : (
          <MemorialFullscreenRead record={record} />
        )}
      </div>
    </div>
  );
};

export default MemorialFullscreen;
