import React from 'react';
import { useRatingSettingsStore, calculateRating } from '../../context/ratingSettingsStore.js';
import { useRanksStore } from '../../context/ranksStore.js';
import AthleteAvatarWrapper from '../Athletes/components/AthleteAvatarWrapper.jsx';

const LazyRanksValidationEngine = ({ athletes, onUpdateAthlete }) => {
  const [Component, setComponent] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetch('src/components/management/RanksValidationEngine.tsx')
      .then(res => {
        if (!res.ok) throw new Error("ფაილის წაკითხვა ვერ მოხერხდა: RanksValidationEngine.tsx");
        return res.text();
      })
      .then(code => {
        // Strip imports and exports to make it compatible with Babel Standalone in the global window context
        const cleanedCode = code
          .replace(/import\s+[\s\S]*?\s+from\s+['"].*?['"];?/g, '')
          .replace(/export\s+default\s+/g, 'window.RanksValidationEngine = ')
          .replace(/export\s+const\s+/g, 'const ')
          .replace(/export\s+enum\s+/g, 'enum ')
          .replace(/export\s+interface\s+/g, 'interface ');

        const compiled = window.Babel.transform(cleanedCode, {
          filename: 'RanksValidationEngine.tsx',
          presets: ['react', 'typescript']
        }).code;

        const runCode = new Function(compiled);
        runCode();

        if (window.RanksValidationEngine) {
          setComponent(() => window.RanksValidationEngine);
        } else {
          throw new Error("კომპონენტის რეგისტრაცია ვერ მოხერხდა.");
        }
      })
      .catch(err => {
        console.error(err);
        setError("შეცდომა ჩატვირთვისას: " + err.message);
      });
  }, []);

  if (error) {
    return (
      <div style={{ color: '#f87171', padding: '20px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px' }}>
        <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '8px' }}></i>
        {error}
      </div>
    );
  }

  if (!Component) {
    return (
      <div style={{ color: 'var(--color-emerald-core)', padding: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '18px' }}></i>
        <span>მთამსვლელთა თანრიგების მართვის პანელი იტვირთება...</span>
      </div>
    );
  }

  return <Component athletes={athletes} onUpdateAthlete={onUpdateAthlete} />;
};

