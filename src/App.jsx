import React, { useRef, useState, useEffect } from 'react';
import CameraComponent from './CameraComponent';
import { Camera, Check, ArrowLeft } from 'lucide-react';

function App() {
  const cameraRef = useRef(null);
  const [hasCaptured, setHasCaptured] = useState(false);
  const [base64Image, setBase64Image] = useState(null);

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
    setBase64Image(null);
  };

  const handleValidate = () => {
    // Get the base64 image from the camera component
    const base64Data = cameraRef.current.getBase64Image();
    setBase64Image(base64Data);
    
    // Here you can add any additional logic to handle the base64 data
    // For example, sending it to a server or storing it locally
    console.log('Validated and saved base64 image:', base64Data.substring(0, 50) + '...');
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
                  onClick={handleValidate}
                  className="btn bg-green-300 border-4 border-black text-black shadow-neo flex items-center hover:bg-green-400"
                >
                  <Check className="w-6 h-6 mr-2" />
                  Validate
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