import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Image } from 'react-bootstrap';
import axios from 'axios';

const Create = () => {
    const [projectName, setProjectName] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const emailRes = await axios.get('/api/login/info',
                { withCredentials: true }
            );

            await axios.post('/api/project/create',
                { name: projectName, email: emailRes.data.email },
                { withCredentials: true}
            );
            
            navigate('/projects');
        } catch (error) {
            alert("Project could not be created.");
        }
    };

    return (
        <Container fluid className='d-flex justify-content-center align-items-center' style={{height: '100vh'}}>
            <Card className='shadow-lg' style={{ width: '100%', maxWidth: '400px'}}>
                <Card.Body>
                    <Container>
                        <h2 className='text-center'>New Project</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className='m-3' controlID='formProjectName'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control type='projectName' value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder='Enter project name' required/>
                            </Form.Group>
                            <div className='d-flex justify-content-center mb-3'>
                                <Button variant='primary' type='submit'>Create</Button>
                            </div>
                        </Form>
                    </Container>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default Create;