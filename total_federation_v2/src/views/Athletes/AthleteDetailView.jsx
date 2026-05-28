import React from '../../utils/react-shim.js';
import AthleteSidePanel from './components/AthleteSidePanel.jsx';
import AthleteFullscreen from './components/AthleteFullscreen.jsx';
import AthletePrintDoc from './components/AthletePrintDoc.jsx';
import { ratingStoreData } from '../../context/ratingSettingsStore.js';
import Timeline from '../../components/ui/Timeline.jsx';

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
      // Fetch current settings on athlete profile initialization
      fetch('/api/v1/dashboard/sync')
        .then(res => res.json())
        .then(data => {
          if (data && data.system_settings) {
            const { ranks_system_enabled, honorary_titles_enabled, awards_enabled } = data.system_settings;
            ratingStoreData.setState({
              ranksEnabled: ranks_system_enabled === 1,
              ranks_system_enabled: ranks_system_enabled === 1,
              honoraryTitlesEnabled: honorary_titles_enabled === 1,
              honorary_titles_enabled: honorary_titles_enabled === 1,
              awardsEnabled: awards_enabled === 1,
              awards_enabled: awards_enabled === 1
            });
          }
        })
        .catch(err => console.error("Failed to sync settings on init:", err));
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
        width: "100%", 
        height: "calc(100vh - var(--header-height) - 60px)", 
        boxSizing: "border-box",
        backgroundColor: "#121418", 
        border: "1px solid #27272a", 
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
    <div className="custom-scrollbar scrollbar-thin scrollbar-thumb-zinc-800" style={{
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      height: "calc(100vh - var(--header-height) - 60px)",
      overflowY: "auto",
      boxSizing: "border-box",
      paddingRight: "4px"
    }}>
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

      {!isEditing && (
        <div style={{
          backgroundColor: "#121418",
          border: "1px solid var(--color-emerald-core)",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6), inset 0 0 20px color-mix(in oklab, var(--color-emerald-core) 2%, transparent)"
        }}>
          <Timeline 
            athlete={athlete} 
            onUpdateAthlete={onUpdateAthlete} 
          />
        </div>
      )}

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
    </div>
  );
};

export default AthleteDetailView;
