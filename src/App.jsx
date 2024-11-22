// src/App.jsx
import React from 'react';
import CameraComponent from './CameraComponent';

function App() {
  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="navbar bg-base-100 rounded-box shadow-xl mb-4">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">Camera App</a>
        </div>
      </div>
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Camera</h2>
          <CameraComponent />
        </div>
      </div>
    </div>
  );
}

export default App;