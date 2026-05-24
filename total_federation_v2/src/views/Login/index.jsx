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
    height: "100vh",
    backgroundColor: "#121418",
    fontFamily: "sans-serif"
  };

  const cardStyle = {
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    border: "1px solid rgba(34, 211, 238, 0.3)",
    borderRadius: "16px",
    padding: "40px",
    width: "400px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(34, 211, 238, 0.1)",
    backdropFilter: "blur(10px)",
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  };

  const titleStyle = {
    color: "#22d3ee",
    textShadow: "0 0 15px rgba(34, 211, 238, 0.8)",
    margin: "0",
    fontSize: "28px",
    fontWeight: "bold",
    textAlign: "center"
  };

  const inputStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(34, 211, 238, 0.2)",
    borderRadius: "8px",
    padding: "12px 15px",
    color: "#e2e8f0",
    fontSize: "16px",
    outline: "none",
    transition: "all 0.3s ease",
    width: "100%",
    boxSizing: "border-box"
  };

  const buttonStyle = {
    backgroundColor: "#22d3ee",
    color: "#121418",
    border: "none",
    padding: "14px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 0 15px rgba(34, 211, 238, 0.5)",
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
              backgroundColor: i === 4 ? "#22d3ee" : "#ffffff",
              boxShadow: i === 4 ? "0 0 10px rgba(34, 211, 238, 0.8)" : "none"
            }}></div>
          ))}
        </div>
        <h1 style={titleStyle}>ARTRON - FEDERATION</h1>
        <p style={{ color: "rgba(226, 232, 240, 0.7)", textAlign: "center", margin: "0 0 10px 0" }}>Sign in to continue</p>
        
        {error && <div style={{ color: "#ef4444", textAlign: "center", fontSize: "14px" }}>{error}</div>}

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
            onMouseOver={(e) => e.target.style.boxShadow = "0 0 25px rgba(34, 211, 238, 0.8)"}
            onMouseOut={(e) => e.target.style.boxShadow = "0 0 15px rgba(34, 211, 238, 0.5)"}
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
