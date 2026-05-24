import React from 'react';
import { useRanksStore } from '../../context/ranksStore.js';
import { getPersistedPeaks } from '../../utils/peaks.js';
import TimelineAddForm from './TimelineAddForm.jsx';

const Timeline = ({ athlete, onUpdateAthlete }) => {
  const [showAddForm, setShowAddForm] = React.useState(false);
  const ranksStore = useRanksStore();
  const activeRanks = (ranksStore?.ranks || []).filter(r => r.status === 'აქტიური');
  const activeTitles = (ranksStore?.honoraryTitles || []).filter(t => t.status === 'აქტიური');
  const peaksList = getPersistedPeaks();

  const achievements = athlete?.achievements || [];
  const sortedActivities = [...achievements].sort((a, b) => Number(b.year) - Number(a.year));

  const getTypeStyles = (type) => {
    switch (type) {
      case 'award':
        return { color: '#FBBF24', label: '🏆 ჯილდო', bulletBg: '#FBBF24', glow: '0 0 8px #FBBF24' };
      case 'title':
        return { color: '#C084FC', label: '🎖️ საპატიო წოდება', bulletBg: '#C084FC', glow: '0 0 8px #C084FC' };
      case 'rank_up':
        return { color: '#34D399', label: '🥇 სპორტული თანრიგი', bulletBg: '#34D399', glow: '0 0 8px #34D399' };
      case 'expedition':
      default:
        return { color: '#22D3EE', label: '🧗 ექსპედიცია', bulletBg: '#22D3EE', glow: '0 0 8px #22D3EE' };
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "10px" }}>
        <h4 style={{ margin: 0, color: "#fff", fontSize: "14px", fontWeight: "bold" }}>
          🏆 სპორტული აქტივობის ქრონოლოგია
        </h4>
        {onUpdateAthlete && (
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              backgroundColor: "rgba(34, 211, 238, 0.1)",
              border: "1px solid #22d3ee",
              color: "#22d3ee",
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "12px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(34, 211, 238, 0.2)"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "rgba(34, 211, 238, 0.1)"; }}
          >
            {showAddForm ? 'გაუქმება' : '+ ახალი აქტივობის დამატება'}
          </button>
        )}
      </div>

      {showAddForm && (
        <TimelineAddForm
          athlete={athlete}
          onUpdateAthlete={onUpdateAthlete}
          onClose={() => setShowAddForm(false)}
          activeRanks={activeRanks}
          activeTitles={activeTitles}
          peaksList={peaksList}
        />
      )}

      <div style={{ position: "relative", paddingLeft: "30px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{
          position: "absolute",
          left: "9px",
          top: "10px",
          bottom: "10px",
          width: "2px",
          backgroundColor: "rgba(34, 211, 238, 0.15)"
        }} />

        {sortedActivities.map((act, i) => {
          const type = act.type || 'expedition';
          const styles = getTypeStyles(type);
          return (
            <div key={act.id || i} style={{ position: "relative" }}>
              <div style={{
                position: "absolute",
                left: "-26px",
                top: "12px",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: styles.bulletBg,
                boxShadow: styles.glow,
                zIndex: 2
              }} />

              <div style={{
                backgroundColor: "#0d0e12",
                border: `1px solid rgba(255, 255, 255, 0.04)`,
                borderLeft: `3px solid ${styles.color}`,
                borderRadius: "8px",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: styles.color, fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {styles.label}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.5)", fontWeight: "500" }}>
                      {act.year} {act.date ? `• ${act.date}` : ''}
                    </span>
                    {onUpdateAthlete && athlete?.membershipStatus !== 'Deceased' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("ნამდვილად გსურთ აქტივობის წაშლა?")) {
                            const updatedAchievements = achievements.filter((item, idx) => {
                              if (act.id && item.id) return item.id !== act.id;
                              return idx !== i;
                            });
                            onUpdateAthlete({
                              ...athlete,
                              achievements: updatedAchievements
                            });
                          }
                        }}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#ef4444",
                          cursor: "pointer",
                          padding: "2px",
                          fontSize: "12px",
                          display: "flex",
                          alignItems: "center",
                          transition: "color 0.2s"
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
                        onMouseLeave={e => e.currentTarget.style.color = "#ef4444"}
                        title="წაშლა"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ fontSize: "13px", color: "#e2e8f0", lineHeight: "1.4" }}>
                  <div style={{ fontWeight: "bold", fontSize: "14px", color: "#fff", marginBottom: "4px" }}>
                    {act.title || act.peak}
                  </div>
                  {act.route && (
                    <div style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "12px", marginBottom: "4px" }}>
                      📍 მარშრუტი: {act.route}
                    </div>
                  )}
                  <div style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "12px" }}>
                    ✨ მიღწევა: {act.achievement || act.result}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {sortedActivities.length === 0 && (
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontStyle: "italic", padding: "10px 0" }}>
            მიღწევები არ არის რეგისტრირებული
          </div>
        )}
      </div>

      {athlete?.biography && (
        <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "15px", marginTop: "10px" }}>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>ბიოგრაფია & Timeline ნარატივი</span>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", margin: 0, lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
            {athlete.biography}
          </p>
        </div>
      )}
    </div>
  );
};

export default Timeline;
