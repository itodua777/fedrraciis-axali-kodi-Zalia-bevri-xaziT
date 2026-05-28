import React from 'react';
import SearchableDropdown from '../../components/ui/SearchableDropdown.jsx';
import InternationalPhoneInput from '../../components/ui/InternationalPhoneInput.jsx';
import MultiSelectDropdown from '../../components/ui/MultiSelectDropdown.jsx';
import { COUNTRIES } from '../../utils/countries.js';

const MentorForm = ({ onViewChange }) => {
  const [formData, setFormData] = React.useState({
    status: '', firstName: '', lastName: '', personalId: '', photo: null,
    birthDate: '', gender: '', nationality: '', phone: '', email: '', address: '',
    height: '', weight: '', bloodType: '', sportTypes: [], category: '',
    certificates: [], awards: [], biography: '', docs: []
  });
  const [certName, setCertName] = React.useState('');
  const [certIssuer, setCertIssuer] = React.useState('');
  const [certExpiry, setCertExpiry] = React.useState('');

  const [awardName, setAwardName] = React.useState('');
  const [awardYear, setAwardYear] = React.useState('');

  const updateData = (field, val) => setFormData(p => ({ ...p, [field]: val }));

  const handleAddCert = () => {
    if(certName) {
      updateData('certificates', [...formData.certificates, { name: certName, issuer: certIssuer, expiry: certExpiry }]);
      setCertName(''); setCertIssuer(''); setCertExpiry('');
    }
  };

  const handleAddAward = () => {
    if(awardName) {
      updateData('awards', [...formData.awards, { name: awardName, year: awardYear }]);
      setAwardName(''); setAwardYear('');
    }
  };

  const handlePhotoDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => updateData('photo', reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDocsDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer ? e.dataTransfer.files : e.target.files);
    const newDocs = files.map(file => ({ name: file.name, type: file.type }));
    updateData('docs', [...formData.docs, ...newDocs]);
  };

  const handleSubmit = async () => {
    if (!formData.status) {
      alert('გთხოვთ აირჩიოთ სტატუსი!');
      return;
    }
    if (!formData.firstName || !formData.lastName) {
      alert('გთხოვთ შეავსოთ სახელი და გვარი!');
      return;
    }
    if (formData.nationality === 'GE') {
      if (!formData.personalId || formData.personalId.length !== 11) {
        alert('საქართველოს მოქალაქის პირადი ნომერი უნდა შედგებოდეს 11 ციფრისგან!');
        return;
      }
    } else {
      if (!formData.personalId || !formData.personalId.trim()) {
        alert('გთხოვთ მიუთითოთ პირადი ნომერი!');
        return;
      }
    }
    
    const phoneRegex = /^\+?[0-9]{9,15}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      alert('ტელეფონის ნომრის ფორმატი არასწორია (უნდა შეიცავდეს 9-15 ციფრს)!');
      return;
    }

    const payload = {
      ...formData,
      id: 'M-' + Date.now()
    };

    try {
      const response = await fetch('/api/mentors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const result = await response.json();
      if (result.success) {
        console.log('Mentor saved successfully on backend:', result);
      } else {
        throw new Error(result.error || 'Unknown backend error');
      }
    } catch (error) {
      console.warn('API submission failed, backing up to local storage:', error);
      
      let existingMentors = [];
      const stored = localStorage.getItem('mentorsStore');
      if (stored) {
        try {
          existingMentors = JSON.parse(stored);
          if (!Array.isArray(existingMentors)) {
            existingMentors = [];
          }
        } catch (e) {
          existingMentors = [];
        }
      }
      
      const localMentor = {
        id: payload.id,
        firstName: payload.firstName,
        lastName: payload.lastName,
        personalId: payload.personalId,
        status: payload.status,
        sportType: payload.sportTypes.length > 0 ? payload.sportTypes[0] : '',
        sportTypes: payload.sportTypes,
        height: payload.height,
        weight: payload.weight,
        bloodType: payload.bloodType,
        phone: payload.phone,
        email: payload.email,
        category: payload.category,
        photo: payload.photo,
        certificates: payload.certificates,
        awards: payload.awards,
        biography: payload.biography
      };
      
      existingMentors.push(localMentor);
      localStorage.setItem('mentorsStore', JSON.stringify(existingMentors));
    }

    onViewChange('mentors');
  };

  const sectionStyle = {
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    border: "1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px"
  };

  const titleStyle = { color: "var(--color-emerald-core)", margin: "0 0 15px 0", fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" };
  const inputStyle = { width: "100%", padding: "10px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", outline: "none", boxSizing: "border-box" };
  const labelStyle = { fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "5px" };
  const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" };

  return (
    <div style={{ flex: 1, padding: "30px", backgroundColor: "#121418", color: "#e2e8f0", overflowY: "auto", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0, color: "#fff" }}>ახალი მენტორის რეგისტრაცია</h2>
        <button onClick={() => onViewChange('mentors')} style={{ background: "transparent", border: "1px solid #ef4444", color: "#ef4444", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}>გაუქმება</button>
      </div>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div style={{ flex: 2, minWidth: "300px" }}>
          <div style={sectionStyle}>
            <h3 style={titleStyle}><i className="fa-solid fa-address-card"></i> სექცია A: პერსონალური მონაცემები</h3>

            <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>სტატუსი *</label>
                <select style={inputStyle} value={formData.status} onChange={e => updateData('status', e.target.value)}>
                  <option value="">აირჩიეთ...</option>
                  <option value="ტრენერი">ტრენერი</option>
                  <option value="ინსტრუქტორი">ინსტრუქტორი</option>
                  <option value="მწვრთნელი">მწვრთნელი</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
              <div style={{ width: "120px", flexShrink: 0, textAlign: "center" }}>
                <label style={labelStyle}>ფოტო</label>
                <div onDragOver={e => e.preventDefault()} onDrop={handlePhotoDrop} style={{ width: "120px", height: "120px", borderRadius: "12px", border: "2px dashed var(--color-emerald-core)", backgroundColor: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", position: "relative" }}>
                  <input type="file" onChange={handlePhotoDrop} accept="image/*" style={{ position: "absolute", opacity: 0, width: "100%", height: "100%", cursor: "pointer" }} />
                  {formData.photo ? <img src={formData.photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <i className="fa-solid fa-camera" style={{ color: "var(--color-emerald-core)", fontSize: "24px" }}></i>}
                </div>
              </div>

              <div style={{ flex: 1, ...gridStyle }}>
                <div>
                  <label style={labelStyle}>სახელი</label>
                  <input type="text" style={inputStyle} value={formData.firstName} onChange={e => updateData('firstName', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>გვარი</label>
                  <input type="text" style={inputStyle} value={formData.lastName} onChange={e => updateData('lastName', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>პირადი ნომერი</label>
                  <input 
                    type="text" 
                    maxLength={formData.nationality === 'GE' ? 11 : undefined} 
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
                  />
                </div>
                <div>
                  <label style={labelStyle}>დაბადების თარიღი</label>
                  <input type="date" style={inputStyle} value={formData.birthDate} onChange={e => updateData('birthDate', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>სქესი</label>
                  <select style={inputStyle} value={formData.gender} onChange={e => updateData('gender', e.target.value)}>
                    <option value="">აირჩიეთ...</option>
                    <option value="male">მამრობითი</option>
                    <option value="female">მდედრობითი</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>მოქალაქეობა</label>
                  <SearchableDropdown
                    value={formData.nationality}
                    options={COUNTRIES}
                    onChange={val => {
                      updateData('nationality', val);
                      if (val === 'GE') {
                        if (formData.personalId) {
                          updateData('personalId', formData.personalId.replace(/\D/g, '').slice(0, 11));
                        }
                      }
                    }}
                    placeholder="აირჩიეთ მოქალაქეობა..."
                    style={inputStyle}
                    showFlags={true}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ ...sectionStyle, flex: 1 }}>
              <h3 style={titleStyle}><i className="fa-solid fa-phone"></i> სექცია B: საკონტაქტო</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div>
                  <label style={labelStyle}>ტელეფონი</label>
                  <InternationalPhoneInput
                    value={formData.phone}
                    onChange={val => updateData('phone', val)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>იმეილი</label>
                  <input type="email" style={inputStyle} value={formData.email} onChange={e => updateData('email', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>მისამართი</label>
                  <input type="text" style={inputStyle} value={formData.address} onChange={e => updateData('address', e.target.value)} />
                </div>
              </div>
            </div>

            <div style={{ ...sectionStyle, flex: 1 }}>
              <h3 style={titleStyle}><i className="fa-solid fa-heart-pulse"></i> სექცია C: ანატომია</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>სიმაღლე (სმ)</label>
                    <input type="number" style={inputStyle} value={formData.height} onChange={e => updateData('height', e.target.value)} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>წონა (კგ)</label>
                    <input type="number" style={inputStyle} value={formData.weight} onChange={e => updateData('weight', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>სისხლის ჯგუფი</label>
                  <select style={inputStyle} value={formData.bloodType} onChange={e => updateData('bloodType', e.target.value)}>
                    <option value="">აირჩიეთ...</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <h3 style={titleStyle}><i className="fa-solid fa-medal"></i> სექცია D: პროფესიული რანგი</h3>
            <div style={gridStyle}>
              <div>
                <label style={labelStyle}>სპორტის სახეობა</label>
                <MultiSelectDropdown
                  value={formData.sportTypes}
                  onChange={val => updateData('sportTypes', val)}
                  options={['ალპინიზმი', 'მთის ტურიზმი', 'კლდეზე ცოცვა']}
                  placeholder="აირჩიეთ სპორტის სახეობები..."
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>რანგი / კატეგორია</label>
                <input type="text" style={inputStyle} value={formData.category} onChange={e => updateData('category', e.target.value)} placeholder="მაგ. I კატეგორია" />
              </div>
            </div>

            <div style={{ marginTop: "20px" }}>
              <label style={labelStyle}>სერტიფიკატების რეესტრი</label>
              {formData.certificates.map((c, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", backgroundColor: "rgba(0,0,0,0.3)", padding: "10px", borderRadius: "8px", marginBottom: "5px", alignItems: "center" }}>
                  <div style={{ flex: 1 }}>{c.name}</div>
                  <div style={{ flex: 1, color: "rgba(255,255,255,0.5)" }}>{c.issuer}</div>
                  <div style={{ flex: 1, color: "rgba(255,255,255,0.5)" }}>{c.expiry}</div>
                  <i className="fa-solid fa-trash" style={{ color: "#ef4444", cursor: "pointer" }} onClick={() => updateData('certificates', formData.certificates.filter((_, idx) => idx !== i))}></i>
                </div>
              ))}
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <input type="text" placeholder="დასახელება" style={{ ...inputStyle, flex: 1 }} value={certName} onChange={e => setCertName(e.target.value)} />
                <input type="text" placeholder="გამცემი" style={{ ...inputStyle, flex: 1 }} value={certIssuer} onChange={e => setCertIssuer(e.target.value)} />
                <input type="date" style={{ ...inputStyle, flex: 1 }} value={certExpiry} onChange={e => setCertExpiry(e.target.value)} />
                <button type="button" onClick={handleAddCert} style={{ background: "var(--color-emerald-core)", color: "#121418", border: "none", padding: "0 15px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>+</button>
              </div>
            </div>

            <div style={{ marginTop: "20px" }}>
              <label style={labelStyle}>ჯილდოები და მიღწევები</label>
              {formData.awards.map((a, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", backgroundColor: "rgba(0,0,0,0.3)", padding: "10px", borderRadius: "8px", marginBottom: "5px", alignItems: "center" }}>
                  <div style={{ flex: 2 }}>{a.name}</div>
                  <div style={{ flex: 1, color: "rgba(255,255,255,0.5)" }}>{a.year}</div>
                  <i className="fa-solid fa-trash" style={{ color: "#ef4444", cursor: "pointer" }} onClick={() => updateData('awards', formData.awards.filter((_, idx) => idx !== i))}></i>
                </div>
              ))}
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <input type="text" placeholder="ჯილდოს დასახელება" style={{ ...inputStyle, flex: 2 }} value={awardName} onChange={e => setAwardName(e.target.value)} />
                <input type="number" placeholder="წელი" style={{ ...inputStyle, flex: 1 }} value={awardYear} onChange={e => setAwardYear(e.target.value)} />
                <button type="button" onClick={handleAddAward} style={{ background: "var(--color-emerald-core)", color: "#121418", border: "none", padding: "0 15px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>+</button>
              </div>
            </div>

            <div style={{ marginTop: "20px" }}>
              <label style={labelStyle}>ბიოგრაფიული ისტორია</label>
              <textarea style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }} value={formData.biography} onChange={e => updateData('biography', e.target.value)}></textarea>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: "250px" }}>
          <div style={sectionStyle}>
            <h3 style={titleStyle}><i className="fa-solid fa-vault"></i> სექცია E: File Vault</h3>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "15px" }}>ატვირთეთ პირადობის დამადასტურებელი და სამედიცინო დოკუმენტაცია.</p>

            <div onDragOver={e => e.preventDefault()} onDrop={handleDocsDrop} style={{ border: "2px dashed color-mix(in oklab, var(--color-emerald-core) 40%, transparent)", borderRadius: "12px", padding: "30px", textAlign: "center", cursor: "pointer", backgroundColor: "rgba(0,0,0,0.2)", marginBottom: "15px", position: "relative" }}>
              <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleDocsDrop} style={{ position: "absolute", opacity: 0, top: 0, left: 0, width: "100%", height: "100%", cursor: "pointer" }} />
              <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: "32px", color: "var(--color-emerald-core)", marginBottom: "10px" }}></i>
              <div style={{ fontSize: "14px", color: "#fff" }}>ფაილების ატვირთვა</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>PDF, JPG, PNG</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {formData.docs.map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "8px", fontSize: "12px" }}>
                  <i className={d.type.includes('pdf') ? "fa-solid fa-file-pdf" : "fa-solid fa-image"} style={{ color: "var(--color-emerald-core)" }}></i>
                  <div style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#fff" }}>{d.name}</div>
                  <i className="fa-solid fa-xmark" style={{ color: "#ef4444", cursor: "pointer" }} onClick={() => updateData('docs', formData.docs.filter((_, idx) => idx !== i))}></i>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleSubmit} style={{ width: "100%", background: "var(--color-emerald-core)", color: "#121418", padding: "15px", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 15px color-mix(in oklab, var(--color-emerald-core) 40%, transparent)" }}>
            <i className="fa-solid fa-check"></i> ბაზაში შენახვა
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorForm;
