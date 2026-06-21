import React from '../../utils/react-shim.js';
import { useTranslation } from '../../context/LanguageContext.jsx';

const GeneralInfoTab = ({ isProfileComplete = true, onProfileUpdate }) => {
  const { t, i18n } = useTranslation();
  const isGeo = i18n.language === 'GEO';

  // Read-only Registration Fields (fetched from backend)
  const [regName, setRegName] = React.useState("");
  const [regTaxId, setRegTaxId] = React.useState("");
  const [regDomain, setRegDomain] = React.useState("");
  const [regAddress, setRegAddress] = React.useState("");

  // Editable Profile Fields
  const [website, setWebsite] = React.useState("");
  const [facebook, setFacebook] = React.useState("");
  const [instagram, setInstagram] = React.useState("");
  const [publicEmail, setPublicEmail] = React.useState("");
  
  const [bankName, setBankName] = React.useState("");
  const [iban, setIban] = React.useState("");

  const [isMinistryRecognized, setIsMinistryRecognized] = React.useState(false);
  const [licenseNumber, setLicenseNumber] = React.useState("");
  const [recognitionDate, setRecognitionDate] = React.useState("");
  const [legalForm, setLegalForm] = React.useState("ააიპ");
  const [logoUrl, setLogoUrl] = React.useState("");

  // Upload/Status states
  const [isUploading, setIsUploading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);

  const fileInputRef = React.useRef(null);

  // Fetch Profile data on mount
  React.useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:5005/companies/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error("ფროფილის ჩატვირთვა ვერ მოხერხდა");
      const data = await response.json();
      
      // Map read-only fields
      setRegName(data.name || "");
      setRegTaxId(data.identificationCode || "");
      setRegDomain(data.sportsDomain || "");
      setRegAddress(data.branches?.[0]?.legalAddress || "");

      // Map editable fields
      setWebsite(data.website || "");
      setFacebook(data.facebook || "");
      setInstagram(data.instagram || "");
      setPublicEmail(data.publicEmail || "");
      setBankName(data.bankName || "");
      setIban(formatIBAN(data.iban || ""));
      setIsMinistryRecognized(data.isMinistryRecognized || false);
      setLicenseNumber(data.licenseNumber || "");
      setLegalForm(data.legalForm || "ააიპ");
      setLogoUrl(data.logoUrl || "");

      if (onProfileUpdate) {
        onProfileUpdate(data.isProfileComplete ?? true);
      }

      // Format date to YYYY-MM-DD
      if (data.recognitionDate) {
        setRecognitionDate(data.recognitionDate.split('T')[0]);
      } else {
        setRecognitionDate("");
      }
    } catch (err) {
      console.error(err);
      setMessage(isGeo ? "შეცდომა მონაცემების წაკითხვისას" : "Error loading profile details");
      setIsSuccess(false);
    }
  };

  // Format IBAN as GE00 AAAA 0000 0000 0000 00
  const formatIBAN = (val) => {
    const raw = val.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    const groups = raw.match(/.{1,4}/g);
    return groups ? groups.join(' ') : raw;
  };

  const handleIbanChange = (e) => {
    const formatted = formatIBAN(e.target.value);
    // Limit to 22 characters + 5 spacing characters = 27 max length
    if (formatted.replace(/\s/g, '').length <= 22) {
      setIban(formatted);
    }
  };

  // Upload Logo handler
  const handleLogoUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append('logo', file);

    try {
      const response = await fetch('http://localhost:5005/companies/profile/logo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: formData
      });
      if (!response.ok) throw new Error("ლოგოს ატვირთვა ვერ მოხერხდა");
      const result = await response.json();
      setLogoUrl(result.logoUrl);
      setIsSuccess(true);
      setMessage(isGeo ? "ბრენდინგის ლოგო წარმატებით აიტვირთა!" : "Logo uploaded successfully!");
    } catch (err) {
      console.error(err);
      setIsSuccess(false);
      setMessage(isGeo ? "ლოგოს ატვირთვა ვერ მოხერხდა" : "Error uploading logo");
    } finally {
      setIsUploading(false);
    }
  };

  // File dropzone handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLogoUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleLogoUpload(e.target.files[0]);
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    // IBAN format validation
    const rawIban = iban.replace(/\s/g, '');
    if (rawIban && (rawIban.length !== 22 || !rawIban.startsWith('GE'))) {
      setIsSuccess(false);
      setMessage(isGeo 
        ? "IBAN-ის ფორმატი არასწორია (უნდა შედგებოდეს 22 სიმბოლოსგან და იწყებოდეს GE-ით)" 
        : "Invalid IBAN format (must be 22 characters and start with GE)");
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5005/companies/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          website: website || null,
          facebook: facebook || null,
          instagram: instagram || null,
          publicEmail: publicEmail || null,
          bankName: bankName || null,
          iban: rawIban || null,
          isMinistryRecognized,
          licenseNumber: isMinistryRecognized ? licenseNumber : null,
          recognitionDate: isMinistryRecognized && recognitionDate ? new Date(recognitionDate).toISOString() : null,
          legalForm: legalForm || null
        })
      });

      if (!response.ok) throw new Error("პროფილის განახლება ვერ მოხერხდა");
      const data = await response.json();
      
      setIsSuccess(true);
      setMessage(isGeo ? "მონაცემები წარმატებით შეინახა!" : "Profile details saved successfully!");
      
      if (onProfileUpdate) {
        onProfileUpdate(data.isProfileComplete ?? true);
      }
      
      // Reload profile
      fetchProfile();
    } catch (err) {
      console.error(err);
      setIsSuccess(false);
      setMessage(isGeo ? "შეცდომა შენახვისას" : "Error saving profile details");
    } finally {
      setIsSaving(false);
      // Auto clear message after 4s
      setTimeout(() => {
        setMessage("");
      }, 4000);
    }
  };

  // Focus effect for inputs
  const [activeInput, setActiveInput] = React.useState(null);

  const gridSectionStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px"
  };

  const labelStyle = {
    display: "block",
    color: "var(--silver)",
    fontSize: "12px",
    fontWeight: "600",
    marginBottom: "8px",
    fontFamily: "var(--font-primary)"
  };

  const inputStyle = (fieldId, value = "dummy") => {
    const isEmpty = !value || (typeof value === 'string' && value.trim() === '');
    const isRequired = ['bankName', 'iban', 'publicEmail'].includes(fieldId);
    const showWarning = !isProfileComplete && isRequired && isEmpty;

    return {
      width: "100%",
      padding: "11px 14px",
      backgroundColor: "rgba(255, 255, 255, 0.02)",
      border: activeInput === fieldId 
        ? "1px solid var(--emerald)" 
        : (showWarning ? "1px solid #ff5252" : "1px solid var(--iron-line)"),
      borderRadius: "6px",
      color: "var(--bone)",
      outline: "none",
      fontSize: "13px",
      fontFamily: "var(--font-primary)",
      transition: "all 0.2s ease-in-out",
      boxShadow: activeInput === fieldId 
        ? "0 0 10px rgba(0, 230, 118, 0.15)" 
        : (showWarning ? "0 0 10px rgba(255, 82, 82, 0.2)" : "none")
    };
  };

  const readOnlyInputStyle = {
    width: "100%",
    padding: "11px 14px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px dashed var(--iron-line)",
    borderRadius: "6px",
    color: "var(--silver)",
    outline: "none",
    fontSize: "13px",
    cursor: "not-allowed",
    fontFamily: "var(--font-primary)"
  };

  const cardSectionStyle = {
    backgroundColor: "var(--iron-2)",
    border: "1px solid var(--iron-line)",
    borderRadius: "8px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  };

  const sectionTitleStyle = {
    margin: 0,
    fontSize: "15px",
    fontWeight: "700",
    color: "var(--bone)",
    fontFamily: "var(--font-heading)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    paddingBottom: "10px"
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }} onDragEnter={handleDrag}>
      {/* Hidden input for logo upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        style={{ display: "none" }} 
        accept="image/*" 
      />

      {/* Top Warning Banner if Profile is Incomplete */}
      {!isProfileComplete && (
        <div style={{
          padding: "16px 20px",
          background: "linear-gradient(135deg, rgba(239, 83, 80, 0.1) 0%, rgba(239, 83, 80, 0.05) 100%)",
          border: "1px solid rgba(239, 83, 80, 0.3)",
          borderRadius: "8px",
          color: "#ff5252",
          fontFamily: "var(--font-primary)",
          fontSize: "14px",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          boxShadow: "0 4px 15px rgba(239, 83, 80, 0.1)",
          marginBottom: "10px"
        }}>
          <i className="fa-solid fa-circle-exclamation" style={{ fontSize: "18px" }}></i>
          <span>ყურადღება: სისტემის სრული ფუნქციონალის გასააქტიურებლად, გთხოვთ შეავსოთ ქვემოთ მოცემული სავალდებულო ველები.</span>
        </div>
      )}

      {/* General Form Card Layout */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* SECTION A: Registration Details (Read-only) */}
        <div style={cardSectionStyle}>
          <h3 style={sectionTitleStyle}>
            <i className="fa-solid fa-id-card" style={{ color: "var(--fed-blue)" }}></i>
            <span>{isGeo ? "სარეგისტრაციო დოკუმენტები (რედაქტირება შეუძლებელია)" : "Registration Details (Read-Only)"}</span>
          </h3>
          <div style={gridSectionStyle}>
            <div>
              <label style={labelStyle}>{isGeo ? "ფედერაციის დასახელება" : "Federation Name"}</label>
              <input type="text" value={regName} readOnly style={readOnlyInputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{isGeo ? "საიდენტიფიკაციო კოდი (ს/კ)" : "Tax Identification ID"}</label>
              <input type="text" value={regTaxId} readOnly style={readOnlyInputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{isGeo ? "სპორტული მიმართულება" : "Sports Discipline"}</label>
              <input type="text" value={regDomain} readOnly style={readOnlyInputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{isGeo ? "სამართლებრივი ფორმა" : "Legal Form"}</label>
              <input type="text" value={legalForm} readOnly style={readOnlyInputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{isGeo ? "იურიდიული მისამართი" : "Legal Address"}</label>
              <input type="text" value={regAddress} readOnly style={readOnlyInputStyle} />
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Section 1 & 2 Left, Section 3 & 4 Right */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px"
        }}>
          
          {/* LEFT COLUMN: LINKS & BANKING */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Section 1: Legal & Links */}
            <div style={cardSectionStyle}>
              <h3 style={sectionTitleStyle}>
                <i className="fa-solid fa-link" style={{ color: "var(--emerald)" }}></i>
                <span>{isGeo ? "ბმულები და კონტაქტები" : "Social Links & Contact"}</span>
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>{isGeo ? "ვებ-გვერდი" : "Website"}</label>
                  <input 
                    type="url" 
                    placeholder="https://example.ge"
                    value={website} 
                    onChange={e => setWebsite(e.target.value)} 
                    style={inputStyle("website")}
                    onFocus={() => setActiveInput("website")}
                    onBlur={() => setActiveInput(null)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>{isGeo ? "ფეისბუქის გვერდი (Facebook)" : "Facebook Page"}</label>
                  <input 
                    type="url" 
                    placeholder="https://facebook.com/federation"
                    value={facebook} 
                    onChange={e => setFacebook(e.target.value)} 
                    style={inputStyle("facebook")}
                    onFocus={() => setActiveInput("facebook")}
                    onBlur={() => setActiveInput(null)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>{isGeo ? "ინსტაგრამი (Instagram)" : "Instagram Username"}</label>
                  <input 
                    type="url" 
                    placeholder="https://instagram.com/federation"
                    value={instagram} 
                    onChange={e => setInstagram(e.target.value)} 
                    style={inputStyle("instagram")}
                    onFocus={() => setActiveInput("instagram")}
                    onBlur={() => setActiveInput(null)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>{isGeo ? "საკონტაქტო ელ-ფოსტა (საზოგადოებრივი)" : "Public Email"}</label>
                  <input 
                    type="email" 
                    placeholder="info@federation.ge"
                    value={publicEmail} 
                    onChange={e => setPublicEmail(e.target.value)} 
                    style={inputStyle("publicEmail", publicEmail)}
                    onFocus={() => setActiveInput("publicEmail")}
                    onBlur={() => setActiveInput(null)}
                  />
                  {!isProfileComplete && (!publicEmail || publicEmail.trim() === '') && (
                    <div style={{ color: "#ff5252", fontSize: "11px", marginTop: "6px", fontWeight: "600" }}>
                      ⚠️ ველი სავალდებულოა - გთხოვთ შეავსოთ.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Banking Requisites */}
            <div style={cardSectionStyle}>
              <h3 style={sectionTitleStyle}>
                <i className="fa-solid fa-money-check" style={{ color: "var(--emerald)" }}></i>
                <span>{isGeo ? "საბანკო რეკვიზიტები" : "Banking Details"}</span>
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>{isGeo ? "ბანკის დასახელება" : "Bank Name"}</label>
                  <input 
                    type="text" 
                    placeholder={isGeo ? "საქართველოს ბანკი, თიბისი ბანკი..." : "Bank of Georgia, TBC Bank..."}
                    value={bankName} 
                    onChange={e => setBankName(e.target.value)} 
                    style={inputStyle("bankName", bankName)}
                    onFocus={() => setActiveInput("bankName")}
                    onBlur={() => setActiveInput(null)}
                  />
                  {!isProfileComplete && (!bankName || bankName.trim() === '') && (
                    <div style={{ color: "#ff5252", fontSize: "11px", marginTop: "6px", fontWeight: "600" }}>
                      ⚠️ ველი სავალდებულოა - გთხოვთ შეავსოთ.
                    </div>
                  )}
                </div>
                <div>
                  <label style={labelStyle}>{isGeo ? "IBAN ანგარიშის ნომერი" : "IBAN Code"}</label>
                  <input 
                    type="text" 
                    placeholder="GE00 TB00 0000 0000 0000 00"
                    value={iban} 
                    onChange={handleIbanChange} 
                    style={{ ...inputStyle("iban", iban), fontFamily: "var(--font-mono)", letterSpacing: "1px" }}
                    onFocus={() => setActiveInput("iban")}
                    onBlur={() => setActiveInput(null)}
                  />
                  {!isProfileComplete && (!iban || iban.trim() === '') && (
                    <div style={{ color: "#ff5252", fontSize: "11px", marginTop: "6px", fontWeight: "600" }}>
                      ⚠️ ველი სავალდებულოა - გთხოვთ შეავსოთ.
                    </div>
                  )}
                  <div style={{ fontSize: "11px", color: "var(--silver)", marginTop: "4px" }}>
                    {isGeo ? "ავტომატური დაჯგუფება ყოველ 4 სიმბოლოში" : "Auto character grouping every 4 indices"}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: STATE STATUS & MEDIA */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Section 3: State Status / Ministry Recognition */}
            <div style={cardSectionStyle}>
              <h3 style={sectionTitleStyle}>
                <i className="fa-solid fa-award" style={{ color: "var(--emerald)" }}></i>
                <span>{isGeo ? "სახელმწიფო სტატუსი" : "State Recognition & Legals"}</span>
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                
                {/* Ministry Recognition Toggle */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "between",
                  padding: "12px 14px",
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid var(--iron-line)",
                  borderRadius: "6px",
                  gap: "10px"
                }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "3px", flex: 1 }}>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--bone)" }}>
                      {isGeo ? "სამინისტროს აღიარება" : "Ministry Recognition"}
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--silver)" }}>
                      {isGeo 
                        ? "აქტიური სახელმწიფო სპორტული ლიცენზიის სტატუსი" 
                        : "Official active sports licensing status"}
                    </span>
                  </div>
                  
                  {/* Styled Switch Button */}
                  <button
                    type="button"
                    onClick={() => setIsMinistryRecognized(!isMinistryRecognized)}
                    style={{
                      width: "48px",
                      height: "24px",
                      borderRadius: "15px",
                      backgroundColor: isMinistryRecognized ? "var(--emerald)" : "rgba(255, 255, 255, 0.1)",
                      border: "none",
                      position: "relative",
                      cursor: "pointer",
                      transition: "background-color 0.2s"
                    }}
                  >
                    <div style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      backgroundColor: "#121418",
                      position: "absolute",
                      top: "3px",
                      left: isMinistryRecognized ? "27px" : "3px",
                      transition: "left 0.2s"
                    }} />
                  </button>
                </div>

                {/* Slide open details */}
                {isMinistryRecognized && (
                  <div className="animate-slide-down" style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    borderLeft: "2px solid var(--emerald)",
                    paddingLeft: "15px",
                    marginTop: "4px"
                  }}>
                    <div>
                      <label style={labelStyle}>{isGeo ? "ლიცენზიის / ბრძანების ნომერი" : "License / decree ID"}</label>
                      <input 
                        type="text" 
                        placeholder={isGeo ? "N-1002" : "ID-102"}
                        value={licenseNumber} 
                        onChange={e => setLicenseNumber(e.target.value)} 
                        style={inputStyle("licenseNumber")}
                        onFocus={() => setActiveInput("licenseNumber")}
                        onBlur={() => setActiveInput(null)}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>{isGeo ? "აღიარების მინიჭების თარიღი" : "Date of Recognition"}</label>
                      <input 
                        type="date" 
                        value={recognitionDate} 
                        onChange={e => setRecognitionDate(e.target.value)} 
                        style={inputStyle("recognitionDate")}
                        onFocus={() => setActiveInput("recognitionDate")}
                        onBlur={() => setActiveInput(null)}
                      />
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Section 4: Media Upload (Logo Dropzone) */}
            <div style={cardSectionStyle}>
              <h3 style={sectionTitleStyle}>
                <i className="fa-solid fa-image" style={{ color: "var(--emerald)" }}></i>
                <span>{isGeo ? "ბრენდინგი და ლოგო" : "Logo & Branding"}</span>
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
                
                {/* Real Logo Image or Placeholder */}
                <div style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  border: "2px solid var(--iron-line)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.5)"
                }}>
                  {logoUrl ? (
                    <img 
                      src={`http://localhost:5005${logoUrl}`} 
                      alt="Federation Logo" 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "var(--silver)" }}>
                      <i className="fa-solid fa-building" style={{ fontSize: "36px", opacity: 0.3 }}></i>
                      <span style={{ fontSize: "10px", marginTop: "8px", fontWeight: "700" }}>NO LOGO</span>
                    </div>
                  )}
                </div>

                {/* Dropzone Container */}
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current.click()}
                  style={{
                    width: "100%",
                    padding: "20px 10px",
                    border: dragActive ? "2px dashed var(--emerald)" : "1px dashed var(--iron-line)",
                    borderRadius: "6px",
                    backgroundColor: dragActive ? "rgba(0, 230, 118, 0.04)" : "rgba(255, 255, 255, 0.01)",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px"
                  }}
                  onMouseEnter={e => {
                    if (!dragActive) {
                      e.currentTarget.style.borderColor = "var(--emerald)";
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.02)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!dragActive) {
                      e.currentTarget.style.borderColor = "var(--iron-line)";
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.01)";
                    }
                  }}
                >
                  {isUploading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin" style={{ color: "var(--emerald)", fontSize: "20px" }}></i>
                      <span style={{ fontSize: "12px", color: "var(--bone)" }}>
                        {isGeo ? "სურათი იტვირთება..." : "Uploading logo image..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-cloud-arrow-up" style={{ color: "var(--emerald)", fontSize: "20px" }}></i>
                      <span style={{ fontSize: "12px", color: "var(--bone)", fontWeight: "600" }}>
                        {isGeo ? "დააწკაპუნეთ ან ჩააგდეთ ლოგოს ფაილი" : "Click or drag files here to upload logo"}
                      </span>
                      <span style={{ fontSize: "10px", color: "var(--silver)" }}>
                        PNG, JPG or WEBP (Max 5MB)
                      </span>
                    </>
                  )}
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Action / Saving Status Message */}
      {message && (
        <div 
          className="animate-slide-down"
          style={{
            padding: "12px 16px",
            backgroundColor: isSuccess ? "rgba(0, 230, 118, 0.08)" : "rgba(180, 3, 7, 0.08)",
            border: `1px solid ${isSuccess ? "rgba(0, 230, 118, 0.2)" : "rgba(180, 3, 7, 0.2)"}`,
            borderRadius: "6px",
            color: isSuccess ? "var(--emerald)" : "var(--crisis-from)",
            fontSize: "13px",
            fontFamily: "var(--font-mono)",
            textAlign: "center",
            fontWeight: "700"
          }}
        >
          <i className={`fa-solid ${isSuccess ? "fa-circle-check" : "fa-triangle-exclamation"}`} style={{ marginRight: "8px" }}></i>
          {message}
        </div>
      )}

      {/* Bottom Buttons */}
      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        borderTop: "1px solid var(--iron-line)",
        paddingTop: "20px",
        marginTop: "10px"
      }}>
        <button
          type="submit"
          disabled={isSaving}
          style={{
            padding: "12px 30px",
            background: "linear-gradient(135deg, var(--emerald) 0%, #00b359 100%)",
            color: "var(--iron)",
            fontFamily: "var(--font-heading)",
            fontWeight: "800",
            fontSize: "14px",
            border: "none",
            borderRadius: "6px",
            cursor: isSaving ? "not-allowed" : "pointer",
            boxShadow: "0 4px 14px rgba(0, 230, 118, 0.25)",
            transition: "all 0.2s ease-in-out",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
          onMouseEnter={e => {
            if (!isSaving) {
              e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 230, 118, 0.45)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }
          }}
          onMouseLeave={e => {
            if (!isSaving) {
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(0, 230, 118, 0.25)";
              e.currentTarget.style.transform = "none";
            }
          }}
        >
          {isSaving ? (
            <>
              <i className="fa-solid fa-spinner fa-spin"></i>
              <span>{isGeo ? "ინახება..." : "Saving..."}</span>
            </>
          ) : (
            <>
              <i className="fa-solid fa-floppy-disk"></i>
              <span>{isGeo ? "მონაცემების შენახვა" : "Save Changes"}</span>
            </>
          )}
        </button>
      </div>

    </form>
  );
};

export default GeneralInfoTab;
