import React from 'react';

export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  personalId: string;
  address: string;
  phone: string;
  email: string;
  bio: string;
  photo: string;
  permissions: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
  role: string;
}

const ROLE_MAP: Record<string, string> = {
  president: "პრეზიდენტი",
  vice_president: "ვიცე-პრეზიდენტი",
  exec_director_gen_sec: "აღმასრულებელი დირექტორი / გენერალური მდივანი",
  cfo_treasurer: "ფინანსური დირექტორი / ხაზინადარი",
  board_chair_sec: "გამგეობის თავმჯდომარე / მდივანი",
  assembly_chair_sec: "ყრილობის თავმჯდომარე / მდივანი",
  technical_manager: "ტექნიკური მენეჯერი",
  security_manager: "უსაფრთხოების მენეჯერი",
  property_manager: "მატერიალური ქონების მართვის მენეჯერი"
};

interface StaffRegistryProps {
  onAddStaff?: (member: StaffMember) => void;
}

export const StaffRegistry: React.FC<StaffRegistryProps> = () => {
  const [staffList, setStaffList] = React.useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('management_staff');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: "1",
        firstName: "ალექსანდრე",
        lastName: "ასათიანი",
        personalId: "01012345678",
        address: "თბილისი, ჭავჭავაძის გამზ. 15",
        phone: "+995555111222",
        email: "a.asatiani@federation.ge",
        bio: "ფედერაციის იურისტი და ადმინისტრაციული მენეჯერი.",
        photo: "https://i.pravatar.cc/150?img=68",
        permissions: { read: true, write: true, delete: false },
        role: "board_chair_sec"
      },
      {
        id: "2",
        firstName: "ნინო",
        lastName: "წერეთელი",
        personalId: "01087654321",
        address: "ქუთაისი, რუსთაველის ქ. 4",
        phone: "+995555333444",
        email: "n.tsereteli@federation.ge",
        bio: "სპორტული მიმართულების კოორდინატორი.",
        photo: "https://i.pravatar.cc/150?img=47",
        permissions: { read: true, write: true, delete: true },
        role: "president"
      }
    ];
  });

  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    personalId: '',
    address: '',
    phone: '',
    email: '',
    bio: '',
    photoPreview: '',
    read: false,
    write: false,
    delete: false,
    role: ''
  });

  const [error, setError] = React.useState('');
  const [isCameraOpen, setIsCameraOpen] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    localStorage.setItem('management_staff', JSON.stringify(staffList));
  }, [staffList]);

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("კამერაზე წვდომა ვერ მოხერხდა.");
      setIsCameraOpen(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setFormData(prev => ({ ...prev, photoPreview: dataUrl }));
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoPreview: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'role') {
      let read = false;
      let write = false;
      let del = false;
      if (value === 'president' || value === 'vice_president' || value === 'exec_director_gen_sec' || value === 'cfo_treasurer') {
        read = true;
        write = true;
        del = true;
      } else if (value === 'board_chair_sec' || value === 'assembly_chair_sec') {
        read = true;
        write = true;
        del = false;
      } else if (value === 'technical_manager' || value === 'security_manager' || value === 'property_manager') {
        read = true;
        write = false;
        del = false;
      }
      setFormData(prev => ({
        ...prev,
        role: value,
        read,
        write,
        delete: del
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (name: 'read' | 'write' | 'delete') => {
    setFormData(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.firstName.trim()) return setError('გთხოვთ მიუთითოთ სახელი');
    if (!formData.lastName.trim()) return setError('გთხოვთ მიუთითოთ გვარი');
    if (!formData.personalId.trim()) return setError('გთხოვთ მიუთითოთ პირადი ნომერი');
    if (formData.personalId.trim().length !== 11) return setError('პირადი ნომერი უნდა შედგებოდეს 11 ციფრისგან');
    if (!formData.role) return setError('გთხოვთ აირჩიოთ როლი / პოზიცია');
    if (!formData.email.trim()) return setError('გთხოვთ მიუთითოთ ელ-ფოსტა');

    const newStaff: StaffMember = {
      id: String(Date.now()),
      firstName: formData.firstName,
      lastName: formData.lastName,
      personalId: formData.personalId,
      address: formData.address,
      phone: formData.phone,
      email: formData.email,
      bio: formData.bio,
      photo: formData.photoPreview || "https://i.pravatar.cc/150?img=" + Math.floor(Math.random() * 70),
      permissions: {
        read: formData.read,
        write: formData.write,
        delete: formData.delete
      },
      role: formData.role
    };

    setStaffList(prev => [...prev, newStaff]);

    // reset form
    setFormData({
      firstName: '',
      lastName: '',
      personalId: '',
      address: '',
      phone: '',
      email: '',
      bio: '',
      photoPreview: '',
      read: false,
      write: false,
      delete: false,
      role: ''
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('ნამდვილად გსურთ ამ საშტატო ერთეულის წაშლა?')) {
      setStaffList(prev => prev.filter(item => item.id !== id));
    }
  };

  const inputGroupStyle = { display: "flex", flexDirection: "column" as const, gap: "5px", flex: 1 };
  const labelStyle = { fontSize: "12px", color: "rgba(255, 255, 255, 0.5)", fontWeight: "500" };
  const inputStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    padding: "10px",
    color: "#fff",
    outline: "none",
    fontSize: "14px",
    transition: "border-color 0.3s"
  };

  const checkboxLabelStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontSize: "13px",
    color: "#e2e8f0"
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
      {/* Creation form */}
      <div style={{
        backgroundColor: "rgba(30, 41, 59, 0.4)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: "12px",
        padding: "24px"
      }}>
        <h3 style={{ margin: "0 0 20px 0", color: "#22d3ee", fontSize: "16px", textShadow: "0 0 8px rgba(34, 211, 238, 0.2)" }}>
          <i className="fa-solid fa-user-plus" style={{ marginRight: "8px" }}></i>
          ახალი საშტატო ერთეულის დამატება
        </h3>

        {error && (
          <div style={{ color: "#ef4444", marginBottom: "15px", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
            <i className="fa-solid fa-triangle-exclamation"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
            
            {/* Avatar block */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", flexShrink: 0 }}>
              <div style={{
                width: "100px",
                height: "100px",
                border: "2px dashed rgba(34, 211, 238, 0.4)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                backgroundColor: "rgba(34, 211, 238, 0.02)"
              }}>
                {!isCameraOpen && <input type="file" accept="image/*" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer", zIndex: 10 }} onChange={handlePhotoUpload} />}
                {isCameraOpen ? (
                  <video ref={videoRef} autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }}></video>
                ) : formData.photoPreview ? (
                  <img src={formData.photoPreview} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Avatar Preview" />
                ) : (
                  <div style={{ textAlign: "center", color: "rgba(34, 211, 238, 0.6)" }}>
                    <i className="fa-solid fa-image" style={{ fontSize: "20px", marginBottom: "4px" }}></i>
                    <div style={{ fontSize: "10px" }}>ატვირთვა</div>
                  </div>
                )}
              </div>

              {!isCameraOpen ? (
                <button type="button" onClick={startCamera} style={{ background: "rgba(34, 211, 238, 0.1)", border: "1px solid rgba(34, 211, 238, 0.4)", color: "#22d3ee", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", display: "flex", alignItems: "center", gap: "5px" }}>
                  <i className="fa-solid fa-camera"></i> კამერა
                </button>
              ) : (
                <div style={{ display: "flex", gap: "5px" }}>
                  <button type="button" onClick={capturePhoto} style={{ background: "#22d3ee", border: "none", color: "#121418", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "bold" }}>
                    გადაღება
                  </button>
                  <button type="button" onClick={stopCamera} style={{ background: "transparent", border: "1px solid #ef4444", color: "#ef4444", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "11px" }}>
                    X
                  </button>
                </div>
              )}
              <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            </div>

            {/* Inputs grid */}
            <div style={{ flex: 1, display: "flex", flexWrap: "wrap", gap: "15px" }}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>სახელი *</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} style={inputStyle} placeholder="მაგ. ალექსანდრე" />
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>გვარი *</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} style={inputStyle} placeholder="მაგ. ასათიანი" />
              </div>

              <div style={{ ...inputGroupStyle, minWidth: "220px" }}>
                <label style={labelStyle}>პირადი ნომერი * (11-ნიშნა)</label>
                <input type="text" name="personalId" value={formData.personalId} onChange={handleInputChange} maxLength={11} style={inputStyle} placeholder="მაგ. 01012345678" />
              </div>

              <div style={{ ...inputGroupStyle, minWidth: "220px" }}>
                <label style={labelStyle}>როლი / პოზიცია</label>
                <select name="role" value={formData.role} onChange={handleInputChange} style={inputStyle}>
                  <option value="">აირჩიეთ პოზიცია</option>
                  <option value="president">პრეზიდენტი</option>
                  <option value="vice_president">ვიცე-პრეზიდენტი</option>
                  <option value="exec_director_gen_sec">აღმასრულებელი დირექტორი / გენერალური მდივანი</option>
                  <option value="cfo_treasurer">ფინანსური დირექტორი / ხაზინადარი</option>
                  <option value="board_chair_sec">გამგეობის თავმჯდომარე / მდივანი</option>
                  <option value="assembly_chair_sec">ყრილობის თავმჯდომარე / მდივანი</option>
                  <option value="technical_manager">ტექნიკური მენეჯერი</option>
                  <option value="security_manager">უსაფრთხოების მენეჯერი</option>
                  <option value="property_manager">მატერიალური ქონების მართვის მენეჯერი</option>
                </select>
              </div>

              <div style={{ ...inputGroupStyle, minWidth: "100%" }}>
                <label style={labelStyle}>ფიზიკური მისამართი</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} style={inputStyle} placeholder="ქალაქი, ქუჩა, ბინა" />
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>ტელეფონი</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} style={inputStyle} placeholder="მაგ. +995555123456" />
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>ელ-ფოსტა *</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} style={inputStyle} placeholder="მაგ. mail@example.com" />
              </div>

              <div style={{ ...inputGroupStyle, minWidth: "100%" }}>
                <label style={labelStyle}>მოკლე აღწერა (Bio/Notes)</label>
                <textarea name="bio" value={formData.bio} onChange={handleInputChange} style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }} placeholder="დამატებითი შენიშვნები თანამშრომლის შესახებ..." />
              </div>
            </div>
          </div>

          {/* ACL matrix permissions block */}
          <div style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.05)",
            paddingTop: "20px"
          }}>
            <label style={{ ...labelStyle, display: "block", marginBottom: "12px", color: "#22d3ee" }}>
              🔒 დაშვების უფლებების მატრიცა (ACL Matrix)
            </label>
            <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
              <label style={checkboxLabelStyle}>
                <input type="checkbox" checked={formData.read} onChange={() => handleCheckboxChange('read')} style={{ cursor: "pointer", width: "16px", height: "16px", accentColor: "#22d3ee" }} />
                დანახვა (Read)
              </label>

              <label style={checkboxLabelStyle}>
                <input type="checkbox" checked={formData.write} onChange={() => handleCheckboxChange('write')} style={{ cursor: "pointer", width: "16px", height: "16px", accentColor: "#22d3ee" }} />
                რედაქტირება (Write)
              </label>

              <label style={checkboxLabelStyle}>
                <input type="checkbox" checked={formData.delete} onChange={() => handleCheckboxChange('delete')} style={{ cursor: "pointer", width: "16px", height: "16px", accentColor: "#22d3ee" }} />
                წაშლა (Delete)
              </label>
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
            <button type="submit" style={{
              backgroundColor: "#22d3ee",
              color: "#121418",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 0 15px rgba(34, 211, 238, 0.3)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "transform 0.2s"
            }}>
              <i className="fa-solid fa-floppy-disk"></i>
              თანამშრომლის შენახვა
            </button>
          </div>
        </form>
      </div>

      {/* Staff registry table */}
      <div style={{
        backgroundColor: "rgba(30, 41, 59, 0.2)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: "12px",
        padding: "24px",
        overflowX: "auto"
      }}>
        <h3 style={{ margin: "0 0 15px 0", color: "#fff", fontSize: "16px" }}>
          საშტატო ერთეულების რეესტრი
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
              <th style={{ padding: "12px 8px", color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>თანამშრომელი</th>
              <th style={{ padding: "12px 8px", color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>როლი</th>
              <th style={{ padding: "12px 8px", color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>პირადი ნომერი</th>
              <th style={{ padding: "12px 8px", color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>საკონტაქტო / მისამართი</th>
              <th style={{ padding: "12px 8px", color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>უფლებები (ACL)</th>
              <th style={{ padding: "12px 8px", color: "rgba(255,255,255,0.5)", fontSize: "12px", textAlign: "right" }}>მოქმედება</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((member) => (
              <tr key={member.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background-color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)"} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "12px 8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img src={member.photo} alt={member.firstName} style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(34, 211, 238, 0.4)" }} />
                    <div>
                      <div style={{ color: "#fff", fontWeight: "500", fontSize: "14px" }}>{member.firstName} {member.lastName}</div>
                      {member.bio && <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", marginTop: "2px" }}>{member.bio}</div>}
                    </div>
                  </div>
                </td>
                <td style={{ padding: "12px 8px" }}>
                  <span style={{ fontSize: "12px", backgroundColor: "rgba(34, 211, 238, 0.1)", color: "#22d3ee", padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(34, 211, 238, 0.2)" }}>
                    {ROLE_MAP[member.role] || member.role}
                  </span>
                </td>
                <td style={{ padding: "12px 8px", color: "#e2e8f0", fontSize: "13px", fontFamily: "monospace" }}>
                  {member.personalId}
                </td>
                <td style={{ padding: "12px 8px" }}>
                  <div style={{ fontSize: "12px", color: "#cbd5e1" }}>{member.email}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>
                    {member.phone && <span><i className="fa-solid fa-phone" style={{ marginRight: "4px" }}></i>{member.phone}</span>}
                    {member.address && <span style={{ marginLeft: "10px" }}><i className="fa-solid fa-location-dot" style={{ marginRight: "4px" }}></i>{member.address}</span>}
                  </div>
                </td>
                <td style={{ padding: "12px 8px" }}>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <span style={{
                      fontSize: "10px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontWeight: "bold",
                      border: "1px solid",
                      borderColor: member.permissions.read ? "#22c55e" : "rgba(255,255,255,0.1)",
                      color: member.permissions.read ? "#22c55e" : "rgba(255,255,255,0.3)"
                    }}>
                      READ
                    </span>
                    <span style={{
                      fontSize: "10px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontWeight: "bold",
                      border: "1px solid",
                      borderColor: member.permissions.write ? "#22c55e" : "rgba(255,255,255,0.1)",
                      color: member.permissions.write ? "#22c55e" : "rgba(255,255,255,0.3)"
                    }}>
                      WRITE
                    </span>
                    <span style={{
                      fontSize: "10px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontWeight: "bold",
                      border: "1px solid",
                      borderColor: member.permissions.delete ? "#ef4444" : "rgba(255,255,255,0.1)",
                      color: member.permissions.delete ? "#ef4444" : "rgba(255,255,255,0.3)"
                    }}>
                      DELETE
                    </span>
                  </div>
                </td>
                <td style={{ padding: "12px 8px", textAlign: "right" }}>
                  <button onClick={() => handleDelete(member.id)} style={{
                    backgroundColor: "transparent",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    color: "#ef4444",
                    borderRadius: "6px",
                    padding: "6px 10px",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)"; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}>
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </td>
              </tr>
            ))}
            {staffList.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: "20px 0", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
                  საშტატო ერთეულები ვერ მოიძებნა.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
