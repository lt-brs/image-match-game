// src/App.jsx
import React from "react";
import CameraComponent from "./CameraComponent";

function App() {
  return (
    <div className="min-h-screen bg-purple-200 flex flex-col items-center p-6">
      {/* Navbar */}
      <div className="navbar bg-green-300 rounded-lg shadow-neo mb-6 w-full max-w-4xl border-4 border-black">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-3xl font-bold text-black">
            Camera App
          </a>
        </div>
      </div>

      {/* Camera Card */}
      <div className="card bg-green-300 rounded-lg shadow-neo w-full max-w-4xl border-4 border-black">
        <div className="card-body flex flex-col items-center">
          <h2 className="card-title text-2xl font-bold text-black mb-4">
            Camera
          </h2>
          <CameraComponent />
        </div>
      </div>
    </div>
  );
}

export default App;
