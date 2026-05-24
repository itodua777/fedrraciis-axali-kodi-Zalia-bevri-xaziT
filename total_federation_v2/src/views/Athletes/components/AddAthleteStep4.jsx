import React from 'react';

const AddAthleteStep4 = ({ formData, updateData }) => {
  const renderDocUploadSlot = (field, title, defaultIcon, colorHex, bgLight, inputId) => {
    const doc = formData[field];
    const isUploaded = !!doc;

    const slotStyle = {
      border: isUploaded ? `1.5px solid #10b981` : `1.5px dashed ${colorHex}`,
      borderRadius: "12px",
      padding: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "15px",
      cursor: "pointer",
      backgroundColor: isUploaded ? "rgba(16, 185, 129, 0.05)" : bgLight,
      transition: "all 0.3s ease",
      boxShadow: isUploaded ? "0 0 15px rgba(16, 185, 129, 0.15)" : "none",
      position: "relative",
      overflow: "hidden"
    };

    const iconContainerStyle = {
      width: "42px",
      height: "42px",
      borderRadius: "50%",
      backgroundColor: isUploaded ? "#10b981" : colorHex,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      transition: "background-color 0.3s ease"
    };

    const iconStyle = {
      color: "#fff",
      fontSize: "16px"
    };

    return (
      <div 
        style={slotStyle} 
        onClick={() => document.getElementById(inputId).click()}
        onMouseEnter={e => {
          if (!isUploaded) {
            e.currentTarget.style.borderColor = "#22d3ee";
            e.currentTarget.style.boxShadow = "0 0 10px rgba(34, 211, 238, 0.2)";
          }
        }}
        onMouseLeave={e => {
          if (!isUploaded) {
            e.currentTarget.style.borderColor = colorHex;
            e.currentTarget.style.boxShadow = "none";
          }
        }}
      >
        <input 
          type="file" 
          id={inputId} 
          accept=".pdf,image/*" 
          style={{ display: "none" }} 
          onChange={e => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                updateData(field, {
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
        
        <div style={{ display: "flex", alignItems: "center", gap: "15px", flex: 1, minWidth: 0 }}>
          <div style={iconContainerStyle}>
            <i className={isUploaded ? "fa-solid fa-check" : defaultIcon} style={iconStyle}></i>
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: "14px", fontWeight: "bold", color: "#fff", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
              {title}
            </div>
            {isUploaded ? (
              <div style={{ fontSize: "12px", color: "#10b981", display: "flex", alignItems: "center", gap: "5px", minWidth: 0, marginTop: "4px" }}>
                <i className={doc.name.endsWith('.pdf') || doc.type === 'application/pdf' ? "fa-solid fa-file-pdf" : "fa-solid fa-file-image"}></i>
                <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", flex: 1 }}>
                  {doc.name} ({(doc.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
            ) : (
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>ატვირთეთ ფაილი...</div>
            )}
          </div>
        </div>

        {isUploaded && (
          <button 
            type="button" 
            onClick={e => {
              e.stopPropagation();
              updateData(field, null);
              document.getElementById(inputId).value = "";
            }}
            style={{ 
              background: "rgba(239, 68, 68, 0.1)", 
              border: "1px solid rgba(239, 68, 68, 0.3)", 
              color: "#ef4444", 
              width: "32px", 
              height: "32px", 
              borderRadius: "8px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              cursor: "pointer", 
              transition: "all 0.3s ease",
              zIndex: 2
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.2)"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)"}
          >
            <i className="fa-solid fa-trash"></i>
          </button>
        )}
      </div>
    );
  };

  return (
    <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
      {renderDocUploadSlot('idCardDoc', 'ID ბარათი / პასპორტი', 'fa-solid fa-id-card', '#94a3b8', 'rgba(148, 163, 184, 0.05)', 'idCardInput')}
      {renderDocUploadSlot('healthDoc', 'ჯანმრთელობის ცნობა', 'fa-solid fa-heart-pulse', '#ec4899', 'rgba(236, 72, 153, 0.05)', 'healthInput')}
      {renderDocUploadSlot('insuranceDoc', 'დაზღვევის დოკუმენტაცია', 'fa-solid fa-file-shield', '#3b82f6', 'rgba(59, 130, 246, 0.05)', 'insuranceInput')}
      {renderDocUploadSlot('dopingDoc', 'დოპინგ ტესტის შესაბამისი დოკუმენტი', 'fa-solid fa-vial', '#eab308', 'rgba(234, 179, 8, 0.05)', 'dopingInput')}
    </div>
  );
};

export default AddAthleteStep4;
