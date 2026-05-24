import React from '../../../utils/react-shim.js';
import ProfileHeaderCard from './ProfileHeaderCard.jsx';
import AthleteSidePanelRead from './AthleteSidePanelRead.jsx';
import AthleteSidePanelEdit from './AthleteSidePanelEdit.jsx';
import { calculateAge } from '../../../utils/helpers.js';

const AthleteSidePanel = ({
  athlete,
  isEditing,
  setIsEditing,
  editForm,
  setEditForm,
  setIsFullscreenOpen,
  onClose,
  clubs,
  onClubClick,
  handleSave,
  handleCancel
}) => {
  if (!athlete) {
    return (
      <div style={{ width: "420px", minWidth: "420px", backgroundColor: "#121418", border: "1px solid rgba(34, 211, 238, 0.15)", borderRadius: "12px", padding: "20px", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(226, 232, 240, 0.5)" }}>
        აირჩიეთ სპორტსმენი დეტალების სანახავად
      </div>
    );
  }

  const age = calculateAge(athlete.birthDate);
  const isMinor = typeof age === 'number' && age < 18;
  const isDeceased = editForm?.membershipStatus === 'Deceased';
  const isVotingDisabled = isMinor || editForm?.membershipStatus !== 'Active' || !editForm?.membershipFeePaid;

  return (
    <div style={{ width: "420px", minWidth: "420px", backgroundColor: "#121418", border: "1px solid rgba(34, 211, 238, 0.15)", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(34, 211, 238, 0.02)", maxHeight: "90vh", overflowY: "auto" }}>
      {/* Header Panel */}
      <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", borderBottom: "1px solid rgba(30, 41, 59, 0.8)", paddingBottom: "12px" }}>
        {!isEditing && (
          <button
            onClick={() => setIsFullscreenOpen(true)}
            title="პროფილის სრულ ეკრანზე გაშლა"
            style={{
              position: "absolute",
              left: "0px",
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(30, 41, 59, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              color: "#cbd5e1",
              borderRadius: "6px",
              cursor: "pointer",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = "rgba(30, 41, 59, 0.8)";
              e.currentTarget.style.color = "#22d3ee";
              e.currentTarget.style.borderColor = "rgba(34, 211, 238, 0.4)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = "rgba(30, 41, 59, 0.5)";
              e.currentTarget.style.color = "#cbd5e1";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
            }}
          >
            <i className="fa-solid fa-expand" style={{ fontSize: "12px" }}></i>
          </button>
        )}
        <span style={{ fontSize: "14px", fontWeight: "bold", color: "#22d3ee", textTransform: "uppercase", letterSpacing: "1px" }}>
          {isEditing ? "რედაქტირება" : "სპორტსმენის პროფილი"}
        </span>
      </div>

      {/* Profile Header Card */}
      <ProfileHeaderCard 
        athlete={athlete} 
        isEditing={isEditing} 
        editForm={editForm} 
        onClose={onClose} 
        onEdit={() => setIsEditing(true)}
        onExpand={() => setIsFullscreenOpen(true)}
      />

      {!isEditing ? (
        <AthleteSidePanelRead
          athlete={athlete}
          isMinor={isMinor}
          clubs={clubs}
          onClubClick={onClubClick}
          setIsEditing={setIsEditing}
        />
      ) : (
        <AthleteSidePanelEdit
          editForm={editForm}
          setEditForm={setEditForm}
          isDeceased={isDeceased}
          isVotingDisabled={isVotingDisabled}
          clubs={clubs}
          handleSave={handleSave}
          handleCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default AthleteSidePanel;
