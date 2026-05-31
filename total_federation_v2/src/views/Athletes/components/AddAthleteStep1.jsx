import React from 'react';
import SearchableDropdown from '../../../components/ui/SearchableDropdown.jsx';
import InternationalPhoneInput from '../../../components/ui/InternationalPhoneInput.jsx';
import { COUNTRIES } from '../../../utils/countries.js';

const AddAthleteStep1 = ({ formData, updateData, clubs, isMinor, error }) => {
  const [isCameraOpen, setIsCameraOpen] = React.useState(false);
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setIsCameraOpen(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      updateData('photoPreview', dataUrl);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateData('photoPreview', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const inputGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "20px",
    flex: 1
  };

  const labelStyle = {
    fontSize: "13px",
    color: "rgba(226, 232, 240, 0.7)"
  };

  const inputStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid color-mix(in oklab, var(--color-emerald-core) 30%, transparent)",
    borderRadius: "8px",
    padding: "12px",
    color: "#fff",
    outline: "none",
    transition: "all 0.3s"
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", flex: 1 }}>
      <div style={{ display: "flex", gap: "30px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px", flexShrink: 0 }}>
          <div style={{ width: "120px", height: "120px", border: "2px solid var(--color-emerald-core)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "var(--color-emerald-core)", cursor: "pointer", position: "relative", overflow: "hidden", boxShadow: "0 0 15px color-mix(in oklab, var(--color-emerald-core) 40%, transparent)" }}>
            {!isCameraOpen && <input type="file" accept="image/*" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer", zIndex: 10 }} onChange={handlePhotoUpload} />}
            {isCameraOpen ? (
              <video ref={videoRef} autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }}></video>
            ) : formData.photoPreview ? (
              <img src={formData.photoPreview} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Avatar Preview" />
            ) : (
              <>
                <i className="fa-solid fa-image" style={{ fontSize: "24px", marginBottom: "8px" }}></i>
                <span style={{ fontSize: "12px", textAlign: "center" }}>ატვირთვა</span>
              </>
            )}
          </div>
          
          {!isCameraOpen ? (
            <button type="button" onClick={startCamera} style={{ background: "color-mix(in oklab, var(--color-emerald-core) 10%, transparent)", border: "1px solid var(--color-emerald-core)", color: "var(--color-emerald-core)", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.3s" }}>
              <i className="fa-solid fa-camera"></i> კამერით გადაღება
            </button>
          ) : (
            <div style={{ display: "flex", gap: "8px" }}>
              <button type="button" onClick={capturePhoto} style={{ background: "var(--color-emerald-core)", border: "none", color: "#121418", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px" }}>
                <i className="fa-solid fa-camera"></i> გადაღება
              </button>
              <button type="button" onClick={stopCamera} style={{ background: "transparent", border: "1px solid #ef4444", color: "#ef4444", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "5px" }}>
                <i className="fa-solid fa-xmark"></i> გაუქმება
              </button>
            </div>
          )}
          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        </div>
        <div style={{ flex: 1, display: "flex", flexWrap: "wrap", gap: "10px 20px" }}>
          <div style={{ ...inputGroupStyle, minWidth: "200px" }}>
            <label style={labelStyle}>სახელი</label>
            <input style={inputStyle} value={formData.firstName} onChange={e => updateData('firstName', e.target.value)} placeholder="სახელი" />
          </div>
          <div style={{ ...inputGroupStyle, minWidth: "200px" }}>
            <label style={labelStyle}>გვარი</label>
            <input style={inputStyle} value={formData.lastName} onChange={e => updateData('lastName', e.target.value)} placeholder="გვარი" />
          </div>
          <div style={{ ...inputGroupStyle, minWidth: "200px" }}>
            <label style={labelStyle}>პირადი ნომერი</label>
            <input 
              style={inputStyle} 
              value={formData.personalId} 
              onChange={e => {
                let val = e.target.value;
                if (formData.nationality === 'GE') {
                  val = val.replace(/\D/g, '').slice(0, 11);
                }
                updateData('personalId', val);
              }} 
              placeholder={formData.nationality === 'GE' ? "11-ნიშნა პირადი ნომერი" : "ID ნომერი"} 
              maxLength={formData.nationality === 'GE' ? 11 : undefined}
            />
          </div>
          <div style={{ ...inputGroupStyle, minWidth: "200px" }}>
            <label style={labelStyle}>დაბადების თარიღი</label>
            <input type="date" style={inputStyle} value={formData.birthDate} onChange={e => updateData('birthDate', e.target.value)} />
          </div>
          <div style={{ ...inputGroupStyle, minWidth: "200px" }}>
            <label style={labelStyle}>სქესი</label>
            <select style={inputStyle} value={formData.gender} onChange={e => updateData('gender', e.target.value)}>
              <option value="">აირჩიეთ სქესი</option>
              <option value="male">მამრობითი</option>
              <option value="female">მდედრობითი</option>
            </select>
          </div>
          <div style={{ ...inputGroupStyle, minWidth: "200px" }}>
            <label style={labelStyle}>მოქალაქეობა</label>
            <SearchableDropdown
              value={formData.nationality}
              onChange={val => {
                updateData('nationality', val);
                if (val === 'GE') {
                  if (formData.personalId) {
                    updateData('personalId', formData.personalId.replace(/\D/g, '').slice(0, 11));
                  }
                  if (formData.representativePersonalId) {
                    updateData('representativePersonalId', formData.representativePersonalId.replace(/\D/g, '').slice(0, 11));
                  }
                }
              }}
              options={COUNTRIES}
              placeholder="აირჩიეთ მოქალაქეობა"
              style={inputStyle}
              showFlags={true}
            />
          </div>
          <div style={{ ...inputGroupStyle, minWidth: "200px" }}>
            <label style={labelStyle}>* სპორტის სახეობა</label>
            <input 
              style={inputStyle} 
              value={formData.sportsDiscipline || ''} 
              onChange={e => updateData('sportsDiscipline', e.target.value)} 
              placeholder="ალპინიზმი, მეკლდეურობა..." 
            />
          </div>
          <div style={{ ...inputGroupStyle, minWidth: "200px" }}>
            <label style={labelStyle}>არის თუ არა კლუბის წევრი?</label>
            <div style={{ display: "flex", gap: "5px" }}>
              <button
                type="button"
                onClick={() => {
                  updateData('isClubMember', true);
                }}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: formData.isClubMember ? "1px solid var(--color-emerald-core)" : "1px solid rgba(255,255,255,0.1)",
                  backgroundColor: formData.isClubMember ? "color-mix(in oklab, var(--color-emerald-core) 15%, transparent)" : "transparent",
                  color: formData.isClubMember ? "var(--color-emerald-core)" : "rgba(255,255,255,0.6)",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "12px",
                  transition: "all 0.2s",
                  flex: 1
                }}
              >
                კი
              </button>
              <button
                type="button"
                onClick={() => {
                  updateData('isClubMember', false);
                  updateData('clubId', null);
                }}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: !formData.isClubMember ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.1)",
                  backgroundColor: !formData.isClubMember ? "rgba(239, 68, 68, 0.15)" : "transparent",
                  color: !formData.isClubMember ? "#ef4444" : "rgba(255,255,255,0.6)",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "12px",
                  transition: "all 0.2s",
                  flex: 1
                }}
              >
                არა
              </button>
            </div>
          </div>
          {formData.isClubMember && (
            <div style={{ ...inputGroupStyle, minWidth: "200px" }}>
              <label style={labelStyle}>* აირჩიეთ კლუბი რეესტრიდან</label>
              <SearchableDropdown
                value={formData.clubId ? String(formData.clubId) : ''}
                options={clubs ? clubs.map(c => ({ code: String(c.id), name: c.name })) : []}
                onChange={(val) => {
                  updateData('clubId', val || null);
                }}
                placeholder="აირჩიეთ კლუბი..."
              />
              {formData.clubId && (
                <div style={{ fontSize: "11px", color: "var(--color-emerald-core)", display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                  <i className="fa-solid fa-circle-check"></i>
                  <span>✓ სისტემამ გადაამოწმა: კლუბი აქტიურია, ID: #{formData.clubId}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isMinor && (
        <div className="animate-slide-down" style={{
          padding: "20px",
          backgroundColor: "color-mix(in oklab, var(--color-emerald-core) 2%, transparent)",
          border: "1px dashed color-mix(in oklab, var(--color-emerald-core) 30%, transparent)",
          borderRadius: "12px",
          marginTop: "10px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)"
        }}>
          <h4 style={{ margin: "0 0 15px 0", color: "var(--color-emerald-core)", fontSize: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
            <i className="fa-solid fa-users-viewfinder"></i> კანონიერი წარმომადგენელი (არასრულწლოვანისთვის)
          </h4>
          
          <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px" }}>
              <input 
                type="radio" 
                name="representativeType" 
                value="parent" 
                checked={formData.representativeType === 'parent'} 
                onChange={() => updateData('representativeType', 'parent')}
                style={{ accentColor: "var(--color-emerald-core)" }}
              />
              მშობელი
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px" }}>
              <input 
                type="radio" 
                name="representativeType" 
                value="guardian" 
                checked={formData.representativeType === 'guardian'} 
                onChange={() => updateData('representativeType', 'guardian')}
                style={{ accentColor: "var(--color-emerald-core)" }}
              />
              მეურვე / კანონიერი წარმომადგენელი
            </label>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
            <div style={{ ...inputGroupStyle, minWidth: "200px", marginBottom: "10px" }}>
              <label style={labelStyle}>წარმომადგენლის სახელი და გვარი</label>
              <input 
                style={inputStyle} 
                value={formData.representativeName} 
                onChange={e => updateData('representativeName', e.target.value)} 
                placeholder="სახელი, გვარი" 
              />
            </div>
            <div style={{ ...inputGroupStyle, minWidth: "200px", marginBottom: "10px" }}>
              <label style={labelStyle}>წარმომადგენლის პირადი ნომერი</label>
              <input 
                style={inputStyle} 
                value={formData.representativePersonalId} 
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 11);
                  updateData('representativePersonalId', val);
                }} 
                placeholder="11-ნიშნა პირადი ნომერი" 
                maxLength={11}
              />
            </div>
            <div style={{ ...inputGroupStyle, minWidth: "200px", marginBottom: "10px" }}>
              <label style={labelStyle}>მობილურის ნომერი</label>
              <InternationalPhoneInput
                value={formData.representativePhone}
                onChange={val => updateData('representativePhone', val)}
                placeholder="(599) 12-34-56"
                defaultCountry={formData.nationality || 'GE'}
              />
            </div>
          </div>

          <div style={{ marginTop: "15px" }}>
            <label style={{ ...labelStyle, display: "block", marginBottom: "8px" }}>წარმომადგენლობის დამადასტურებელი დოკუმენტი (PDF/JPG)</label>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <label style={{
                background: "color-mix(in oklab, var(--color-emerald-core) 10%, transparent)",
                border: "1px solid var(--color-emerald-core)",
                color: "var(--color-emerald-core)",
                padding: "10px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "13px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.3s"
              }}>
                <i className="fa-solid fa-cloud-arrow-up"></i> ფაილის ატვირთვა
                <input 
                  type="file" 
                  accept=".pdf,image/*" 
                  style={{ display: "none" }} 
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        updateData('representativeDoc', {
                          name: file.name,
                          size: file.size,
                          type: file.type,
                          data: reader.result
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }} 
                />
              </label>
              
              {formData.representativeDoc ? (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "rgba(255, 255, 255, 0.05)", padding: "8px 12px", borderRadius: "8px" }}>
                  <i className={formData.representativeDoc.name.endsWith('.pdf') || formData.representativeDoc.type === 'application/pdf' ? "fa-solid fa-file-pdf" : "fa-solid fa-file-image"} style={{ color: "#ef4444" }}></i>
                  <span style={{ fontSize: "13px", color: "#e2e8f0" }}>{formData.representativeDoc.name}</span>
                  <button 
                    type="button" 
                    onClick={() => updateData('representativeDoc', null)}
                    style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "14px" }}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ) : (
                <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.4)" }}>ფაილი არ არის არჩეული</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddAthleteStep1;
