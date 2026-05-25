import React from 'react';
import UserHeaderWidget from './UserHeaderWidget.jsx';

const Navbar = ({ federation, onLogout }) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const headerStyle = {
    height: "70px",
    backgroundColor: "var(--color-iron)",
    borderBottom: "1px solid var(--color-iron-border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 30px",
    color: "var(--color-bone-light)"
  };

  const searchContainerStyle = {
    position: "relative",
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    alignItems: "center"
  };

  const searchInputStyle = {
    width: "100%",
    backgroundColor: "var(--color-iron)",
    color: "var(--color-bone-light)",
    paddingLeft: "40px",
    paddingRight: "16px",
    paddingTop: "8px",
    paddingBottom: "8px",
    borderRadius: "8px",
    border: `1px solid ${isFocused ? 'var(--color-emerald-core)' : 'var(--color-iron-border)'}`,
    boxShadow: isFocused ? "0 0 10px var(--color-emerald-core)" : "none",
    outline: "none",
    fontSize: "14px",
    transition: "all 0.2s ease-in-out",
    fontFamily: "sans-serif"
  };

  const svgColor = isFocused ? "var(--color-emerald-core)" : "var(--color-silver-structure)";

  const logoIconStyle = {
    position: "absolute",
    left: "12px",
    display: "flex",
    alignItems: "center",
    pointerEvents: "none",
    transition: "color 0.2s ease-in-out",
    color: svgColor
  };

  const userStyle = {
    color: "var(--color-emerald-core)",
    textShadow: "0 0 5px var(--color-emerald-core)",
    fontWeight: "bold",
    fontFamily: "sans-serif",
    display: "flex",
    alignItems: "center",
    gap: "15px"
  };

  return (
    <div style={headerStyle}>
      <div style={searchContainerStyle}>
        <div style={logoIconStyle}>
          <svg 
            style={{ width: "20px", height: "20px" }}
            viewBox="0 0 24 24"
          >
            <defs>
              <filter id="neon-glow-focus" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="neon-glow-blur" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* 8 white outer dots */}
            <circle cx="5" cy="5" r="2" fill={isFocused ? "var(--color-bone-light)" : "var(--color-silver-structure)"} style={{ transition: "all 0.2s" }} />
            <circle cx="12" cy="5" r="2" fill={isFocused ? "var(--color-bone-light)" : "var(--color-silver-structure)"} style={{ transition: "all 0.2s" }} />
            <circle cx="19" cy="5" r="2" fill={isFocused ? "var(--color-bone-light)" : "var(--color-silver-structure)"} style={{ transition: "all 0.2s" }} />
            
            <circle cx="5" cy="12" r="2" fill={isFocused ? "var(--color-bone-light)" : "var(--color-silver-structure)"} style={{ transition: "all 0.2s" }} />
            <circle cx="19" cy="12" r="2" fill={isFocused ? "var(--color-bone-light)" : "var(--color-silver-structure)"} style={{ transition: "all 0.2s" }} />
            
            <circle cx="5" cy="19" r="2" fill={isFocused ? "var(--color-bone-light)" : "var(--color-silver-structure)"} style={{ transition: "all 0.2s" }} />
            <circle cx="12" cy="19" r="2" fill={isFocused ? "var(--color-bone-light)" : "var(--color-silver-structure)"} style={{ transition: "all 0.2s" }} />
            <circle cx="19" cy="19" r="2" fill={isFocused ? "var(--color-bone-light)" : "var(--color-silver-structure)"} style={{ transition: "all 0.2s" }} />
            
            {/* 1 neon middle dot */}
            <circle 
              cx="12" 
              cy="12" 
              r="2" 
              fill="var(--color-emerald-core)" 
              filter={isFocused ? "url(#neon-glow-focus)" : "url(#neon-glow-blur)"}
              style={{ transition: "all 0.2s" }}
            />
          </svg>
        </div>
        <input
          type="text"
          style={searchInputStyle}
          placeholder="მოძებნე სპორტსმენი, მარშრუტი, მწვერვალი..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
      
      <div style={userStyle}>
        <UserHeaderWidget onLogout={onLogout} />
      </div>
    </div>
  );
};

export default Navbar;
