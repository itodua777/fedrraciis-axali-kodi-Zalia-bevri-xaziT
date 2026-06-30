import React from '../../utils/react-shim.js';
import { useTranslation } from '../../context/LanguageContext.jsx';

const DepartmentDetails = ({
  activeUnit,
  onDeleteUnit,
  onRefresh,
  staffLedger = [],
  onUnassignUser
}) => {
  const { i18n } = useTranslation();
  const isGeo = i18n.language === 'GEO';

  const [isSaving, setIsSaving] = React.useState(false);
  const [isCameraOpen, setIsCameraOpen] = React.useState(false);
  const [error, setError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");

  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  const modules = [
    { key: 'athletes', geo: 'ათლეტები', eng: 'Athletes', icon: 'fa-user-running' },
    { key: 'calendar', geo: 'კალენდარი', eng: 'Calendar', icon: 'fa-calendar-days' },
    { key: 'finance', geo: 'ფინანსები', eng: 'Finance', icon: 'fa-coins' },
    { key: 'roles', geo: 'როლები', eng: 'Roles', icon: 'fa-user-shield' }
  ];

  const [permissionsMatrix, setPermissionsMatrix] = React.useState({
    athletes: { create: false, read: false, update: false, delete: false, fullControl: false },
    calendar: { create: false, read: false, update: false, delete: false, fullControl: false },
    finance: { create: false, read: false, update: false, delete: false, fullControl: false },
    roles: { create: false, read: false, update: false, delete: false, fullControl: false }
  });

  const [memberForm, setMemberForm] = React.useState({
    id: '',
    firstName: '',
    lastName: '',
    personalId: '',
    address: '',
    phone: '',
    email: '',
    bio: '',
    photo: ''
  });

  React.useEffect(() => {
    if (activeUnit) {
      const defaultPerms = {
        athletes: { create: false, read: false, update: false, delete: false, fullControl: false },
        calendar: { create: false, read: false, update: false, delete: false, fullControl: false },
        finance: { create: false, read: false, update: false, delete: false, fullControl: false },
        roles: { create: false, read: false, update: false, delete: false, fullControl: false }
      };

      if (activeUnit.permissions && Array.isArray(activeUnit.permissions)) {
        activeUnit.permissions.forEach(p => {
          const mod = p.module.toLowerCase();
          if (defaultPerms[mod]) {
            defaultPerms[mod] = {
              create: !!p.create,
              read: !!p.read,
              update: !!p.update,
              delete: !!p.delete,
              fullControl: !!p.fullControl
            };
          }
        });
      }

      setPermissionsMatrix(defaultPerms);

      // Populate member form if a user is assigned to this role
      if (activeUnit.users && activeUnit.users.length > 0) {
        const u = activeUnit.users[0];
        setMemberForm({
          id: u.id || '',
          firstName: u.firstName || '',
          lastName: u.lastName || '',
          personalId: u.personalId || '',
          address: u.address || '',
          phone: u.phone || '',
          email: u.email || '',
          bio: u.bio || '',
          photo: u.photo || ''
        });
      } else {
        // Clear/Empty form for new registration
        setMemberForm({
          id: '',
          firstName: '',
          lastName: '',
          personalId: '',
          address: '',
          phone: '',
          email: '',
          bio: '',
          photo: ''
        });
      }

      setIsCameraOpen(false);
      setError("");
      setSuccessMessage("");
    }
  }, [activeUnit]);

  if (!activeUnit) {
    return (
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "16px",
        height: "100%",
        color: "var(--silver)"
      }}>
        <i className="fa-solid fa-sitemap" style={{ fontSize: "48px", opacity: 0.15 }}></i>
        <div style={{ fontFamily: "var(--font-heading)", fontSize: "14px", fontWeight: "600" }}>
          {isGeo ? "აირჩიეთ ორგანიზაციული როლი მარცხენა პანელიდან" : "Select an organizational role from the left panel"}
        </div>
      </div>
    );
  }

  // Camera Management Handlers
  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(isGeo ? "კამერაზე წვდომა ვერ მოხერხდა." : "Could not access camera.");
      setIsCameraOpen(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setMemberForm(prev => ({ ...prev, photo: dataUrl }));
      }
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMemberForm(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMemberForm(prev => ({ ...prev, [name]: value }));
  };

  // Matrix Checkbox Toggle Handler
  const handleToggle = (moduleKey, flag) => {
    setPermissionsMatrix(prev => {
      const updatedModule = { ...prev[moduleKey] };
      
      if (flag === 'fullControl') {
        const newVal = !updatedModule.fullControl;
        updatedModule.fullControl = newVal;
        if (newVal) {
          updatedModule.create = true;
          updatedModule.read = true;
          updatedModule.update = true;
          updatedModule.delete = true;
        }
      } else {
        updatedModule[flag] = !updatedModule[flag];
        if (!updatedModule[flag] && updatedModule.fullControl) {
          updatedModule.fullControl = false;
        }
        if (updatedModule.create && updatedModule.read && updatedModule.update && updatedModule.delete) {
          updatedModule.fullControl = true;
        }
      }

      return {
        ...prev,
        [moduleKey]: updatedModule
      };
    });
  };

  // Unified Atomic Save Handler
  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Validate only if at least one field of member profile is provided
    const hasMemberInfo = memberForm.firstName.trim() || memberForm.lastName.trim() || memberForm.personalId.trim() || memberForm.email.trim() || memberForm.photo;
    
    if (hasMemberInfo) {
      if (!memberForm.firstName.trim()) return setError(isGeo ? 'სახელი სავალდებულოა' : 'First Name is required');
      if (!memberForm.lastName.trim()) return setError(isGeo ? 'გვარი სავალდებულოა' : 'Last Name is required');
      if (!memberForm.personalId.trim()) return setError(isGeo ? 'პირადი ნომერი სავალდებულოა' : 'Personal ID is required');
      if (memberForm.personalId.trim().length !== 11) return setError(isGeo ? 'პირადი ნომერი უნდა შედგებოდეს 11 ციფრისგან' : 'Personal ID must be exactly 11 digits');
      if (!memberForm.email.trim()) return setError(isGeo ? 'ელ-ფოსტა სავალდებულოა' : 'Email is required');
    }

    setIsSaving(true);
    try {
      const response = await fetch(`http://localhost:5005/hr/structure/${activeUnit.id}/save-member-and-permissions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          member: hasMemberInfo ? memberForm : null,
          permissions: permissionsMatrix
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || (isGeo ? "შენახვა ვერ მოხერხდა" : "Save failed"));
      }

      setSuccessMessage(isGeo ? "მონაცემები წარმატებით შეინახა!" : "Saved successfully!");
      if (onRefresh) {
        await onRefresh();
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearMember = () => {
    setMemberForm({
      id: '',
      firstName: '',
      lastName: '',
      personalId: '',
      address: '',
      phone: '',
      email: '',
      bio: '',
      photo: ''
    });
    setError("");
    setSuccessMessage("");
  };

  // Card layouts and styles
  const mainStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    height: "100%",
    overflowY: "auto",
    paddingRight: "8px"
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottom: "1px solid var(--iron-line)",
    paddingBottom: "16px"
  };

  const titleStyle = {
    margin: 0,
    fontFamily: "var(--font-heading)",
    fontSize: "20px",
    fontWeight: "800",
    color: "var(--bone)"
  };

  const tagStyle = {
    fontSize: "11px",
    fontWeight: "700",
    color: "var(--emerald)",
    backgroundColor: "rgba(0, 230, 118, 0.08)",
    padding: "3px 8px",
    borderRadius: "4px",
    border: "1px solid rgba(0, 230, 118, 0.2)",
    textTransform: "uppercase"
  };

  const sectionCardStyle = {
    backgroundColor: "var(--iron-2)",
    border: "1px solid var(--iron-line)",
    borderRadius: "8px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  };

  const splitFormContainer = {
    display: "flex",
    gap: "24px",
    flexWrap: "wrap"
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

  const tableHeaderStyle = {
    color: "var(--silver)",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    padding: "10px 12px",
    textAlign: "left",
    borderBottom: "1px solid var(--iron-line)"
  };

  const tableRowStyle = {
    borderBottom: "1px solid rgba(255, 255, 255, 0.03)",
    fontSize: "13px",
    fontFamily: "var(--font-primary)"
  };

  const tableCellStyle = {
    padding: "12px",
    color: "var(--bone)"
  };

  const inputGroupStyle = { display: "flex", flexDirection: "column", gap: "5px", flex: 1 };

  return (
    <div style={mainStyle} className="custom-scrollbar">
      
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={tagStyle}>{isGeo ? "ორგანიზაციული როლი" : "Organizational Role"}</span>
            <span style={{ fontSize: "11px", color: "var(--silver)" }}>ID: {activeUnit.id.substring(0, 8)}...</span>
          </div>
          <h2 style={titleStyle}>{activeUnit.name}</h2>
        </div>

        <button
          onClick={() => {
            if (window.confirm(isGeo ? "ნამდვილად გსურთ ამ როლის წაშლა?" : "Are you sure you want to delete this role?")) {
              onDeleteUnit(activeUnit.id);
            }
          }}
          style={{
            padding: "8px 16px",
            backgroundColor: "rgba(180, 3, 7, 0.08)",
            border: "1px solid rgba(180, 3, 7, 0.2)",
            color: "var(--crisis-from)",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 0.2s"
          }}
        >
          <i className="fa-solid fa-trash-can"></i>
          <span>{isGeo ? "წაშლა" : "Delete"}</span>
        </button>
      </div>

      {error && (
        <div style={{
          padding: "10px 14px",
          backgroundColor: "rgba(180, 3, 7, 0.08)",
          border: "1px solid rgba(180, 3, 7, 0.2)",
          borderRadius: "6px",
          color: "var(--crisis-from)",
          fontSize: "12px",
          fontFamily: "var(--font-mono)",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <i className="fa-solid fa-triangle-exclamation"></i>
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div style={{
          padding: "10px 14px",
          backgroundColor: "rgba(0, 230, 118, 0.08)",
          border: "1px solid rgba(0, 230, 118, 0.2)",
          borderRadius: "6px",
          color: "var(--emerald)",
          fontSize: "12px",
          fontFamily: "var(--font-mono)",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <i className="fa-solid fa-circle-check"></i>
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* Staff registry form */}
        <div style={sectionCardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", paddingBottom: "10px" }}>
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "var(--bone)", fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "8px" }}>
              <i className="fa-solid fa-user-plus" style={{ color: "var(--emerald)" }}></i>
              <span>{memberForm.id ? (isGeo ? "თანამშრომლის რედაქტირება" : "Edit Staff Member") : (isGeo ? "ახალი საშტატო ერთეულის დამატება" : "Add New Staff Member")}</span>
            </h3>
            {memberForm.id && (
              <button 
                type="button" 
                onClick={handleClearMember}
                style={{
                  padding: "4px 10px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid var(--iron-line)",
                  color: "var(--silver)",
                  borderRadius: "4px",
                  fontSize: "11px",
                  cursor: "pointer"
                }}
              >
                {isGeo ? "ახლის დამატება" : "Add New Instead"}
              </button>
            )}
          </div>

          <div style={splitFormContainer}>
            {/* Camera Block */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", flexShrink: 0 }}>
              <div style={{
                width: "110px",
                height: "110px",
                border: "2px dashed rgba(0, 230, 118, 0.3)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                backgroundColor: "rgba(0, 230, 118, 0.02)"
              }}>
                {!isCameraOpen && <input type="file" accept="image/*" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer", zIndex: 10 }} onChange={handlePhotoUpload} />}
                {isCameraOpen ? (
                  <video ref={videoRef} autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }}></video>
                ) : memberForm.photo ? (
                  <img src={memberForm.photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Avatar" />
                ) : (
                  <div style={{ textAlign: "center", color: "var(--silver)" }}>
                    <i className="fa-solid fa-image" style={{ fontSize: "20px", marginBottom: "4px" }}></i>
                    <div style={{ fontSize: "10px" }}>{isGeo ? "ატვირთვა" : "Upload"}</div>
                  </div>
                )}
              </div>

              {!isCameraOpen ? (
                <button type="button" onClick={startCamera} style={{ background: "rgba(0, 230, 118, 0.1)", border: "1px solid rgba(0, 230, 118, 0.3)", color: "var(--emerald)", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", display: "flex", alignItems: "center", gap: "5px" }}>
                  <i className="fa-solid fa-camera"></i> {isGeo ? "კამერა" : "Camera"}
                </button>
              ) : (
                <div style={{ display: "flex", gap: "5px" }}>
                  <button type="button" onClick={capturePhoto} style={{ background: "var(--emerald)", border: "none", color: "var(--iron)", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "bold" }}>
                    {isGeo ? "გადაღება" : "Capture"}
                  </button>
                  <button type="button" onClick={stopCamera} style={{ background: "transparent", border: "1px solid #ef4444", color: "#ef4444", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "11px" }}>
                    X
                  </button>
                </div>
              )}
              <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            </div>

            {/* Form Fields Grid */}
            <div style={{ flex: 1, display: "flex", flexWrap: "wrap", gap: "15px" }}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>{isGeo ? "სახელი *" : "First Name *"}</label>
                <input type="text" name="firstName" value={memberForm.firstName} onChange={handleInputChange} style={inputStyle} placeholder={isGeo ? "სახელი" : "First Name"} />
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>{isGeo ? "გვარი *" : "Last Name *"}</label>
                <input type="text" name="lastName" value={memberForm.lastName} onChange={handleInputChange} style={inputStyle} placeholder={isGeo ? "გვარი" : "Last Name"} />
              </div>

              <div style={{ ...inputGroupStyle, minWidth: "200px" }}>
                <label style={labelStyle}>{isGeo ? "პირადი ნომერი * (11 ციფრი)" : "National ID * (11 digits)"}</label>
                <input type="text" name="personalId" value={memberForm.personalId} onChange={handleInputChange} maxLength={11} style={inputStyle} placeholder="e.g. 01012345678" />
              </div>

              <div style={{ ...inputGroupStyle, minWidth: "100%" }}>
                <label style={labelStyle}>{isGeo ? "მისამართი" : "Address"}</label>
                <input type="text" name="address" value={memberForm.address} onChange={handleInputChange} style={inputStyle} placeholder={isGeo ? "ფიზიკური მისამართი" : "Physical Address"} />
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>{isGeo ? "ტელეფონი" : "Phone"}</label>
                <input type="text" name="phone" value={memberForm.phone} onChange={handleInputChange} style={inputStyle} placeholder="e.g. +995555123456" />
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>{isGeo ? "ელ-ფოსტა *" : "Email *"}</label>
                <input type="email" name="email" value={memberForm.email} onChange={handleInputChange} style={inputStyle} placeholder="mail@example.com" />
              </div>

              <div style={{ ...inputGroupStyle, minWidth: "100%" }}>
                <label style={labelStyle}>{isGeo ? "მოკლე აღწერა (Bio)" : "Bio/Notes"}</label>
                <textarea name="bio" value={memberForm.bio} onChange={handleInputChange} style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }} placeholder={isGeo ? "დამატებითი აღწერა..." : "Brief notes about the employee..."} />
              </div>
            </div>
          </div>
        </div>

        {/* Permissions Matrix */}
        <div style={sectionCardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", paddingBottom: "10px" }}>
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "var(--bone)", fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "6px" }}>
              <i className="fa-solid fa-shield-halved" style={{ color: "var(--emerald)" }}></i>
              <span>{isGeo ? "წვდომის უფლებების მატრიცა" : "Access Permissions Matrix"}</span>
            </h3>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr>
                  <th style={{ ...tableHeaderStyle, width: "30%" }}>{isGeo ? "მოდული" : "Module"}</th>
                  <th style={{ ...tableHeaderStyle, textAlign: "center" }}>{isGeo ? "წაკითხვა" : "Read"}</th>
                  <th style={{ ...tableHeaderStyle, textAlign: "center" }}>{isGeo ? "შექმნა" : "Create"}</th>
                  <th style={{ ...tableHeaderStyle, textAlign: "center" }}>{isGeo ? "განახლება" : "Update"}</th>
                  <th style={{ ...tableHeaderStyle, textAlign: "center" }}>{isGeo ? "წაშლა" : "Delete"}</th>
                  <th style={{ ...tableHeaderStyle, textAlign: "center" }}>{isGeo ? "სრული მართვა" : "Full Control"}</th>
                </tr>
              </thead>
              <tbody>
                {modules.map(mod => {
                  const perms = permissionsMatrix[mod.key] || { create: false, read: false, update: false, delete: false, fullControl: false };
                  return (
                    <tr key={mod.key} style={tableRowStyle}>
                      <td style={{ ...tableCellStyle, fontWeight: "600" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <i className={`fa-solid ${mod.icon}`} style={{ color: "var(--silver)", fontSize: "14px", width: "16px", textAlign: "center" }}></i>
                          <span>{isGeo ? mod.geo : mod.eng}</span>
                        </div>
                      </td>
                      {['read', 'create', 'update', 'delete', 'fullControl'].map(action => (
                        <td key={action} style={{ ...tableCellStyle, textAlign: "center" }}>
                          <input
                            type="checkbox"
                            checked={perms[action]}
                            onChange={() => handleToggle(mod.key, action)}
                            style={{
                              cursor: "pointer",
                              accentColor: "var(--emerald)",
                              width: "16px",
                              height: "16px"
                            }}
                          />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            disabled={isSaving}
            style={{
              padding: "12px 28px",
              background: "linear-gradient(135deg, var(--emerald) 0%, #00b359 100%)",
              border: "none",
              color: "var(--iron)",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "800",
              cursor: isSaving ? "not-allowed" : "pointer",
              boxShadow: "0 4px 15px rgba(0, 230, 118, 0.2)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "transform 0.1s"
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
                <span>{isGeo ? "შენახვა" : "Save"}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Staff ledger output table */}
      <div style={sectionCardStyle}>
        <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "var(--bone)", fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "8px" }}>
          <i className="fa-solid fa-users" style={{ color: "var(--emerald)" }}></i>
          <span>{isGeo ? "საშტატო ერთეულების რეესტრი" : "Staff Registry Ledger"}</span>
          <span style={{ fontSize: "11px", color: "var(--silver)", fontWeight: "500", marginLeft: "4px" }}>
            ({staffLedger.length} {isGeo ? "თანამშრომელი" : "members"})
          </span>
        </h3>

        {staffLedger.length === 0 ? (
          <div style={{
            padding: "30px 0",
            textAlign: "center",
            color: "var(--silver)",
            fontSize: "13px",
            fontStyle: "italic",
            border: "1px dashed rgba(255, 255, 255, 0.05)",
            borderRadius: "6px"
          }}>
            {isGeo ? "საშტატო ერთეულები ვერ მოიძებნა" : "No active members currently registered"}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>{isGeo ? "თანამშრომელი" : "Staff Member"}</th>
                  <th style={tableHeaderStyle}>{isGeo ? "პოზიცია / როლი" : "Position / Role"}</th>
                  <th style={tableHeaderStyle}>{isGeo ? "პირადი ნომერი" : "National ID"}</th>
                  <th style={tableHeaderStyle}>{isGeo ? "საკონტაქტო" : "Contact"}</th>
                  <th style={tableHeaderStyle}>{isGeo ? "უფლებები (ACL)" : "ACL Badges"}</th>
                  <th style={{ ...tableHeaderStyle, textAlign: "right" }}>{isGeo ? "მოქმედება" : "Action"}</th>
                </tr>
              </thead>
              <tbody>
                {staffLedger.map(member => (
                  <tr key={member.id} style={tableRowStyle}>
                    <td style={tableCellStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {member.photo ? (
                          <img src={member.photo} alt={member.firstName} style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(0, 230, 118, 0.2)" }} />
                        ) : (
                          <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justify: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
                            <i className="fa-solid fa-user" style={{ fontSize: "12px", color: "var(--silver)" }}></i>
                          </div>
                        )}
                        <div>
                          <strong style={{ color: "var(--bone)" }}>{member.firstName} {member.lastName}</strong>
                          {member.bio && <div style={{ fontSize: "11px", color: "var(--silver)", marginTop: "2px" }}>{member.bio}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={tableCellStyle}>
                      <span style={{ fontSize: "12px", backgroundColor: "rgba(0, 230, 118, 0.08)", color: "var(--emerald)", padding: "3px 8px", borderRadius: "4px", border: "1px solid rgba(0, 230, 118, 0.15)", fontWeight: "600" }}>
                        {member.roleName}
                      </span>
                    </td>
                    <td style={{ ...tableCellStyle, fontFamily: "var(--font-mono)", fontSize: "12px" }}>
                      {member.personalId}
                    </td>
                    <td style={tableCellStyle}>
                      <div style={{ fontSize: "12px" }}>{member.email}</div>
                      {member.phone && <div style={{ fontSize: "11px", color: "var(--silver)", marginTop: "2px" }}><i className="fa-solid fa-phone" style={{ fontSize: "9px", marginRight: "4px" }}></i>{member.phone}</div>}
                    </td>
                    <td style={tableCellStyle}>
                      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                        {member.permissions && member.permissions.length > 0 ? (
                          member.permissions.map(p => {
                            const activeRights = [];
                            if (p.fullControl) activeRights.push("★");
                            else {
                              if (p.read) activeRights.push("R");
                              if (p.create) activeRights.push("C");
                              if (p.update) activeRights.push("U");
                              if (p.delete) activeRights.push("D");
                            }

                            if (activeRights.length === 0) return null;

                            return (
                              <span
                                key={p.id}
                                style={{
                                  fontSize: "10px",
                                  backgroundColor: "rgba(255,255,255,0.02)",
                                  border: "1px solid var(--iron-line)",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  color: "var(--bone)",
                                  fontFamily: "var(--font-mono)"
                                }}
                              >
                                {p.module.toUpperCase()}: {activeRights.join("")}
                              </span>
                            );
                          })
                        ) : (
                          <span style={{ fontSize: "11px", color: "var(--silver)", fontStyle: "italic" }}>
                            {isGeo ? "არააქტიური" : "None"}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ ...tableCellStyle, textAlign: "right" }}>
                      <button
                        onClick={() => {
                          if (window.confirm(isGeo ? `ნამდვილად გსურთ ${member.firstName}-ს მოხსნა ამ როლიდან?` : `Are you sure you want to remove ${member.firstName} from this role?`)) {
                            onUnassignUser(member.id);
                          }
                        }}
                        title={isGeo ? "საშტატოდან მოხსნა" : "Remove from role"}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--crisis-from)",
                          cursor: "pointer",
                          fontSize: "14px",
                          opacity: 0.7,
                          transition: "opacity 0.2s"
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                        onMouseLeave={e => e.currentTarget.style.opacity = "0.7"}
                      >
                        <i className="fa-solid fa-user-minus"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default DepartmentDetails;
