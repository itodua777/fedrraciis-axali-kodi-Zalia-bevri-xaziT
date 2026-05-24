import React from 'react';
import StatCard from '../../components/ui/StatCard.jsx';

const Dashboard = ({ incidents = [] }) => {
  const containerStyle = {
    flex: 1,
    padding: "30px",
    backgroundColor: "#121418",
    color: "#e2e8f0",
    fontFamily: "sans-serif",
    overflowY: "auto"
  };

  const cardStyle = {
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    border: "1px solid rgba(34, 211, 238, 0.1)",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(34, 211, 238, 0.05)"
  };

  const statTitleStyle = {
    color: "#22d3ee",
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
          50% { background-color: rgba(255, 255, 255, 0.18); }
          100% { background-color: rgba(255, 255, 255, 0.05); }
        }
        .skeleton-loading {
          animation: skeleton-pulse 1.4s infinite ease-in-out;
        }
        .dashboard-sectors-container {
          display: flex;
          flex-direction: column;
          gap: 25px;
          margin-bottom: 25px;
        }
        .dashboard-sector {
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding-bottom: 25px;
          display: flex;
          flex-direction: column;
          gap: 15px;
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
          color: rgba(34, 211, 238, 0.85);
          font-size: 14px;
        }
        .sector-title {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #94a3b8;
          margin: 0;
        }
        .sector-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }
      `}</style>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "15px" }}>
        <h2 style={{ color: "#22d3ee", margin: 0, textShadow: "0 0 10px rgba(34, 211, 238, 0.5)" }}>
          Dashboard Overview
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
          <span><strong>Critical Alert:</strong> ფიქსირდება მაღალი სიმძიმის ინციდენტი! გთხოვთ გადახვიდეთ ინციდენტების პანელში.</span>
        </div>
      )}

      <div className="dashboard-sectors-container">
        {/* Sector 1: Overview & Status */}
        <div className="dashboard-sector">
          <div className="sector-header">
            <i className="fa-solid fa-chart-pie sector-icon"></i>
            <h3 className="sector-title">1. მიმოხილვა და სტატუსი (Overview & Status)</h3>
          </div>
          <div className="sector-grid">
            <StatCard 
              title="Pending Requests" 
              value="38" 
              subtitle="აქტიური მოთხოვნები" 
              loading={false} 
            />
            <StatCard 
              title="System Status" 
              value="Online" 
              subtitle="სისტემის სტატუსი" 
              loading={false} 
              valueColor="#22d3ee" 
              textShadow="0 0 10px rgba(34, 211, 238, 0.5)"
            />
            <StatCard 
              title="Active Incidents" 
              value={stats.activeIncidents} 
              subtitle="აქტიური ინციდენტები" 
              loading={loading.activeIncidents} 
              valueColor={!loading.activeIncidents && stats.activeIncidents > 0 ? "#ef4444" : "#ffffff"}
              textShadow={!loading.activeIncidents && stats.activeIncidents > 0 ? "0 0 10px rgba(239, 68, 68, 0.4)" : "0 0 10px rgba(255, 255, 255, 0.3)"}
            />
          </div>
        </div>

        {/* Sector 2: User & Member Analytics */}
        <div className="dashboard-sector">
          <div className="sector-header">
            <i className="fa-solid fa-users sector-icon"></i>
            <h3 className="sector-title">2. მომხმარებელთა და წევრთა ანალიტიკა (User & Member Analytics)</h3>
          </div>
          <div className="sector-grid">
            <StatCard 
              title="Active Members" 
              value="1,204" 
              subtitle="აქტიური წევრები" 
              loading={false} 
            />
            <StatCard 
              title="Athletes Stats" 
              value={stats.athletesCount} 
              subtitle="სპორტსმენთა სტატისტიკა" 
              loading={loading.athletesCount} 
            />
            <StatCard 
              title="Active Mentors" 
              value={stats.activeMentors} 
              subtitle="აქტიური მენტორები" 
              loading={loading.activeMentors} 
            />
          </div>
        </div>

        {/* Sector 3: Warehouse & Assets */}
        <div className="dashboard-sector">
          <div className="sector-header">
            <i className="fa-solid fa-warehouse sector-icon"></i>
            <h3 className="sector-title">3. საწყობი და აქტივები (Warehouse & Assets)</h3>
          </div>
          <div className="sector-grid">
            <StatCard 
              title="Issued Gear" 
              value={stats.issuedInventory} 
              subtitle="გაცემული ინვენტარი" 
              loading={loading.issuedInventory} 
            />
            <StatCard 
              title="Returnable Gear" 
              value={stats.returnableInventory} 
              subtitle="დასაბრუნებელი ინვენტარი" 
              loading={loading.returnableInventory} 
            />
          </div>
        </div>

        {/* Sector 4: Finance & Partnership */}
        <div className="dashboard-sector">
          <div className="sector-header">
            <i className="fa-solid fa-handshake sector-icon"></i>
            <h3 className="sector-title">4. ფინანსები და პარტნიორობა (Finance & Partnership)</h3>
          </div>
          <div className="sector-grid">
            <StatCard 
              title="Membership Status" 
              value={stats.membershipStatus} 
              subtitle="წევრობის სტატუსი" 
              loading={loading.membershipStatus} 
            />
            <StatCard 
              title="Active Partners" 
              value={stats.activePartners} 
              subtitle="აქტიური ხელშეკრულებები" 
              loading={loading.activePartners} 
            />
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={statTitleStyle}>Recent Activity</div>
        <p style={{ color: "rgba(226, 232, 240, 0.7)", marginTop: "10px" }}>No recent activity to display.</p>
      </div>
    </div>
  );
};

export default Dashboard;
