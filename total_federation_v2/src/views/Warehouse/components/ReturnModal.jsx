import React from 'react';

const ReturnModal = ({ isOpen, onClose, onReturnConfirm, selectedTransactionForReturn }) => {
  const [returnForm, setReturnForm] = React.useState({
    status: 'good',
    damageReason: ''
  });
  const [damageReason, setDamageReason] = React.useState('');
  const [returnReasonType, setReturnReasonType] = React.useState('objective');
  const [uploadedPhoto, setUploadedPhoto] = React.useState('');
  
  const [showReturnConfirmStep, setShowReturnConfirmStep] = React.useState(false);
  const [returnTimestamp, setReturnTimestamp] = React.useState(null);

  React.useEffect(() => {
    if (isOpen) {
      setReturnForm({ status: 'good', damageReason: '' });
      setDamageReason('');
      setReturnReasonType('objective');
      setUploadedPhoto('');
      setShowReturnConfirmStep(false);
      setReturnTimestamp(null);
    }
  }, [isOpen]);

  React.useEffect(() => {
    let interval;
    if (showReturnConfirmStep) {
      setReturnTimestamp(new Date());
      interval = setInterval(() => {
        setReturnTimestamp(new Date());
      }, 1000);
    } else {
      setReturnTimestamp(null);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showReturnConfirmStep]);

  if (!isOpen || !selectedTransactionForReturn) return null;

  const formatTimestamp = (date) => {
    if (!date) return '';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  };

  const handleReturnStepSubmit = (e) => {
    e.preventDefault();
    setShowReturnConfirmStep(true);
  };

  const handleFinalConfirm = () => {
    onReturnConfirm({
      status: returnForm.status,
      damageReason: damageReason,
      returnReasonType: returnReasonType,
      uploadedPhoto: uploadedPhoto,
      returnTimestamp: returnTimestamp
    });
  };

  const modalOverlayStyle = {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.75)", display: "flex", justifyContent: "center",
    alignItems: "center", zIndex: 9999, padding: "20px", backdropFilter: "blur(4px)"
  };

  const modalContentStyle = {
    backgroundColor: "#1e293b", border: "1px solid color-mix(in oklab, var(--color-emerald-core) 30%, transparent)",
    borderRadius: "16px", padding: "30px", width: "100%", maxWidth: "600px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)", maxHeight: "85vh", overflowY: "auto"
  };

  const formGroupStyle = {
    display: "flex", flexDirection: "column", gap: "6px", marginBottom: "15px"
  };

  const inputStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px", padding: "10px 14px", color: "#fff", outline: "none", fontSize: "14px"
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        {!showReturnConfirmStep ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, color: "#fff" }}>
                <i className="fa-solid fa-rotate-left" style={{ color: "#10b981", marginRight: "10px" }}></i>
                ინვენტარის დაბრუნება: {selectedTransactionForReturn?.itemName}
              </h3>
              <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "20px" }}><i className="fa-solid fa-xmark"></i></button>
            </div>

            <form onSubmit={handleReturnStepSubmit}>
              <div style={{ ...formGroupStyle, marginBottom: "20px" }}>
                <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>მდგომარეობა მიღებისას</label>
                <div style={{ display: "flex", gap: "15px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "#fff" }}>
                    <input 
                      type="radio" name="returnStatus" value="good" checked={returnForm.status === 'good'}
                      onChange={() => setReturnForm({ ...returnForm, status: 'good' })} 
                    />
                    ვარგისი / ჩვეულებრივი
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "#ef4444", fontWeight: "bold" }}>
                    <input 
                      type="radio" name="returnStatus" value="damaged" checked={returnForm.status === 'damaged'}
                      onChange={() => setReturnForm({ ...returnForm, status: 'damaged' })} 
                    />
                    დაზიანებული / ჩამოწერილი
                  </label>
                </div>
              </div>

              {returnForm.status === 'damaged' && (
                <>
                  <div style={formGroupStyle}>
                    <label style={{ fontSize: "12px", color: "#ef4444", fontWeight: "bold" }}>დაზიანების მიზეზი (ზარალის პროტოკოლი) *</label>
                    <textarea 
                      required style={{ ...inputStyle, minHeight: "80px", fontFamily: "sans-serif" }} 
                      placeholder="აღწერეთ ექსპედიციის ხელმძღვანელის ახსნა-განმარტება..."
                      value={damageReason}
                      onChange={(e) => setDamageReason(e.target.value)}
                    />
                  </div>

                  <div style={formGroupStyle}>
                    <label style={{ fontSize: "12px", color: "#ef4444", fontWeight: "bold" }}>დაზიანების ხასიათი *</label>
                    <select 
                      required style={inputStyle}
                      value={returnReasonType}
                      onChange={(e) => setReturnReasonType(e.target.value)}
                    >
                      <option value="objective">ობიექტური / ფორსმაჟორი</option>
                      <option value="subjective">სუბიექტური / დაუდევრობა (სანქციით)</option>
                    </select>
                  </div>

                  <div style={formGroupStyle}>
                    <label style={{ fontSize: "12px", color: "#ef4444", fontWeight: "bold" }}>ფოტო-მტკიცებულება *</label>
                    <input 
                      type="file" 
                      required 
                      accept="image/*"
                      style={{ ...inputStyle, color: "#cbd5e1" }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setUploadedPhoto(file.name);
                        }
                      }}
                    />
                    {uploadedPhoto && (
                      <div style={{ fontSize: "11px", color: "#10b981", marginTop: "4px" }}>
                        <i className="fa-solid fa-image"></i> ატვირთულია: {uploadedPhoto}
                      </div>
                    )}
                  </div>
                </>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
                <button type="button" onClick={onClose} style={{ backgroundColor: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>გაუქმება</button>
                <button type="submit" style={{ backgroundColor: "#10b981", border: "none", color: "#fff", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>დადასტურება</button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, color: "#fff" }}>
                <i className="fa-solid fa-clock" style={{ color: "#f59e0b", marginRight: "10px" }}></i>
                ✏️ დაბრუნების დადასტურება
              </h3>
              <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "20px" }}><i className="fa-solid fa-xmark"></i></button>
            </div>

            <div style={{ color: "#fff", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
              <div>
                <span style={{ color: "rgba(255,255,255,0.5)" }}>ინვენტარი: </span>
                <strong style={{ color: "var(--color-emerald-core)" }}>{selectedTransactionForReturn?.itemName} #{selectedTransactionForReturn?.itemCode}</strong>
              </div>
              <div>
                <span style={{ color: "rgba(255,255,255,0.5)" }}>პასუხისმგებელი: </span>
                <strong>{selectedTransactionForReturn?.athleteName}</strong>
              </div>

              <div style={{ marginTop: "15px", padding: "15px", backgroundColor: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "8px" }}>
                <div style={{ color: "#f59e0b", fontWeight: "bold", fontSize: "14px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <i className="fa-solid fa-triangle-exclamation"></i> ⚠️ სისტემა აფიქსირებს დაბრუნების ზუსტ დროს:
                </div>
                <div style={{ fontFamily: "monospace", fontSize: "20px", color: "#fff", fontWeight: "bold", textAlign: "center", padding: "5px 0" }}>
                  [ {formatTimestamp(returnTimestamp)} ]
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
              <button type="button" onClick={() => setShowReturnConfirmStep(false)} style={{ backgroundColor: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>გაუქმება</button>
              <button type="button" onClick={handleFinalConfirm} style={{ backgroundColor: "#10b981", border: "none", color: "#fff", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px" }}>
                <i className="fa-solid fa-check"></i> ✓ დროის დადასტურება
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReturnModal;
