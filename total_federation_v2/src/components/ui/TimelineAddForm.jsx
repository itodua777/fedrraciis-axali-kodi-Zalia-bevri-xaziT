import React from 'react';
import { generateUUID } from '../../utils/helpers.js';
import { useRatingSettingsStore } from '../../context/ratingSettingsStore.js';

const mapRankNameToKey = (name) => {
  if (!name) return 'NONE';
  if (name.includes('III') || name.includes('3')) return 'RANK_3';
  if (name.includes('II') || name.includes('2')) return 'RANK_2';
  if (name.includes('I') || name.includes('1')) return 'RANK_1';
  if (name.toLowerCase() === 'სოკ' || name.includes('კანდიდატი')) return 'CANDIDATE';
  if (name.includes('ოსტატი') && !name.includes('საერთაშორისო')) return 'MASTER';
  if (name.includes('საერთაშორისო')) return 'INT_MASTER';
  if (name.includes('ნიშანი') || name.includes('ნიშნოსანი')) return 'BADGE';
  return 'NONE';
};

const TimelineAddForm = ({ athlete, onUpdateAthlete, onClose, activeRanks, activeTitles, peaksList }) => {
  const store = useRatingSettingsStore();
  const [dbTitles, setDbTitles] = React.useState([]);
  const [dbAwards, setDbAwards] = React.useState([]);

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
    titleName: '',
    organization: '',
    awardName: '',
    nomination: '',
    sportDiscipline: athlete?.sportsDiscipline || 'ალპინიზმი'
  });

  React.useEffect(() => {
    fetch('/api/v1/honorary-titles')
      .then(res => res.json())
      .then(data => {
        setDbTitles(data);
        if (data.length > 0) {
          setNewAct(prev => ({ ...prev, titleName: data[0].title_name }));
        }
      })
      .catch(err => console.error(err));

    fetch('/api/v1/federation-awards')
      .then(res => res.json())
      .then(data => {
        setDbAwards(data);
        if (data.length > 0) {
          setNewAct(prev => ({ ...prev, awardName: data[0].award_name }));
        }
      })
      .catch(err => console.error(err));
  }, []);

  React.useEffect(() => {
    if (newAct.type === 'rank_up' && store.ranksEnabled === false) {
      setNewAct(prev => ({ ...prev, type: 'expedition' }));
    }
    if (newAct.type === 'title' && store.honoraryTitlesEnabled === false) {
      setNewAct(prev => ({ ...prev, type: 'expedition' }));
    }
    if (newAct.type === 'award' && store.awardsEnabled === false) {
      setNewAct(prev => ({ ...prev, type: 'expedition' }));
    }
  }, [store.ranksEnabled, store.honoraryTitlesEnabled, store.awardsEnabled, newAct.type]);

  const handleAddActivity = (e) => {
    e.preventDefault();
    
    let titleVal = "";
    let additionalProps = {};
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
      const actualSport = newAct.sportDiscipline || '';
      const actualOrg = newAct.organization || '';
      
      if (!actualSport) {
        alert("გთხოვთ აირჩიოთ სპორტის სახეობა!");
        return;
      }
      if (!actualRank) {
        alert("გთხოვთ აირჩიოთ სპორტული თანრიგი!");
        return;
      }
      if (!actualOrg) {
        alert("გთხოვთ მიუთითოთ ორგანიზაციის დასახელება!");
        return;
      }
      if (!newAct.date) {
        alert("გთხოვთ მიუთითოთ მინიჭების თარიღი!");
        return;
      }

      titleVal = `მიენიჭა "${actualRank}" (${actualSport})`;
      peakVal = `მიენიჭა "${actualRank}"`;
      routeVal = actualSport;
      
      const parts = newAct.date.split('-');
      if (parts.length === 3) {
        dateVal = `${parts[2]}/${parts[1]}/${parts[0]}`;
      } else {
        dateVal = newAct.date;
      }
      
      achievementVal = `ორგანიზაცია: ${actualOrg}. მინიჭების თარიღი: ${dateVal}`;

      const targetRankKey = mapRankNameToKey(actualRank);
      let isNational = athlete.isNationalTeamMember ?? false;
      let nationalStatus = athlete.nationalTeamStatus;

      if (targetRankKey === 'CANDIDATE') {
        isNational = true;
        nationalStatus = 'CANDIDATE';
      } else if (targetRankKey === 'MASTER') {
        isNational = true;
        nationalStatus = 'MASTER';
      } else if (targetRankKey === 'INT_MASTER') {
        isNational = true;
        nationalStatus = 'INT_MASTER';
      } else {
        isNational = false;
        nationalStatus = undefined;
      }

      additionalProps = {
        mountaineerRank: targetRankKey,
        isNationalTeamMember: isNational,
        nationalTeamStatus: nationalStatus
      };

      // POST to backend athlete_ranks table
      fetch('/api/v1/athletes/ranks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          athlete_id: athlete.id,
          sport_type: actualSport,
          rank_name: actualRank,
          organization: actualOrg,
          assignment_date: newAct.date
        })
      })
      .then(res => res.json())
      .catch(err => console.error("Database save to athlete_ranks failed:", err));

    } else if (newAct.type === 'title') {
      const actualTitle = newAct.titleName || (dbTitles[0]?.title_name || '');
      if (!actualTitle) {
        alert("გთხოვთ აირჩიოთ საპატიო წოდება!");
        return;
      }
      titleVal = `საპატიო წოდება: "${actualTitle}"`;
      peakVal = `საპატიო წოდება: "${actualTitle}"`;
      achievementVal = `მიმნიჭებელი ორგანიზაცია: ${newAct.organization || 'N/A'}`;
    } else if (newAct.type === 'award') {
      const actualAward = newAct.awardName || (dbAwards[0]?.award_name || '');
      if (!actualAward) {
        alert("გთხოვთ აირჩიოთ ჯილდო!");
        return;
      }
      titleVal = `ჯილდო: "${actualAward}"`;
      peakVal = `ჯილდო: "${actualAward}"`;
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
      ...additionalProps,
      achievements: updatedAchievements
    });

    onClose();
  };

  return (
    <div style={{ backgroundColor: "#16191f", border: "1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)", borderRadius: "8px", padding: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", gap: "15px", marginBottom: "5px", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", fontWeight: "bold" }}>აქტივობის ტიპი:</span>
        <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "12px", color: "#fff" }}>
          <input type="radio" name="eventType" checked={newAct.type === 'expedition'} onChange={() => setNewAct(prev => ({ ...prev, type: 'expedition' }))} style={{ accentColor: "var(--color-emerald-core)" }} />
          🧗 ექსპედიცია
        </label>
        {store.ranksEnabled !== false && (
          <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "12px", color: "#fff" }}>
            <input type="radio" name="eventType" checked={newAct.type === 'rank_up'} onChange={() => setNewAct(prev => ({ ...prev, type: 'rank_up' }))} style={{ accentColor: "var(--color-emerald-core)" }} />
            🥇 სპორტული თანრიგი
          </label>
        )}
        {store.honoraryTitlesEnabled !== false && (
          <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "12px", color: "#fff" }}>
            <input type="radio" name="eventType" checked={newAct.type === 'title'} onChange={() => setNewAct(prev => ({ ...prev, type: 'title' }))} style={{ accentColor: "var(--color-emerald-core)" }} />
            🎖️ საპატიო წოდება
          </label>
        )}
        {store.awardsEnabled !== false && (
          <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "12px", color: "#fff" }}>
            <input type="radio" name="eventType" checked={newAct.type === 'award'} onChange={() => setNewAct(prev => ({ ...prev, type: 'award' }))} style={{ accentColor: "var(--color-emerald-core)" }} />
            🏆 ჯილდო
          </label>
        )}
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
              <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>🥋 სპორტის სახეობა *</label>
              <select
                value={newAct.sportDiscipline || ''}
                onChange={e => setNewAct({ ...newAct, sportDiscipline: e.target.value })}
                style={{ width: "100%", padding: "6px 10px", backgroundColor: "#1e222b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "12px", outline: "none" }}
              >
                <option value="">-- აირჩიეთ სახეობა --</option>
                <option value="ალპინიზმი">ალპინიზმი</option>
                <option value="მეკლდეურობა">მეკლდეურობა</option>
                <option value="ყინულზე ცოცვა">ყინულზე ცოცვა</option>
                <option value="სკაირანინგი">სკაირანინგი</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>🎖️ სპორტული თანრიგი / რანგი *</label>
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
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>🏢 ფედერაციის/ორგანიზაციის დასახელება *</label>
              <input
                type="text"
                placeholder="მაგ: საქართველოს მთამსვლელთა გაერთიანებული ფედერაცია"
                value={newAct.organization || ''}
                onChange={e => setNewAct({ ...newAct, organization: e.target.value })}
                style={{ width: "100%", padding: "6px 10px", backgroundColor: "#1e222b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "12px", boxSizing: "border-box", outline: "none" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>📅 მინიჭების თარიღი *</label>
              <input
                type="date"
                value={newAct.date}
                onChange={e => setNewAct({ ...newAct, date: e.target.value })}
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
                {dbTitles.length === 0 ? (
                  <option value="">-- წოდებები არ არის --</option>
                ) : (
                  dbTitles.map(t => (
                    <option key={t.id} value={t.title_name}>{t.title_name}</option>
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
              <select
                value={newAct.awardName}
                onChange={e => setNewAct({ ...newAct, awardName: e.target.value })}
                style={{ width: "100%", padding: "6px 10px", backgroundColor: "#1e222b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "12px", outline: "none" }}
              >
                {dbAwards.length === 0 ? (
                  <option value="">-- ჯილდოები არ არის --</option>
                ) : (
                  dbAwards.map(a => (
                    <option key={a.id} value={a.award_name}>{a.award_name}</option>
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
          backgroundColor: "var(--color-emerald-core)",
          color: "#121418",
          border: "none",
          padding: "8px 16px",
          borderRadius: "6px",
          fontSize: "12px",
          fontWeight: "bold",
          cursor: "pointer",
          alignSelf: "flex-end",
          marginTop: "5px",
          transition: "all 0.3s ease",
          boxShadow: "0 0 10px color-mix(in oklab, var(--color-emerald-core) 30%, transparent)"
        }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = "0 0 15px var(--color-emerald-core)";
          e.currentTarget.style.transform = "scale(1.02)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = "0 0 10px color-mix(in oklab, var(--color-emerald-core) 30%, transparent)";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {newAct.type === 'rank_up' ? 'თანრიგის მინიჭება / შენახვა' : 'დამატება'}
      </button>
    </div>
  );
};

export default TimelineAddForm;
