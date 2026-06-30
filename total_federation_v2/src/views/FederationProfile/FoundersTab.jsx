import React from '../../utils/react-shim.js';
import { useTranslation } from '../../context/LanguageContext.jsx';

const FoundersTab = () => {
  const { i18n } = useTranslation();
  const isGeo = i18n.language === 'GEO';

  const [founders, setFounders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [activeInput, setActiveInput] = React.useState(null);
  const [showAddForm, setShowAddForm] = React.useState(false);

  // Form Type State
  const [founderType, setFounderType] = React.useState('INDIVIDUAL'); // 'INDIVIDUAL' or 'LEGAL_ENTITY'

  // Individual Form Fields
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [personalId, setPersonalId] = React.useState("");

  // Legal Entity Form Fields
  const [companyName, setCompanyName] = React.useState("");
  const [companyCode, setCompanyCode] = React.useState("");
  const [representativeName, setRepresentativeName] = React.useState("");
  const [representativePersonalId, setRepresentativePersonalId] = React.useState("");

  // Common switches
  const [isActiveMember, setIsActiveMember] = React.useState(true);
  const [hasVotingRight, setHasVotingRight] = React.useState(true);

  // Fetch Founders
  const fetchFounders = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5005/api/founders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error("დამფუძნებლების ჩატვირთვა ვერ მოხერხდა");
      const data = await response.json();
      setFounders(data || []);
    } catch (err) {
      console.error(err);
      setMessage(isGeo ? "შეცდომა დამფუძნებლების ჩატვირთვისას" : "Error loading founders registry");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchFounders();
  }, []);

  // Form input change helpers
  const handleDigitsOnly = (value, limit, setter) => {
    const clean = value.replace(/\D/g, '');
    if (clean.length <= limit) {
      setter(clean);
    }
  };

  // Submit Handler
  const handleAddFounder = async (e) => {
    e.preventDefault();
    setMessage("");

    // Front-end Validation
    if (founderType === 'INDIVIDUAL') {
      if (!firstName.trim() || !lastName.trim() || !phone.trim() || !email.trim() || !personalId.trim()) {
        setIsSuccess(false);
        setMessage(isGeo ? "გთხოვთ შეავსოთ ყველა სავალდებულო ველი" : "Please fill in all required fields");
        return;
      }
      if (personalId.length !== 11) {
        setIsSuccess(false);
        setMessage(isGeo ? "პირადი ნომერი უნდა შედგებოდეს ზუსტად 11 ციფრისგან" : "Personal ID must be exactly 11 digits");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setIsSuccess(false);
        setMessage(isGeo ? "ელ. ფოსტის ფორმატი არასწორია" : "Invalid email format");
        return;
      }
    } else {
      if (!companyName.trim() || !companyCode.trim() || !representativeName.trim() || !representativePersonalId.trim()) {
        setIsSuccess(false);
        setMessage(isGeo ? "გთხოვთ შეავსოთ ყველა სავალდებულო ველი" : "Please fill in all required fields");
        return;
      }
      if (companyCode.length !== 9) {
        setIsSuccess(false);
        setMessage(isGeo ? "საიდენტიფიკაციო კოდი უნდა შედგებოდეს ზუსტად 9 ციფრისგან" : "Company identification code must be exactly 9 digits");
        return;
      }
      if (representativePersonalId.length !== 11) {
        setIsSuccess(false);
        setMessage(isGeo ? "წარმომადგენლის პირადი ნომერი უნდა შედგებოდეს ზუსტად 11 ციფრისგან" : "Representative Personal ID must be exactly 11 digits");
        return;
      }
    }

    setIsSaving(true);

    const payload = founderType === 'INDIVIDUAL' ? {
      type: 'INDIVIDUAL',
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      personalId,
      isActiveMember,
      hasVotingRight
    } : {
      type: 'LEGAL_ENTITY',
      companyName: companyName.trim(),
      companyCode,
      representativeName: representativeName.trim(),
      representativePersonalId,
      isActiveMember,
      hasVotingRight
    };

    try {
      const response = await fetch('http://localhost:5005/api/founders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData?.message || "დამატება ვერ მოხერხდა");
      }

      await fetchFounders();
      
      // Clear form
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
      setPersonalId("");
      setCompanyName("");
      setCompanyCode("");
      setRepresentativeName("");
      setRepresentativePersonalId("");
      setIsActiveMember(true);
      setHasVotingRight(true);
      setShowAddForm(false);
      setIsSuccess(true);
      setMessage(isGeo ? "დამფუძნებელი წარმატებით დაემატა!" : "Founder added successfully!");
    } catch (err) {
      console.error(err);
      setIsSuccess(false);
      setMessage(err.message || (isGeo ? "შეცდომა დამატებისას" : "Error saving founder"));
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  // Toggle Switch Handler
  const handleToggleStatus = async (founder, field) => {
    try {
      const updatedValue = !founder[field];
      const response = await fetch(`http://localhost:5005/api/founders/${founder.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          [field]: updatedValue
        })
      });

      if (!response.ok) throw new Error("სტატუსის განახლება ვერ მოხერხდა");
      
      // Update local state directly
      setFounders(prev => prev.map(f => f.id === founder.id ? { ...f, [field]: updatedValue } : f));
    } catch (err) {
      console.error(err);
      setIsSuccess(false);
      setMessage(isGeo ? "შეცდომა სტატუსის შეცვლისას" : "Error updating membership status");
      setTimeout(() => setMessage(""), 4000);
    }
  };

  // Delete Handler
  const handleDeleteFounder = async (id) => {
    if (!window.confirm(isGeo ? "ნამდვილად გსურთ დამფუძნებლის წაშლა?" : "Are you sure you want to delete this founder?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5005/api/founders/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error("წაშლა ვერ მოხერხდა");

      setFounders(prev => prev.filter(f => f.id !== id));
      setIsSuccess(true);
      setMessage(isGeo ? "დამფუძნებელი წარმატებით წაიშალა!" : "Founder deleted successfully!");
    } catch (err) {
      console.error(err);
      setIsSuccess(false);
      setMessage(isGeo ? "შეცდომა წაშლისას" : "Error deleting founder record");
    } finally {
      setTimeout(() => setMessage(""), 4000);
    }
  };

  // Calculate stats in real-time
  const stats = {
    individuals: founders.filter(f => f.type === 'INDIVIDUAL').length,
    legalEntities: founders.filter(f => f.type === 'LEGAL_ENTITY').length,
    votingRights: founders.filter(f => f.hasVotingRight).length,
    total: founders.length
  };

  // Styling maps
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

  const inputStyle = (fieldId) => ({
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
  });

  const tableHeaderStyle = {
    padding: "14px 16px",
    fontSize: "11px",
    fontWeight: "700",
    color: "var(--silver)",
    fontFamily: "var(--font-heading)",
    textAlign: "left",
    borderBottom: "1px solid var(--iron-line)",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  };

  const tableCellStyle = {
    padding: "14px 16px",
    fontSize: "13px",
    color: "var(--bone)",
    fontFamily: "var(--font-primary)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.03)"
  };

  const switchContainerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 0"
  };

  // Custom switch styled toggle
  const renderSwitch = (checked, onChange) => (
    <div 
      onClick={onChange}
      style={{
        width: "44px",
        height: "22px",
        borderRadius: "100px",
        backgroundColor: checked ? "rgba(0, 230, 118, 0.2)" : "rgba(255, 255, 255, 0.08)",
        border: checked ? "1px solid var(--emerald)" : "1px solid var(--iron-line)",
        cursor: "pointer",
        position: "relative",
        transition: "all 0.25s ease"
      }}
    >
      <div 
        style={{
          width: "14px",
          height: "14px",
          borderRadius: "50%",
          backgroundColor: checked ? "var(--emerald)" : "var(--silver)",
          position: "absolute",
          top: "3px",
          left: checked ? "25px" : "4px",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
        }}
      />
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* 4 Micro-Stat Cards Counter Dashboard */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
        width: "100%"
      }}>
        {/* Total Individuals */}
        <div style={{
          backgroundColor: "var(--iron-2)",
          border: "1px solid var(--iron-line)",
          borderRadius: "8px",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)"
        }}>
          <div style={{
            width: "42px",
            height: "42px",
            borderRadius: "6px",
            backgroundColor: "rgba(0, 230, 118, 0.05)",
            color: "var(--emerald)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            border: "1px solid rgba(0, 230, 118, 0.15)"
          }}>
            <i className="fa-solid fa-user-tie"></i>
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "var(--silver)", fontFamily: "var(--font-heading)" }}>
              {isGeo ? "ფიზიკური პირები" : "Individual Founders"}
            </div>
            <div style={{ fontSize: "20px", fontWeight: "800", color: "var(--bone)", fontFamily: "var(--font-mono)", marginTop: "2px" }}>
              {stats.individuals}
            </div>
          </div>
        </div>

        {/* Total Legal Entities */}
        <div style={{
          backgroundColor: "var(--iron-2)",
          border: "1px solid var(--iron-line)",
          borderRadius: "8px",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)"
        }}>
          <div style={{
            width: "42px",
            height: "42px",
            borderRadius: "6px",
            backgroundColor: "rgba(0, 230, 118, 0.05)",
            color: "var(--emerald)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            border: "1px solid rgba(0, 230, 118, 0.15)"
          }}>
            <i className="fa-solid fa-building"></i>
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "var(--silver)", fontFamily: "var(--font-heading)" }}>
              {isGeo ? "იურიდიული პირები" : "Legal Entity Founders"}
            </div>
            <div style={{ fontSize: "20px", fontWeight: "800", color: "var(--bone)", fontFamily: "var(--font-mono)", marginTop: "2px" }}>
              {stats.legalEntities}
            </div>
          </div>
        </div>

        {/* Total Voting Rights */}
        <div style={{
          backgroundColor: "var(--iron-2)",
          border: "1px solid var(--iron-line)",
          borderRadius: "8px",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)"
        }}>
          <div style={{
            width: "42px",
            height: "42px",
            borderRadius: "6px",
            backgroundColor: "rgba(0, 230, 118, 0.05)",
            color: "var(--emerald)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            border: "1px solid rgba(0, 230, 118, 0.15)"
          }}>
            <i className="fa-solid fa-check-to-slot"></i>
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "var(--silver)", fontFamily: "var(--font-heading)" }}>
              {isGeo ? "ხმის უფლებით" : "Voting Members"}
            </div>
            <div style={{ fontSize: "20px", fontWeight: "800", color: "var(--bone)", fontFamily: "var(--font-mono)", marginTop: "2px" }}>
              {stats.votingRights}
            </div>
          </div>
        </div>

        {/* Combined Total */}
        <div style={{
          backgroundColor: "var(--iron-2)",
          border: "1px solid var(--iron-line)",
          borderRadius: "8px",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)"
        }}>
          <div style={{
            width: "42px",
            height: "42px",
            borderRadius: "6px",
            backgroundColor: "rgba(0, 230, 118, 0.05)",
            color: "var(--emerald)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            border: "1px solid rgba(0, 230, 118, 0.15)"
          }}>
            <i className="fa-solid fa-users"></i>
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "var(--silver)", fontFamily: "var(--font-heading)" }}>
              {isGeo ? "ჯამური დამფუძნებლები" : "Total Founders"}
            </div>
            <div style={{ fontSize: "20px", fontWeight: "800", color: "var(--bone)", fontFamily: "var(--font-mono)", marginTop: "2px" }}>
              {stats.total}
            </div>
          </div>
        </div>
      </div>

      {/* Main List Section */}
      <div style={cardSectionStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ ...sectionTitleStyle, borderBottom: "none", paddingBottom: 0 }}>
            <i className="fa-solid fa-users-cog" style={{ color: "var(--emerald)" }}></i>
            <span>{isGeo ? "დამფუძნებლების რეესტრი" : "Founders Registry"}</span>
          </h3>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                backgroundColor: "rgba(0, 230, 118, 0.08)",
                color: "var(--emerald)",
                border: "1px solid rgba(0, 230, 118, 0.2)",
                borderRadius: "6px",
                padding: "8px 16px",
                fontSize: "12px",
                fontWeight: "700",
                fontFamily: "var(--font-heading)",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(0, 230, 118, 0.15)"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "rgba(0, 230, 118, 0.08)"}
            >
              <i className="fa-solid fa-plus" style={{ marginRight: "6px" }}></i>
              {isGeo ? "დამატება" : "Add Founder"}
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "40px 0", color: "var(--silver)" }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "24px", marginRight: "10px" }}></i>
            <span>{isGeo ? "იტვირთება..." : "Loading..."}</span>
          </div>
        ) : founders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--silver)", fontSize: "13px" }}>
            {isGeo ? "დამფუძნებლები ჯერ არ არის დამატებული." : "No founders registered yet."}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>{isGeo ? "დამფუძნებელი / წარმომადგენელი" : "Founder / Representative"}</th>
                  <th style={tableHeaderStyle}>{isGeo ? "ტიპი" : "Type"}</th>
                  <th style={tableHeaderStyle}>{isGeo ? "კოდი / პირადი ნომერი" : "ID / Code"}</th>
                  <th style={tableHeaderStyle}>{isGeo ? "საკონტაქტო" : "Contact"}</th>
                  <th style={tableHeaderStyle}>{isGeo ? "აქტიური" : "Active"}</th>
                  <th style={tableHeaderStyle}>{isGeo ? "ხმა" : "Vote"}</th>
                  <th style={{ ...tableHeaderStyle, width: "60px", textAlign: "right" }}></th>
                </tr>
              </thead>
              <tbody>
                {founders.map(founder => (
                  <tr key={founder.id}>
                    <td style={tableCellStyle}>
                      {founder.type === 'INDIVIDUAL' ? (
                        <div style={{ fontWeight: "700" }}>{founder.firstName} {founder.lastName}</div>
                      ) : (
                        <div>
                          <div style={{ fontWeight: "700" }}>{founder.companyName}</div>
                          <div style={{ fontSize: "11px", color: "var(--silver)", marginTop: "2px" }}>
                            {isGeo ? "წარმომადგენელი: " : "Rep: "}{founder.representativeName}
                          </div>
                        </div>
                      )}
                    </td>
                    <td style={tableCellStyle}>
                      <span style={{
                        fontSize: "11px",
                        padding: "3px 8px",
                        borderRadius: "100px",
                        backgroundColor: founder.type === 'INDIVIDUAL' ? "rgba(0, 188, 212, 0.08)" : "rgba(156, 39, 176, 0.08)",
                        color: founder.type === 'INDIVIDUAL' ? "#00bcd4" : "#9c27b0",
                        fontWeight: "700"
                      }}>
                        {founder.type === 'INDIVIDUAL' 
                          ? (isGeo ? "ფიზ. პირი" : "Individual") 
                          : (isGeo ? "იურ. პირი" : "Corporate")}
                      </span>
                    </td>
                    <td style={{ ...tableCellStyle, fontFamily: "var(--font-mono)", fontSize: "12px" }}>
                      {founder.type === 'INDIVIDUAL' ? founder.personalId : (
                        <div>
                          <div>{founder.companyCode}</div>
                          <div style={{ fontSize: "10px", color: "var(--silver)", marginTop: "2px" }}>
                            Dir: {founder.representativePersonalId}
                          </div>
                        </div>
                      )}
                    </td>
                    <td style={tableCellStyle}>
                      {founder.type === 'INDIVIDUAL' ? (
                        <div>
                          <div>{founder.phone}</div>
                          <div style={{ fontSize: "11px", color: "var(--silver)" }}>{founder.email}</div>
                        </div>
                      ) : (
                        <span style={{ color: "var(--silver)", fontSize: "12px" }}>-</span>
                      )}
                    </td>
                    {/* Active Member Status Toggle */}
                    <td style={tableCellStyle}>
                      {renderSwitch(founder.isActiveMember, () => handleToggleStatus(founder, 'isActiveMember'))}
                    </td>
                    {/* Voting Rights Toggle */}
                    <td style={tableCellStyle}>
                      {renderSwitch(founder.hasVotingRight, () => handleToggleStatus(founder, 'hasVotingRight'))}
                    </td>
                    {/* Actions */}
                    <td style={{ ...tableCellStyle, textAlign: "right" }}>
                      <button
                        onClick={() => handleDeleteFounder(founder.id)}
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
            <span>{isGeo ? "ახალი დამფუძნებლის დამატება" : "Add New Founder"}</span>
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            {/* Toggle / Segmented Buttons Group */}
            <div>
              <label style={labelStyle}>{isGeo ? "დამფუძნებლის ტიპი" : "Founder Type"}</label>
              <div style={{
                display: "flex",
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                padding: "3px",
                borderRadius: "6px",
                border: "1px solid var(--iron-line)",
                width: "fit-content"
              }}>
                <button
                  type="button"
                  onClick={() => setFounderType('INDIVIDUAL')}
                  style={{
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "4px",
                    backgroundColor: founderType === 'INDIVIDUAL' ? "var(--emerald)" : "transparent",
                    color: founderType === 'INDIVIDUAL' ? "var(--iron)" : "var(--silver)",
                    fontFamily: "var(--font-heading)",
                    fontWeight: "800",
                    fontSize: "12px",
                    cursor: "pointer",
                    transition: "all 0.25s ease"
                  }}
                >
                  {isGeo ? "ფიზიკური პირი" : "Individual"}
                </button>
                <button
                  type="button"
                  onClick={() => setFounderType('LEGAL_ENTITY')}
                  style={{
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "4px",
                    backgroundColor: founderType === 'LEGAL_ENTITY' ? "var(--emerald)" : "transparent",
                    color: founderType === 'LEGAL_ENTITY' ? "var(--iron)" : "var(--silver)",
                    fontFamily: "var(--font-heading)",
                    fontWeight: "800",
                    fontSize: "12px",
                    cursor: "pointer",
                    transition: "all 0.25s ease"
                  }}
                >
                  {isGeo ? "იურიდიული პირი" : "Legal Entity"}
                </button>
              </div>
            </div>

            {/* Render fields for Individual */}
            {founderType === 'INDIVIDUAL' && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>
                    {isGeo ? "სახელი" : "First Name"}
                    {!firstName && <span style={{ color: '#ff5252', marginLeft: '4px' }}>*</span>}
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    style={inputStyle("firstName")}
                    onFocus={() => setActiveInput("firstName")}
                    onBlur={() => setActiveInput(null)}
                    placeholder={isGeo ? "მაგ. გიორგი" : "e.g. Giorgi"}
                  />
                </div>
                <div>
                  <label style={labelStyle}>
                    {isGeo ? "გვარი" : "Last Name"}
                    {!lastName && <span style={{ color: '#ff5252', marginLeft: '4px' }}>*</span>}
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    style={inputStyle("lastName")}
                    onFocus={() => setActiveInput("lastName")}
                    onBlur={() => setActiveInput(null)}
                    placeholder={isGeo ? "მაგ. კაპანაძე" : "e.g. Kapanadze"}
                  />
                </div>
                <div>
                  <label style={labelStyle}>
                    {isGeo ? "პირადი ნომერი (11 ნიშნა)" : "National Personal ID (11 digits)"}
                    {personalId.length !== 11 && <span style={{ color: '#ff5252', marginLeft: '4px' }}>*</span>}
                  </label>
                  <input
                    type="text"
                    value={personalId}
                    onChange={e => handleDigitsOnly(e.target.value, 11, setPersonalId)}
                    style={{ ...inputStyle("personalId"), fontFamily: "var(--font-mono)", letterSpacing: "1px" }}
                    onFocus={() => setActiveInput("personalId")}
                    onBlur={() => setActiveInput(null)}
                    placeholder="01012345678"
                  />
                  <div style={{ fontSize: "11px", color: personalId.length === 11 ? "var(--emerald)" : "var(--silver)", marginTop: "4px" }}>
                    {personalId.length}/11 {isGeo ? "ციფრი" : "digits"}
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>
                    {isGeo ? "ტელეფონი" : "Phone"}
                    {!phone && <span style={{ color: '#ff5252', marginLeft: '4px' }}>*</span>}
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    style={inputStyle("phone")}
                    onFocus={() => setActiveInput("phone")}
                    onBlur={() => setActiveInput(null)}
                    placeholder="+995 555 12 34 56"
                  />
                </div>
                <div style={{ gridColumn: "span 1" }}>
                  <label style={labelStyle}>
                    {isGeo ? "ელ. ფოსტა" : "Email"}
                    {!email && <span style={{ color: '#ff5252', marginLeft: '4px' }}>*</span>}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={inputStyle("email")}
                    onFocus={() => setActiveInput("email")}
                    onBlur={() => setActiveInput(null)}
                    placeholder="founder@example.com"
                  />
                </div>
              </div>
            )}

            {/* Render fields for Legal Entity */}
            {founderType === 'LEGAL_ENTITY' && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>
                    {isGeo ? "კომპანიის დასახელება" : "Company Name"}
                    {!companyName && <span style={{ color: '#ff5252', marginLeft: '4px' }}>*</span>}
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    style={inputStyle("companyName")}
                    onFocus={() => setActiveInput("companyName")}
                    onBlur={() => setActiveInput(null)}
                    placeholder={isGeo ? "მაგ. შპს სპორტის განვითარება" : "e.g. LLC Sports Development"}
                  />
                </div>
                <div>
                  <label style={labelStyle}>
                    {isGeo ? "საიდენტიფიკაციო კოდი (9 ნიშნა)" : "Corporate Code (9 digits)"}
                    {companyCode.length !== 9 && <span style={{ color: '#ff5252', marginLeft: '4px' }}>*</span>}
                  </label>
                  <input
                    type="text"
                    value={companyCode}
                    onChange={e => handleDigitsOnly(e.target.value, 9, setCompanyCode)}
                    style={{ ...inputStyle("companyCode"), fontFamily: "var(--font-mono)", letterSpacing: "1px" }}
                    onFocus={() => setActiveInput("companyCode")}
                    onBlur={() => setActiveInput(null)}
                    placeholder="404123456"
                  />
                  <div style={{ fontSize: "11px", color: companyCode.length === 9 ? "var(--emerald)" : "var(--silver)", marginTop: "4px" }}>
                    {companyCode.length}/9 {isGeo ? "ციფრი" : "digits"}
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>
                    {isGeo ? "დირექტორის / წარმომადგენლის სახელი" : "Representative/Director's Name"}
                    {!representativeName && <span style={{ color: '#ff5252', marginLeft: '4px' }}>*</span>}
                  </label>
                  <input
                    type="text"
                    value={representativeName}
                    onChange={e => setRepresentativeName(e.target.value)}
                    style={inputStyle("representativeName")}
                    onFocus={() => setActiveInput("representativeName")}
                    onBlur={() => setActiveInput(null)}
                    placeholder={isGeo ? "მაგ. გიორგი კაპანაძე" : "e.g. Giorgi Kapanadze"}
                  />
                </div>
                <div>
                  <label style={labelStyle}>
                    {isGeo ? "წარმომადგენლის პირადი ნომერი (11 ნიშნა)" : "Representative Personal ID (11 digits)"}
                    {representativePersonalId.length !== 11 && <span style={{ color: '#ff5252', marginLeft: '4px' }}>*</span>}
                  </label>
                  <input
                    type="text"
                    value={representativePersonalId}
                    onChange={e => handleDigitsOnly(e.target.value, 11, setRepresentativePersonalId)}
                    style={{ ...inputStyle("representativePersonalId"), fontFamily: "var(--font-mono)", letterSpacing: "1px" }}
                    onFocus={() => setActiveInput("representativePersonalId")}
                    onBlur={() => setActiveInput(null)}
                    placeholder="01012345678"
                  />
                  <div style={{ fontSize: "11px", color: representativePersonalId.length === 11 ? "var(--emerald)" : "var(--silver)", marginTop: "4px" }}>
                    {representativePersonalId.length}/11 {isGeo ? "ციფრი" : "digits"}
                  </div>
                </div>
              </div>
            )}

            {/* Membership and Voting Switches */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", padding: "12px 0", borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>
              <div style={switchContainerStyle}>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--bone)" }}>
                    {isGeo ? "აქტიური წევრი" : "Active Member"}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--silver)", marginTop: "2px" }}>
                    {isGeo ? "წევრობის მიმდინარე სტატუსის მართვა" : "Manage active membership status"}
                  </div>
                </div>
                {renderSwitch(isActiveMember, () => setIsActiveMember(!isActiveMember))}
              </div>

              <div style={switchContainerStyle}>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--bone)" }}>
                    {isGeo ? "ხმის უფლების მქონე" : "Voting Rights"}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--silver)", marginTop: "2px" }}>
                    {isGeo ? "ყრილობაზე ხმის მიცემის უფლება" : "Eligibility to vote at assemblies"}
                  </div>
                </div>
                {renderSwitch(hasVotingRight, () => setHasVotingRight(!hasVotingRight))}
              </div>
            </div>

            {/* Submit / Cancel Buttons */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "16px", marginTop: "8px" }}>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setFirstName("");
                  setLastName("");
                  setPhone("");
                  setEmail("");
                  setPersonalId("");
                  setCompanyName("");
                  setCompanyCode("");
                  setRepresentativeName("");
                  setRepresentativePersonalId("");
                  setIsActiveMember(true);
                  setHasVotingRight(true);
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
                onClick={handleAddFounder}
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
                    <span>{isGeo ? "ინახება..." : "Saving..."}</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-check"></i>
                    <span>{isGeo ? "შენახვა" : "Save Founder"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action / Saving Status Message Banner */}
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

export default FoundersTab;
