import React from '../../utils/react-shim.js';
import { useTranslation } from '../../context/LanguageContext.jsx';

const AddDepartmentModal = ({ isOpen, onClose, onSubmit, activeUnit, flatUnits }) => {
  const { i18n } = useTranslation();
  const isGeo = i18n.language === 'GEO';

  const [name, setName] = React.useState("");
  const [unitType, setUnitType] = React.useState("თანამდებობა/საშტატო ერთეული");
  const [parentId, setParentId] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setName("");
      setUnitType("დეპარტამენტი/სამსახური");
      setIsSubmitting(false);
      
      if (flatUnits && flatUnits.length === 1) {
        setParentId(flatUnits[0].id);
      } else if (activeUnit) {
        setParentId((activeUnit.unitType === 'თანამდებობა' || activeUnit.unitType === 'თანამდებობა/საშტატო ერთეული') ? (activeUnit.parentId || "") : activeUnit.id);
      } else {
        setParentId("");
      }
    }
  }, [isOpen, activeUnit, flatUnits]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        name,
        unitType: "თანამდებობა/საშტატო ერთეული"
      });
      // Modal is closed on success by the parent component
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
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
            {isGeo ? "ორგანიზაციული როლის დამატება" : "Add Organizational Role"}
          </h3>
          <button style={closeBtnStyle} onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          
          <div>
            <label style={labelStyle}>{isGeo ? "როლის დასახელება *" : "Role Name *"}</label>
            <select
              required
              disabled={isSubmitting}
              value={name} 
              onChange={e => setName(e.target.value)} 
              style={{
                ...selectStyle,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.6 : 1
              }}
            >
              <option value="">{isGeo ? "აირჩიეთ როლი" : "Select Role"}</option>
              <option value="პრეზიდენტი">{isGeo ? "პრეზიდენტი" : "President"}</option>
              <option value="ვიცე-პრეზიდენტი">{isGeo ? "ვიცე-პრეზიდენტი" : "Vice-President"}</option>
              <option value="აღმასრულებელი დირექტორი">{isGeo ? "აღმასრულებელი დირექტორი" : "Executive Director"}</option>
              <option value="ფინანსური დირექტორი">{isGeo ? "ფინანსური დირექტორი" : "Financial Director"}</option>
              <option value="გამგეობის თავმჯდომარე">{isGeo ? "გამგეობის თავმჯდომარე" : "Board Chairman"}</option>
              <option value="ყრილობის თავმჯდომარე">{isGeo ? "ყრილობის თავმჯდომარე" : "Assembly Chairman"}</option>
              <option value="ტექნიკური მენეჯერი">{isGeo ? "ტექნიკური მენეჯერი" : "Technical Manager"}</option>
              <option value="უსაფრთხოების მენეჯერი">{isGeo ? "უსაფრთხოების მენეჯერი" : "Security Manager"}</option>
              <option value="მატერიალური ქონების მართვის მენეჯერი">{isGeo ? "მატერიალური ქონების მართვის მენეჯერი" : "Property Manager"}</option>
            </select>
          </div>

          {/* Footer */}
          <div style={footerStyle}>
            <button 
              type="button" 
              style={{
                ...cancelBtnStyle,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.6 : 1
              }} 
              onClick={onClose} 
              disabled={isSubmitting}
            >
              {isGeo ? "გაუქმება" : "Cancel"}
            </button>
            <button 
              type="submit" 
              style={{
                ...submitBtnStyle,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.6 : 1
              }} 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: "6px" }}></i>
                  {isGeo ? "ინახება..." : "Saving..."}
                </>
              ) : (
                isGeo ? "დამატება" : "Add"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddDepartmentModal;
