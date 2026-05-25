import React from 'react';
import RouteMap from './components/RouteMap.jsx';
import RouteForm from './components/RouteForm.jsx';

const RoutePlanningDashboard = () => {
  const emptyRoute = {
    name: '', category: '1B', height: '', startPoint: '', duration: '',
    terrainTags: [], approach: '', routeDescription: '', descent: '',
    waypoints: [
      { id: 'wp-1', lat: '', lng: '', label: 'საწყისი წერტილი' }
    ]
  };

  const [routes, setRoutes] = React.useState([
    {
      id: 'route-1',
      name: 'თეთნულდი (კლასიკური)',
      category: '4B',
      height: 4858,
      date: '2023-08-15',
      startPoint: 'ზესხოს ალპინისტური ბანაკი',
      duration: '7 დღე',
      terrainTags: ['მყინვარი', 'თოვლის საფარი', 'კლდოვანი ქედი'],
      approach: 'ზესხოდან მიდგომა ფეხით...',
      routeDescription: 'კლდოვანი უბნების გავლა...',
      descent: 'იგივე მარშრუტით...',
      waypoints: [
        { id: 'wp-1', lat: 43.00, lng: 42.95, label: 'ბანაკი 1' },
        { id: 'wp-2', lat: 43.01, lng: 42.97, label: 'გზა' },
        { id: 'wp-3', lat: 43.0308, lng: 42.9972, label: 'მწვერვალი' }
      ]
    },
    {
      id: 'route-2',
      name: 'უშბა (სამხრეთ ქედი)',
      category: '5A',
      height: 4710,
      date: '2023-09-02',
      startPoint: 'მაზერი',
      duration: '10 დღე',
      terrainTags: ['კლდოვანი ქედი', 'ყინულოვანი კედელი'],
      approach: 'მაზერიდან მიდგომა...',
      routeDescription: 'რთული მონაკვეთები...',
      descent: 'სამხრეთით...',
      waypoints: [
        { id: 'wp-1', lat: 43.1025, lng: 42.6041, label: 'Base Camp' },
        { id: 'wp-2', lat: 43.1200, lng: 42.6300, label: 'Peak' }
      ]
    }
  ]);

  const [formData, setFormData] = React.useState(emptyRoute);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editRouteId, setEditRouteId] = React.useState(null);

  const mapContainerRef = React.useRef(null);
  const mapInstance = React.useRef(null);
  const markersRef = React.useRef([]);
  const [selectedWaypoint, setSelectedWaypoint] = React.useState(null);

  const updateMapSource = (waypoints) => {
    if (!mapInstance.current) return;
    const validCoords = waypoints
      .filter(wp => wp.lat !== '' && wp.lng !== '' && !isNaN(parseFloat(wp.lat)) && !isNaN(parseFloat(wp.lng)))
      .map(wp => [parseFloat(wp.lng), parseFloat(wp.lat)]);

    // Update Line
    const routeSource = mapInstance.current.getSource('route');
    if (routeSource) {
      routeSource.setData({
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'LineString',
          'coordinates': validCoords.length > 1 ? validCoords : []
        }
      });
    }

    // Update Markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    waypoints.forEach((wp, index) => {
      if (wp.lat !== '' && wp.lng !== '' && !isNaN(parseFloat(wp.lat)) && !isNaN(parseFloat(wp.lng))) {
        const el = document.createElement('div');
        const isPeak = index === waypoints.length - 1 && waypoints.length > 1;
        el.innerHTML = isPeak 
          ? '<i class="fa-solid fa-flag" style="color: #ef4444; font-size: 24px; text-shadow: 0 0 10px #ef4444;"></i>'
          : '<i class="fa-solid fa-campground" style="color: var(--color-emerald-core); font-size: 20px; text-shadow: 0 0 10px var(--color-emerald-core); cursor: pointer;"></i>';
        
        const marker = new window.mapboxgl.Marker(el)
          .setLngLat([parseFloat(wp.lng), parseFloat(wp.lat)])
          .addTo(mapInstance.current);
        
        el.addEventListener('click', () => {
          setSelectedWaypoint({
            title: wp.label || `წერტილი ${index + 1}`,
            elevation: 'უცნობია',
            desc: `Lat: ${wp.lat}, Lng: ${wp.lng}`
          });
        });

        markersRef.current.push(marker);
      }
    });
  };

  const handleSave = () => {
    if (isEditMode) {
      setRoutes(routes.map(r => r.id === editRouteId ? { ...formData, id: editRouteId, date: new Date().toISOString().split('T')[0] } : r));
    } else {
      setRoutes([...routes, { ...formData, id: `route-${Date.now()}`, date: new Date().toISOString().split('T')[0] }]);
    }
    handleCancel();
  };

  const handleCancel = () => {
    setFormData(emptyRoute);
    setIsEditMode(false);
    setEditRouteId(null);
  };

  const handleEdit = (route) => {
    setFormData(route);
    setIsEditMode(true);
    setEditRouteId(route.id);
    if (mapInstance.current && route.waypoints.length > 0) {
      const validCoords = route.waypoints.filter(wp => wp.lat !== '' && wp.lng !== '');
      if (validCoords.length > 0) {
        const firstValid = validCoords[0];
        mapInstance.current.flyTo({
          center: [parseFloat(firstValid.lng), parseFloat(firstValid.lat)],
          zoom: 12,
          essential: true
        });
      }
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('დარწმუნებული ხართ რომ გსურთ მარშრუტის წაშლა?')) {
      setRoutes(routes.filter(r => r.id !== id));
      if (editRouteId === id) {
        handleCancel();
      }
    }
  };

  const handlePreview = (route) => {
    if (mapInstance.current && route.waypoints.length > 0) {
      updateMapSource(route.waypoints);
      const validCoords = route.waypoints.filter(wp => wp.lat !== '' && wp.lng !== '');
      if (validCoords.length > 0) {
        const firstValid = validCoords[0];
        mapInstance.current.flyTo({
          center: [parseFloat(firstValid.lng), parseFloat(firstValid.lat)],
          zoom: 12,
          essential: true
        });
      }
    }
  };

  const updateWaypoint = (index, field, value) => {
    const newWaypoints = [...formData.waypoints];
    newWaypoints[index][field] = value;
    setFormData({ ...formData, waypoints: newWaypoints });
  };

  const addWaypoint = () => {
    setFormData({
      ...formData,
      waypoints: [...formData.waypoints, { id: `wp-${Date.now()}`, lat: '', lng: '', label: '' }]
    });
  };

  const removeWaypoint = (index) => {
    const newWaypoints = [...formData.waypoints];
    newWaypoints.splice(index, 1);
    setFormData({ ...formData, waypoints: newWaypoints });
  };

  const toggleTag = (tag) => {
    setFormData(p => ({
      ...p,
      terrainTags: p.terrainTags.includes(tag) ? p.terrainTags.filter(t => t !== tag) : [...p.terrainTags, tag]
    }));
  };

  return (
    <div style={{ flex: 1, display: "flex", backgroundColor: "#121418", color: "#e2e8f0", overflow: "hidden", fontFamily: "sans-serif" }}>
      <div style={{ width: "300px", borderRight: "1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)", backgroundColor: "rgba(15, 23, 42, 0.8)", padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "15px", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
          <h3 style={{ margin: 0, color: "#fff", fontSize: "18px" }}>მარშრუტები</h3>
          <button onClick={handleCancel} style={{ background: "color-mix(in oklab, var(--color-emerald-core) 10%, transparent)", border: "1px solid var(--color-emerald-core)", color: "var(--color-emerald-core)", padding: "5px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>
            + ახალი
          </button>
        </div>

        {routes.map(r => (
          <div key={r.id} style={{ backgroundColor: "rgba(255,255,255,0.05)", border: editRouteId === r.id ? "1px solid var(--color-emerald-core)" : "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "15px", display: "flex", flexDirection: "column", gap: "10px", transition: "all 0.3s" }}>
            <div style={{ fontWeight: "bold", fontSize: "14px", color: "#fff" }}>{r.name}</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
              <span><i className="fa-solid fa-layer-group"></i> {r.category}</span>
              <span><i className="fa-solid fa-mountain-sun"></i> {r.height}მ</span>
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "5px" }}>
              <button onClick={() => handlePreview(r)} style={{ flex: 1, background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "6px", borderRadius: "4px", cursor: "pointer" }} title="Preview">
                <i className="fa-regular fa-eye"></i>
              </button>
              <button onClick={() => handleEdit(r)} style={{ flex: 1, background: "transparent", border: "1px solid var(--color-emerald-core)", color: "var(--color-emerald-core)", padding: "6px", borderRadius: "4px", cursor: "pointer" }} title="Edit">
                <i className="fa-solid fa-pencil"></i>
              </button>
              <button onClick={() => handleDelete(r.id)} style={{ flex: 1, background: "transparent", border: "1px solid #ef4444", color: "#ef4444", padding: "6px", borderRadius: "4px", cursor: "pointer" }} title="Delete">
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      <RouteForm
        formData={formData}
        setFormData={setFormData}
        isEditMode={isEditMode}
        addWaypoint={addWaypoint}
        removeWaypoint={removeWaypoint}
        updateWaypoint={updateWaypoint}
        toggleTag={toggleTag}
        handleSave={handleSave}
        handleCancel={handleCancel}
      />

      <RouteMap
        waypoints={formData.waypoints}
        selectedWaypoint={selectedWaypoint}
        setSelectedWaypoint={setSelectedWaypoint}
        mapInstance={mapInstance}
        mapContainerRef={mapContainerRef}
        markersRef={markersRef}
        updateMapSource={updateMapSource}
      />
    </div>
  );
};

export default RoutePlanningDashboard;
