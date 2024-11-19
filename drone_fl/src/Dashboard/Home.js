import React, {useState, useEffect, useMemo, useCallback} from 'react';
import { Container, Navbar, Nav, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster'; 
import 'leaflet/dist/leaflet.css';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import L from 'leaflet';  
import ReactToggle from 'react-toggle';
import 'react-toggle/style.css';
import Slider from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';
import { HeatmapLayer } from 'react-leaflet-heatmap-layer-v3';
import debounce from 'lodash.debounce';


//Import drone images for different battery levels
import droneImg1 from '../droneImg1.png';
import droneImg2 from '../droneImg2.png';
import droneImg3 from '../droneImg3.png';
import droneImg4 from '../droneImg4.png';
import droneImg5 from '../droneImg5.png';

const Home = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [tileLayerUrl, setTileLayerUrl] = useState(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
    );
  
    const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const initialData = [0, 2, 3, 1, 5, 3, 7, 9, 14, 6, 11, 4];
    const [isMdScreen, setIsMdScreen] = useState(false);

    const [timeRange, setTimeRange] = useState([0, 4]); // Initial time range
    const [chartData, setChartData] = useState({
      labels: allMonths,
      datasets: [
        {
          label: 'Intrusion Attempts',
          data: initialData,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
        },
      ],
    });



    useEffect(() => {
        const handleResize = () => {
          setIsMdScreen(window.innerWidth >= 768 && window.innerWidth < 992); // md screen width
        };
    
        window.addEventListener('resize', handleResize);
        handleResize(); // Call it initially to set the state
    
        return () => window.removeEventListener('resize', handleResize);
      }, []);

      const marks = allMonths.map((month, index) => {
        const isVisible = isMdScreen ? index % 2 === 0 : true; // Apply index % 2 === 0 only for md screens
        
        // Define the color for dark mode or light mode
        const textColor = isDarkMode ? 'white' : 'black';
      
        return {
          value: index,
          label: (
            isVisible && (
              <Tooltip title={allMonths[index]}>
                <span style={{ color: textColor }}>{month}</span>
              </Tooltip>
            )
          ),
        };
      });

    useEffect(() => {
        const filteredLabels = allMonths.slice(timeRange[0], timeRange[1] + 1);
        const filteredData = initialData.slice(timeRange[0], timeRange[1] + 1);
        setChartData({
          ...chartData,
          labels: filteredLabels,
          datasets: [
            {
              ...chartData.datasets[0],
              data: filteredData,
            },
          ],
        });
      }, [timeRange]);

    useEffect(() => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setIsDarkMode(savedTheme === 'dark');
        setTileLayerUrl(savedTheme === 'dark'
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png' 
          : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png');
      }
    }, []);
  
    useEffect(() => {
      document.body.className = isDarkMode ? 'dark' : 'light';
      document.body.style.transition = 'background-color 0.8s ease, color 0.8s ease'; 
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
      setTileLayerUrl(isDarkMode
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png');
    }, [isDarkMode]);

    const handleSliderChange = (event, newValue) => {
        setTimeRange(newValue);
      };
    
    const [filteredDrones, setFilteredDrones] = useState([]);


  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  const droneLocations = useMemo(() => [
    { id: 1, lat: 37.7749, lng: -122.4194, name: 'Drone 1', battery: 80, intrusions: 0 }, 
    { id: 2, lat: 34.0522, lng: -118.2437, name: 'Drone 2', battery: 50, intrusions: 2 }, 
    { id: 3, lat: 40.7128, lng: -74.0060, name: 'Drone 3', battery: 20, intrusions: 4 }, 
    { id: 4, lat: 41.8781, lng: -87.6298, name: 'Drone 4', battery: 90, intrusions: 0 }, 
    { id: 5, lat: 29.7604, lng: -95.3698, name: 'Drone 5', battery: 65, intrusions: 2 }, 
    { id: 6, lat: 33.4484, lng: -112.0740, name: 'Drone 6', battery: 40, intrusions: 0 }, 
    { id: 7, lat: 39.7392, lng: -104.9903, name: 'Drone 7', battery: 55, intrusions: 4 }, 
    { id: 8, lat: 47.6062, lng: -122.3321, name: 'Drone 8', battery: 35, intrusions: 3 }, 
    { id: 9, lat: 51.5074, lng: -0.1278, name: 'Drone 9', battery: 0, intrusions: 10 }, 
    { id: 10, lat: 42.3601, lng: -71.0589, name: 'Drone 10', battery: 25, intrusions: 8 }, 
    { id: 11, lat: 39.9612, lng: -82.9988, name: 'Drone 11', battery: 75, intrusions: 0 }, 
    { id: 12, lat: 36.1627, lng: -86.7816, name: 'Drone 12', battery: 90, intrusions: 3 }, 
    { id: 13, lat: 34.0522, lng: -118.2437, name: 'Drone 13', battery: 45, intrusions: 2 }, 
    { id: 14, lat: 39.9526, lng: -75.1652, name: 'Drone 14', battery: 85, intrusions: 7 }, 
    { id: 15, lat: 34.0522, lng: -118.2437, name: 'Drone 15', battery: 10, intrusions: 1 }, 
    { id: 16, lat: 40.7306, lng: -73.9352, name: 'Drone 16', battery: 60, intrusions: 9 }, 
    { id: 17, lat: 36.1699, lng: -115.1398, name: 'Drone 17', battery: 50, intrusions: 0 }, 
    { id: 18, lat: 25.7617, lng: -80.1918, name: 'Drone 18', battery: 95, intrusions: 1 }, 
    { id: 19, lat: 43.0731, lng: -89.4012, name: 'Drone 19', battery: 60, intrusions: 6 }, 
    { id: 20, lat: 45.5051, lng: -122.6750, name: 'Drone 20', battery: 30, intrusions: 3 }, 
    { id: 21, lat: 32.7157, lng: -117.1611, name: 'Drone 21', battery: 50, intrusions: 1 }, 
    { id: 22, lat: 37.3382, lng: -121.8863, name: 'Drone 22', battery: 70, intrusions: 0 }, 
    { id: 23, lat: 30.2672, lng: -97.7431, name: 'Drone 23', battery: 40, intrusions: 1 },
    { id: 24, lat: 33.7490, lng: -84.3880, name: 'Drone 24', battery: 65, intrusions: 5 }, 
    { id: 25, lat: 38.9072, lng: -77.0369, name: 'Drone 25', battery: 55, intrusions: 2 }, 
    { id: 26, lat: 44.9778, lng: -93.2650, name: 'Drone 26', battery: 70, intrusions: 2 }, 
    { id: 27, lat: 40.4406, lng: -79.9959, name: 'Drone 27', battery: 50, intrusions: 6 }, 
    { id: 28, lat: 35.2271, lng: -80.8431, name: 'Drone 28', battery: 65, intrusions: 4 }, 
    { id: 29, lat: 29.9511, lng: -90.0715, name: 'Drone 29', battery: 80, intrusions: 1 }, 
    { id: 30, lat: 32.7767, lng: -96.7970, name: 'Drone 30', battery: 0, intrusions: 7 }, 
    { id: 31, lat: 46.7296, lng: -94.6859, name: 'Drone 31', battery: 60, intrusions: 3 }, 
    { id: 32, lat: 40.4173, lng: -82.9071, name: 'Drone 32', battery: 45, intrusions: 0 }, 
    { id: 33, lat: 44.0582, lng: -121.3153, name: 'Drone 33', battery: 25, intrusions: 2 }, 
    { id: 34, lat: 27.9506, lng: -82.4572, name: 'Drone 34', battery: 75, intrusions: 1 }, 
    { id: 35, lat: 36.8508, lng: -76.2859, name: 'Drone 35', battery: 55, intrusions: 4 }, 
    { id: 36, lat: 35.1495, lng: -90.0490, name: 'Drone 36', battery: 85, intrusions: 3 }, 
    { id: 37, lat: 41.6005, lng: -93.6091, name: 'Drone 37', battery: 0, intrusions: 5 }, 
    { id: 38, lat: 39.1031, lng: -84.5120, name: 'Drone 38', battery: 65, intrusions: 6 }, 
    { id: 39, lat: 37.9833, lng: -120.3844, name: 'Drone 39', battery: 50, intrusions: 1 }, 
    { id: 40, lat: 35.2226, lng: -97.4395, name: 'Drone 40', battery: 95, intrusions: 4 }, 
    { id: 41, lat: 41.2524, lng: -95.9980, name: 'Drone 41', battery: 20, intrusions: 2 }, 
    { id: 42, lat: 36.1627, lng: -86.7816, name: 'Drone 42', battery: 60, intrusions: 0 }, 
    { id: 43, lat: 33.0198, lng: -96.6989, name: 'Drone 43', battery: 80, intrusions: 3 }, 
    { id: 44, lat: 27.9944, lng: -82.5944, name: 'Drone 44', battery: 0, intrusions: 6 }, 
    { id: 45, lat: 40.6331, lng: -89.3985, name: 'Drone 45', battery: 55, intrusions: 5 }, 
    { id: 46, lat: 37.8044, lng: -122.2712, name: 'Drone 46', battery: 70, intrusions: 1 }, 
    { id: 47, lat: 34.7465, lng: -92.2896, name: 'Drone 47', battery: 0, intrusions: 3 }, 
    { id: 48, lat: 39.7392, lng: -104.9903, name: 'Drone 48', battery: 35, intrusions: 7 }, 
    { id: 49, lat: 36.1532, lng: -95.9928, name: 'Drone 49', battery: 25, intrusions: 4 }, 
    { id: 50, lat: 43.6591, lng: -70.2568, name: 'Drone 50', battery: 60, intrusions: 8 }
], []);


const [batteryRange, setBatteryRange] = useState([0, 100]);
const [intrusionRange, setIntrusionRange] = useState([0, 10]);

const [heatmapData, setHeatmapData] = useState(droneLocations.map(drone => [drone.lat, drone.lng, drone.intrusions]));
const [heatmapLayer, setHeatmapLayer] = useState({ radius: 50, blur: 25, max: 10, minOpacity: 0.2 });


const getFilteredDrones = useCallback(() => {
    return droneLocations.filter(
      (drone) =>
        drone.battery >= batteryRange[0] &&
        drone.battery <= batteryRange[1] &&
        drone.intrusions >= intrusionRange[0] &&
        drone.intrusions <= intrusionRange[1]
    );
  }, [batteryRange, intrusionRange, droneLocations]);

  useEffect(() => {
    setFilteredDrones(getFilteredDrones());
  }, [batteryRange, intrusionRange, getFilteredDrones]);


  const handleBatteryChange = debounce((_, newValue) => {
    setBatteryRange(newValue);
  }, 50);

  const handleIntrusionChange = debounce((_, newValue) => {
    setIntrusionRange(newValue);
  }, 50);

  
  const filteredHeatmapData = useMemo(() => {
    return getFilteredDrones().map(drone => [drone.lat, drone.lng, drone.intrusions]);
  }, [batteryRange, intrusionRange, getFilteredDrones]);
          


  const chartOptions = {
    maintainAspectRatio: false,
  };

  const handleZoom = (e) => {
    const zoomLevel = e.target.getZoom();
    const radius = Math.min(50, Math.max(10, 100 - zoomLevel * 2));
    const blur =  Math.min(30, Math.max(10, 50 - zoomLevel));
    const minOpacity = zoomLevel < 10 ? 0.2 : 0.5;
    const maxIntensity = zoomLevel > 10 ? heatmapLayer.max * 0.8 : heatmapLayer.max * 1.2;
    
    setHeatmapLayer({ radius, blur, maxIntensity, minOpacity});
  };

  //Function to get the icon based on battery level
  const getDroneIcon = (batteryLevel) => {
    let iconUrl;
    if (batteryLevel > 75) {
      iconUrl = droneImg1;
    } else if (batteryLevel > 50) {
      iconUrl = droneImg2;
    } else if (batteryLevel > 25) {
      iconUrl = droneImg3;
    } else if (batteryLevel > 0) {
      iconUrl = droneImg4;
    } else {
      iconUrl = droneImg5;
    }

    const iconClass = isDarkMode ? 'drone-icon-light' : 'drone-icon-dark';


    return new L.Icon({
      iconUrl: iconUrl,
      iconSize: [40, 40],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
      shadowSize: [0, 0],
      className: iconClass,
    });
  };

  const clusterIconCreate = (cluster) => {
    const count = cluster.getChildCount();
    const size = Math.min(60, 20 + (count * 4)); 
    return new L.DivIcon({
      html: `<div style="background-color: rgba(0, 123, 255, 0.8); color: white; width: ${size}px; height: ${size}px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: ${Math.min(16, size / 3)}px;">
               ${count}
             </div>`,
      className: 'leaflet-cluster-icon',
      iconSize: new L.Point(size, size),
    });
  };

  const cardStyle = {
    backgroundColor: isDarkMode ? '#343a40' : '#ffffff',
    color: isDarkMode ? '#fff' : '#000',
    transition: 'background-color 0.8s ease, color 0.8s ease' // Add transition to the card
  };


  return (
    <>
      <Navbar bg={isDarkMode ? 'dark' : 'light'} variant={isDarkMode ? 'dark' : 'light'} expand="lg" className="mb-4" style={{transition: 'background-color 0.8s ease, color 0.8s ease',}}>
        <Container>
          <Navbar.Brand as={Link} to="/home">Drone Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
              <Nav.Link as={Link} to="/login">Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div style={{ position: 'fixed', top: '10px', right: '10px' }}>
        <ReactToggle
          defaultChecked={isDarkMode}
          onChange={toggleDarkMode}
          icons={false}
        />
      </div>

      <Container fluid>
        <Row>
          <Col md={7}>
            <Card className="mb-4" style={cardStyle}>
              <Card.Header>Drone Locations</Card.Header>
              <Card.Body style={{ height: '500px' }}>
                <MapContainer center={[37.7749, -122.4194]} zoom={5} maxZoom={16} onZoomEnd={handleZoom} style={{ height: '100%'}}>
                  <LayersControl>
                    <LayersControl.BaseLayer name="CartoDB Positron" checked>
                      <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://carto.com/attributions">CartoDB</a>'
                      />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="CartoDB Dark Matter" checked={isDarkMode}>
                      <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://carto.com/attributions">CartoDB</a>'
                      />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="OpenStreetMap">
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer name="Satellite">
                      <TileLayer
                        url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution='&copy; <a href="https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9">Esri World Imagery</a>'
                      />
                    </LayersControl.BaseLayer>
                  </LayersControl>

                    <HeatmapLayer
                        fitBoundsOnLoad
                        points={filteredHeatmapData}
                        longitudeExtractor={(m) => m[1]}
                        latitudeExtractor={(m) => m[0]}  
                        intensityExtractor={(m) => parseFloat(m[2])}
                        radius={heatmapLayer.radius}
                        blur={heatmapLayer.blur}
                        max={heatmapLayer.max}
                        minOpacity={heatmapLayer.minOpacity}
                        useLocalExtrema={false}
                    />

                    <MarkerClusterGroup chunkedLoading iconCreateFunction={clusterIconCreate}>
                    {getFilteredDrones().map((drone) => (
                        <Marker
                        key={drone.id}
                        position={[drone.lat, drone.lng]}
                        icon={getDroneIcon(drone.battery)}
                        >
                        <Popup>
                            {drone.name} - Battery: {drone.battery}% <br />
                            Intrusions: {drone.intrusions} <br />
                        </Popup>
                        </Marker>
                    ))}
                    </MarkerClusterGroup>

                </MapContainer>
              </Card.Body>
            </Card>
          </Col>

          <Col md={5} sm={12}>
            <Card className="mb-4" style={cardStyle}>
              <Card.Header>Intrusion Attempts</Card.Header>
              <Card.Body style={{ height: '400px' }}>
                <div style={{ height: '300px' }}>
                <Line data={chartData} options={chartOptions} />
                </div>
                <div style={{ marginTop: '20px', marginLeft: '20px'}}>
                <Slider
                value={timeRange}
                onChange={handleSliderChange}
                min={0}
                max={11}
                marks={marks}
                valueLabelDisplay="auto"
                sx={{
                    '& .MuiSlider-markLabel': {
                    whiteSpace: 'nowrap',
                    fontSize: '0.9rem',
                    '@media (max-width: 768px)': {
                        fontSize: '0.75rem',
                    },
                    '@media (max-width: 600px)': {
                        display: 'none',
                    },
                    },
                }}
                style={{ width: '100%', color: 'rgba(75,192,192,1)' }}
                />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
            <Col md={12}>
                <Card className="mb-4" style={cardStyle}>
                <Card.Header>Adjust Thresholds</Card.Header>
                <Card.Body>
                    <div style={{ marginBottom: '20px' }}>
                    <h6>Battery Range</h6>
                    <Slider
                        value={batteryRange}
                        onChange={handleBatteryChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={100}
                        step={1}
                        style={{ color: 'rgba(75,192,192,1)' }}
                    />
                    <p>
                        Current Range: {batteryRange[0]}% - {batteryRange[1]}%
                    </p>
                    </div>

                    <div>
                    <h6>Intrusion Threshold</h6>
                    <Slider
                        value={intrusionRange}
                        onChange={handleIntrusionChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={50}
                        step={1}
                        style={{ color: 'rgba(255,99,132,1)' }}
                    />
                    </div>
                </Card.Body>
                </Card>
            </Col>
        </Row>

        <Row>
          <Col >
            <Card className="mb-4" style={cardStyle}>
              <Card.Header>System Status</Card.Header>
              <Card.Body>
                <p>Active Drones: 50</p>
                <p>Last Intrusion Detected: 2 hours ago</p>
                <p>Zero Trust Status: Secure</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
