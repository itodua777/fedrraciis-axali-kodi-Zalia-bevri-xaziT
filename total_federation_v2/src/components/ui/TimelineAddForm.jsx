import React from 'react';
import { generateUUID } from '../../utils/helpers.js';

const TimelineAddForm = ({ athlete, onUpdateAthlete, onClose, activeRanks, activeTitles, peaksList }) => {
  const [newAct, setNewAct] = React.useState({
    type: 'expedition',
    year: new Date().getFullYear(),
    date: '',
    peakName: '',
    customPeakName: '',
    route: '',
    difficulty: '',
    status: 'წარმატებული ასვლა',
    rankName: activeRanks[0]?.name || '',
    decreeNumber: '',
    titleName: activeTitles[0]?.name || '',
    organization: '',
    awardName: '',
    nomination: ''
  });

  const handleAddActivity = (e) => {
    e.preventDefault();
    
    let titleVal = "";
    let achievementVal = "";
    let routeVal = "";
    let dateVal = newAct.date || "";
    let peakVal = "";

    if (newAct.type === 'expedition') {
      const actualPeak = newAct.peakName === 'custom' ? newAct.customPeakName : newAct.peakName;
      if (!actualPeak) {
        alert("გთხოვთ აირჩიოთ ან შეიყვანოთ მწვერვალი!");
        return;
      }
      titleVal = actualPeak;
      peakVal = actualPeak;
      routeVal = newAct.route || "";
      achievementVal = `სტატუსი: ${newAct.status}${newAct.difficulty ? ` (${newAct.difficulty} კატეგორია)` : ''}`;
    } else if (newAct.type === 'rank_up') {
      const actualRank = newAct.rankName || (activeRanks[0]?.name || '');
      if (!actualRank) {
        alert("გთხოვთ აირჩიოთ სპორტული თანრიგი!");
        return;
      }
      if (!newAct.date) {
        alert("გთხოვთ მიუთითოთ მინიჭების თარიღი!");
        return;
      }
      titleVal = `მიენიჭა "${actualRank}"`;
      peakVal = `მიენიჭა "${actualRank}"`;
      
      const parts = newAct.date.split('-');
      if (parts.length === 3) {
        dateVal = `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      
      achievementVal = `სტატუსი: მიენიჭა "${actualRank}"-ის წოდება. საფუძველი: ოქმი/ბრძანება #${newAct.decreeNumber || 'N/A'}`;
    } else if (newAct.type === 'title') {
      const actualTitle = newAct.titleName || (activeTitles[0]?.name || '');
      if (!actualTitle) {
        alert("გთხოვთ აირჩიოთ საპატიო წოდება!");
        return;
      }
      titleVal = `საპატიო წოდება: "${actualTitle}"`;
      peakVal = `საპატიო წოდება: "${actualTitle}"`;
      achievementVal = `მიმნიჭებელი ორგანიზაცია: ${newAct.organization || 'N/A'}`;
    } else if (newAct.type === 'award') {
      if (!newAct.awardName) {
        alert("გთხოვთ შეიყვანოთ ჯილდოს დასახელება!");
        return;
      }
      titleVal = `ჯილდო: "${newAct.awardName}"`;
      peakVal = `ჯილდო: "${newAct.awardName}"`;
      achievementVal = `ნომინაცია / საფუძველი: ${newAct.nomination || 'N/A'}`;
    }

    const activity = {
      id: generateUUID(),
      year: parseInt(newAct.year) || new Date().getFullYear(),
      date: dateVal || undefined,
      title: titleVal,
      peak: peakVal,
      route: routeVal || undefined,
      achievement: achievementVal,
      result: achievementVal,
      type: newAct.type
    };

    const achievements = athlete?.achievements || [];
    const updatedAchievements = [...achievements, activity];
    
    onUpdateAthlete({
      ...athlete,
      achievements: updatedAchievements
    });

    onClose();
  };

  return (
    <div style={{ backgroundColor: "#16191f", border: "1px solid rgba(34, 211, 238, 0.2)", borderRadius: "8px", padding: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", gap: "15px", marginBottom: "5px", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", fontWeight: "bold" }}>აქტივობის ტიპი:</span>
        <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "12px", color: "#fff" }}>
          <input type="radio" name="eventType" checked={newAct.type === 'expedition'} onChange={() => setNewAct(prev => ({ ...prev, type: 'expedition' }))} style={{ accentColor: "#22d3ee" }} />
          🧗 ექსპედიცია
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "12px", color: "#fff" }}>
          <input type="radio" name="eventType" checked={newAct.type === 'rank_up'} onChange={() => setNewAct(prev => ({ ...prev, type: 'rank_up' }))} style={{ accentColor: "#22d3ee" }} />
          🥇 სპორტული თანრიგი
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "12px", color: "#fff" }}>
          <input type="radio" name="eventType" checked={newAct.type === 'title'} onChange={() => setNewAct(prev => ({ ...prev, type: 'title' }))} style={{ accentColor: "#22d3ee" }} />
          🎖️ საპატიო წოდება
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "12px", color: "#fff" }}>
          <input type="radio" name="eventType" checked={newAct.type === 'award'} onChange={() => setNewAct(prev => ({ ...prev, type: 'award' }))} style={{ accentColor: "#22d3ee" }} />
          🏆 ჯილდო
        </label>
      </div>

      {newAct.type === 'expedition' && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>მწვერვალი *</label>
              <select
                value={newAct.peakName}
                onChange={e => setNewAct({ ...newAct, peakName: e.target.value })}
                style={{ width: "100%", padding: "6px 10px", backgroundColor: "#1e222b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "12px", outline: "none" }}
              >
                <option value="">-- აირჩიეთ მწვერვალი --</option>
                {peaksList.map(p => (
                  <option key={p.id} value={p.name}>{p.name} ({p.height}მ) - {p.system}</option>
                ))}
                <option value="custom">სხვა (ხელით შეყვანა)...</option>
              </select>
              {newAct.peakName === 'custom' && (
                <input
                  type="text"
                  placeholder="შეიყვანეთ მწვერვალის სახელი"
                  value={newAct.customPeakName}
                  onChange={e => setNewAct({ ...newAct, customPeakName: e.target.value })}
                  style={{ width: "100%", padding: "6px 10px", backgroundColor: "#1e222b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "12px", boxSizing: "border-box", marginTop: "5px", outline: "none" }}
                />
              )}
            </div>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>წელი *</label>
              <select
                value={newAct.year}
                onChange={e => setNewAct({ ...newAct, year: parseInt(e.target.value) || new Date().getFullYear() })}
                style={{ width: "100%", padding: "6px 10px", backgroundColor: "#1e222b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "12px", outline: "none" }}
              >
                {Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>მარშრუტი</label>
              <input
                type="text"
                placeholder="მაგ: სამხრეთ ქედით"
                value={newAct.route}
                onChange={e => setNewAct({ ...newAct, route: e.target.value })}
                style={{ width: "100%", padding: "6px 10px", backgroundColor: "#1e222b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "12px", boxSizing: "border-box", outline: "none" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>სირთულის კატეგორია</label>
              <select
                value={newAct.difficulty}
                onChange={e => setNewAct({ ...newAct, difficulty: e.target.value })}
                style={{ width: "100%", padding: "6px 10px", backgroundColor: "#1e222b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "12px", outline: "none" }}
              >
                <option value="">-- აირჩიეთ კატეგორია --</option>
                {["1B", "2A", "2B", "3A", "3B", "4A", "4B", "5A", "5B", "6A", "6B"].map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>სტატუსი *</label>
              <select
                value={newAct.status}
                onChange={e => setNewAct({ ...newAct, status: e.target.value })}
                style={{ width: "100%", padding: "6px 10px", backgroundColor: "#1e222b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "12px", outline: "none" }}
              >
                <option value="წარმატებული ასვლა">წარმატებული ასვლა</option>
                <option value="მწვერვალამდე ვერ მიაღწია">მწვერვალამდე ვერ მიაღწია</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>თარიღი (სურვილისამებრ)</label>
              <input
                type="text"
                placeholder="მაგ: 15 მაისი"
                value={newAct.date}
                onChange={e => setNewAct({ ...newAct, date: e.target.value })}
                style={{ width: "100%", padding: "6px 10px", backgroundColor: "#1e222b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "12px", boxSizing: "border-box", outline: "none" }}
              />
            </div>
          </div>
        </>
      )}

      {newAct.type === 'rank_up' && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>სპორტული თანრიგი *</label>
              <select
                value={newAct.rankName}
                onChange={e => setNewAct({ ...newAct, rankName: e.target.value })}
                style={{ width: "100%", padding: "6px 10px", backgroundColor: "#1e222b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "12px", outline: "none" }}
              >
                {activeRanks.length === 0 ? (
                  <option value="">-- თანრიგები არ არის --</option>
                ) : (
                  activeRanks.map(r => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>წელი *</label>
              <select
                value={newAct.year}
                onChange={e => setNewAct({ ...newAct, year: parseInt(e.target.value) || new Date().getFullYear() })}
                style={{ width: "100%", padding: "6px 10px", backgroundColor: "#1e222b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "12px", outline: "none" }}
              >
                {Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>მინიჭების თარიღი *</label>
              <input
                type="date"
                value={newAct.date}
                onChange={e => setNewAct({ ...newAct, date: e.target.value })}
                style={{ width: "100%", padding: "6px 10px", backgroundColor: "#1e222b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "12px", boxSizing: "border-box", outline: "none" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>ბრძანების / ოქმის ნომერი</label>
              <input
                type="text"
                placeholder="მაგ: #120-A"
                value={newAct.decreeNumber}
                onChange={e => setNewAct({ ...newAct, decreeNumber: e.target.value })}
                style={{ width: "100%", padding: "6px 10px", backgroundColor: "#1e222b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "12px", boxSizing: "border-box", outline: "none" }}
              />
            </div>
          </div>
        </>
      )}

      {newAct.type === 'title' && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>წოდების დასახელება *</label>
              <select
                value={newAct.titleName}
                onChange={e => setNewAct({ ...newAct, titleName: e.target.value })}
                style={{ width: "100%", padding: "6px 10px", backgroundColor: "#1e222b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "12px", outline: "none" }}
              >
                {activeTitles.length === 0 ? (
                  <option value="">-- წოდებები არ არის --</option>
                ) : (
                  activeTitles.map(t => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>მიმნიჭებელი ორგანიზაცია</label>
              <input
                type="text"
                placeholder="მაგ: სპორტის სამინისტრო"
                value={newAct.organization}
                onChange={e => setNewAct({ ...newAct, organization: e.target.value })}
                style={{ width: "100%", padding: "6px 10px", backgroundColor: "#1e222b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "12px", boxSizing: "border-box", outline: "none" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>წელი *</label>
              <select
                value={newAct.year}
                onChange={e => setNewAct({ ...newAct, year: parseInt(e.target.value) || new Date().getFullYear() })}
                style={{ width: "100%", padding: "6px 10px", backgroundColor: "#1e222b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "12px", outline: "none" }}
              >
                {Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}

      {newAct.type === 'award' && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>ჯილდოს დასახელება *</label>
              <input
                type="text"
                placeholder="მაგ: ოქროს ყინულცული"
                value={newAct.awardName}
                onChange={e => setNewAct({ ...newAct, awardName: e.target.value })}
                style={{ width: "100%", padding: "6px 10px", backgroundColor: "#1e222b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "12px", boxSizing: "border-box", outline: "none" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>წელი *</label>
              <select
                value={newAct.year}
                onChange={e => setNewAct({ ...newAct, year: parseInt(e.target.value) || new Date().getFullYear() })}
                style={{ width: "100%", padding: "6px 10px", backgroundColor: "#1e222b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "12px", outline: "none" }}
              >
                {Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>ნომინაცია / საფუძველი *</label>
            <textarea
              placeholder="რისთვის გადაეცა..."
              value={newAct.nomination}
              onChange={e => setNewAct({ ...newAct, nomination: e.target.value })}
              rows={3}
              style={{ width: "100%", padding: "6px 10px", backgroundColor: "#1e222b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "12px", boxSizing: "border-box", resize: "vertical", fontFamily: "sans-serif", outline: "none" }}
            />
          </div>
        </>
      )}

      <button
        type="button"
        onClick={handleAddActivity}
        style={{
          backgroundColor: "#22d3ee",
          color: "#121418",
          border: "none",
          padding: "6px 12px",
          borderRadius: "6px",
          fontSize: "12px",
          fontWeight: "bold",
          cursor: "pointer",
          alignSelf: "flex-end",
          marginTop: "5px"
        }}
      >
        დამატება
      </button>
    </div>
  );
};

export default TimelineAddForm;
