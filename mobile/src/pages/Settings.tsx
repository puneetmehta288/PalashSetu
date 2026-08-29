import React from 'react';

const Settings: React.FC = () => {
  return (
    <div>
      <h2>Settings</h2>
      <div className="input-group">
        <label className="input-label">Teacher Name</label>
        <input className="input-field" defaultValue="Teacher" />
      </div>
      <div className="input-group">
        <label className="input-label">Backend URL</label>
        <input className="input-field" defaultValue="http://localhost:8000" />
      </div>
      <button className="btn-primary">Save Settings</button>
    </div>
  );
};

export default Settings;
