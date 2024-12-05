import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { useLocation} from 'react-router-dom';
import axios from 'axios';

const TwoFactorAuth = ({ qrCode, onVerify }) => {
    const [code, setCode] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try { 
            await axios.post('/api/login/two-factor', 
            { email, otpToken: code }, 
            { withCredentials: true } );

            navigate('/projects')
        } catch (error) {
            alert("Login failed.");
            console.log(error);
        }
    };

    return (
        <Container
            fluid className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Card className="shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
                <Card.Body>
                    <h2 className="text-center">Two-Factor Authentication</h2>
                    <hr></hr>
                    <p className="text-center">Enter the code in Google Authenticator below.</p>                                                                                  
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="form2FACode">
                            <Form.Label>Authentication Code</Form.Label>
                            <Form.Control type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter 2FA Code" required />
                        </Form.Group>
                        <div className="d-flex justify-content-center mt-4">
                            <Button variant="primary" type="submit">Verify</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default TwoFactorAuth;