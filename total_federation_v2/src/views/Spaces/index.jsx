import React from 'react';
import SpaceAddForm from './components/SpaceAddForm.jsx';
import SpaceEditForm from './components/SpaceEditForm.jsx';

const TrainingSpacesDashboard = () => {
  const [spaces, setSpaces] = React.useState([
    {
      id: '1',
      name: 'დიდუბის საწვრთნელი დარბაზი',
      ownershipType: 'FEDERATION',
      trainingProfile: ['ფიზიკური მომზადება', 'კლდეზე ცოცვა'],
      workingHours: { days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], timeRange: '09:00 - 21:00', is24_7: false },
      contract: { startDate: '2025-01-01', endDate: '2030-12-31' },
      status: 'OPEN',
      activePermissions: 12,
      area: 150,
      capacity: 30
    },
    {
      id: '2',
      name: 'შატილის საბაზო ბანაკი',
      ownershipType: 'PRIVATE',
      ownerDetails: { name: 'შპს შატილი ტური', idCode: '400123456', phone: '555112233' },
      trainingProfile: ['სამაშველო მომზადება', 'ფიზიკური მომზადება'],
      workingHours: { days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], timeRange: '', is24_7: true },
      contract: { startDate: '2024-05-01', endDate: '2026-06-01' },
      status: 'OPEN',
      activePermissions: 5,
      area: 200,
      capacity: 50
    }
  ]);

  const [selectedSpace, setSelectedSpace] = React.useState(null);
  const [filterOwner, setFilterOwner] = React.useState('ALL');
  const [filterStatus, setFilterStatus] = React.useState('ALL');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showAddForm, setShowAddForm] = React.useState(false);
  
  const filteredSpaces = spaces.filter((space) => {
    if (filterOwner !== 'ALL' && space.ownershipType !== filterOwner) return false;
    if (filterStatus !== 'ALL') {
      const isExpired = space.contract && new Date(space.contract.endDate) < new Date();
      if (filterStatus === 'ACTIVE' && isExpired) return false;
      if (filterStatus === 'EXPIRED' && !isExpired) return false;
    }
    if (searchQuery && !space.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const containerStyle = { flex: 1, padding: "30px", backgroundColor: "#121418", color: "#e2e8f0", fontFamily: "sans-serif", overflowY: "auto", display: "flex", flexDirection: "row", gap: "20px" };
  const centerContentStyle = { flex: 1, display: "flex", flexDirection: "column", gap: "20px", transition: "all 0.3s" };
  const cardStyle = { backgroundColor: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(34, 211, 238, 0.1)", borderRadius: "12px", padding: "20px", cursor: "pointer", transition: "all 0.3s" };
  
  // Add Form States
  const [name, setName] = React.useState('');
  const [ownerType, setOwnerType] = React.useState('საჯარო სივრცე');
  const [trainingProfiles, setTrainingProfiles] = React.useState([]);
  const [is247, setIs247] = React.useState(false);
  const [selectedDays, setSelectedDays] = React.useState([]);
  const [timeRange, setTimeRange] = React.useState('09:00 - 21:00');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [area, setArea] = React.useState('');
  const [capacity, setCapacity] = React.useState('');

  // Edit Form States
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [editingSpace, setEditingSpace] = React.useState(null);
  const [editName, setEditName] = React.useState('');
  const [editArea, setEditArea] = React.useState('');
  const [editCapacity, setEditCapacity] = React.useState('');
  const [editStatus, setEditStatus] = React.useState('OPEN');
  const [editOwnerType, setEditOwnerType] = React.useState('FEDERATION');

  const handleOpenEditModal = (space) => {
    setEditingSpace(space);
    setEditName(space.name);
    setEditArea(space.area || '');
    setEditCapacity(space.capacity || '');
    setEditStatus(space.status || 'OPEN');
    setEditOwnerType(space.ownershipType || 'FEDERATION');
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingSpace(null);
    setEditName('');
    setEditArea('');
    setEditCapacity('');
    setEditStatus('OPEN');
    setEditOwnerType('FEDERATION');
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    
    console.log(`Sending PUT/PATCH request to /api/spaces/${editingSpace.id}`, {
      name: editName,
      area: parseFloat(editArea),
      capacity: parseInt(editCapacity),
      status: editStatus,
      ownershipType: editOwnerType
    });

    const updatedSpaces = spaces.map(s => {
      if (s.id === editingSpace.id) {
        return {
          ...s,
          name: editName,
          area: parseFloat(editArea) || 0,
          capacity: parseInt(editCapacity) || 0,
          status: editStatus,
          ownershipType: editOwnerType
        };
      }
      return s;
    });
    
    setSpaces(updatedSpaces);
    
    if (selectedSpace && selectedSpace.id === editingSpace.id) {
      setSelectedSpace({
        ...selectedSpace,
        name: editName,
        area: parseFloat(editArea) || 0,
        capacity: parseInt(editCapacity) || 0,
        status: editStatus,
        ownershipType: editOwnerType
      });
    }
    
    handleCloseEditModal();
  };

  // Hydration Logic: when editingSpace changes, sync the form states
  React.useEffect(() => {
    if (editingSpace) {
      setEditName(editingSpace.name || '');
      setEditArea(editingSpace.area || '');
      setEditCapacity(editingSpace.capacity || '');
      setEditStatus(editingSpace.status || 'OPEN');
      setEditOwnerType(editingSpace.ownershipType || 'FEDERATION');
    }
  }, [editingSpace]);

  const toggleProfile = (profile) => {
    setTrainingProfiles(prev => prev.includes(profile) ? prev.filter(p => p !== profile) : [...prev, profile]);
  };
  
  const toggleDay = (day) => {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSpaces([...spaces, {
      id: String(Date.now()),
      name,
      ownershipType: ownerType === 'საჯარო სივრცე' ? 'FEDERATION' : 'PRIVATE',
      trainingProfile: trainingProfiles,
      workingHours: { days: selectedDays, timeRange: timeRange, is24_7: is247 },
      contract: { startDate, endDate },
      status: 'OPEN',
      activePermissions: 0,
      area: parseFloat(area) || 0,
      capacity: parseInt(capacity) || 0
    }]);
    setShowAddForm(false);
    setName('');
    setOwnerType('საჯარო სივრცე');
    setTrainingProfiles([]);
    setIs247(false);
    setSelectedDays([]);
    setTimeRange('09:00 - 21:00');
    setStartDate('');
    setEndDate('');
    setArea('');
    setCapacity('');
  };

  return (
    <div style={containerStyle}>
      {showAddForm && (
        <SpaceAddForm
          handleSubmit={handleSubmit}
          setShowAddForm={setShowAddForm}
          name={name} setName={setName}
          area={area} setArea={setArea}
          capacity={capacity} setCapacity={setCapacity}
          ownerType={ownerType} setOwnerType={setOwnerType}
          trainingProfiles={trainingProfiles} toggleProfile={toggleProfile}
          is247={is247} setIs247={setIs247}
          selectedDays={selectedDays} toggleDay={toggleDay}
          timeRange={timeRange} setTimeRange={setTimeRange}
          startDate={startDate} setStartDate={setStartDate}
          endDate={endDate} setEndDate={setEndDate}
        />
      )}

      {showEditModal && editingSpace && (
        <SpaceEditForm
          handleEditSubmit={handleEditSubmit}
          handleCloseEditModal={handleCloseEditModal}
          editName={editName} setEditName={setEditName}
          editOwnerType={editOwnerType} setEditOwnerType={setEditOwnerType}
          editArea={editArea} setEditArea={setEditArea}
          editCapacity={editCapacity} setEditCapacity={setEditCapacity}
          editStatus={editStatus} setEditStatus={setEditStatus}
        />
      )}

      <div style={centerContentStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ color: "#22d3ee", margin: 0, textShadow: "0 0 10px rgba(34, 211, 238, 0.5)" }}>სავარჯიშო სივრცე</h2>
          <button onClick={() => setShowAddForm(true)} style={{ backgroundColor: "rgba(34, 211, 238, 0.1)", color: "#22d3ee", border: "1px solid rgba(34, 211, 238, 0.4)", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
            <i className="fa-solid fa-plus"></i> სივრცის დამატება
          </button>
        </div>
        
        <div style={{ display: "flex", gap: "10px", backgroundColor: "rgba(15, 23, 42, 0.6)", padding: "15px", borderRadius: "12px", border: "1px solid rgba(34, 211, 238, 0.1)" }}>
          <input type="text" placeholder="ძიება..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "transparent", color: "#fff" }} />
          <select value={filterOwner} onChange={e => setFilterOwner(e.target.value)} style={{ padding: "10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "#1e293b", color: "#fff" }}>
            <option value="ALL">ყველა საკუთრება</option>
            <option value="FEDERATION">საჯარო სივრცე</option>
            <option value="PRIVATE">კერძო</option>
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {filteredSpaces.map(space => {
            const isExpiringSoon = space.contract && (new Date(space.contract.endDate).getTime() - Date.now()) / (1000 * 3600 * 24) < 30;
            let emoji = "🏢";
            if (space.name.includes("მეკლდეურობა") || space.trainingProfile.includes("კლდეზე ცოცვა")) {
              emoji = "🧗";
            } else if (space.name.includes("შატილი") || space.trainingProfile.includes("სამაშველო მომზადება")) {
              emoji = "⛺";
            }
            return (
              <div key={space.id} onClick={() => setSelectedSpace(space)} style={{ ...cardStyle, position: "relative", border: selectedSpace?.id === space.id ? "1px solid #22d3ee" : isExpiringSoon ? "1px solid #f43f5e" : "1px solid rgba(34, 211, 238, 0.1)", backgroundColor: selectedSpace?.id === space.id ? "rgba(34, 211, 238, 0.05)" : "rgba(15, 23, 42, 0.6)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px", gap: "10px" }}>
                  <h3 style={{ color: "#fff", margin: 0, fontSize: "15px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>{emoji}</span> {space.name}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEditModal(space);
                    }}
                    className="edit-button-zone"
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "rgba(255, 255, 255, 0.5)",
                      fontSize: "12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      transition: "color 0.2s, background-color 0.2s"
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.color = "#22d3ee";
                      e.currentTarget.style.textShadow = "0 0 8px rgba(34, 211, 238, 0.6)";
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.color = "rgba(255, 255, 255, 0.5)";
                      e.currentTarget.style.textShadow = "none";
                    }}
                  >
                    <i className="fa-solid fa-pen" style={{ fontSize: "10px" }}></i>
                    რედაქტირება
                  </button>
                </div>
                <p style={{ margin: "5px 0", fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
                  • საკუთრება: <span style={{ color: "#fff" }}>{space.ownershipType === 'FEDERATION' ? 'საჯარო სივრცე' : 'კერძო'}</span>
                </p>
                <p style={{ margin: "5px 0", fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
                  • ფართობი: <span style={{ color: "#fff", fontWeight: "bold" }}>{space.area || 0} კვ.მ</span>
                </p>
                <p style={{ margin: "5px 0", fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
                  • მოცულობა: მაქს. <span style={{ color: "#fff", fontWeight: "bold" }}>{space.capacity || 0} სპორტსმენი ერთდროულად</span>
                </p>
                <p style={{ margin: "5px 0", fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
                  • მიმდინარე სტატუსი: <span style={{ color: space.status === 'OPEN' ? '#10b981' : '#f59e0b', fontWeight: "bold" }}>
                    [ {space.status === 'OPEN' ? '✓ აქტიური' : '⚠️ ტექნიკური შესვენება'} ]
                  </span>
                </p>
                <p style={{ margin: "5px 0", fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
                  დაშვება: <span style={{ color: "#fff", fontWeight: "bold" }}>{space.activePermissions}</span>
                </p>
                {isExpiringSoon && <p style={{ margin: "10px 0 0 0", fontSize: "12px", color: "#f43f5e", fontWeight: "bold" }}><i className="fa-solid fa-triangle-exclamation"></i> ხელშეკრულების ვადა იწურება</p>}
              </div>
            );
          })}
        </div>
      </div>
      
      {selectedSpace && (
        <div style={{ width: "350px", minWidth: "350px", backgroundColor: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(34, 211, 238, 0.1)", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "20px", boxShadow: "-4px 0 15px rgba(0,0,0,0.5)" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3 style={{ margin: 0, color: "#22d3ee" }}>{selectedSpace.name}</h3>
            <button onClick={() => setSelectedSpace(null)} style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer" }}><i className="fa-solid fa-xmark"></i></button>
          </div>
          
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "15px" }}>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>საკუთრება</h4>
            <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#fff" }}>{selectedSpace.ownershipType === 'FEDERATION' ? 'საჯარო სივრცე' : 'კერძო საკუთრება'}</p>
            {selectedSpace.ownerDetails && (
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "5px" }}>
                მესაკუთრე: {selectedSpace.ownerDetails.name} <br/>
                ს/კ: {selectedSpace.ownerDetails.idCode} <br/>
                ტელ: {selectedSpace.ownerDetails.phone}
              </div>
            )}
          </div>
          
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "15px" }}>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>პარამეტრები</h4>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
              <span style={{color: "rgba(255,255,255,0.6)"}}>ფართობი:</span>
              <span style={{ color: "#fff" }}>{selectedSpace.area || 0} კვ.მ</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginTop: "5px" }}>
              <span style={{color: "rgba(255,255,255,0.6)"}}>მოცულობა:</span>
              <span style={{ color: "#fff" }}>მაქს. {selectedSpace.capacity || 0} სპორტსმენი</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginTop: "5px" }}>
              <span style={{color: "rgba(255,255,255,0.6)"}}>სტატუსი:</span>
              <span style={{ color: selectedSpace.status === 'OPEN' ? '#10b981' : '#f59e0b', fontWeight: "bold" }}>
                {selectedSpace.status === 'OPEN' ? '✓ აქტიური' : '⚠️ ტექნიკური შესვენება'}
              </span>
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "15px" }}>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>იურიდიული ვადა</h4>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
              <span style={{color: "rgba(255,255,255,0.6)"}}>დაწყება:</span>
              <span style={{ color: "#fff" }}>{selectedSpace.contract.startDate}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginTop: "5px" }}>
              <span style={{color: "rgba(255,255,255,0.6)"}}>დასრულება:</span>
              <span style={{ color: ((new Date(selectedSpace.contract.endDate).getTime() - Date.now()) / (1000 * 3600 * 24) < 30) ? "#f43f5e" : "#fff" }}>{selectedSpace.contract.endDate}</span>
            </div>
            
            <button style={{ width: "100%", marginTop: "15px", padding: "8px", backgroundColor: "transparent", border: "1px solid rgba(34, 211, 238, 0.4)", color: "#22d3ee", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>
              <i className="fa-solid fa-download"></i> PDF გადმოწერა
            </button>
          </div>
          
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "15px" }}>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>სამუშაო გრაფიკი</h4>
            <p style={{ margin: 0, fontSize: "14px", color: "#fff" }}>{selectedSpace.workingHours.is24_7 ? "24/7" : `${selectedSpace.workingHours.days.join(', ')} | ${selectedSpace.workingHours.timeRange}`}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingSpacesDashboard;
