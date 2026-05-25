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
      <div style={{ 
        gridColumn: "span 4", 
        width: "100%", 
        maxWidth: "420px", 
        height: "100%", 
        boxSizing: "border-box",
        backgroundColor: "#121418", 
        border: "1px solid color-mix(in oklab, var(--color-emerald-core) 15%, transparent)", 
        borderRadius: "12px", 
        padding: "32px", 
        display: "flex", 
        flexDirection: "column",
        alignItems: "center", 
        justifyContent: "center", 
        userSelect: "none",
        pointerEvents: "none"
      }}>
        {/* 3x3 Ennea Core გრიდის მინიმალისტური SVG ილუსტრაცია */}
        <div style={{
          width: "96px",
          height: "96px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.2
        }}>
          <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", fill: "var(--color-silver-structure)" }}>
            {/* რიგი 1 */}
            <circle cx="20" cy="20" r="5" />
            <circle cx="50" cy="20" r="5" />
            <circle cx="80" cy="20" r="5" />
            {/* რიგი 2 */}
            <circle cx="20" cy="50" r="5" />
            <circle cx="50" cy="50" r="5" fill="var(--color-emerald-core)" className="animate-pulse-emerald" /> {/* ცენტრალური ზურმუხტისფერი ბირთვი */}
            <circle cx="80" cy="50" r="5" />
            {/* რიგი 3 */}
            <circle cx="20" cy="80" r="5" />
            <circle cx="50" cy="80" r="5" />
            <circle cx="80" cy="80" r="5" />
          </svg>
        </div>

        {/* საინფორმაციო ტექსტი */}
        <p style={{
          margin: 0,
          fontSize: "14px",
          fontWeight: "500",
          color: "var(--color-silver-structure)",
          letterSpacing: "0.025em",
          textAlign: "center",
          maxWidth: "250px",
          lineHeight: "1.5"
        }}>
          აირჩიეთ სპორტსმენი დეტალების სანახავად
        </p>
      </div>
    );
  }

  const age = calculateAge(athlete.birthDate);
  const isMinor = typeof age === 'number' && age < 18;
  const isDeceased = editForm?.membershipStatus === 'Deceased';
  const isVotingDisabled = isMinor || editForm?.membershipStatus !== 'Active' || !editForm?.membershipFeePaid;

  return (
    <div style={{ 
      gridColumn: "span 4", 
      width: "100%", 
      maxWidth: "420px", 
      backgroundColor: "#121418", 
      border: "1px solid color-mix(in oklab, var(--color-emerald-core) 15%, transparent)", 
      borderRadius: "12px", 
      padding: "16px", 
      display: "flex", 
      flexDirection: "column", 
      gap: "12px", 
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6), inset 0 0 20px color-mix(in oklab, var(--color-emerald-core) 2%, transparent)", 
      height: "100%", 
      maxHeight: "100%", 
      overflowY: "auto",
      boxSizing: "border-box"
    }}>
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
              e.currentTarget.style.color = "var(--color-emerald-core)";
              e.currentTarget.style.borderColor = "color-mix(in oklab, var(--color-emerald-core) 40%, transparent)";
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
        <span style={{ fontSize: "14px", fontWeight: "bold", color: "var(--color-emerald-core)", textTransform: "uppercase", letterSpacing: "1px" }}>
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
