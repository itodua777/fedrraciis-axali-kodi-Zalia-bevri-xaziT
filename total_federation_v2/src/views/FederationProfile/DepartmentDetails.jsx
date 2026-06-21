import React from '../../utils/react-shim.js';
import { useTranslation } from '../../context/LanguageContext.jsx';

const DepartmentDetails = ({ activeUnit, availableUsers, onAssignUser, onUnassignUser, onUpdateDetails, onDeleteUnit }) => {
  const { i18n } = useTranslation();
  const isGeo = i18n.language === 'GEO';

  const [selectedUserId, setSelectedUserId] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  // Metadata editable fields
  const [compositionType, setCompositionType] = React.useState("");
  const [termDuration, setTermDuration] = React.useState("");
  const [actNumber, setActNumber] = React.useState("");
  const [issueDate, setIssueDate] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (activeUnit) {
      setCompositionType(activeUnit.compositionType || "");
      setTermDuration(activeUnit.termDuration || "");
      setActNumber(activeUnit.actNumber || "");
      setIssueDate(activeUnit.issueDate ? activeUnit.issueDate.split('T')[0] : "");
      setSelectedUserId("");
      setSearchTerm("");
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
          {isGeo ? "აირჩიეთ ქვედანაყოფი ან დაამატეთ ახალი მარცხენა პანელიდან" : "Select a structure unit or add a new one from the left panel"}
        </div>
      </div>
    );
  }

  // Filter available users based on search query and if they are not already in this unit
  const filteredUsers = availableUsers.filter(user => {
    const isAlreadyMember = activeUnit.users?.some(member => member.id === user.id);
    if (isAlreadyMember) return false;

    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const email = user.email.toLowerCase();
    const position = (user.position || "").toLowerCase();
    const query = searchTerm.toLowerCase();

    return fullName.includes(query) || email.includes(query) || position.includes(query);
  });

  const handleSaveMetadata = async () => {
    setIsSaving(true);
    await onUpdateDetails({
      compositionType: compositionType || null,
      termDuration: termDuration || null,
      actNumber: actNumber || null,
      issueDate: issueDate || null
    });
    setIsSaving(false);
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!selectedUserId) return;
    onAssignUser(selectedUserId);
    setSelectedUserId("");
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  const selectUser = (user) => {
    setSelectedUserId(user.id);
    setSearchTerm(`${user.firstName} ${user.lastName} (${user.position || (isGeo ? "თანამშრომელი" : "Staff")})`);
    setIsDropdownOpen(false);
  };

  // Card layouts and styles
  const mainStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    height: "100%",
    overflowY: "auto",
    paddingLeft: "8px"
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

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px"
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

  return (
    <div style={mainStyle} className="custom-scrollbar">
      
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={tagStyle}>{activeUnit.unitType}</span>
            <span style={{ fontSize: "11px", color: "var(--silver)" }}>ID: {activeUnit.id.substring(0, 8)}...</span>
          </div>
          <h2 style={titleStyle}>{activeUnit.name}</h2>
        </div>

        <button
          onClick={() => {
            if (window.confirm(isGeo ? "ნამდვილად გსურთ ამ ქვედანაყოფის წაშლა?" : "Are you sure you want to delete this unit?")) {
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

      {/* Metadata Section */}
      <div style={sectionCardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", paddingBottom: "10px" }}>
          <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "var(--bone)", fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "6px" }}>
            <i className="fa-solid fa-sliders" style={{ color: "var(--emerald)" }}></i>
            <span>{isGeo ? "ქვედანაყოფის პარამეტრები" : "Unit Settings & Details"}</span>
          </h3>
          <button 
            onClick={handleSaveMetadata}
            disabled={isSaving}
            style={{
              padding: "6px 16px",
              backgroundColor: "rgba(0, 230, 118, 0.1)",
              border: "1px solid rgba(0, 230, 118, 0.2)",
              color: "var(--emerald)",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            {isSaving ? (isGeo ? "ინახება..." : "Saving...") : (isGeo ? "შენახვა" : "Save")}
          </button>
        </div>

        <div style={gridStyle}>
          <div>
            <label style={labelStyle}>{isGeo ? "სტრუქტურული ტიპი" : "Composition Type"}</label>
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
          <div>
            <label style={labelStyle}>{isGeo ? "სამართლებრივი აქტის ნომერი" : "Decree / Act Number"}</label>
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
      </div>

      {/* Member Assignment Lookup Form */}
      <div style={sectionCardStyle}>
        <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "var(--bone)", fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "6px" }}>
          <i className="fa-solid fa-user-plus" style={{ color: "var(--emerald)" }}></i>
          <span>{isGeo ? "ინტეგრაცია / წევრის მიბმა" : "Member Integration & Mapping"}</span>
        </h3>
        
        <form onSubmit={handleAssignSubmit} style={{ display: "flex", gap: "12px", position: "relative" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <input
              type="text"
              placeholder={isGeo ? "მოძებნეთ წევრი (სახელი, გვარი, პოზიცია...)" : "Search member by name, email, or position..."}
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
                if (!e.target.value) {
                  setSelectedUserId("");
                }
              }}
              onFocus={() => setIsDropdownOpen(true)}
              style={inputStyle}
            />

            {/* Suggestions Dropdown */}
            {isDropdownOpen && searchTerm.length > 0 && (
              <div 
                className="custom-scrollbar"
                style={{
                  position: "absolute",
                  top: "42px",
                  left: 0,
                  right: 0,
                  backgroundColor: "#1c1e22",
                  border: "1px solid var(--iron-line)",
                  borderRadius: "6px",
                  maxHeight: "180px",
                  overflowY: "auto",
                  zIndex: 99,
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.4)"
                }}
              >
                {filteredUsers.length === 0 ? (
                  <div style={{ padding: "10px 12px", color: "var(--silver)", fontSize: "12px", fontStyle: "italic" }}>
                    {isGeo ? "წევრები ვერ მოიძებნა" : "No match found"}
                  </div>
                ) : (
                  filteredUsers.map(user => (
                    <div
                      key={user.id}
                      onClick={() => selectUser(user)}
                      style={{
                        padding: "10px 12px",
                        cursor: "pointer",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.02)",
                        fontSize: "12px",
                        color: "var(--bone)",
                        display: "flex",
                        justifyContent: "space-between"
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.03)"}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      <div>
                        <strong>{user.firstName} {user.lastName}</strong>
                        <div style={{ fontSize: "10px", color: "var(--silver)" }}>{user.email}</div>
                      </div>
                      <span style={{ fontSize: "11px", color: "var(--emerald)", opacity: 0.8 }}>
                        {user.position || (isGeo ? "თანამშრომელი" : "Staff")}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!selectedUserId}
            style={{
              padding: "10px 24px",
              backgroundColor: selectedUserId ? "var(--emerald)" : "rgba(255, 255, 255, 0.05)",
              color: selectedUserId ? "var(--iron)" : "var(--silver)",
              border: "none",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "700",
              cursor: selectedUserId ? "pointer" : "not-allowed",
              transition: "all 0.2s"
            }}
          >
            {isGeo ? "მიბმა" : "Assign"}
          </button>
        </form>
      </div>

      {/* Attached Members Table */}
      <div style={sectionCardStyle}>
        <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "var(--bone)", fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "8px" }}>
          <i className="fa-solid fa-users" style={{ color: "var(--emerald)" }}></i>
          <span>{isGeo ? "თანამშრომლების სია" : "Current Staff Members"}</span>
          <span style={{ fontSize: "11px", color: "var(--silver)", fontWeight: "500", marginLeft: "4px" }}>
            ({activeUnit.users?.length || 0} {isGeo ? "წევრი" : "members"})
          </span>
        </h3>

        {(!activeUnit.users || activeUnit.users.length === 0) ? (
          <div style={{
            padding: "30px 0",
            textAlign: "center",
            color: "var(--silver)",
            fontSize: "13px",
            fontStyle: "italic",
            border: "1px dashed rgba(255, 255, 255, 0.05)",
            borderRadius: "6px"
          }}>
            {isGeo ? "ამ ქვედანაყოფში თანამშრომლები არ ირიცხებიან" : "No members are currently enrolled in this unit"}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>{isGeo ? "სახელი, გვარი" : "Full Name"}</th>
                  <th style={tableHeaderStyle}>{isGeo ? "თანამდებობა" : "Position"}</th>
                  <th style={tableHeaderStyle}>{isGeo ? "ელ-ფოსტა" : "Email"}</th>
                  <th style={{ ...tableHeaderStyle, textAlign: "right" }}>{isGeo ? "მოქმედება" : "Action"}</th>
                </tr>
              </thead>
              <tbody>
                {activeUnit.users.map(member => (
                  <tr key={member.id} style={tableRowStyle}>
                    <td style={tableCellStyle}>
                      <strong>{member.firstName} {member.lastName}</strong>
                    </td>
                    <td style={tableCellStyle}>
                      <span style={{ color: "var(--silver)" }}>{member.position || (isGeo ? "თანამშრომელი" : "Staff")}</span>
                    </td>
                    <td style={tableCellStyle}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", opacity: 0.8 }}>{member.email}</span>
                    </td>
                    <td style={{ ...tableCellStyle, textAlign: "right" }}>
                      <button
                        onClick={() => {
                          if (window.confirm(isGeo ? `ნამდვილად გსურთ ${member.firstName}-ს მოხსნა ამ ქვედანაყოფიდან?` : `Are you sure you want to remove ${member.firstName} from this unit?`)) {
                            onUnassignUser(member.id);
                          }
                        }}
                        title={isGeo ? "ქვედანაყოფიდან მოხსნა" : "Remove from unit"}
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