const SettingsDashboard = ({ athletes, onUpdateAthlete }) => {
  const store = useRatingSettingsStore();
  const ranksStore = useRanksStore();
  const [activeTab, setActiveTab] = React.useState("ranks");

  const [newCat, setNewCat] = React.useState("");
  const [newStyle, setNewStyle] = React.useState("");

  const [simHeight, setSimHeight] = React.useState(5054);
  const [simLevel, setSimLevel] = React.useState("UIAA V");
  const [simStyle, setSimStyle] = React.useState("On-sight");

  const simScore = calculateRating(simHeight, simLevel, simStyle);

  const containerStyle = {
    flex: 1, padding: "30px", backgroundColor: "#121418", color: "#e2e8f0",
    fontFamily: "sans-serif", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px"
  };

  const cardStyle = {
    backgroundColor: "rgba(15, 23, 42, 0.6)", border: "1px solid color-mix(in oklab, var(--color-emerald-core) 10%, transparent)",
    borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)", gap: "15px"
  };

  const inputStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px", padding: "8px 12px", color: "#fff", outline: "none", width: "100%", boxSizing: "border-box"
  };

  const rowStyle = {
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)"
  };

  const tabContainerStyle = {
    display: "flex", gap: "15px", borderBottom: "1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)", paddingBottom: "15px", marginBottom: "10px"
  };

  const tabButtonStyle = (tabId) => ({
    backgroundColor: "transparent",
    color: activeTab === tabId ? "#fff" : "rgba(226, 232, 240, 0.6)",
    border: activeTab === tabId ? "1px solid var(--color-emerald-core)" : "1px solid transparent",
    borderRadius: "20px",
    padding: "8px 24px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    boxShadow: activeTab === tabId ? "0 0 10px color-mix(in oklab, var(--color-emerald-core) 20%, transparent)" : "none",
    transition: "all 0.3s"
  });

  const switchBoxStyle = {
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    border: "1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.4), inset 0 0 10px color-mix(in oklab, var(--color-emerald-core) 5%, transparent)",
    backdropFilter: "blur(4px)"
  };

  const switchRowStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    gap: "20px"
  };

  const switchLabelStyle = {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#e2e8f0"
  };

  const switchBtnStyle = (enabled) => ({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: enabled ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.1)",
    border: `2px solid ${enabled ? "#10b981" : "#ef4444"}`,
    borderRadius: "30px",
    padding: "6px 16px",
    color: enabled ? "#10b981" : "#f87171",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "12px",
    boxShadow: enabled ? "0 0 15px rgba(16, 185, 129, 0.3)" : "0 0 10px rgba(239, 68, 68, 0.2)",
    transition: "all 0.3s ease",
    outline: "none"
  });

  return (
    <div style={containerStyle}>
      <div style={switchBoxStyle}>
        <h3 style={{ margin: "0 0 5px 0", color: "#fff", fontSize: "16px", fontWeight: "bold" }}>
          ⚙️ ფედერაციის პარამეტრები (Settings Panel)
        </h3>
        <p style={{ margin: 0, color: "rgba(255, 255, 255, 0.5)", fontSize: "12px", marginBottom: "10px" }}>
          გლობალური გადამრთველები ფედერაციის სისტემების სამართავად.
        </p>
        <div style={switchRowStyle}>
          <span style={switchLabelStyle}>თანრიგთა სისტემის აქტივაცია (მექანიკური მართვა)</span>
          <button 
            onClick={() => store.toggleRanksEnabled()}
            style={switchBtnStyle(store.ranksEnabled !== false)}
          >
            <span>{store.ranksEnabled !== false ? "🟢 ON" : "🔴 OFF"}</span>
          </button>
        </div>
        <div style={{ ...switchRowStyle, borderBottom: "none" }}>
          <span style={switchLabelStyle}>რეიტინგის კალკულაციის აქტივაცია (გლობალური თოგლი)</span>
          <button 
            onClick={() => store.toggleRatingCalculationEnabled()}
            style={switchBtnStyle(store.ratingCalculationEnabled !== false)}
          >
            <span>{store.ratingCalculationEnabled !== false ? "🟢 ON" : "🔴 OFF"}</span>
          </button>
        </div>
      </div>

      <div style={tabContainerStyle}>
        <button style={tabButtonStyle('rating')} onClick={() => setActiveTab('rating')}>რეიტინგის კალკულაცია</button>
        <button style={tabButtonStyle('ranks')} onClick={() => setActiveTab('ranks')}>თანრიგთა სისტემა</button>
      </div>

      {activeTab === 'rating' && (
        store.ratingCalculationEnabled === false ? (
          <div style={{ ...cardStyle, border: "1px dashed rgba(239, 68, 68, 0.3)", padding: "40px", textAlign: "center" }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: "36px", color: "#ef4444", marginBottom: "15px" }}></i>
            <h3 style={{ color: "#fff", margin: "0 0 10px 0", fontSize: "18px" }}>რეიტინგების სისტემა დროებით გამორთულია ფედერაციის მიერ</h3>
            <p style={{ color: "rgba(255, 255, 255, 0.4)", margin: 0, fontSize: "13px" }}>
              რეიტინგების გამოთვლა, ქულების დარიცხვა და ასვლების რეგისტრაცია გაყინულია ადმინისტრაციის მიერ.
            </p>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
              {/* Card 1: UIAA */}
              <div style={cardStyle}>
                <h3 style={{ color: "var(--color-emerald-core)", margin: "0 0 10px 0", fontSize: "16px" }}><i className="fa-solid fa-mountain"></i> UIAA საბაზისო ქულები</h3>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {Object.entries(store.uiaaDictionary || {}).map(([level, point]) => (
                    <div key={level} style={rowStyle}>
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>{level}</span>
                      <input type="number" style={{ ...inputStyle, width: "80px" }} value={point} onChange={e => store.updateUiaaPoint(level, parseFloat(e.target.value) || 0)} />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <input type="text" placeholder="ახალი კატეგორია" style={inputStyle} value={newCat} onChange={e => setNewCat(e.target.value)} />
                  <button onClick={() => { if(newCat) { store.addUiaaCategory(newCat); setNewCat(""); } }} style={{ backgroundColor: "color-mix(in oklab, var(--color-emerald-core) 10%, transparent)", border: "1px solid var(--color-emerald-core)", color: "var(--color-emerald-core)", padding: "8px 12px", borderRadius: "8px", cursor: "pointer" }}>+</button>
                </div>
              </div>

              {/* Card 2: Styles */}
              <div style={cardStyle}>
                <h3 style={{ color: "var(--color-emerald-core)", margin: "0 0 10px 0", fontSize: "16px" }}><i className="fa-solid fa-person-snowboarding"></i> ასვლის სტილის კოეფიციენტი</h3>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {Object.entries(store.uiaaStyleMultipliers || {}).map(([style, mult]) => (
                    <div key={style} style={rowStyle}>
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>{style}</span>
                      <input type="number" step="0.1" style={{ ...inputStyle, width: "80px" }} value={mult} onChange={e => store.updateStyleMultiplier(style, parseFloat(e.target.value) || 0)} />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <input type="text" placeholder="ახალი სტილი" style={inputStyle} value={newStyle} onChange={e => setNewStyle(e.target.value)} />
                  <button onClick={() => { if(newStyle) { store.addStyle(newStyle); setNewStyle(""); } }} style={{ backgroundColor: "color-mix(in oklab, var(--color-emerald-core) 10%, transparent)", border: "1px solid var(--color-emerald-core)", color: "var(--color-emerald-core)", padding: "8px 12px", borderRadius: "8px", cursor: "pointer" }}>+</button>
                </div>
              </div>

              {/* Card 3: Height Divisor */}
              <div style={cardStyle}>
                <h3 style={{ color: "var(--color-emerald-core)", margin: "0 0 10px 0", fontSize: "16px" }}><i className="fa-solid fa-ruler-vertical"></i> სიმაღლის პარამეტრები</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <label style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>სიმაღლის გამყოფი კოეფიციენტი</label>
                  <input type="number" style={inputStyle} value={store.heightDivisor} onChange={e => store.updateHeightDivisor(parseFloat(e.target.value) || 1)} />
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                    ეს რიცხვი განსაზღვრავს რეიტინგის სიმკაცრეს მთელ სისტემაში.
                  </div>
                </div>
              </div>
            </div>

            {/* Simulator */}
            <div style={{ ...cardStyle, border: "1px solid #f59e0b", marginTop: "20px" }}>
              <h3 style={{ color: "#f59e0b", margin: "0 0 15px 0", fontSize: "18px", display: "flex", alignItems: "center", gap: "10px" }}>
                <i className="fa-solid fa-calculator"></i> სიმულატორი (Live Sandbox Testing)
              </h3>
              <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>მწვერვალის სიმაღლე</label>
                  <input type="number" style={inputStyle} value={simHeight} onChange={e => setSimHeight(parseFloat(e.target.value) || 0)} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>სირთულე (UIAA)</label>
                  <select style={inputStyle} value={simLevel} onChange={e => setSimLevel(e.target.value)}>
                    {Object.keys(store.uiaaDictionary || {}).map(lvl => (
                      <option key={lvl} value={lvl}>{lvl} ({store.uiaaDictionary[lvl]})</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>სტილი</label>
                  <select style={inputStyle} value={simStyle} onChange={e => setSimStyle(e.target.value)}>
                    {Object.keys(store.uiaaStyleMultipliers || {}).map(s => (
                      <option key={s} value={s}>{s} ({store.uiaaStyleMultipliers[s]})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", border: "1px dashed #f59e0b", borderRadius: "8px", padding: "20px", marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "16px", color: "#f59e0b", fontWeight: "bold" }}>⚡ რეალური დროის სატესტო შედეგი:</span>
                <span style={{ fontSize: "32px", color: "#fff", fontWeight: "bold", textShadow: "0 0 10px rgba(245, 158, 11, 0.5)" }}>{simScore} ქულა</span>
              </div>
            </div>
          </>
        )
      )}

      {activeTab === 'ranks' && (
        <LazyRanksValidationEngine athletes={athletes} onUpdateAthlete={onUpdateAthlete} />
      )}
    </div>
  );
};

export default SettingsDashboard;
