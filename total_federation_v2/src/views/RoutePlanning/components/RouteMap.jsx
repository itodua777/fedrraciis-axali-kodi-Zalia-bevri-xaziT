import React from 'react';

const RouteMap = ({
  waypoints,
  selectedWaypoint,
  setSelectedWaypoint,
  mapInstance,
  mapContainerRef,
  markersRef,
  updateMapSource
}) => {
  React.useEffect(() => {
    if (!mapContainerRef.current) return;
    
    try {
      const mapboxgl = window.mapboxgl;
      if (!mapboxgl) {
        console.error("Mapbox GL not loaded on window.");
        return;
      }
      mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';
      
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: [42.9972, 43.0308],
        zoom: 11,
        pitch: 65,
        bearing: -45,
        antialias: true
      });
      mapInstance.current = map;
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.on('style.load', () => {
        map.addSource('mapbox-dem', {
          'type': 'raster-dem',
          'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
          'tileSize': 512,
          'maxzoom': 14
        });
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
        
        map.addLayer({
          'id': 'sky',
          'type': 'sky',
          'paint': {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 0.0],
            'sky-atmosphere-sun-intensity': 15
          }
        });

        map.addSource('route', {
          'type': 'geojson',
          'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
              'type': 'LineString',
              'coordinates': []
            }
          }
        });

        map.addLayer({
          'id': 'route-line',
          'type': 'line',
          'source': 'route',
          'layout': {
            'line-join': 'round',
            'line-cap': 'round'
          },
          'paint': {
            'line-color': '#22D3EE',
            'line-width': 4,
            'line-opacity': 0.8
          }
        });

        updateMapSource(waypoints);
      });

      return () => map.remove();
    } catch(e) {
      console.error("Mapbox init error:", e);
    }
  }, []);

  React.useEffect(() => {
    if (mapInstance.current && mapInstance.current.isStyleLoaded()) {
      updateMapSource(waypoints);
    }
  }, [waypoints]);

  return (
    <div style={{ flex: 1, position: "relative" }}>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%", outline: "none" }}></div>
      
      <div style={{ position: "absolute", top: "20px", left: "20px", backgroundColor: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(34, 211, 238, 0.2)", borderRadius: "8px", padding: "15px", backdropFilter: "blur(5px)", pointerEvents: "none" }}>
        <div style={{ color: "#fff", fontWeight: "bold", marginBottom: "10px", fontSize: "14px" }}>3D Terrain Mesh Active</div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "rgba(255,255,255,0.7)", marginBottom: "5px" }}>
          <div style={{ width: "15px", height: "3px", backgroundColor: "#22d3ee" }}></div> მარშრუტის ხაზი
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "rgba(255,255,255,0.7)", marginBottom: "5px" }}>
          <i className="fa-solid fa-flag" style={{ color: "#ef4444" }}></i> მწვერვალი
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>
          <i className="fa-solid fa-campground" style={{ color: "#22d3ee" }}></i> გაჩერების ადგილი
        </div>
      </div>

      {selectedWaypoint && (
        <div style={{ position: "absolute", top: "20px", right: "20px", width: "250px", backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid #22d3ee", borderRadius: "8px", padding: "15px", backdropFilter: "blur(5px)", boxShadow: "0 0 20px rgba(34, 211, 238, 0.2)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <h4 style={{ margin: 0, color: "#22d3ee" }}>{selectedWaypoint.title}</h4>
            <i className="fa-solid fa-xmark" style={{ cursor: "pointer", color: "rgba(255,255,255,0.5)" }} onClick={() => setSelectedWaypoint(null)}></i>
          </div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", marginBottom: "5px" }}>
            სიმაღლე: <span style={{ color: "#fff", fontWeight: "bold" }}>{selectedWaypoint.elevation}</span>
          </div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>
            {selectedWaypoint.desc}
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteMap;
