import React from 'react';
import StatCard from '../../components/ui/StatCard.jsx';

const CardSkeleton = ({ variant }) => {
  return (
    <div style={{
      backgroundColor: "rgba(15, 23, 42, 0.4)",
      border: "1px solid color-mix(in oklab, var(--color-emerald-core) 5%, transparent)",
      borderRadius: "12px",
      padding: "20px",
      minHeight: "125px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxSizing: "border-box"
    }}>
      <div className="skeleton-loading" style={{ height: "12px", width: "40%", borderRadius: "4px" }}></div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "10px 0" }}>
        <div className="skeleton-loading" style={{ height: "30px", width: "35%", borderRadius: "4px" }}></div>
        {variant === 'gauge' && (
          <div className="skeleton-loading" style={{ height: "45px", width: "45px", borderRadius: "50%" }}></div>
        )}
        {(variant === 'sparkline' || variant === 'status' || variant === 'bars') && (
          <div className="skeleton-loading" style={{ height: "20px", width: "65px", borderRadius: "4px" }}></div>
        )}
      </div>
      <div className="skeleton-loading" style={{ height: "10px", width: "60%", borderRadius: "4px" }}></div>
    </div>
  );
};

const DashboardCard = ({ 
  title, 
  value, 
  subtitle, 
  loading, 
  variant = 'default',
  valueColor = '#ffffff'
}) => {
  const [hovered, setHovered] = React.useState(false);

  if (loading) {
    return <CardSkeleton variant={variant} />;
  }

  const numericValue = parseFloat(String(value).replace(/[^0-9.-]/g, '')) || 0;
  let cardClass = "dashboard-card";
  let textShadow = "0 0 10px var(--color-iron-border)";
  let finalValueColor = valueColor;

  if (variant === 'incident' && numericValue > 0) {
    cardClass += " incident-card-active";
    finalValueColor = "var(--color-copper)";
    textShadow = "0 0 12px var(--color-copper)";
  } else if (variant === 'returnable' && numericValue > 0) {
    cardClass += " warning-card-active";
    finalValueColor = "var(--color-copper)";
    textShadow = "0 0 12px var(--color-copper)";
  } else if (variant === 'status') {
    finalValueColor = "var(--color-emerald-core)";
    textShadow = "0 0 10px var(--color-emerald-core)";
  }

  const renderVisual = () => {
    if (variant === 'gauge') {
      const radius = 22;
      const circumference = 2 * Math.PI * radius;
      const strokeDashoffset = circumference - (numericValue / 100) * circumference;
      return (
        <div className="card-visual-container">
          <svg width="56" height="56" viewBox="0 0 56 56" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="28" cy="28" r={radius} fill="transparent" stroke="var(--color-iron-border)" strokeWidth="4" />
            <circle 
              cx="28" 
              cy="28" 
              r={radius} 
              fill="transparent" 
              stroke="var(--color-emerald-core)" 
              strokeWidth="4" 
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
            />
          </svg>
        </div>
      );
    }

    if (variant === 'sparkline') {
      const baseRatio = [0.85, 0.82, 0.9, 0.88, 0.94, 0.97, 1];
      const dataPoints = baseRatio.map(r => numericValue * r);
      const min = Math.min(...dataPoints);
      const max = Math.max(...dataPoints);
      const range = max - min || 1;
      
      const width = 80;
      const height = 24;
      const points = dataPoints.map((val, idx) => {
        const x = idx * (width / (dataPoints.length - 1));
        const y = height - ((val - min) / range) * (height - 6) - 3;
        return `${x},${y}`;
      }).join(' ');

      const fillPoints = `0,${height} ${points} ${width},${height}`;

      return (
        <div className="card-visual-container">
          <svg width={width} height={height} style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-emerald-core)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="var(--color-emerald-core)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon points={fillPoints} fill="url(#sparklineGrad)" />
            <polyline points={points} fill="none" stroke="var(--color-emerald-core)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle 
              cx={width} 
              cy={height - ((dataPoints[6] - min) / range) * (height - 6) - 3} 
              r="2.5" 
              fill="var(--color-emerald-core)" 
              className="pulse-dot" 
            />
          </svg>
        </div>
      );
    }

    if (variant === 'status') {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span className="status-dot-active" />
        </div>
      );
    }

    if (variant === 'bars') {
      return (
        <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "20px" }}>
          <div style={{ width: "3px", height: "35%", backgroundColor: "color-mix(in oklab, var(--color-emerald-core) 25%, transparent)", borderRadius: "1px" }}></div>
          <div style={{ width: "3px", height: "55%", backgroundColor: "color-mix(in oklab, var(--color-emerald-core) 45%, transparent)", borderRadius: "1px" }}></div>
          <div style={{ width: "3px", height: "45%", backgroundColor: "color-mix(in oklab, var(--color-emerald-core) 35%, transparent)", borderRadius: "1px" }}></div>
          <div style={{ width: "3px", height: "75%", backgroundColor: "color-mix(in oklab, var(--color-emerald-core) 65%, transparent)", borderRadius: "1px" }}></div>
          <div style={{ width: "3px", height: "90%", backgroundColor: "var(--color-emerald-core)", borderRadius: "1px", boxShadow: "0 0 4px color-mix(in oklab, var(--color-emerald-core) 50%, transparent)" }}></div>
        </div>
      );
    }

    if (variant === 'incident' && numericValue > 0) {
      return (
        <div className="incident-radar-container">
          <span className="incident-radar" />
        </div>
      );
    }

    return null;
  };

  return (
    <div 
      className={cardClass}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="card-top">
        <div className="card-title">{title}</div>
        {renderVisual()}
      </div>
      <div className="card-bottom">
        <div className="card-value" style={{ color: finalValueColor, textShadow }}>
          {value}
        </div>
        {subtitle && <div className="card-subtitle">{subtitle}</div>}
      </div>
    </div>
  );
};

