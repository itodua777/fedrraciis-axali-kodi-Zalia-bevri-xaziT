import React from '../../utils/react-shim.js';
import { useTranslation } from '../../context/LanguageContext.jsx';

const BankingRequisitesTab = ({ isProfileComplete = true, onProfileUpdate }) => {
  const { t, i18n } = useTranslation();
  const isGeo = i18n.language === 'GEO';

  const [bankAccounts, setBankAccounts] = React.useState([]);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [bankName, setBankName] = React.useState("");
  const [iban, setIban] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [activeInput, setActiveInput] = React.useState(null);

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
      
      setBankAccounts(data?.bankAccounts || []);

      if (onProfileUpdate) {
        onProfileUpdate(data?.isProfileComplete ?? true);
      }
    } catch (err) {
      console.error(err);
      setBankAccounts([]);
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

  // Add Bank Account Handler
  const handleAddAccount = async (e) => {
    e.preventDefault();
    if (!bankName.trim() || !iban.trim()) {
      setIsSuccess(false);
      setMessage(isGeo ? "გთხოვთ შეავსოთ ყველა ველი" : "Please fill in all fields");
      return;
    }

    const rawIban = iban.replace(/\s/g, '');
    if (rawIban.length !== 22 || !rawIban.startsWith('GE')) {
      setIsSuccess(false);
      setMessage(isGeo 
        ? "IBAN-ის ფორმატი არასწორია (უნდა შედგებოდეს 22 სიმბოლოსგან და იწყებოდეს GE-ით)" 
        : "Invalid IBAN format (must be 22 characters and start with GE)");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch('http://localhost:5005/companies/profile/bank-accounts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bankName: bankName.trim(),
          iban: rawIban
        })
      });

      if (!response.ok) throw new Error("ანგარიშის დამატება ვერ მოხერხდა");
      const data = await response.json();
      
      setBankAccounts(data?.bankAccounts || []);
      setBankName("");
      setIban("");
      setShowAddForm(false);
      setIsSuccess(true);
      setMessage(isGeo ? "საბანკო ანგარიში წარმატებით დაემატა!" : "Bank account added successfully!");
      
      if (onProfileUpdate) {
        onProfileUpdate(data?.isProfileComplete ?? true);
      }
    } catch (err) {
      console.error(err);
      setIsSuccess(false);
      setMessage(isGeo ? "შეცდომა დამატებისას" : "Error adding bank account");
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  // Delete Bank Account Handler
  const handleDeleteAccount = async (id) => {
    if (!window.confirm(isGeo ? "ნამდვილად გსურთ ანგარიშის წაშლა?" : "Are you sure you want to delete this bank account?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5005/companies/profile/bank-accounts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error("ანგარიშის წაშლა ვერ მოხერხდა");
      const data = await response.json();
      
      setBankAccounts(data?.bankAccounts || []);
      setIsSuccess(true);
      setMessage(isGeo ? "საბანკო ანგარიში წარმატებით წაიშალა!" : "Bank account deleted successfully!");
      
      if (onProfileUpdate) {
        onProfileUpdate(data?.isProfileComplete ?? true);
      }
    } catch (err) {
      console.error(err);
      setIsSuccess(false);
      setMessage(isGeo ? "შეცდომა წაშლისას" : "Error deleting bank account");
    } finally {
      setTimeout(() => setMessage(""), 4000);
    }
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

  const labelStyle = {
    display: "block",
    color: "var(--silver)",
    fontSize: "12px",
    fontWeight: "600",
    marginBottom: "8px",
    fontFamily: "var(--font-primary)"
  };

  const inputStyle = (fieldId) => {
    return {
      width: "100%",
      padding: "11px 14px",
      backgroundColor: "rgba(255, 255, 255, 0.02)",
      border: activeInput === fieldId 
        ? "1px solid var(--emerald)" 
        : "1px solid var(--iron-line)",
      borderRadius: "6px",
      color: "var(--bone)",
      outline: "none",
      fontSize: "13px",
      fontFamily: "var(--font-primary)",
      transition: "all 0.2s ease-in-out",
      boxShadow: activeInput === fieldId 
        ? "0 0 10px rgba(0, 230, 118, 0.15)" 
        : "none"
    };
  };

  const gridTableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
    textAlign: "left"
  };

  const tableHeaderStyle = {
    borderBottom: "1px solid var(--iron-line)",
    padding: "12px 16px",
    color: "var(--silver)",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    fontFamily: "var(--font-heading)",
    letterSpacing: "0.5px"
  };

  const tableCellStyle = {
    padding: "16px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.03)",
    color: "var(--bone)",
    fontSize: "13px",
    fontFamily: "var(--font-primary)"
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      


      {/* Accounts List Grid */}
      <div style={cardSectionStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", paddingBottom: "10px" }}>
          <h3 style={{ ...sectionTitleStyle, borderBottom: "none", paddingBottom: "0" }}>
            <i className="fa-solid fa-money-check" style={{ color: "var(--emerald)" }}></i>
            <span>
              {isGeo ? "აქტიური საბანკო ანგარიშები" : "Active Bank Accounts"}
              {bankAccounts.length === 0 && <span style={{ color: '#ff5252', marginLeft: '4px' }}>*</span>}
            </span>
          </h3>
          
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                backgroundColor: "rgba(0, 230, 118, 0.1)",
                color: "var(--emerald)",
                border: "1px solid rgba(0, 230, 118, 0.3)",
                borderRadius: "6px",
                padding: "6px 12px",
                fontSize: "12px",
                fontFamily: "var(--font-heading)",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = "rgba(0, 230, 118, 0.2)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = "rgba(0, 230, 118, 0.1)";
                e.currentTarget.style.transform = "none";
              }}
            >
              <i className="fa-solid fa-plus"></i>
              <span>{isGeo ? "საბანკო ანგარიშის დამატება" : "Add Bank Account"}</span>
            </button>
          )}
        </div>

        {bankAccounts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px 10px", color: "var(--silver)", fontSize: "13px", fontFamily: "var(--font-primary)" }}>
            {isGeo ? "საბანკო ანგარიშები არ არის დამატებული" : "No bank accounts added yet"}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={gridTableStyle}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>{isGeo ? "ბანკის დასახელება" : "Bank Name"}</th>
                  <th style={tableHeaderStyle}>{isGeo ? "IBAN ანგარიშის ნომერი" : "IBAN Code"}</th>
                  <th style={{ ...tableHeaderStyle, textAlign: "right" }}>{isGeo ? "მოქმედება" : "Action"}</th>
                </tr>
              </thead>
              <tbody>
                {bankAccounts.map(account => (
                  <tr key={account.id} style={{ transition: "background 0.2s" }}>
                    <td style={tableCellStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <i className="fa-solid fa-building-columns" style={{ color: "var(--emerald)", opacity: 0.7 }}></i>
                        <span style={{ fontWeight: "600" }}>{account.bankName}</span>
                      </div>
                    </td>
                    <td style={{ ...tableCellStyle, fontFamily: "var(--font-mono)", letterSpacing: "0.5px" }}>
                      {formatIBAN(account.iban)}
                    </td>
                    <td style={{ ...tableCellStyle, textAlign: "right" }}>
                      <button
                        onClick={() => handleDeleteAccount(account.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#ff5252",
                          cursor: "pointer",
                          padding: "4px 8px",
                          fontSize: "14px",
                          transition: "color 0.2s"
                        }}
                        title={isGeo ? "წაშლა" : "Delete"}
                        onMouseEnter={e => e.currentTarget.style.color = "#ff1744"}
                        onMouseLeave={e => e.currentTarget.style.color = "#ff5252"}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dynamic Add Form Panel */}
      {showAddForm && (
        <div style={cardSectionStyle} className="animate-slide-down">
          <h3 style={sectionTitleStyle}>
            <i className="fa-solid fa-plus" style={{ color: "var(--emerald)" }}></i>
            <span>{isGeo ? "ახალი საბანკო ანგარიშის დამატება" : "Add New Bank Account"}</span>
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={labelStyle}>
                {isGeo ? "ბანკის დასახელება" : "Bank Name"}
                {!bankName && <span style={{ color: '#ff5252', marginLeft: '4px' }}>*</span>}
              </label>
              <input 
                type="text" 
                placeholder={isGeo ? "საქართველოს ბანკი, თიბისი ბანკი..." : "Bank of Georgia, TBC Bank..."}
                value={bankName} 
                onChange={e => setBankName(e.target.value)} 
                style={inputStyle("bankName")}
                onFocus={() => setActiveInput("bankName")}
                onBlur={() => setActiveInput(null)}
              />
            </div>
            
            <div>
              <label style={labelStyle}>
                {isGeo ? "IBAN ანგარიშის ნომერი" : "IBAN Code"}
                {!iban && <span style={{ color: '#ff5252', marginLeft: '4px' }}>*</span>}
              </label>
              <input 
                type="text" 
                placeholder="GE00 TB00 0000 0000 0000 00"
                value={iban} 
                onChange={handleIbanChange} 
                style={{ ...inputStyle("iban"), fontFamily: "var(--font-mono)", letterSpacing: "1px" }}
                onFocus={() => setActiveInput("iban")}
                onBlur={() => setActiveInput(null)}
              />
              <div style={{ fontSize: "11px", color: "var(--silver)", marginTop: "4px" }}>
                {isGeo ? "ავტომატური დაჯგუფება ყოველ 4 სიმბოლოში" : "Auto character grouping every 4 indices"}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "16px", marginTop: "8px" }}>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setBankName("");
                  setIban("");
                }}
                style={{
                  backgroundColor: "transparent",
                  color: "var(--silver)",
                  border: "1px solid var(--iron-line)",
                  borderRadius: "6px",
                  padding: "10px 20px",
                  fontSize: "13px",
                  fontFamily: "var(--font-heading)",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.03)"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
              >
                {isGeo ? "გაუქმება" : "Cancel"}
              </button>

              <button
                onClick={handleAddAccount}
                disabled={isSaving}
                style={{
                  padding: "10px 24px",
                  background: "linear-gradient(135deg, var(--emerald) 0%, #00b359 100%)",
                  color: "var(--iron)",
                  fontFamily: "var(--font-heading)",
                  fontWeight: "800",
                  fontSize: "13px",
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
                    <span>{isGeo ? "ინახება..." : "Adding..."}</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-plus"></i>
                    <span>{isGeo ? "დამატება" : "Add Account"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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

    </div>
  );
};

export default BankingRequisitesTab;
