import React, { useRef, useState, useEffect } from 'react';
import CameraComponent from './CameraComponent';
import { Camera, Download, ArrowLeft } from 'lucide-react';

function App() {
  const cameraRef = useRef(null);
  const [hasCaptured, setHasCaptured] = useState(false);

  useEffect(() => {
    cameraRef.current.startCamera();
  }, []);

  const handleCapturePhoto = () => {
    cameraRef.current.capturePhoto();
    setHasCaptured(true);
  };

  const handleRetake = async () => {
    await cameraRef.current.retakePhoto();
    setHasCaptured(false);
  };

  const handleDownload = () => {
    cameraRef.current.downloadPhoto();
  };

  return (
    <div className="min-h-screen bg-purple-200 flex flex-col items-center p-6">
      <div className="navbar bg-green-300 rounded-lg shadow-neo mb-6 w-full border-4 border-black">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-3xl font-bold text-black">
            Magic happens here
          </a>
        </div>
      </div>

      <div className="card bg-green-300 rounded-lg shadow-neo w-full border-4 border-black mb-4">
        <div className="p-4 text-center text-xl font-bold">
          Take a picture of an UHU stick
        </div>
      </div>

      <div className="card bg-green-300 rounded-lg shadow-neo w-full border-4 border-black">
        <div className="card-body flex flex-col items-center p-0">
          <div className="relative w-full">
            <CameraComponent
              ref={cameraRef}
              containerClassName="relative w-full aspect-[9/21] bg-black rounded-lg overflow-hidden border-4 border-black shadow-neo"
              videoClassName="w-full h-full object-cover"
            />
            {hasCaptured && (
              <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            )}
          </div>

          <div className="flex gap-4 my-4">
            {hasCaptured ? (
              <>
                <button
                  onClick={handleRetake}
                  className="btn bg-red-300 border-4 border-black text-black shadow-neo flex items-center hover:bg-red-400"
                >
                  <ArrowLeft className="w-6 h-6 mr-2" />
                  Retake
                </button>
                <button
                  onClick={handleDownload}
                  className="btn bg-green-300 border-4 border-black text-black shadow-neo flex items-center hover:bg-green-400"
                >
                  <Download className="w-6 h-6 mr-2" />
                  Save Photo
                </button>
              </>
            ) : (
              <button
                onClick={handleCapturePhoto}
                className="btn bg-blue-300 border-4 border-black text-black shadow-neo flex items-center hover:bg-blue-400"
              >
                <Camera className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;