const Dashboard = ({ incidents = [] }) => {
  const containerStyle = {
    flex: 1,
    padding: "30px",
    backgroundColor: "var(--color-iron)",
    color: "var(--color-bone-light)",
    fontFamily: "sans-serif",
    overflowY: "auto"
  };

  const cardStyle = {
    backgroundColor: "var(--color-iron-surface)",
    border: "1px solid var(--color-iron-border)",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5), inset 0 0 15px var(--color-iron-border)"
  };

  const statTitleStyle = {
    color: "var(--color-emerald-core)",
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "10px"
  };

  const hasCriticalAlert = incidents.some(i => i.severity === 'მაღალი');

  const [stats, setStats] = React.useState({
    activeMentors: 0,
    issuedInventory: 0,
    returnableInventory: 0,
    activePartners: 0,
    membershipStatus: "0%",
    athletesCount: 0,
    activeIncidents: 0
  });

  const [loading, setLoading] = React.useState({
    activeMentors: true,
    issuedInventory: true,
    returnableInventory: true,
    activePartners: true,
    membershipStatus: true,
    athletesCount: true,
    activeIncidents: true
  });

  React.useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await fetch('/api/mentors/count?status=active');
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.count !== 'undefined') {
            setStats(prev => ({ ...prev, activeMentors: data.count }));
            return;
          }
        }
        const allRes = await fetch('/api/mentors');
        if (allRes.ok) {
          const data = await allRes.json();
          const count = Array.isArray(data) 
            ? data.filter(m => ['მწვრთნელი', 'ინსტრუქტორი', 'ტრენერი', 'აქტიური'].includes(m.status)).length 
            : 0;
          setStats(prev => ({ ...prev, activeMentors: count }));
        } else {
          throw new Error("Failed to fetch mentors API");
        }
      } catch (e) {
        console.warn("Active Mentors fetch failed, trying fallback:", e);
        try {
          const stored = localStorage.getItem('mentorsStore');
          if (stored) {
            const parsed = JSON.parse(stored);
            const count = Array.isArray(parsed)
              ? parsed.filter(m => ['მწვრთნელი', 'ინსტრუქტორი', 'ტრენერი', 'აქტიური'].includes(m.status)).length
              : 0;
            setStats(prev => ({ ...prev, activeMentors: count }));
          } else {
            setStats(prev => ({ ...prev, activeMentors: 0 }));
          }
        } catch (err) {
          setStats(prev => ({ ...prev, activeMentors: '-' }));
        }
      } finally {
        setLoading(prev => ({ ...prev, activeMentors: false }));
      }
    };

    const fetchWarehouseStats = async () => {
      let warehouseData = null;
      let summaryData = null;

      try {
        const res = await fetch('/api/warehouse/stats');
        if (res.ok) {
          warehouseData = await res.json();
        }
      } catch (e) {
        console.warn("Warehouse stats API failed, will try summary:", e);
      }

      try {
        const res = await fetch('/api/v1/dashboard/summary');
        if (res.ok) {
          summaryData = await res.json();
        }
      } catch (e) {
        console.warn("Dashboard summary API failed, will try localStorage:", e);
      }

      try {
        if (warehouseData && typeof warehouseData.issued_count !== 'undefined') {
          setStats(prev => ({ ...prev, issuedInventory: warehouseData.issued_count }));
        } else if (summaryData && summaryData.warehouse_pulse) {
          setStats(prev => ({ ...prev, issuedInventory: summaryData.warehouse_pulse.active_gear_outside || 0 }));
        } else {
          throw new Error("No warehouse inventory data from APIs");
        }
      } catch (e) {
        try {
          const storedTx = localStorage.getItem('warehouse_transactions');
          if (storedTx) {
            const txs = JSON.parse(storedTx);
            const count = txs.filter(t => t.status === 'issued').reduce((acc, t) => acc + (Number(t.qty) || 0), 0);
            setStats(prev => ({ ...prev, issuedInventory: count }));
          } else {
            setStats(prev => ({ ...prev, issuedInventory: 0 }));
          }
        } catch (err) {
          setStats(prev => ({ ...prev, issuedInventory: '-' }));
        }
      } finally {
        setLoading(prev => ({ ...prev, issuedInventory: false }));
      }

      try {
        if (warehouseData && typeof warehouseData.returnable_count !== 'undefined') {
          setStats(prev => ({ ...prev, returnableInventory: warehouseData.returnable_count }));
        } else if (summaryData && summaryData.warehouse_pulse) {
          setStats(prev => ({ ...prev, returnableInventory: summaryData.warehouse_pulse.overdue_count || 0 }));
        } else {
          throw new Error("No returnable inventory data from APIs");
        }
      } catch (e) {
        try {
          const storedTx = localStorage.getItem('warehouse_transactions');
          if (storedTx) {
            const txs = JSON.parse(storedTx);
            const today = new Date('2026-05-24');
            const count = txs.filter(t => {
              if (t.status !== 'issued' || !t.expectedReturnDate) return false;
              const retDate = new Date(t.expectedReturnDate);
              return retDate < today;
            }).length;
            setStats(prev => ({ ...prev, returnableInventory: count }));
          } else {
            setStats(prev => ({ ...prev, returnableInventory: 0 }));
          }
        } catch (err) {
          setStats(prev => ({ ...prev, returnableInventory: '-' }));
        }
      } finally {
        setLoading(prev => ({ ...prev, returnableInventory: false }));
      }
    };

    const fetchActivePartners = async () => {
      try {
        const res = await fetch('/api/partners/count?status=active');
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.count !== 'undefined') {
            setStats(prev => ({ ...prev, activePartners: data.count }));
            return;
          }
        }
        const sumRes = await fetch('/api/v1/dashboard/summary');
        if (sumRes.ok) {
          const summaryData = await sumRes.json();
          if (summaryData && summaryData.partnership_pipeline) {
            const partners = summaryData.partnership_pipeline.active_partners_count || 0;
            const sponsors = summaryData.partnership_pipeline.active_sponsors 
              ? summaryData.partnership_pipeline.active_sponsors.length 
              : 0;
            setStats(prev => ({ ...prev, activePartners: partners + sponsors }));
            return;
          }
        }
        throw new Error("Partners APIs failed");
      } catch (e) {
        console.warn("Active Partners fetch failed, trying fallback:", e);
        try {
          const stored = localStorage.getItem('federation_partnerships');
          if (stored) {
            const parsed = JSON.parse(stored);
            const count = Array.isArray(parsed)
              ? parsed.filter(p => p.status === 'active').length
              : 0;
            setStats(prev => ({ ...prev, activePartners: count }));
          } else {
            setStats(prev => ({ ...prev, activePartners: 0 }));
          }
        } catch (err) {
          setStats(prev => ({ ...prev, activePartners: '-' }));
        }
      } finally {
        setLoading(prev => ({ ...prev, activePartners: false }));
      }
    };

    const fetchMembershipStatus = async () => {
      try {
        const res = await fetch('/api/membership/stats');
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.percentage !== 'undefined') {
            setStats(prev => ({ ...prev, membershipStatus: data.percentage }));
            return;
          }
        }
        throw new Error("Membership API failed");
      } catch (e) {
        console.warn("Membership Status API failed, calculating locally:", e);
        try {
          const saved = localStorage.getItem('athletesStore');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const fedMembers = parsed.filter(a => a.isFederationMember);
              const total = fedMembers.length;
              const paid = fedMembers.filter(a => a.membershipFeePaid).length;
              const pct = total > 0 ? Math.round((paid / total) * 100) : 0;
              setStats(prev => ({ ...prev, membershipStatus: `${pct}%` }));
            } else {
              setStats(prev => ({ ...prev, membershipStatus: '0%' }));
            }
          } else {
            setStats(prev => ({ ...prev, membershipStatus: '0%' }));
          }
        } catch (err) {
          setStats(prev => ({ ...prev, membershipStatus: '-' }));
        }
      } finally {
        setLoading(prev => ({ ...prev, membershipStatus: false }));
      }
    };

    const fetchAthletesCount = async () => {
      try {
        const res = await fetch('/api/athletes/count?status=active');
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.count !== 'undefined') {
            setStats(prev => ({ ...prev, athletesCount: data.count }));
            return;
          }
        }
        throw new Error("Athletes API failed");
      } catch (e) {
        console.warn("Athletes Count API failed, checking local storage:", e);
        try {
          const saved = localStorage.getItem('athletesStore');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              const count = parsed.filter(a => a.status === 'აქტიური').length;
              setStats(prev => ({ ...prev, athletesCount: count }));
            } else {
              setStats(prev => ({ ...prev, athletesCount: 0 }));
            }
          } else {
            setStats(prev => ({ ...prev, athletesCount: 0 }));
          }
        } catch (err) {
          setStats(prev => ({ ...prev, athletesCount: '-' }));
        }
      } finally {
        setLoading(prev => ({ ...prev, athletesCount: false }));
      }
    };

    const fetchActiveIncidents = async () => {
      try {
        const res = await fetch('/api/incidents/count?status=open');
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.count !== 'undefined') {
            setStats(prev => ({ ...prev, activeIncidents: data.count }));
            return;
          }
        }
        const sumRes = await fetch('/api/v1/dashboard/summary');
        if (sumRes.ok) {
          const summaryData = await sumRes.json();
          if (summaryData && summaryData.warehouse_pulse) {
            setStats(prev => ({ ...prev, activeIncidents: summaryData.warehouse_pulse.recent_incidents || 0 }));
            return;
          }
        }
        throw new Error("Incidents API failed");
      } catch (e) {
        console.warn("Active Incidents API failed, using incidents prop:", e);
        try {
          const count = incidents.filter(i => i.status !== 'დასრულებული').length;
          setStats(prev => ({ ...prev, activeIncidents: count }));
        } catch (err) {
          setStats(prev => ({ ...prev, activeIncidents: '-' }));
        }
      } finally {
        setLoading(prev => ({ ...prev, activeIncidents: false }));
      }
    };

    fetchMentors();
    fetchWarehouseStats();
    fetchActivePartners();
    fetchMembershipStatus();
    fetchAthletesCount();
    fetchActiveIncidents();
  }, [incidents]);

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes skeleton-pulse {
          0% { background-color: rgba(255, 255, 255, 0.05); }
          50% { background-color: rgba(255, 255, 255, 0.15); }
          100% { background-color: rgba(255, 255, 255, 0.05); }
        }
        .skeleton-loading {
          animation: skeleton-pulse 1.4s infinite ease-in-out;
        }
        .dashboard-sectors-container {
          display: flex;
          flex-direction: column;
          gap: 40px;
          margin-bottom: 40px;
        }
        .dashboard-sector {
          border-bottom: 1px solid var(--color-iron-border);
          padding-bottom: 35px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .dashboard-sector:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .sector-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sector-icon {
          color: var(--color-emerald-core);
          font-size: 14px;
        }
        .sector-title {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--color-silver-structure);
          margin: 0;
        }
        .sector-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }
        .dashboard-card {
          background-color: var(--color-iron-surface);
          border: 1px solid var(--color-iron-border);
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), inset 0 0 15px var(--color-iron-border);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 125px;
          box-sizing: border-box;
        }
        .dashboard-card:hover {
          border-color: var(--color-emerald-core);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.7), 0 0 15px var(--color-emerald-core), inset 0 0 15px var(--color-iron-border);
          transform: translateY(-2px);
        }
        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          width: 100%;
        }
        .card-title {
          color: var(--color-silver-structure);
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }
        .card-value {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 4px;
        }
        .card-subtitle {
          color: var(--color-silver-structure);
          font-size: 11px;
          margin-top: 2px;
        }
        .card-bottom {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
        }
        .card-visual-container {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @keyframes status-pulse {
          0% { transform: scale(0.95); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 1; box-shadow: 0 0 12px var(--color-emerald-core); }
          100% { transform: scale(0.95); opacity: 0.6; }
        }
        .status-dot-active {
          width: 8px;
          height: 8px;
          background-color: var(--color-emerald-core);
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 8px var(--color-emerald-core);
          animation: status-pulse 2s infinite ease-in-out;
        }
        @keyframes copper-neon-glow {
          0% {
            border-color: color-mix(in oklab, var(--color-copper) 20%, transparent);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), inset 0 0 15px color-mix(in oklab, var(--color-copper) 5%, transparent);
          }
          50% {
            border-color: color-mix(in oklab, var(--color-copper) 60%, transparent);
            box-shadow: 0 4px 30px color-mix(in oklab, var(--color-copper) 25%, transparent), 0 0 15px color-mix(in oklab, var(--color-copper) 20%, transparent), inset 0 0 15px color-mix(in oklab, var(--color-copper) 15%, transparent);
          }
          100% {
            border-color: color-mix(in oklab, var(--color-copper) 20%, transparent);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), inset 0 0 15px color-mix(in oklab, var(--color-copper) 5%, transparent);
          }
        }
        .incident-card-active {
          animation: copper-neon-glow 2s infinite ease-in-out;
          background: linear-gradient(135deg, var(--color-iron-surface) 0%, color-mix(in oklab, var(--color-copper) 4%, transparent) 100%) !important;
        }
        .incident-card-active:hover {
          border-color: var(--color-copper) !important;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.7), 0 0 20px var(--color-copper), inset 0 0 20px color-mix(in oklab, var(--color-copper) 20%, transparent) !important;
        }
        .warning-card-active {
          border-color: color-mix(in oklab, var(--color-copper) 20%, transparent) !important;
          background: linear-gradient(135deg, var(--color-iron-surface) 0%, color-mix(in oklab, var(--color-copper) 2%, transparent) 100%) !important;
        }
        .warning-card-active:hover {
          border-color: var(--color-copper) !important;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.7), 0 0 15px var(--color-copper), inset 0 0 15px color-mix(in oklab, var(--color-copper) 8%, transparent) !important;
        }
        @keyframes spark-pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.6; }
          100% { transform: scale(1); opacity: 1; }
        }
        .pulse-dot {
          animation: spark-pulse 1.8s infinite ease-in-out;
          transform-origin: center;
        }
        @keyframes radar-ping {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .incident-radar-container {
          position: relative;
          width: 12px;
          height: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .incident-radar {
          width: 8px;
          height: 8px;
          background-color: var(--color-copper);
          border-radius: 50%;
          position: relative;
        }
        .incident-radar::after {
          content: '';
          position: absolute;
          top: -4px;
          left: -4px;
          width: 16px;
          height: 16px;
          border: 2px solid var(--color-copper);
          border-radius: 50%;
          animation: radar-ping 1.5s infinite ease-out;
        }
      `}</style>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "15px" }}>
        <h2 style={{ color: "var(--color-bone-light)", margin: 0, textShadow: "0 0 10px var(--color-emerald-core)" }}>
          პანელის მიმოხილვა
        </h2>
      </div>

      {hasCriticalAlert && (
        <div style={{
          backgroundColor: "rgba(239, 68, 68, 0.08)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          borderRadius: "8px",
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: "#ef4444",
          fontSize: "12px",
          marginBottom: "20px",
          boxShadow: "0 0 12px rgba(239, 68, 68, 0.08)",
          maxWidth: "100%",
          boxSizing: "border-box",
          width: "fit-content"
        }}>
          <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: "14px" }}></i>
          <span><strong>კრიტიკული შეტყობინება:</strong> ფიქსირდება მაღალი სიმძიმის ინციდენტი! გთხოვთ გადახვიდეთ ინციდენტების პანელში.</span>
        </div>
      )}

      <div className="dashboard-sectors-container">
        {/* Sector 1: Overview & Status */}
        <div className="dashboard-sector">
          <div className="sector-header">
            <i className="fa-solid fa-chart-pie sector-icon"></i>
            <h3 className="sector-title">1. მიმოხილვა და სტატუსი</h3>
          </div>
          <div className="sector-grid">
            <DashboardCard 
              title="მომლოდინე მოთხოვნები" 
              value="38" 
              subtitle="აქტიური მოთხოვნები" 
              loading={false}
              variant="bars" 
            />
            <DashboardCard 
              title="სისტემის სტატუსი" 
              value="ონლაინ" 
              subtitle="სისტემის სტატუსი" 
              loading={false} 
              variant="status"
            />
            <DashboardCard 
              title="აქტიური ინციდენტები" 
              value={stats.activeIncidents} 
              subtitle="აქტიური ინციდენტები" 
              loading={loading.activeIncidents} 
              variant="incident"
            />
          </div>
        </div>

        {/* Sector 2: User & Member Analytics */}
        <div className="dashboard-sector">
          <div className="sector-header">
            <i className="fa-solid fa-users sector-icon"></i>
            <h3 className="sector-title">2. მომხმარებელთა და წევრთა ანალიტიკა</h3>
          </div>
          <div className="sector-grid">
            <DashboardCard 
              title="აქტიური წევრები" 
              value="1,204" 
              subtitle="აქტიური წევრები" 
              loading={false} 
              variant="sparkline"
            />
            <DashboardCard 
              title="სპორტსმენთა სტატისტიკა" 
              value={stats.athletesCount} 
              subtitle="სპორტსმენთა სტატისტიკა" 
              loading={loading.athletesCount} 
              variant="sparkline"
            />
            <DashboardCard 
              title="აქტიური მენტორები" 
              value={stats.activeMentors} 
              subtitle="აქტიური მენტორები" 
              loading={loading.activeMentors} 
              variant="sparkline"
            />
          </div>
        </div>

        {/* Sector 3: Warehouse & Assets */}
        <div className="dashboard-sector">
          <div className="sector-header">
            <i className="fa-solid fa-warehouse sector-icon"></i>
            <h3 className="sector-title">3. საწყობი და აქტივები</h3>
          </div>
          <div className="sector-grid">
            <DashboardCard 
              title="გაცემული ინვენტარი" 
              value={stats.issuedInventory} 
              subtitle="გაცემული ინვენტარი" 
              loading={loading.issuedInventory} 
              variant="sparkline"
            />
            <DashboardCard 
              title="დასაბრუნებელი ინვენტარი" 
              value={stats.returnableInventory} 
              subtitle="დასაბრუნებელი ინვენტარი" 
              loading={loading.returnableInventory} 
              variant="returnable"
            />
          </div>
        </div>

        {/* Sector 4: Finance & Partnership */}
        <div className="dashboard-sector">
          <div className="sector-header">
            <i className="fa-solid fa-handshake sector-icon"></i>
            <h3 className="sector-title">4. ფინანსები და პარტნიორობა</h3>
          </div>
          <div className="sector-grid">
            <DashboardCard 
              title="წევრობის სტატუსი" 
              value={stats.membershipStatus} 
              subtitle="წევრობის სტატუსი" 
              loading={loading.membershipStatus} 
              variant="gauge"
            />
            <DashboardCard 
              title="აქტიური ხელშეკრულებები" 
              value={stats.activePartners} 
              subtitle="აქტიური ხელშეკრულებები" 
              loading={loading.activePartners} 
              variant="sparkline"
            />
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={statTitleStyle}>ბოლო აქტივობები</div>
        <p style={{ color: "rgba(226, 232, 240, 0.7)", marginTop: "10px" }}>ბოლო აქტივობები არ ფიქსირდება.</p>
      </div>
    </div>
  );
};

export default Dashboard;

