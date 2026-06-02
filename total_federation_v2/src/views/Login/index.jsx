import React from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [federation, setFederation] = React.useState('');
  const [error, setError] = React.useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === '11' && password === '11' && federation) {
      onLogin(federation);
    } else {
      setError('Invalid credentials or federation not selected.');
    }
  };

  return (
    <>
      {/* Scoped styles */}
      <style>{`
        @keyframes loginPulse {
          0%, 100% { opacity: .55; transform: scale(.95); }
          50%       { opacity: 1;   transform: scale(1.05); }
        }
        @keyframes loginFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .login-input {
          width: 100%;
          background-color: var(--iron);
          color: var(--bone);
          padding: 11px 14px;
          border-radius: 4px;
          border: 1px solid var(--iron-line);
          font-family: var(--font-primary);
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .login-input:focus {
          border-color: var(--fed-blue);
          box-shadow: 0 0 0 3px rgba(8,133,237,.15);
        }
        .login-input option {
          background-color: var(--iron-1);
          color: var(--bone);
        }
        .login-btn {
          width: 100%;
          background-color: var(--fed-blue);
          color: var(--iron);
          border: none;
          padding: 13px;
          border-radius: 4px;
          font-family: var(--font-heading);
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          transition: box-shadow 0.2s, transform 0.1s;
          margin-top: 4px;
        }
        .login-btn:hover {
          box-shadow: 0 0 20px rgba(8,133,237,.6);
          transform: translateY(-1px);
        }
        .login-btn:active {
          transform: translateY(0);
        }
      `}</style>

      {/* Background */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        background: 'var(--iron)',
        fontFamily: 'var(--font-primary)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Dot-grid texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(var(--iron-line) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: .18,
          pointerEvents: 'none',
        }} />

        {/* Blue radial glow (center) */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(8,133,237,.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Divider cross lines */}
        <div style={{
          position: 'absolute', top: '50%', left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--iron-line) 30%, var(--iron-line) 70%, transparent)',
          opacity: .4, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px',
          background: 'linear-gradient(180deg, transparent, var(--iron-line) 30%, var(--iron-line) 70%, transparent)',
          opacity: .4, pointerEvents: 'none',
        }} />

        {/* Login Card */}
        <div style={{
          position: 'relative',
          backgroundColor: 'var(--iron-1)',
          border: '1px solid var(--iron-line)',
          borderRadius: '6px',
          padding: '36px 40px 32px',
          width: '400px',
          boxShadow: '0 20px 60px rgba(0,0,0,.6), 0 0 30px rgba(8,133,237,.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
          animation: 'loginFadeIn .5s cubic-bezier(0.16,1,0.3,1) both',
          overflow: 'hidden',
        }}>
          {/* Card accent bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
            background: 'linear-gradient(90deg, var(--fed-blue) 0%, transparent 100%)',
          }} />

          {/* Eyebrow tag */}
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'var(--fed-blue)',
            marginBottom: '20px',
          }}>
            ARTRON · FEDERATION · PLATFORM
          </div>

          {/* 9-Node Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            width: '60px',
            height: '60px',
            margin: '0 auto 16px',
          }}>
            {[...Array(9)].map((_, i) => (
              <div key={i} style={{
                borderRadius: '50%',
                backgroundColor: i === 4 ? 'var(--fed-blue)' : 'rgba(245,245,247,.65)',
                boxShadow: i === 4 ? '0 0 14px var(--fed-blue), 0 0 28px rgba(8,133,237,.35)' : 'none',
                animation: i === 4 ? 'loginPulse 3s ease-in-out infinite' : 'none',
              }} />
            ))}
          </div>

          {/* Wordmark */}
          <div style={{ textAlign: 'center', marginBottom: '4px' }}>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '28px',
              fontWeight: '900',
              letterSpacing: '6px',
              textTransform: 'uppercase',
              color: 'var(--bone)',
              lineHeight: '1',
            }}>
              ART<span style={{ color: 'var(--fed-blue)' }}>R</span>ON
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '9px',
              fontWeight: '400',
              letterSpacing: '8px',
              textTransform: 'uppercase',
              color: 'var(--bone-30)',
              marginTop: '4px',
            }}>
              FEDERATION
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: '48px', height: '1px', background: 'linear-gradient(90deg, transparent, var(--fed-blue), transparent)', margin: '16px auto' }} />

          {/* Sub-text */}
          <p style={{
            color: 'var(--bone-30)',
            textAlign: 'center',
            margin: '0 0 20px',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.5px',
          }}>
            AUTHENTICATE TO CONTINUE
          </p>

          {/* Error */}
          {error && (
            <div style={{
              color: 'var(--crisis-from)',
              textAlign: 'center',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.5px',
              backgroundColor: 'rgba(180,3,7,.08)',
              border: '1px solid rgba(180,3,7,.25)',
              borderRadius: '4px',
              padding: '8px 12px',
              marginBottom: '16px',
            }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--bone-30)' }}>
                USERNAME
              </label>
              <input
                type="text"
                className="login-input"
                placeholder="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--bone-30)' }}>
                PASSWORD
              </label>
              <input
                type="password"
                className="login-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--bone-30)' }}>
                FEDERATION
              </label>
              <select
                className="login-input"
                value={federation}
                onChange={e => setFederation(e.target.value)}
              >
                <option value="" disabled>Select Federation</option>
                <option value="mountaineering">Mountaineering Federation</option>
                <option value="judo">Judo Federation</option>
                <option value="rugby">Rugby Federation</option>
              </select>
            </div>

            <button type="submit" className="login-btn" style={{ marginTop: '8px' }}>
              AUTHENTICATE
            </button>
          </form>
        </div>

        {/* Footer */}
        <footer style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '11px',
          color: 'var(--bone-30)',
          letterSpacing: '1px',
          pointerEvents: 'none',
          userSelect: 'none',
          fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>
          © {new Date().getFullYear()} ARTRON LLC // ALL RIGHTS RESERVED
        </footer>
      </div>
    </>
  );
};

export default Login;
