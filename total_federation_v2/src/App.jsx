import React from 'react';
import ReactDOM from './utils/react-dom-shim.js';
import Sidebar from './components/Layout/Sidebar.jsx';
import Header from './components/Layout/Navbar.jsx';
import Login from './views/Login/index.jsx';
import Dashboard from './views/Dashboard/index.jsx';
import AthletesLibrary from './views/Athletes/index.jsx';
import AddAthleteForm from './views/Athletes/AddAthleteForm.jsx';
import IncidentsDashboard from './views/Incidents/index.jsx';
import AddIncidentForm from './views/Incidents/AddIncidentForm.jsx';
import WarehouseDashboard from './views/Warehouse/index.jsx';
import MediaNewsDashboard from './views/MediaNews/index.jsx';
import PartnershipsDashboard from './views/Partners/index.jsx';
import ManagementDashboard from './views/Management/index.jsx';
import MemorialRegistryDashboard from './views/Memorial/index.jsx';
import MentorsDashboard from './views/Mentors/index.jsx';
import AddMentorForm from './views/Mentors/MentorForm.jsx';
import ClubsRegistryDashboard from './views/Clubs/index.jsx';
import TrainingSpacesDashboard from './views/Spaces/index.jsx';
import RoutePlanningDashboard from './views/RoutePlanning/index.jsx';
import PeaksDashboard from './views/Peaks/index.jsx';
import SettingsDashboard from './views/Settings/index.jsx';

import { MOCK_ATHLETES, MOCK_CLUBS, MOCK_INCIDENTS } from './utils/mockData.js';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [selectedFederation, setSelectedFederation] = React.useState("");
  const [currentView, setCurrentView] = React.useState("dashboard");
  const [athletes, setAthletes] = React.useState(MOCK_ATHLETES);
  const [clubs, setClubs] = React.useState(MOCK_CLUBS);
  const [selectedClubId, setSelectedClubId] = React.useState(null);
  const [incidents, setIncidents] = React.useState(MOCK_INCIDENTS);

  const handleClubClick = (clubId) => {
    setSelectedClubId(clubId);
    setCurrentView("clubs");
  };

  const handleLogin = (federation) => {
    setIsAuthenticated(true);
    setSelectedFederation(federation);
  };

  const handleAddAthlete = (newAthlete) => {
    setAthletes([...athletes, newAthlete]);
  };

  const handleUpdateAthlete = (updatedAthlete) => {
    setAthletes(prev => prev.map(a => a.id === updatedAthlete.id ? updatedAthlete : a));
  };

  const handleAddIncident = (newIncident) => {
    setIncidents([...incidents, { ...newIncident, id: String(Date.now()) }]);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedFederation("");
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#121418", overflow: "hidden" }}>
      <Sidebar currentView={currentView} onViewChange={setCurrentView} federation={selectedFederation} />
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Header federation={selectedFederation} onLogout={handleLogout} />
        {currentView === 'dashboard' && <Dashboard incidents={incidents} />}
        {currentView === 'athletes' && <AthletesLibrary onViewChange={setCurrentView} athletes={athletes} onUpdateAthlete={handleUpdateAthlete} clubs={clubs} onClubClick={handleClubClick} />}
        {currentView === 'add_athlete' && <AddAthleteForm onViewChange={setCurrentView} federation={selectedFederation} onAdd={handleAddAthlete} clubs={clubs} />}
        {currentView === 'incidents' && <IncidentsDashboard onViewChange={setCurrentView} incidents={incidents} athletes={athletes} />}
        {currentView === 'add_incident' && <AddIncidentForm onViewChange={setCurrentView} onAdd={handleAddIncident} athletes={athletes} />}
        {currentView === 'warehouse' && <WarehouseDashboard athletes={athletes} onUpdateAthlete={handleUpdateAthlete} />}
        {currentView === 'medianews' && <MediaNewsDashboard />}
        {currentView === 'partnerships' && <PartnershipsDashboard />}
        {currentView === 'management' && <ManagementDashboard athletes={athletes} />}
        {currentView === 'memorial' && <MemorialRegistryDashboard athletes={athletes} onUpdateAthlete={handleUpdateAthlete} />}
        {currentView === 'mentors' && <MentorsDashboard onViewChange={setCurrentView} athletes={athletes} />}
        {currentView === 'add_mentor' && <AddMentorForm onViewChange={setCurrentView} />}
        {currentView === 'clubs' && <ClubsRegistryDashboard clubs={clubs} setClubs={setClubs} selectedClubId={selectedClubId} setSelectedClubId={setSelectedClubId} />}
        {currentView === 'spaces' && <TrainingSpacesDashboard />}
        {currentView === 'routes' && <RoutePlanningDashboard />}
        {currentView === 'peaks' && <PeaksDashboard athletes={athletes} onUpdateAthlete={handleUpdateAthlete} />}
        {currentView === 'settings' && <SettingsDashboard athletes={athletes} onUpdateAthlete={handleUpdateAthlete} />}
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
export default App;
