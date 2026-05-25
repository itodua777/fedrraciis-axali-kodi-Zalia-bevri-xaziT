import React from 'react';

const StatCard = ({ title, value, subtitle, loading, valueColor = "#ffffff", textShadow = "0 0 10px rgba(255, 255, 255, 0.3)" }) => {
  const [hovered, setHovered] = React.useState(false);
  
  const cardStyle = {
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    border: hovered ? "1px solid color-mix(in oklab, var(--color-emerald-core) 30%, transparent)" : "1px solid color-mix(in oklab, var(--color-emerald-core) 10%, transparent)",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: hovered 
      ? "0 8px 30px rgba(0, 0, 0, 0.7), 0 0 15px color-mix(in oklab, var(--color-emerald-core) 10%, transparent), inset 0 0 15px color-mix(in oklab, var(--color-emerald-core) 8%, transparent)"
      : "0 4px 20px rgba(0, 0, 0, 0.5), inset 0 0 15px color-mix(in oklab, var(--color-emerald-core) 5%, transparent)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "100px",
    boxSizing: "border-box"
  };

  const titleStyle = {
    color: "var(--color-emerald-core)",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "8px"
  };

  const valueStyle = {
    fontSize: "28px",
    fontWeight: "bold",
    color: valueColor,
    textShadow: textShadow,
    marginBottom: "4px"
  };

  const subtitleStyle = {
    color: "rgba(226, 232, 240, 0.5)",
    fontSize: "12px",
    marginTop: "auto"
  };

  return (
    <div 
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={titleStyle}>{title}</div>
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
          <div className="skeleton-loading" style={{ height: "32px", width: "60%", borderRadius: "4px" }}></div>
          <div className="skeleton-loading" style={{ height: "14px", width: "80%", borderRadius: "4px" }}></div>
        </div>
      ) : (
        <>
          <div style={valueStyle}>{value}</div>
          {subtitle && <div style={subtitleStyle}>{subtitle}</div>}
        </>
      )}
    </div>
  );
};

export default StatCard;
