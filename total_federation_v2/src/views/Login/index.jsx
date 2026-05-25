import React from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [federation, setFederation] = React.useState("");
  const [error, setError] = React.useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "11" && password === "11" && federation) {
      onLogin(federation);
    } else {
      setError("Invalid credentials or federation not selected.");
    }
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",
    height: "100vh",
    background: "radial-gradient(circle at center, rgba(0, 230, 118, 0.15) 0%, rgba(18, 20, 24, 0.95) 60%, #121418 100%)",
    fontFamily: "sans-serif",
    overflow: "hidden",
    position: "relative"
  };

  const cardStyle = {
    backgroundColor: "var(--color-iron-surface)",
    border: "1px solid var(--color-iron-border)",
    borderRadius: "16px",
    padding: "40px",
    width: "400px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5), inset 0 0 20px var(--color-iron-border)",
    backdropFilter: "blur(10px)",
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  };

  const titleStyle = {
    color: "var(--color-emerald-core)",
    textShadow: "0 0 15px var(--color-emerald-core)",
    margin: "0",
    fontSize: "28px",
    fontWeight: "bold",
    textAlign: "center"
  };

  const inputStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid var(--color-iron-border)",
    borderRadius: "8px",
    padding: "12px 15px",
    color: "var(--color-bone-light)",
    fontSize: "16px",
    outline: "none",
    transition: "all 0.3s ease",
    width: "100%",
    boxSizing: "border-box"
  };

  const buttonStyle = {
    backgroundColor: "var(--color-emerald-core)",
    color: "var(--color-iron)",
    border: "none",
    padding: "14px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 0 15px var(--color-emerald-core)",
    transition: "all 0.3s ease",
    marginTop: "10px"
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", width: "54px", margin: "0 auto 20px auto" }}>
          {[...Array(9)].map((_, i) => (
            <div key={i} style={{
              width: "10px", height: "10px", borderRadius: "50%",
              backgroundColor: i === 4 ? "var(--color-emerald-core)" : "var(--color-bone-light)",
              boxShadow: i === 4 ? "0 0 10px var(--color-emerald-core)" : "none"
            }}></div>
          ))}
        </div>
        <h1 style={titleStyle}>ARTRON - FEDERATION</h1>
        <p style={{ color: "var(--color-silver-structure)", textAlign: "center", margin: "0 0 10px 0" }}>Sign in to continue</p>
        
        {error && <div style={{ color: "var(--color-copper)", textAlign: "center", fontSize: "14px", fontWeight: "bold" }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input 
            type="text" 
            placeholder="Username" 
            style={inputStyle}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            style={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <select 
            style={inputStyle}
            value={federation}
            onChange={(e) => setFederation(e.target.value)}
          >
            <option value="" disabled>Select Federation</option>
            <option value="mountaineering">Mountaineering Federation</option>
            <option value="judo">Judo Federation</option>
            <option value="rugby">Rugby Federation</option>
          </select>

          <button 
            type="submit" 
            style={buttonStyle}
            onMouseOver={(e) => e.target.style.boxShadow = "0 0 25px var(--color-emerald-core)"}
            onMouseOut={(e) => e.target.style.boxShadow = "0 0 15px var(--color-emerald-core)"}
          >
            Authenticate
          </button>
        </form>
      </div>
      <footer 
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-[#9CA3AF] tracking-wide pointer-events-none select-none"
        style={{
          position: "absolute",
          bottom: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "12px",
          color: "var(--color-silver-structure, #9CA3AF)",
          letterSpacing: "0.025em",
          pointerEvents: "none",
          userSelect: "none"
        }}
      >
        © {new Date().getFullYear()} ARTRON LLC. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;
