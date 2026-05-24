import React from 'react';

const MemorialFullscreenRead = ({ record }) => {
  return (
    <>
      {/* Profile Card Header Inside Modal */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "24px",
        padding: "20px",
        backgroundColor: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(212, 175, 55, 0.2)",
        borderRadius: "12px"
      }}>
        {/* Photo Frame */}
        <div style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          overflow: "hidden",
          border: "3px solid #d4af37",
          boxShadow: "0 0 15px rgba(212, 175, 55, 0.4)",
          flexShrink: 0
        }}>
          {record.profilePhoto ? (
            <img src={record.profilePhoto} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Profile" />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className="fa-solid fa-user" style={{ color: "#d4af37", fontSize: "32px" }}></i>
            </div>
          )}
        </div>

        {/* Name & Basic details */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <h1 style={{ margin: 0, color: "#fff", fontSize: "32px" }}>{record.firstName} {record.lastName}</h1>
            <span style={{
              backgroundColor: "rgba(212, 175, 55, 0.15)",
              border: "1px solid #d4af37",
              color: "#d4af37",
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "bold"
            }}>
              ლეგენდარული სპორტსმენები
            </span>
          </div>

          {/* Life years and Country details */}
          <div style={{ display: "flex", gap: "30px", marginTop: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ fontSize: "18px", color: "#cbd5e1" }}>
              🇬🇪 საქართველო - ლეგენდა
            </div>
            <div style={{ fontSize: "18px", color: "#d4af37", fontWeight: "bold" }}>
              ცხოვრების წლები: [ {record.birthYear} - {record.deathYear} ]
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Body Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", flex: 1 }}>
        
        {/* Left Column: Historical Achievements */}
        <div style={{
          backgroundColor: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(212, 175, 55, 0.15)",
          borderRadius: "12px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "15px"
        }}>
          <h3 style={{ margin: 0, color: "#d4af37", borderBottom: "1px solid rgba(212, 175, 55, 0.2)", paddingBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
            🏛️ ისტორიული მიღწევები
          </h3>

          <ul style={{ margin: 0, paddingLeft: "20px", color: "#cbd5e1", fontSize: "15px", lineHeight: "2.0", display: "flex", flexDirection: "column", gap: "10px" }}>
            {record.titles.map((t, i) => (
              <li key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: "#d4af37" }}>🏆</span>
                <span>{t}</span>
              </li>
            ))}
            {record.titles.length === 0 && (
              <div style={{ color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>
                მიღწევები არ არის შეყვანილი.
              </div>
            )}
          </ul>
        </div>

        {/* Right Column: Biography & Narrative */}
        <div style={{
          backgroundColor: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(212, 175, 55, 0.15)",
          borderRadius: "12px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "15px"
        }}>
          <h3 style={{ margin: 0, color: "#d4af37", borderBottom: "1px solid rgba(212, 175, 55, 0.2)", paddingBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
            📝 ბიოგრაფია & TIMELINE ნარატივი
          </h3>

          <p style={{
            color: "#cbd5e1",
            lineHeight: "1.8",
            whiteSpace: "pre-wrap",
            fontSize: "15px",
            margin: 0,
            overflowY: "auto",
            flex: 1
          }}>
            {record.biography || "ბიოგრაფიული მონაცემები არ არის შეყვანილი."}
          </p>
        </div>

      </div>

      {/* Gallery Section inside Modal */}
      {record.galleryPhotos && record.galleryPhotos.length > 0 && (
        <div style={{
          backgroundColor: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(212, 175, 55, 0.15)",
          borderRadius: "12px",
          padding: "24px"
        }}>
          <h4 style={{ color: "rgba(255,255,255,0.5)", borderBottom: "1px solid rgba(212, 175, 55, 0.2)", paddingBottom: "10px", marginBottom: "15px" }}>ფოტო მასალა / გალერეა</h4>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            {record.galleryPhotos.map((photo, idx) => (
              <div key={idx} style={{ width: "120px", height: "120px", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                <img src={photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={`Gallery ${idx}`} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MemorialFullscreenRead;
