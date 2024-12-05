import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Image } from 'react-bootstrap';
import axios from 'axios';

const Projects = () => {
    const [projects, setProjects] = useState('');

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const emailRes = await axios.get('/api/login/info',
                    { withCredentials: true }
                );

                const projectsRes = await axios.get('/api/project/listWithAccess', {
                    params: { email: emailRes.data.email },
                    withCredentials: true 
                });
                
                setProjects(projectsRes.data.projects);
                console.log(projectsRes.data.projects);
            } catch (error) {
                console.log(error);
                navigate('/projects/create')
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const handleValidButton = () => {
        navigate('/home');
    }

    if (loading) {
        return <div>Projects loading...</div>
    }

    return (
        <Container fluid className='d-flex justify-content-center align-items-center' style={{height: '100vh'}}>
            <Card className='shadow-lg' style={{ width: '80%'}}>
                <Card.Body>
                    <Container>
                        <h2 className='text-center pb-2'>Projects</h2>
                        {projects.map((project, index) => (
                            <Card className='d-flex flex-row justify-content-between align-items-center mb-3 p-3'>
                                <h5>{project.name}</h5>
                                <div className='d-flex align-items-center'>
                                    {project.hasUser === true ? (
                                        <Button variant="primary" onClick={handleValidButton}>Dashboard</Button>
                                    ) : (
                                        <Button variant="Secondary">Ask to join</Button>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </Container>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default Projects;