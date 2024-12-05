import React, { useState } from 'react';
import axios from 'axios';

const TriggerEvent = () => {
  const [projectName, setProjectName] = useState('');

  const handleSubmit = async () => {
    if (!projectName) {
      alert('Please enter a project name');
      return;
    }

    try {
      const response = await axios.post('/api/email/', { projectName });
      alert(response.data);
    } catch (error) {
      console.error('Error sending event:', error);
      alert('Failed to send notification. Check console for details.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Trigger Project Event</h2>
      <input
        type="text"
        placeholder="Enter project name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />
      <button
        onClick={handleSubmit}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Trigger Event
      </button>
    </div>
  );
};

export default TriggerEvent;
