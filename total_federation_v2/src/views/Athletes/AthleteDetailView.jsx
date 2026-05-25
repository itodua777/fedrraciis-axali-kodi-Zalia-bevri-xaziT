import React from '../../utils/react-shim.js';
import AthleteSidePanel from './components/AthleteSidePanel.jsx';
import AthleteFullscreen from './components/AthleteFullscreen.jsx';
import AthletePrintDoc from './components/AthletePrintDoc.jsx';

const AthleteDetailView = ({ athlete, onClose, onUpdateAthlete, clubs, onClubClick }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editForm, setEditForm] = React.useState(null);
  const [isFullscreenOpen, setIsFullscreenOpen] = React.useState(false);
  const prevAthleteIdRef = React.useRef(null);

  const initializeForm = React.useCallback((ath) => {
    if (!ath) return null;
    return {
      ...ath,
      isFederationMember: ath.isFederationMember ?? false,
      membershipStatus: ath.membershipStatus ?? 'Active',
      membershipFeePaid: ath.membershipFeePaid ?? true,
      isFounder: ath.isFounder ?? false,
      hasVotingRight: ath.hasVotingRight ?? false,
      isNationalTeamMember: ath.isNationalTeamMember ?? false,
      isVeteran: ath.isVeteran ?? false,
      isMentor: ath.isMentor ?? false,
      achievements: ath.achievements ? [...ath.achievements] : [],
      biography: ath.biography ?? '',
      deathYear: ath.deathYear ?? '',
      height: ath.height ?? '',
      weight: ath.weight ?? '',
      bloodType: ath.bloodType ?? '',
      asthma: ath.asthma ?? false,
      diabetes: ath.diabetes ?? false,
      allergies: ath.allergies ?? '',
      phone: ath.phone ?? '',
      email: ath.email ?? '',
      emergencyContactRelation: ath.emergencyContactRelation ?? '',
      emergencyContactName: ath.emergencyContactName ?? '',
      emergencyContactPhone: ath.emergencyContactPhone ?? '',
      sportsDiscipline: ath.sportsDiscipline ?? '',
      isClubMember: ath.isClubMember ?? false,
      clubId: ath.clubId ?? null,
    };
  }, []);

  const handleMinimize = React.useCallback(() => {
    setIsFullscreenOpen(false);
    setIsEditing(false);
    if (athlete) {
      setEditForm(initializeForm(athlete));
    }
  }, [athlete, initializeForm]);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleMinimize();
      }
    };
    if (isFullscreenOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isFullscreenOpen, handleMinimize]);

  React.useEffect(() => {
    if (athlete) {
      setEditForm(initializeForm(athlete));
      setIsEditing(false);
      if (prevAthleteIdRef.current !== athlete.id) {
        setIsFullscreenOpen(false);
        prevAthleteIdRef.current = athlete.id;
      }
    } else {
      setEditForm(null);
      setIsFullscreenOpen(false);
      prevAthleteIdRef.current = null;
    }
  }, [athlete, initializeForm]);

  const handleSave = () => {
    if (onUpdateAthlete && editForm) {
      onUpdateAthlete(editForm);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (athlete) {
      setEditForm(initializeForm(athlete));
    }
    setIsEditing(false);
  };

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

  return (
    <>
      <AthleteSidePanel
        athlete={athlete}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editForm={editForm}
        setEditForm={setEditForm}
        setIsFullscreenOpen={setIsFullscreenOpen}
        onClose={onClose}
        clubs={clubs}
        onClubClick={onClubClick}
        handleSave={handleSave}
        handleCancel={handleCancel}
      />

      <AthleteFullscreen
        athlete={athlete}
        editForm={editForm}
        setEditForm={setEditForm}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isFullscreenOpen={isFullscreenOpen}
        setIsFullscreenOpen={setIsFullscreenOpen}
        clubs={clubs}
        onClubClick={onClubClick}
        onUpdateAthlete={onUpdateAthlete}
        handleMinimize={handleMinimize}
        handleSave={handleSave}
        handleCancel={handleCancel}
      />

      {isFullscreenOpen && (
        <AthletePrintDoc athlete={athlete} clubs={clubs} />
      )}
    </>
  );
};

export default AthleteDetailView;
