import React, { useRef, useState, useEffect } from 'react';
import CameraComponent from './CameraComponent';
import { Camera, Check, ArrowLeft, Loader } from 'lucide-react';
import { initializeCLIPModel, classifyImage } from './CLIP.mjs';


function getBestClass(results) {
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error('Results must be a non-empty array');
  }
  
  // Initialize bestResult with the first element
  let bestResult = results[0];

  // Iterate through the results to find the one with the highest score
  for (let i = 1; i < results.length; i++) {
    if (results[i].score > bestResult.score) {
      bestResult = results[i];
    }
  }

  // Return the label of the best result
  return bestResult.label;
}



// Placeholder for model processing - replace with actual model
const mockModelProcess = async (base64Image) => {
  try {
    // Initialize the model
    const model = await initializeCLIPModel();

    // Classify the image
    const result = await classifyImage(model, base64Image, ["a photo of a person", "a photo of a bird", "a photo of a vegetable", "a photo of an iphone"]);
    console.log(result);

    console.log(getBestClass(result));

    // Simulate processing delay and success rate
    return getBestClass(result);
  } catch (error) {
    console.error('Error in mockModelProcess:', error);
    throw error;
  }
};


function App() {
  const cameraRef = useRef(null);
  const [hasCaptured, setHasCaptured] = useState(false);
  const [base64Image, setBase64Image] = useState(null);
  const [processingState, setProcessingState] = useState('idle'); // idle, processing, success, failure

  useEffect(() => {
    cameraRef.current.startCamera();
  }, []);

  const handleCapturePhoto = () => {
    cameraRef.current.capturePhoto();
    setHasCaptured(true);
    setProcessingState('idle');
  };

  const handleRetake = async () => {
    await cameraRef.current.retakePhoto();
    setHasCaptured(false);
    setBase64Image(null);
    setProcessingState('idle');
  };

  const handleValidate = async () => {
    const base64Data = cameraRef.current.getBase64Image();
    setBase64Image(base64Data);
    setProcessingState('processing');
    
    try {
      const result = await mockModelProcess(base64Data);
      setProcessingState(result ? 'success' : 'failure');
    } catch (error) {
      console.error('Model processing error:', error);
      setProcessingState('failure');
    }
  };

  const renderOverlay = () => {
    switch (processingState) {
      case 'processing':
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="flex flex-col items-center gap-4">
              <Loader className="w-12 h-12 text-white animate-spin" />
              <p className="text-white text-xl font-bold">Processing...</p>
            </div>
          </div>
        );
      case 'success':
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-green-500/80">
            <div className="flex flex-col items-center gap-4">
              <Check className="w-16 h-16 text-white" />
              <p className="text-white text-xl font-bold">Success!</p>
            </div>
          </div>
        );
      case 'failure':
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-red-500/80">
            <div className="flex flex-col items-center gap-4">
              <X className="w-16 h-16 text-white" />
              <p className="text-white text-xl font-bold">Failed!</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-purple-200 flex flex-col items-center p-6">
      <div className="navbar bg-green-300 rounded-lg shadow-neo mb-6 w-full border-4 border-black">
        <div className="flex-1 text-center">
          <a className="btn btn-ghost normal-case text-3xl font-bold text-black font-space font-bold" style={{ fontWeight: 700 }}>
            Magic happens here
          </a>
        </div>
      </div>

      <div className="card bg-green-300 rounded-lg shadow-neo w-full border-4 border-black mb-4">
        <div className="p-4 text-center text-xl font-inter">
          A tired developer trying to make a camera app
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
            {renderOverlay()}
          </div>

          <div className="flex gap-4 my-4">
            {hasCaptured ? (
              <>
                <button
                  onClick={handleRetake}
                  className="btn bg-red-300 border-4 border-black text-black shadow-neo flex items-center hover:bg-red-400"
                  disabled={processingState === 'processing'}
                >
                  <ArrowLeft className="w-6 h-6 mr-2" />
                  Retake
                </button>
                {processingState === 'idle' && (
                  <button
                    onClick={handleValidate}
                    className="btn bg-green-300 border-4 border-black text-black shadow-neo flex items-center hover:bg-green-400"
                  >
                    <Check className="w-6 h-6 mr-2" />
                    Validate
                  </button>
                )}
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