import React from 'react';

const AddIncidentForm = ({ onViewChange, onAdd, athletes = [] }) => {
  const [formData, setFormData] = React.useState({
    athleteId: '',
    date: '',
    time: '',
    location: '',
    severity: '',
    description: '',
    status: 'მიმდინარე',
    attachments: []
  });
  const [error, setError] = React.useState('');

  const handleFileDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer ? e.dataTransfer.files : e.target.files);
    const validExtensions = ['image/jpeg', 'image/png', 'application/pdf'];
    
    let validFiles = [];
    let hasInvalid = false;

    files.forEach(file => {
      if (validExtensions.includes(file.type)) {
        validFiles.push({ filename: file.name, type: file.type, path: URL.createObjectURL(file) });
      } else {
        hasInvalid = true;
      }
    });

    if (hasInvalid) {
      setError("მხოლოდ .jpg, .png და .pdf ფორმატებია დაშვებული.");
    } else {
      setError("");
    }

    if (validFiles.length > 0) {
      setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...validFiles] }));
    }
  };

  const handleSubmit = () => {
    if (!formData.athleteId || !formData.date || !formData.time || !formData.location || !formData.severity || !formData.description) {
      setError("გთხოვთ შეავსოთ ყველა სავალდებულო (*) ველი.");
      return;
    }
    onAdd(formData);
    onViewChange('incidents');
  };

  const inputStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px", padding: "12px", color: "#fff", outline: "none", width: "100%", boxSizing: "border-box"
  };

  return (
    <div style={{ flex: 1, padding: "30px", backgroundColor: "#121418", overflowY: "auto" }}>
      <div style={{ margin: "0 auto", width: "100%", maxWidth: "800px", backgroundColor: "rgba(15, 23, 42, 0.8)", borderRadius: "12px", overflow: "hidden", border: "1px solid color-mix(in oklab, var(--color-emerald-core) 10%, transparent)" }}>
        
        <div style={{ backgroundColor: "#f59e0b", padding: "15px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: "bold", fontSize: "18px" }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ color: "#000" }}></i> შემთხვევის აღრიცხვა
          </div>
          <i className="fa-solid fa-xmark" style={{ cursor: "pointer", fontSize: "18px" }} onClick={() => onViewChange('incidents')}></i>
        </div>

        <div style={{ padding: "30px" }}>
          {error && <div style={{ color: "#ef4444", marginBottom: "15px", fontSize: "14px", backgroundColor: "rgba(239, 68, 68, 0.1)", padding: "10px", borderRadius: "8px" }}>{error}</div>}

          <div style={{ marginBottom: "25px" }}>
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px", marginBottom: "20px", fontWeight: "bold", color: "#fff" }}>ძირითადი ინფორმაცია</div>
            
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>თანამშრომელი / პიროვნება <span style={{color: "#ef4444"}}>*</span></label>
              <select style={inputStyle} value={formData.athleteId} onChange={e => setFormData({...formData, athleteId: e.target.value})}>
                <option value="">-- აირჩიეთ პიროვნება --</option>
                {athletes.map(a => (
                  <option key={a.id} value={a.id}>{a.firstName} {a.lastName} ({a.personalId})</option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>თარიღი <span style={{color: "#ef4444"}}>*</span></label>
                <input type="date" style={inputStyle} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>დრო <span style={{color: "#ef4444"}}>*</span></label>
                <input type="time" style={inputStyle} value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
              </div>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>ადგილმდებარეობა <span style={{color: "#ef4444"}}>*</span></label>
              <input type="text" style={inputStyle} placeholder="მაგ: ცენტრალური ოფისი, მე-2 სართული" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>სიმძიმის ხარისხი <span style={{color: "#ef4444"}}>*</span></label>
              <select style={inputStyle} value={formData.severity} onChange={e => setFormData({...formData, severity: e.target.value})}>
                <option value="">-- აირჩიეთ --</option>
                <option value="დაბალი">დაბალი (უმნიშვნელო)</option>
                <option value="საშუალო">საშუალო (საყურადღებო)</option>
                <option value="მაღალი">მაღალი (კრიტიკული)</option>
              </select>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>შემთხვევის აღწერა <span style={{color: "#ef4444"}}>*</span></label>
              <textarea style={{...inputStyle, height: "100px", resize: "vertical"}} placeholder="დეტალურად აღწერეთ რა მოხდა..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontWeight: "bold", color: "#fff" }}>მტკიცებულებები და დოკუმენტაცია</span>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", backgroundColor: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: "10px" }}>ფოტოები, დასკვნები</span>
            </div>
            
            <div 
              onDragOver={e => e.preventDefault()} 
              onDrop={handleFileDrop}
              style={{ border: "1px dashed rgba(255,255,255,0.3)", borderRadius: "12px", padding: "40px", textAlign: "center", cursor: "pointer", position: "relative", backgroundColor: "rgba(0,0,0,0.2)" }}>
              <input type="file" multiple accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileDrop} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }} />
              <div style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 15px auto" }}>
                <i className="fa-solid fa-arrow-up-from-bracket" style={{ fontSize: "20px", color: "rgba(255,255,255,0.5)" }}></i>
              </div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>Drag & Drop ან დააკლიკეთ ასატვირთად</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginTop: "5px" }}>მხოლოდ .jpg, .png, .pdf</div>
            </div>

            {formData.attachments.length > 0 && (
              <div style={{ marginTop: "15px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {formData.attachments.map((file, idx) => (
                  <div key={idx} style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "5px 10px", borderRadius: "8px", fontSize: "12px", color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
                    <i className={file.type.includes('pdf') ? "fa-solid fa-file-pdf" : "fa-solid fa-image"}></i>
                    {file.filename}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ backgroundColor: "rgba(0,0,0,0.2)", padding: "20px 30px", display: "flex", justifyContent: "flex-end", gap: "15px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <button onClick={() => onViewChange('incidents')} style={{ backgroundColor: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", padding: "10px 20px", borderRadius: "20px", cursor: "pointer", transition: "all 0.3s" }}>გაუქმება</button>
          <button onClick={handleSubmit} style={{ backgroundColor: "#f59e0b", border: "none", color: "#fff", padding: "10px 20px", borderRadius: "20px", cursor: "pointer", fontWeight: "bold" }}>ბაზაში დამატება</button>
        </div>

      </div>
    </div>
  );
};

export default AddIncidentForm;
