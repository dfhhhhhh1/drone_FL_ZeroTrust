import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post('/api/login/', 
                { email, password }, 
                { withCredentials: true } );
            
            navigate('/twoFactorAuth', {state: { email }});

        } catch (error) {
            alert("Login failed.")
        }

        //navigate('/TwoFactorAuth');
    };

    return (
        <Container fluid className='d-flex justify-content-center align-items-center' style={{height: '100vh'}}>
                    <Card className='shadow-lg' style={{ width: '100%', maxWidth: '400px'}}>
                        <Card.Body>
                            <h2 className='text-center'>Login</h2>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className='m-3' controlID='formEmail'>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter email' required/>
                                </Form.Group>
                                <Form.Group className='m-3' controlID='formPassword'>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter password' required/>
                                </Form.Group>
                                <div className='d-flex justify-content-center mb-3'>
                                    <Button variant='primary' type='submit'>Login</Button>
                                </div>
                            </Form>
                            <p className='text-center'>Don't have an account <Link to='/register'>Register here</Link></p>

                        </Card.Body>
                    </Card>
        </Container>
    )
}

export default Login;