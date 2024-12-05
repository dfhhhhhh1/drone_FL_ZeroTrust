import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';


const ProjectMembersPage = () => {
  const navigate = useNavigate();

  const {name} = useParams();
  const [projectData, setProjectData] = useState(null);
  const [currentMembers, setCurrentMembers] = useState('');
  const [unassigned, setUnassigned] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await axios.get(`/api/project/members/${name}`);
        setProjectData(response.data);
        setCurrentMembers(response.data.members.current);
        setUnassigned(response.data.members.unassigned);
        setIsAdmin(response.data.isAdmin);
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    fetchProjectData();
  }, [name]);

  const handleRequest = async (email) => {
    try {
      const response = await axios.post('/api/project/addMember',
        { name: name, email: email },
        { withCredentials: true}
    );
      // Refresh data after action
      navigate(0);
    } catch (error) {
      console.error('Error handling request:', error);
    }
  };

  if (!projectData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-6">
          <div className="mb-4">
            <h2 className="display-5 text-primary border-bottom pb-2">Project Members</h2>
          </div>
          <ul className="list-group">
            {currentMembers.map((member) => (
              <li key={member.user.email} className="list-group-item">
                {member.user.email}
              </li>
            ))}
          </ul>
        </div>

        {isAdmin && (
          <div className="col-md-6">
            <div className="mb-4">
              <h2 className="display-5 text-success border-bottom pb-2">Requested Members</h2>
            </div>
            <ul className="list-group">
              {unassigned.map((request) => (
                <li
                  key={request.user.email}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {request.user.email}
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleRequest(request.user.email, 'accept')}
                  >
                    Accept
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectMembersPage;
