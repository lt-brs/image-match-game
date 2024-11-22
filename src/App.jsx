// src/App.jsx
import React, { useRef, useState } from 'react';
import CameraComponent from './CameraComponent';
import { Camera } from 'lucide-react';

function App() {
  const cameraRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleStartCamera = async () => {
    await cameraRef.current.startCamera();
    setIsStreaming(true);
  };

  const handleStopCamera = () => {
    cameraRef.current.stopCamera();
    setIsStreaming(false);
  };

  const handleCapturePhoto = () => {
    cameraRef.current.capturePhoto();
  };

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
          <CameraComponent
            ref={cameraRef}
            containerClassName="relative w-full max-w-2xl aspect-video bg-black rounded-lg overflow-hidden border-4 border-black shadow-neo"
            videoClassName="w-full h-full object-cover"
          />

          {/* Controls */}
          <div className="flex gap-4 mt-6">
            {!isStreaming ? (
              <button
                onClick={handleStartCamera}
                className="btn btn-primary bg-yellow-300 border-4 border-black text-black shadow-neo hover:bg-yellow-400"
              >
                Start Camera
              </button>
            ) : (
              <>
                <button
                  onClick={handleCapturePhoto}
                  className="btn bg-blue-300 border-4 border-black text-black shadow-neo flex items-center hover:bg-blue-400"
                >
                  <Camera className="w-6 h-6 mr-2" />
                  Take Photo
                </button>
                <button
                  onClick={handleStopCamera}
                  className="btn bg-red-300 border-4 border-black text-black shadow-neo hover:bg-red-400"
                >
                  Stop Camera
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
