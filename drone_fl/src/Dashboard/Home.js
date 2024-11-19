import React from 'react';
import { Container, Navbar, Nav, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster'; 
import 'leaflet/dist/leaflet.css';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import L from 'leaflet';  

//Import drone images for different battery levels
import droneImg1 from '../droneImg1.png';
import droneImg2 from '../droneImg2.png';
import droneImg3 from '../droneImg3.png';
import droneImg4 from '../droneImg4.png';
import droneImg5 from '../droneImg5.png';

const Home = () => {
  const droneLocations = [
    { id: 1, lat: 37.7749, lng: -122.4194, name: 'Drone 1', battery: 80 }, 
    { id: 2, lat: 34.0522, lng: -118.2437, name: 'Drone 2', battery: 50 }, 
    { id: 3, lat: 40.7128, lng: -74.0060, name: 'Drone 3', battery: 20 }, 
    { id: 4, lat: 41.8781, lng: -87.6298, name: 'Drone 4', battery: 90 }, 
    { id: 5, lat: 29.7604, lng: -95.3698, name: 'Drone 5', battery: 65 }, 
    { id: 6, lat: 33.4484, lng: -112.0740, name: 'Drone 6', battery: 40 }, 
    { id: 7, lat: 39.7392, lng: -104.9903, name: 'Drone 7', battery: 55 }, 
    { id: 8, lat: 47.6062, lng: -122.3321, name: 'Drone 8', battery: 35 }, 
    { id: 9, lat: 51.5074, lng: -0.1278, name: 'Drone 9', battery: 80 }, 
    { id: 10, lat: 42.3601, lng: -71.0589, name: 'Drone 10', battery: 25 }, 
    { id: 11, lat: 39.9612, lng: -82.9988, name: 'Drone 11', battery: 75 }, 
    { id: 12, lat: 36.1627, lng: -86.7816, name: 'Drone 12', battery: 90 }, 
    { id: 13, lat: 34.0522, lng: -118.2437, name: 'Drone 13', battery: 45 }, 
    { id: 14, lat: 39.9526, lng: -75.1652, name: 'Drone 14', battery: 85 }, 
    { id: 15, lat: 34.0522, lng: -118.2437, name: 'Drone 15', battery: 10 }, 
    { id: 16, lat: 40.7306, lng: -73.9352, name: 'Drone 16', battery: 60 }, 
    { id: 17, lat: 36.1699, lng: -115.1398, name: 'Drone 17', battery: 50 }, 
    { id: 18, lat: 25.7617, lng: -80.1918, name: 'Drone 18', battery: 95 }, 
    { id: 19, lat: 43.0731, lng: -89.4012, name: 'Drone 19', battery: 60 }, 
    { id: 20, lat: 45.5051, lng: -122.6750, name: 'Drone 20', battery: 30 }, 
    { id: 21, lat: 32.7157, lng: -117.1611, name: 'Drone 21', battery: 50 }, 
    { id: 22, lat: 37.3382, lng: -121.8863, name: 'Drone 22', battery: 70 }, 
    { id: 23, lat: 30.2672, lng: -97.7431, name: 'Drone 23', battery: 40 },
    { id: 24, lat: 33.7490, lng: -84.3880, name: 'Drone 24', battery: 65 }, 
    { id: 25, lat: 38.9072, lng: -77.0369, name: 'Drone 25', battery: 55 }, 
  ];

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Intrusion Attempts',
        data: [5, 10, 3, 15, 8],
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
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
    return new L.Icon({
      iconUrl: iconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
      shadowSize: [0, 0],
    });
  };

  const clusterIconCreate = (cluster) => {
    const count = cluster.getChildCount();
    const size = Math.min(60, 20 + (count * 4)); //Dynamically change size based on number of markers in cluster
    return new L.DivIcon({
      html: `<div style="background-color: rgba(0, 123, 255, 0.8); color: white; width: ${size}px; height: ${size}px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: ${Math.min(16, size / 3)}px;">
               ${count}
             </div>`,
      className: 'leaflet-cluster-icon',
      iconSize: new L.Point(size, size),
    });
  };


  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
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

      <Container fluid>
        <Row>
          <Col md={8}>
            <Card className="mb-4">
              <Card.Header>Drone Locations</Card.Header>
              <Card.Body style={{ height: '500px' }}>
                <MapContainer center={[37.7749, -122.4194]} zoom={5} style={{ height: '100%' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <MarkerClusterGroup
                        chunkedLoading
                        iconCreateFunction={clusterIconCreate}  //Apply custom cluster icon
                    >
                    {droneLocations.map(drone => (
                        <Marker
                        key={drone.id}
                        position={[drone.lat, drone.lng]}
                        icon={getDroneIcon(drone.battery)}
                        >
                        <Popup>
                            <strong>{drone.name}</strong><br />
                            Battery: {drone.battery}%<br />
                        </Popup>
                        </Marker>
                    ))}
                    </MarkerClusterGroup>

                </MapContainer>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="mb-4">
              <Card.Header>Intrusion Attempts Over Time</Card.Header>
              <Card.Body style={{ height: '400px' }}>
                <Line data={chartData} options={chartOptions} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Card.Header>System Status</Card.Header>
              <Card.Body>
                <p>Active Drones: {droneLocations.length}</p>
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