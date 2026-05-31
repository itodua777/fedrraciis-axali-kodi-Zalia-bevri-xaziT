import React from '../../../utils/react-shim.js';

const FullscreenRightCol = ({
  athlete,
  editForm,
  setEditForm,
  isEditing,
  isDeceased
}) => {
  const labelStyle = { fontSize: "11px", color: "rgba(255, 255, 255, 0.4)", textTransform: "uppercase", display: "block", marginBottom: "4px" };
  const inputStyle = { width: "100%", padding: "6px 10px", backgroundColor: "#1e222b", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "6px", color: "#fff", fontSize: "12px", outline: "none", boxSizing: "border-box" };

  return (
    <div style={{
      gridColumn: "span 6",
      display: "flex",
      flexDirection: "column",
      gap: "24px"
    }}>
      {/* ICE Block */}
      <div style={{
        backgroundColor: "rgba(239, 68, 68, 0.04)",
        border: "1px solid rgba(239, 68, 68, 0.2)",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}>
        <h4 style={{ margin: 0, color: "#ef4444", fontSize: "14px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          🚨 საგანგებო კონტაქტი (ICE)
        </h4>

        {isEditing ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid rgba(239, 68, 68, 0.2)", paddingTop: "8px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label style={{ ...labelStyle, color: "rgba(239, 68, 68, 0.6)" }}>კავშირი</label>
                <input
                  type="text"
                  disabled={isDeceased}
                  value={editForm.emergencyContactRelation || ''}
                  onChange={e => setEditForm(prev => ({ ...prev, emergencyContactRelation: e.target.value }))}
                  style={{ ...inputStyle, borderColor: "rgba(239, 68, 68, 0.2)" }}
                  placeholder="მაგ: მამა"
                  onFocus={e => { if (!isDeceased) { e.target.style.borderColor = '#ef4444'; e.target.style.boxShadow = '0 0 8px rgba(239, 68, 68, 0.2)'; } }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(239, 68, 68, 0.2)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <div>
                <label style={{ ...labelStyle, color: "rgba(239, 68, 68, 0.6)" }}>სახელი/გვარი</label>
                <input
                  type="text"
                  disabled={isDeceased}
                  value={editForm.emergencyContactName || ''}
                  onChange={e => setEditForm(prev => ({ ...prev, emergencyContactName: e.target.value }))}
                  style={{ ...inputStyle, borderColor: "rgba(239, 68, 68, 0.2)" }}
                  onFocus={e => { if (!isDeceased) { e.target.style.borderColor = '#ef4444'; e.target.style.boxShadow = '0 0 8px rgba(239, 68, 68, 0.2)'; } }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(239, 68, 68, 0.2)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>
            <div>
              <label style={{ ...labelStyle, color: "rgba(239, 68, 68, 0.6)" }}>ტელეფონი</label>
              <input
                type="text"
                disabled={isDeceased}
                value={editForm.emergencyContactPhone || ''}
                onChange={e => setEditForm(prev => ({ ...prev, emergencyContactPhone: e.target.value }))}
                style={{ ...inputStyle, borderColor: "rgba(239, 68, 68, 0.2)", color: "#ef4444", fontWeight: "bold" }}
                onFocus={e => { if (!isDeceased) { e.target.style.borderColor = '#ef4444'; e.target.style.boxShadow = '0 0 8px rgba(239, 68, 68, 0.2)'; } }}
                onBlur={e => { e.target.style.borderColor = 'rgba(239, 68, 68, 0.2)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          </div>
        ) : (
          <div style={{ fontSize: "14px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "rgba(255,255,255,0.7)" }}>
              {athlete.emergencyContactName || '-'} {athlete.emergencyContactRelation ? `(${athlete.emergencyContactRelation})` : ''}
            </span>
            <span style={{ color: "#ef4444", fontWeight: "bold", fontSize: "15px" }}>
              {athlete.emergencyContactPhone || '-'}
            </span>
          </div>
        )}
      </div>

      {/* Documents List */}
      <div style={{
        backgroundColor: "rgba(255, 255, 255, 0.02)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}>
        <h4 style={{ margin: 0, color: "var(--color-emerald-core)", fontSize: "14px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          📄 იურიდიული საბუთები / დოკუმენტები
        </h4>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {!(athlete.idCardDoc || athlete.healthDoc || athlete.insuranceDoc || athlete.dopingDoc || athlete.representativeDoc) ? (
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", textAlign: "center" }}>
              ატვირთული დოკუმენტები არ ფიქსირდება
            </div>
          ) : (
            [
              { key: 'idCardDoc', label: 'ID ბარათი / პასპორტი' },
              { key: 'healthDoc', label: 'ჯანმრთელობის ცნობა' },
              { key: 'insuranceDoc', label: 'დაზღვევის დოკუმენტაცია' },
              { key: 'dopingDoc', label: 'დოპინგ ტესტის დოკუმენტი' },
              { key: 'representativeDoc', label: 'მშობლის/მეურვის თანხმობა' }
            ].map(item => {
              const doc = athlete[item.key];
              if (!doc) return null;
              const isPdf = doc.name?.endsWith('.pdf') || doc.type === 'application/pdf';
              const docIcon = isPdf ? "fa-solid fa-file-pdf" : "fa-solid fa-file-image";
              const docColor = isPdf ? "#ef4444" : "var(--color-emerald-core)";
              return (
                <div 
                  key={item.key} 
                  style={{ 
                    backgroundColor: "rgba(0,0,0,0.3)", 
                    border: "1px solid rgba(255,255,255,0.06)", 
                    borderRadius: "8px", 
                    padding: "10px 14px", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between", 
                    gap: "12px" 
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 }}>
                    <i className={docIcon} style={{ color: docColor, fontSize: "18px", flexShrink: 0 }}></i>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: "12px", fontWeight: "bold", color: "#fff", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", display: "flex", flexWrap: "wrap", gap: "5px", alignItems: "center" }}>
                        <span>{doc.name} ({(doc.size / 1024 / 1024).toFixed(2)} MB)</span>
                        {item.key === 'healthDoc' && athlete.medicalCertificateExpiry && (() => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const expDate = new Date(athlete.medicalCertificateExpiry);
                          expDate.setHours(0, 0, 0, 0);
                          const isCritical = expDate - today <= 7 * 24 * 60 * 60 * 1000;
                          return (
                            <span style={{
                              backgroundColor: isCritical ? "rgba(239, 68, 68, 0.15)" : "rgba(0, 230, 118, 0.15)",
                              color: isCritical ? "#ef4444" : "var(--color-emerald-core)",
                              border: isCritical ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid color-mix(in oklab, var(--color-emerald-core) 30%, transparent)",
                              padding: "1px 5px",
                              borderRadius: "4px",
                              fontSize: "9px",
                              fontWeight: "bold",
                              whiteSpace: "nowrap"
                            }}>
                              ვადა: {athlete.medicalCertificateExpiry}
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                  <a 
                    href={doc.data} 
                    download={doc.name}
                    style={{ 
                      background: "color-mix(in oklab, var(--color-emerald-core) 10%, transparent)", 
                      border: "1px solid color-mix(in oklab, var(--color-emerald-core) 30%, transparent)", 
                      color: "var(--color-emerald-core)", 
                      width: "28px", 
                      height: "28px", 
                      borderRadius: "6px", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "color-mix(in oklab, var(--color-emerald-core) 20%, transparent)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "color-mix(in oklab, var(--color-emerald-core) 10%, transparent)"; }}
                  >
                    <i className="fa-solid fa-download" style={{ fontSize: "11px" }}></i>
                  </a>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Checked-out Inventory Section in Fullscreen View */}
      <div style={{
        backgroundColor: "color-mix(in oklab, var(--color-emerald-core) 2%, transparent)",
        border: "1px solid color-mix(in oklab, var(--color-emerald-core) 15%, transparent)",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}>
        <h4 style={{ margin: 0, color: "var(--color-emerald-core)", fontSize: "14px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          📦 გაცემული ინვენტარი & აღჭურვილობა
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid rgba(30, 41, 59, 0.8)", paddingTop: "12px" }}>
          {(!athlete.issuedItems || athlete.issuedItems.filter(item => item.status === 'issued').length === 0) ? (
            <div style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "13px", fontStyle: "italic", textAlign: "center" }}>
              გაცემული ნივთები არ ფიქსირდება
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {athlete.issuedItems.filter(item => item.status === 'issued').map(item => {
                const isOverdue = item.expectedReturnDate && new Date(item.expectedReturnDate) < new Date();
                return (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", backgroundColor: "rgba(0,0,0,0.3)", border: `1px solid ${isOverdue ? "#ef4444" : "rgba(255,255,255,0.06)"}`, borderRadius: "8px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <div style={{ fontSize: "13px", fontWeight: "bold", color: "#fff" }}>
                        {item.itemName} {item.type === 'bundle' ? ' (კომპლექტი)' : ''}
                      </div>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
                        საინვენტარო კოდი: <span style={{ color: "var(--color-emerald-core)" }}>{item.itemCode}</span>
                        {item.components && <span style={{ marginLeft: "10px", fontStyle: "italic", color: "rgba(255,255,255,0.4)" }}>({item.components})</span>}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                      <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "6px", backgroundColor: isOverdue ? "rgba(239, 68, 68, 0.15)" : "rgba(245, 158, 11, 0.15)", color: isOverdue ? "#ef4444" : "#f59e0b", border: `1px solid ${isOverdue ? "rgba(239, 68, 68, 0.3)" : "rgba(245, 158, 11, 0.3)"}`, fontWeight: "bold" }}>
                        {isOverdue ? "ვადაგადაცილებული" : "გაცემული"}
                      </span>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
                        დაბრუნების ვადა: <span style={{ color: isOverdue ? "#ef4444" : "#fff", fontWeight: "bold" }}>{item.expectedReturnDate || 'უვადო'}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Biography narrative card */}
      <div style={{
        backgroundColor: "rgba(255, 255, 255, 0.02)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        flex: 1
      }}>
        <h4 style={{ margin: 0, color: "var(--color-emerald-core)", fontSize: "14px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          📝 ბიოგრაფია & TIMELINE ნარატივი
        </h4>

        {isEditing ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid rgba(30, 41, 59, 0.8)", paddingTop: "10px", flex: 1 }}>
            <textarea
              disabled={isDeceased}
              value={editForm.biography || ''}
              onChange={e => setEditForm(prev => ({ ...prev, biography: e.target.value }))}
              style={{
                ...inputStyle,
                minHeight: "120px",
                flex: 1,
                resize: "vertical",
                fontFamily: "sans-serif",
                lineHeight: "1.5"
              }}
              placeholder="აღწერეთ სპორტსმენის გზა..."
              onFocus={e => { if (!isDeceased) { e.target.style.borderColor = 'var(--color-emerald-core)'; e.target.style.boxShadow = '0 0 8px color-mix(in oklab, var(--color-emerald-core) 20%, transparent)'; } }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
        ) : (
          <div style={{
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "14px",
            lineHeight: "1.6",
            whiteSpace: "pre-wrap",
            paddingTop: "8px",
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            flex: 1
          }}>
            {athlete.biography || "ბიოგრაფია არ არის შეყვანილი."}
          </div>
        )}
      </div>
    </div>
  );
};

export default FullscreenRightCol;
