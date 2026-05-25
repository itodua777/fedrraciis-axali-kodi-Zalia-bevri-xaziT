import React from 'react';

const SpaceAddForm = ({
  handleSubmit,
  setShowAddForm,
  name, setName,
  area, setArea,
  capacity, setCapacity,
  ownerType, setOwnerType,
  trainingProfiles, toggleProfile,
  is247, setIs247,
  selectedDays, toggleDay,
  timeRange, setTimeRange,
  startDate, setStartDate,
  endDate, setEndDate
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
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 30px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <h2 style={{ color: "#fff", margin: 0, fontSize: "18px" }}>ახალი სივრცის რეგისტრაცია</h2>
          <button onClick={() => setShowAddForm(false)} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "20px" }}><i className="fa-solid fa-xmark"></i></button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "30px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
              <div style={{ backgroundColor: "color-mix(in oklab, var(--color-emerald-core) 15%, transparent)", color: "var(--color-emerald-core)", padding: "5px 10px", borderRadius: "4px", fontWeight: "bold" }}>A</div>
              <h3 style={{ margin: 0, color: "#fff", fontSize: "16px" }}>ძირითადი მონაცემები</h3>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", marginBottom: "5px", display: "block" }}>სივრცის დასახელება *</label>
                <input type="text" placeholder="მაგ: შატილის საბაზო ბანაკი" value={name} onChange={e => setName(e.target.value)} required style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.02)", color: "#fff", boxSizing: "border-box" }} />
              </div>
              
              <div style={{ display: "flex", gap: "15px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", marginBottom: "5px", display: "block" }}>ფართობი (კვ.მ)</label>
                  <div style={{ position: "relative" }}>
                    <input type="number" placeholder="120" value={area} onChange={e => setArea(e.target.value)} style={{ width: "100%", padding: "12px 55px 12px 12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.02)", color: "#fff", boxSizing: "border-box" }} />
                    <span style={{ position: "absolute", right: "12px", top: "12px", color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>კვ.მ</span>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", marginBottom: "5px", display: "block" }}>მოცულობა (მაქს. სპორტსმენი)</label>
                  <div style={{ position: "relative" }}>
                    <input type="number" placeholder="25" value={capacity} onChange={e => setCapacity(e.target.value)} style={{ width: "100%", padding: "12px 55px 12px 12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.02)", color: "#fff", boxSizing: "border-box" }} />
                    <span style={{ position: "absolute", right: "12px", top: "12px", color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>სპორტ.</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", marginBottom: "5px", display: "block" }}>საკუთრების ტიპი</label>
                <div style={{ display: "flex", gap: "0", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden", backgroundColor: "rgba(255,255,255,0.02)" }}>
                  <button type="button" onClick={() => setOwnerType('საჯარო სივრცე')} style={{ flex: 1, padding: "12px", backgroundColor: ownerType === 'საჯარო სივრცე' ? "rgba(15, 23, 42, 0.8)" : "transparent", color: ownerType === 'საჯარო სივრცე' ? "var(--color-emerald-core)" : "rgba(255,255,255,0.5)", border: "none", cursor: "pointer", transition: "all 0.3s" }}>საჯარო სივრცე</button>
                  <button type="button" onClick={() => setOwnerType('კერძო საკუთრება')} style={{ flex: 1, padding: "12px", backgroundColor: ownerType === 'კერძო საკუთრება' ? "rgba(15, 23, 42, 0.8)" : "transparent", color: ownerType === 'კერძო საკუთრება' ? "var(--color-emerald-core)" : "rgba(255,255,255,0.5)", border: "none", cursor: "pointer", transition: "all 0.3s" }}>კერძო საკუთრება</button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
              <div style={{ backgroundColor: "color-mix(in oklab, var(--color-emerald-core) 15%, transparent)", color: "var(--color-emerald-core)", padding: "5px 10px", borderRadius: "4px", fontWeight: "bold" }}>B</div>
              <h3 style={{ margin: 0, color: "#fff", fontSize: "16px" }}>ოპერაციული პროფილი</h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", marginBottom: "10px", display: "block" }}>სავარჯიშო პროფილი</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {['ფიზიკური მომზადება', 'სამაშველო მომზადება', 'კლდეზე ცოცვა', 'ყინულზე ცოცვა', 'Dry-tooling', 'ბოლდერინგი'].map(profile => (
                    <div key={profile} onClick={() => toggleProfile(profile)} style={{ padding: "8px 16px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: trainingProfiles.includes(profile) ? "color-mix(in oklab, var(--color-emerald-core) 10%, transparent)" : "rgba(255,255,255,0.05)", color: trainingProfiles.includes(profile) ? "var(--color-emerald-core)" : "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: "13px", transition: "all 0.2s" }}>
                      {profile}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", marginBottom: "10px", display: "block" }}>სამუშაო საათები</label>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", color: "#fff", cursor: "pointer", marginBottom: "15px", fontSize: "14px" }}>
                  <input type="checkbox" checked={is247} onChange={e => setIs247(e.target.checked)} style={{ width: "18px", height: "18px", accentColor: "var(--color-emerald-core)" }} />
                  24/7 (უწყვეტი რეჟიმი)
                </label>
                
                {!is247 && (
                  <div style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "15px" }}>
                    <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                      {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                        <div key={day} onClick={() => toggleDay(day)} style={{ width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: selectedDays.includes(day) ? "var(--color-emerald-core)" : "rgba(255,255,255,0.05)", color: selectedDays.includes(day) ? "#121418" : "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: "14px", fontWeight: selectedDays.includes(day) ? "bold" : "normal" }}>
                          {day}
                        </div>
                      ))}
                    </div>
                    <div>
                       <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "5px", display: "block" }}>დროის დიაპაზონი</label>
                       <input type="text" value={timeRange} onChange={e => setTimeRange(e.target.value)} style={{ width: "200px", padding: "10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "transparent", color: "#fff", boxSizing: "border-box" }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
              <div style={{ backgroundColor: "color-mix(in oklab, var(--color-emerald-core) 15%, transparent)", color: "var(--color-emerald-core)", padding: "5px 10px", borderRadius: "4px", fontWeight: "bold" }}>C</div>
              <h3 style={{ margin: 0, color: "#fff", fontSize: "16px" }}>იურიდიული დოკუმენტაცია</h3>
            </div>

            <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", marginBottom: "5px", display: "block" }}>ძალაში შესვლა</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.02)", color: "#fff", boxSizing: "border-box" }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", marginBottom: "5px", display: "block" }}>ვადის ამოწურვა</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.02)", color: "#fff", boxSizing: "border-box" }} />
              </div>
            </div>

            <div style={{ border: "1px dashed rgba(255,255,255,0.2)", borderRadius: "12px", padding: "30px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.02)", cursor: "pointer" }}>
              <div style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundColor: "rgba(15, 23, 42, 0.8)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "15px" }}>
                <i className="fa-solid fa-cloud-arrow-up" style={{ color: "var(--color-emerald-core)", fontSize: "20px" }}></i>
              </div>
              <div style={{ color: "#fff", marginBottom: "5px" }}>ხელშეკრულების ატვირთვა</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>PDF, JPG ან PNG (მაქს. 10MB)</div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "15px", marginTop: "10px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px" }}>
            <button type="button" onClick={() => setShowAddForm(false)} style={{ padding: "12px 24px", backgroundColor: "rgba(255,255,255,0.05)", border: "none", color: "#fff", borderRadius: "24px", cursor: "pointer", transition: "all 0.3s" }}>გაუქმება</button>
            <button type="submit" style={{ padding: "12px 30px", backgroundColor: "var(--color-emerald-core)", border: "none", color: "#121418", borderRadius: "24px", cursor: "pointer", fontWeight: "bold", transition: "all 0.3s" }}>შენახვა</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpaceAddForm;
