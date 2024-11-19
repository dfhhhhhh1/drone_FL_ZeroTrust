import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Image } from 'react-bootstrap';
import QRCode from 'react-qr-code';
import axios from 'axios';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [qrToggle, setQrToggle] = useState(false);    //Display qr code page or registration page
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(password !== confirmPass) {
            alert("Passwords don't match");
            return;
        }

        try { 
            const res = await axios.post('/api/login/register', 
            { email, password }, 
            { withCredentials: true } );

            setQrCode(res.data.qrcode);
            //console.log(qrCode);
            setQrToggle(true);

        } catch (error) {
            alert("Registration failed.");
        }
    };

    const handleNext = () => {
        navigate('/login');
    }

    return (
        <Container fluid className='d-flex justify-content-center align-items-center' style={{height: '100vh'}}>
                    <Card className='shadow-lg' style={{ width: '100%', maxWidth: '400px'}}>
                        <Card.Body>
                            {qrToggle ? (
                                <Container>
                                    <h2 className='text-center'>Register with Google Authenticator</h2>
                                    <p className='text-center'>Scan the QR code with Google Authenticator</p>
                                    <div className='text-center'>
                                        {qrCode ? (
                                            <QRCode value={qrCode} size={256} fluid />
                                        ) : (
                                            <p>Loading...</p>
                                        )}
                                    </div>
                                    <div className='d-flex justify-content-center mt-3'>
                                        <Button variant='primary' onClick={handleNext}>Continue to Login</Button>
                                    </div>
                                </Container>
                            ) : (
                                <Container>
                                    <h2 className='text-center'>Register</h2>
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group className='m-3' controlID='formEmail'>
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter email' required/>
                                        </Form.Group>
                                        <Form.Group className='m-3' controlID='formPassword'>
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter password' required/>
                                        </Form.Group>
                                        <Form.Group className='m-3' controlID='formConfirmPass'>
                                            <Form.Label>Confirm Password</Form.Label>
                                            <Form.Control type='password' value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} placeholder='Confirm your password' required/>
                                        </Form.Group>
                                        <div className='d-flex justify-content-center mb-3'>
                                            <Button variant='primary' type='submit'>Register</Button>
                                        </div>
                                    </Form>
                                    <p className='text-center'>Already have an account? <Link to='/login'>Login here</Link></p>
                                </Container>
                            )}
                        </Card.Body>
                    </Card>
        </Container>
    )
}

export default Register;