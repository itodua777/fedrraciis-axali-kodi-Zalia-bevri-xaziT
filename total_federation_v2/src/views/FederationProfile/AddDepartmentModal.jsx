import React from '../../utils/react-shim.js';
import { useTranslation } from '../../context/LanguageContext.jsx';

const AddDepartmentModal = ({ isOpen, onClose, onSubmit, activeUnit, flatUnits }) => {
  const { i18n } = useTranslation();
  const isGeo = i18n.language === 'GEO';

  const [name, setName] = React.useState("");
  const [unitType, setUnitType] = React.useState("დეპარტამენტი");
  const [compositionType, setCompositionType] = React.useState("");
  const [termDuration, setTermDuration] = React.useState("");
  const [actNumber, setActNumber] = React.useState("");
  const [issueDate, setIssueDate] = React.useState("");
  const [parentId, setParentId] = React.useState("");

  React.useEffect(() => {
    if (isOpen) {
      setName("");
      setUnitType("დეპარტამენტი");
      setCompositionType("");
      setTermDuration("");
      setActNumber("");
      setIssueDate("");
      setParentId(activeUnit ? activeUnit.id : "");
    }
  }, [isOpen, activeUnit]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name,
      unitType,
      compositionType: compositionType || null,
      termDuration: termDuration || null,
      actNumber: actNumber || null,
      issueDate: issueDate || null,
      parentId: parentId || null
    });
  };

  const backdropStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    animation: "fadeIn 0.2s ease-out"
  };

  const modalStyle = {
    width: "480px",
    backgroundColor: "#1c1e22", // var(--iron-1)
    border: "1px solid var(--iron-line)",
    borderRadius: "8px",
    padding: "24px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    animation: "slideUp 0.2s ease-out",
    color: "var(--bone)"
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "between",
    alignItems: "center",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    paddingBottom: "12px"
  };

  const titleStyle = {
    margin: 0,
    fontFamily: "var(--font-heading)",
    fontSize: "18px",
    fontWeight: "700",
    color: "var(--bone)"
  };

  const closeBtnStyle = {
    background: "none",
    border: "none",
    color: "var(--silver)",
    cursor: "pointer",
    fontSize: "16px"
  };

  const labelStyle = {
    display: "block",
    color: "var(--silver)",
    fontSize: "11px",
    fontWeight: "600",
    marginBottom: "6px",
    fontFamily: "var(--font-primary)"
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    border: "1px solid var(--iron-line)",
    borderRadius: "6px",
    color: "var(--bone)",
    outline: "none",
    fontSize: "13px",
    fontFamily: "var(--font-primary)",
    transition: "border 0.2s"
  };

  const selectStyle = {
    ...inputStyle,
    backgroundColor: "#121418"
  };

  const footerStyle = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
    paddingTop: "16px",
    marginTop: "8px"
  };

  const cancelBtnStyle = {
    padding: "10px 20px",
    backgroundColor: "transparent",
    border: "1px solid var(--iron-line)",
    borderRadius: "6px",
    color: "var(--silver)",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s"
  };

  const submitBtnStyle = {
    padding: "10px 20px",
    background: "linear-gradient(135deg, var(--emerald) 0%, #00b359 100%)",
    border: "none",
    borderRadius: "6px",
    color: "var(--iron)",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0, 230, 118, 0.2)",
    transition: "all 0.2s"
  };

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", paddingBottom: "12px" }}>
          <h3 style={titleStyle}>
            {isGeo ? "ქვედანაყოფის დამატება" : "Add Structure Unit"}
          </h3>
          <button style={closeBtnStyle} onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          
          <div>
            <label style={labelStyle}>{isGeo ? "ქვედანაყოფის დასახელება *" : "Unit Name *"}</label>
            <input 
              type="text" 
              required
              placeholder={isGeo ? "მაგ. მარკეტინგის დეპარტამენტი" : "e.g. Marketing Department"}
              value={name} 
              onChange={e => setName(e.target.value)} 
              style={inputStyle} 
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label style={labelStyle}>{isGeo ? "ტიპი *" : "Type *"}</label>
              <select value={unitType} onChange={e => setUnitType(e.target.value)} style={selectStyle}>
                <option value="ფილიალი">{isGeo ? "ფილიალი" : "Branch"}</option>
                <option value="დეპარტამენტი">{isGeo ? "დეპარტამენტი" : "Department"}</option>
                <option value="კომიტეტი">{isGeo ? "კომიტეტი" : "Committee"}</option>
                <option value="კომისია">{isGeo ? "კომისია" : "Commission"}</option>
                <option value="სამსახური">{isGeo ? "სამსახური" : "Office/Service"}</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>{isGeo ? "მშობელი ქვედანაყოფი" : "Parent Unit"}</label>
              <select value={parentId} onChange={e => setParentId(e.target.value)} style={selectStyle}>
                <option value="">{isGeo ? "[არცერთი - ძირითადი]" : "[None - Root]"}</option>
                {flatUnits.map(unit => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} ({unit.unitType})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label style={labelStyle}>{isGeo ? "შემადგენლობის ტიპი" : "Composition Type"}</label>
              <input 
                type="text" 
                placeholder={isGeo ? "მაგ. კოლეგიური" : "e.g. Collegial"}
                value={compositionType} 
                onChange={e => setCompositionType(e.target.value)} 
                style={inputStyle} 
              />
            </div>
            <div>
              <label style={labelStyle}>{isGeo ? "უფლებამოსილების ვადა" : "Term Duration"}</label>
              <input 
                type="text" 
                placeholder={isGeo ? "მაგ. 4 წელი" : "e.g. 4 Years"}
                value={termDuration} 
                onChange={e => setTermDuration(e.target.value)} 
                style={inputStyle} 
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label style={labelStyle}>{isGeo ? "აქტის ნომერი" : "Act Number"}</label>
              <input 
                type="text" 
                placeholder="N-120"
                value={actNumber} 
                onChange={e => setActNumber(e.target.value)} 
                style={inputStyle} 
              />
            </div>
            <div>
              <label style={labelStyle}>{isGeo ? "გაცემის თარიღი" : "Issue Date"}</label>
              <input 
                type="date" 
                value={issueDate} 
                onChange={e => setIssueDate(e.target.value)} 
                style={inputStyle} 
              />
            </div>
          </div>

          {/* Footer */}
          <div style={footerStyle}>
            <button type="button" style={cancelBtnStyle} onClick={onClose}>
              {isGeo ? "გაუქმება" : "Cancel"}
            </button>
            <button type="submit" style={submitBtnStyle}>
              {isGeo ? "დამატება" : "Add"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddDepartmentModal;
