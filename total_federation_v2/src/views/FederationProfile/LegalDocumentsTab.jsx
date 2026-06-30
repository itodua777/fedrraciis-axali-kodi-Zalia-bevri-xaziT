import React from '../../utils/react-shim.js';
import { useTranslation } from '../../context/LanguageContext.jsx';

const LegalDocumentsTab = ({ isProfileComplete = true, onProfileUpdate }) => {
  const { t, i18n } = useTranslation();
  const isGeo = i18n.language === 'GEO';

  const [documents, setDocuments] = React.useState([]);
  const [dragActive, setDragActive] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [documentTitle, setDocumentTitle] = React.useState("");
  const [uploading, setUploading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [activeInput, setActiveInput] = React.useState(null);

  const fileInputRef = React.useRef(null);

  // Fetch Profile and Documents list on mount
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
      
      setDocuments(data?.documents || []);

      if (onProfileUpdate) {
        onProfileUpdate(data?.isProfileComplete ?? true);
      }
    } catch (err) {
      console.error(err);
      setDocuments([]);
      setMessage(isGeo ? "შეცდომა მონაცემების წაკითხვისას" : "Error loading profile details");
      setIsSuccess(false);
    }
  };

  // Drag and Drop Events
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
      stageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      stageFile(e.target.files[0]);
    }
  };

  // Stage file and set a friendly default title
  const stageFile = (file) => {
    setSelectedFile(file);
    const lastDotIdx = file.name.lastIndexOf('.');
    const defaultTitle = lastDotIdx !== -1 ? file.name.substring(0, lastDotIdx) : file.name;
    setDocumentTitle(defaultTitle);
    setMessage("");
  };

  // Perform backend multipart file upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    if (!documentTitle.trim()) {
      setIsSuccess(false);
      setMessage(isGeo ? "გთხოვთ შეიყვანოთ დოკუმენტის დასახელება" : "Please enter a document title");
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append('file', selectedFile); // Must match the @UploadedFile('file') decorator on NestJS
    formData.append('title', documentTitle.trim());

    try {
      const response = await fetch('http://localhost:5005/companies/profile/documents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          // Omit Content-Type header to let the browser automatically calculate the multipart boundary
        },
        body: formData
      });

      if (!response.ok) throw new Error("დოკუმენტის ატვირთვა ვერ მოხერხდა");
      const data = await response.json();

      setDocuments(data?.documents || []);
      setSelectedFile(null);
      setDocumentTitle("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsSuccess(true);
      setMessage(isGeo ? "დოკუმენტი წარმატებით აიტვირთა!" : "Document uploaded successfully!");

      if (onProfileUpdate) {
        onProfileUpdate(data?.isProfileComplete ?? true);
      }
    } catch (err) {
      console.error(err);
      setIsSuccess(false);
      setMessage(isGeo ? "შეცდომა ატვირთვისას" : "Error uploading document");
    } finally {
      setUploading(false);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  // Delete Document Handler
  const handleDeleteDocument = async (id) => {
    if (!window.confirm(isGeo ? "ნამდვილად გსურთ დოკუმენტის წაშლა?" : "Are you sure you want to delete this document?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5005/companies/profile/documents/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error("დოკუმენტის წაშლა ვერ მოხერხდა");
      const data = await response.json();

      setDocuments(data?.documents || []);
      setIsSuccess(true);
      setMessage(isGeo ? "დოკუმენტი წარმატებით წაიშალა!" : "Document deleted successfully!");

      if (onProfileUpdate) {
        onProfileUpdate(data?.isProfileComplete ?? true);
      }
    } catch (err) {
      console.error(err);
      setIsSuccess(false);
      setMessage(isGeo ? "შეცდომა წაშლისას" : "Error deleting document");
    } finally {
      setTimeout(() => setMessage(""), 4000);
    }
  };

  // Format File Size
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Map file extension to color & FontAwesome icon class
  const getFileFormatStyles = (format) => {
    const fmt = (format || "").toUpperCase();
    if (fmt === 'PDF') {
      return { icon: 'fa-regular fa-file-pdf', color: '#ff5252', bg: 'rgba(255, 82, 82, 0.08)' };
    } else if (['DOC', 'DOCX', 'TXT', 'ODT'].includes(fmt)) {
      return { icon: 'fa-regular fa-file-word', color: '#2979ff', bg: 'rgba(41, 121, 255, 0.08)' };
    } else if (['XLS', 'XLSX', 'CSV', 'ODS'].includes(fmt)) {
      return { icon: 'fa-regular fa-file-excel', color: '#00e676', bg: 'rgba(0, 230, 118, 0.08)' };
    } else if (['JPG', 'JPEG', 'PNG', 'WEBP', 'GIF', 'SVG'].includes(fmt)) {
      return { icon: 'fa-regular fa-file-image', color: '#ff9100', bg: 'rgba(255, 145, 0, 0.08)' };
    }
    return { icon: 'fa-regular fa-file', color: '#9e9e9e', bg: 'rgba(158, 158, 158, 0.08)' };
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
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} onDragEnter={handleDrag}>
      
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        style={{ display: "none" }}
      />

      {/* Upload Dropzone or Staging view */}
      <div style={cardSectionStyle}>
        <h3 style={sectionTitleStyle}>
          <i className="fa-solid fa-cloud-arrow-up" style={{ color: "var(--emerald)" }}></i>
          <span>
            {isGeo ? "დოკუმენტების ატვირთვა" : "Upload Document"}
            {documents.length === 0 && <span style={{ color: '#ff5252', marginLeft: '4px' }}>*</span>}
          </span>
        </h3>

        {!selectedFile ? (
          /* Drag & Drop Zone */
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            style={{
              width: "100%",
              padding: "40px 20px",
              border: dragActive ? "2px dashed var(--emerald)" : "1px dashed var(--iron-line)",
              borderRadius: "6px",
              backgroundColor: dragActive ? "rgba(0, 230, 118, 0.04)" : "rgba(255, 255, 255, 0.01)",
              cursor: "pointer",
              textAlign: "center",
              transition: "all 0.2s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px"
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
            <i className="fa-solid fa-folder-open" style={{ color: "var(--emerald)", fontSize: "36px", opacity: 0.85 }}></i>
            <span style={{ fontSize: "14px", color: "var(--bone)", fontWeight: "600", fontFamily: "var(--font-heading)" }}>
              {isGeo ? "გადმოათრიეთ ფაილი აქ ან დააწკაპუნეთ ასარჩევად" : "Drag and drop legal file here or click to browse"}
            </span>
            <span style={{ fontSize: "11px", color: "var(--silver)" }}>
              PDF, Word, Excel, Images (Max 10MB)
            </span>
          </div>
        ) : (
          /* Inline Staging Editor Card */
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            padding: "20px",
            backgroundColor: "rgba(255, 255, 255, 0.01)",
            border: "1px solid var(--iron-line)",
            borderRadius: "6px"
          }} className="animate-slide-down">
            <div style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid rgba(255, 255, 255, 0.03)", paddingBottom: "12px" }}>
              <div style={{
                width: "42px",
                height: "42px",
                borderRadius: "6px",
                backgroundColor: getFileFormatStyles(selectedFile.name.split('.').pop()).bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: getFileFormatStyles(selectedFile.name.split('.').pop()).color,
                fontSize: "18px"
              }}>
                <i className={getFileFormatStyles(selectedFile.name.split('.').pop()).icon}></i>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--bone)" }}>{selectedFile.name}</span>
                <span style={{ fontSize: "11px", color: "var(--silver)" }}>{formatSize(selectedFile.size)}</span>
              </div>
            </div>

            <div>
              <label style={labelStyle}>
                {isGeo ? "დოკუმენტის დასახელება (სისტემური სახელი)" : "Document Display Title"}
                {!documentTitle && <span style={{ color: '#ff5252', marginLeft: '4px' }}>*</span>}
              </label>
              <input 
                type="text" 
                placeholder={isGeo ? "მაგ. წესდება, გაწევრიანების ანკეტა..." : "e.g. Charter, Application Form..."}
                value={documentTitle} 
                onChange={e => setDocumentTitle(e.target.value)} 
                style={inputStyle("documentTitle")}
                onFocus={() => setActiveInput("documentTitle")}
                onBlur={() => setActiveInput(null)}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "16px", marginTop: "4px" }}>
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setDocumentTitle("");
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
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
                onClick={handleUpload}
                disabled={uploading}
                style={{
                  padding: "10px 24px",
                  background: "linear-gradient(135deg, var(--emerald) 0%, #00b359 100%)",
                  color: "var(--iron)",
                  fontFamily: "var(--font-heading)",
                  fontWeight: "800",
                  fontSize: "13px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: uploading ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 14px rgba(0, 230, 118, 0.25)",
                  transition: "all 0.2s ease-in-out",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
                onMouseEnter={e => {
                  if (!uploading) {
                    e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 230, 118, 0.45)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={e => {
                  if (!uploading) {
                    e.currentTarget.style.boxShadow = "0 4px 14px rgba(0, 230, 118, 0.25)";
                    e.currentTarget.style.transform = "none";
                  }
                }}
              >
                {uploading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>{isGeo ? "იტვირთება..." : "Uploading..."}</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-arrow-up-from-bracket"></i>
                    <span>{isGeo ? "ატვირთვა" : "Upload Document"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Files Repository Table */}
      <div style={cardSectionStyle}>
        <h3 style={sectionTitleStyle}>
          <i className="fa-solid fa-folder-closed" style={{ color: "var(--emerald)" }}></i>
          <span>
            {isGeo ? "ატვირთული დოკუმენტების არქივი" : "Uploaded Legal Vault"}
            {documents.length === 0 && <span style={{ color: '#ff5252', marginLeft: '4px' }}>*</span>}
          </span>
        </h3>

        {documents.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px 10px", color: "var(--silver)", fontSize: "13px", fontFamily: "var(--font-primary)" }}>
            {isGeo ? "იურიდიული დოკუმენტები არ არის ატვირთული" : "No legal documents uploaded yet"}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={gridTableStyle}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>{isGeo ? "დოკუმენტის დასახელება" : "Document Name"}</th>
                  <th style={tableHeaderStyle}>{isGeo ? "ატვირთვის თარიღი" : "Upload Date"}</th>
                  <th style={tableHeaderStyle}>{isGeo ? "ფორმატი" : "Format"}</th>
                  <th style={{ ...tableHeaderStyle, textAlign: "right" }}>{isGeo ? "მოქმედება" : "Action"}</th>
                </tr>
              </thead>
              <tbody>
                {documents.map(doc => {
                  const formatStyles = getFileFormatStyles(doc.format);
                  const uploadDate = new Date(doc.createdAt).toLocaleDateString(isGeo ? 'ka-GE' : 'en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  });

                  return (
                    <tr key={doc.id} style={{ transition: "background 0.2s" }}>
                      <td style={tableCellStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "4px",
                            backgroundColor: formatStyles.bg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: formatStyles.color,
                            fontSize: "14px",
                            flexShrink: 0
                          }}>
                            <i className={formatStyles.icon}></i>
                          </div>
                          <span style={{ fontWeight: "600" }}>{doc.title}</span>
                        </div>
                      </td>
                      <td style={{ ...tableCellStyle, color: "var(--silver)" }}>
                        {uploadDate}
                      </td>
                      <td style={tableCellStyle}>
                        <span style={{
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid var(--iron-line)",
                          borderRadius: "4px",
                          padding: "2px 6px",
                          fontSize: "11px",
                          fontWeight: "700",
                          fontFamily: "var(--font-mono)",
                          color: formatStyles.color
                        }}>
                          {doc.format}
                        </span>
                      </td>
                      <td style={{ ...tableCellStyle, textAlign: "right" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                          {/* Download Link */}
                          <button
                            onClick={() => window.open(`http://localhost:5005${doc.fileUrl}`, '_blank')}
                            style={{
                              background: "none",
                              border: "none",
                              color: "var(--emerald)",
                              cursor: "pointer",
                              padding: "4px 8px",
                              fontSize: "14px",
                              transition: "color 0.2s"
                            }}
                            title={isGeo ? "ჩამოტვირთვა / ნახვა" : "Download / View"}
                            onMouseEnter={e => e.currentTarget.style.color = "#00e676"}
                            onMouseLeave={e => e.currentTarget.style.color = "var(--emerald)"}
                          >
                            <i className="fa-solid fa-download"></i>
                          </button>

                          {/* Delete Trigger */}
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
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
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message Notifications */}
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

export default LegalDocumentsTab;
