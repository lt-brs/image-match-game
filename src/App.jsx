import React, { useRef, useState, useEffect } from 'react';
import CameraComponent from './CameraComponent';
import { Camera, Check, ArrowLeft, Loader, X } from 'lucide-react';
import { initializeCLIPModel, classifyImage } from './CLIP.mjs';

const input_prompt = "Take a photo of a human"; // Configurable prompt

function formatPromptForCLIP(prompt) {
  const cleanedPrompt = prompt
    .toLowerCase()
    .replace(/^take\s+/, '')
    .trim();
  
  return cleanedPrompt.startsWith('a photo of') 
    ? cleanedPrompt 
    : `a photo of ${cleanedPrompt}`;
}

function getBestClass(results) {
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error('Results must be a non-empty array');
  }
  
  let bestResult = results[0];
  
  for (let i = 1; i < results.length; i++) {
    if (results[i].score > bestResult.score) {
      bestResult = results[i];
    }
  }
  
  return bestResult.label;
}

const mockModelProcess = async (base64Image) => {
  try {
    const model = await initializeCLIPModel();
    const formattedPrompt = formatPromptForCLIP(input_prompt);
    const result = await classifyImage(model, base64Image,
      [
      formattedPrompt,
      "a photo of a bird",
      "a photo of a plane",
      "a photo of a human"
    ]);
    
    const bestClass = getBestClass(result);
    console.log(result)
    // Compare with formatted prompt
    return {
      success: bestClass === formattedPrompt,
      bestClass
    };
  } catch (error) {
    console.error('Error in mockModelProcess:', error);
    throw error;
  }
};

function App() {
  const cameraRef = useRef(null);
  const [hasCaptured, setHasCaptured] = useState(false);
  const [base64Image, setBase64Image] = useState(null);
  const [processingState, setProcessingState] = useState('idle');
  const [showSuccessPage, setShowSuccessPage] = useState(false);

  useEffect(() => {
    cameraRef.current?.startCamera();
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
    setShowSuccessPage(false);
  };

  const handleValidate = async () => {
    const base64Data = cameraRef.current.getBase64Image();
    setBase64Image(base64Data);
    setProcessingState('processing');
    
    try {
      const { success } = await mockModelProcess(base64Data);
      if (success) {
        setProcessingState('success');
        // Show success page after a brief delay
        setTimeout(() => {
          setShowSuccessPage(true);
        }, 1500);
      } else {
        setProcessingState('failure');
      }
    } catch (error) {
      console.error('Model processing error:', error);
      setProcessingState('failure');
    }
  };

  if (showSuccessPage) {
    return (
      <div className="min-h-screen bg-purple-200 flex flex-col items-center justify-center p-4">
        <div className="bg-green-300 rounded-lg shadow-neo p-8 border-4 border-black max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-4">🎉 Congratulations! 🎉</h1>
        </div>
      </div>
    );
  }

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
              <p className="text-white text-lg">Redirecting to success page...</p>
            </div>
          </div>
        );
      case 'failure':
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-red-500/80">
            <div className="flex flex-col items-center gap-4">
              <X className="w-16 h-16 text-white" />
              <p className="text-white text-xl font-bold">Not quite right!</p>
              <p className="text-white text-lg">Please try taking another photo</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-purple-200 flex flex-col items-center p-4 md:p-6">
      <div className="navbar bg-green-300 rounded-lg shadow-neo mb-4 w-full border-4 border-black">
        <div className="flex-1 text-center">
          <a className="btn btn-ghost normal-case text-xl md:text-3xl font-bold text-black font-space">
            Magic happens here
          </a>
        </div>
      </div>

      <div className="card bg-green-300 rounded-lg shadow-neo w-full border-4 border-black mb-4">
        <div className="p-3 md:p-4 text-center text-lg md:text-xl font-inter">
          {input_prompt}
        </div>
      </div>

      <div className="card bg-green-300 rounded-lg shadow-neo w-full border-4 border-black">
        <div className="card-body flex flex-col items-center p-0">
          <div className="relative w-full">
            <CameraComponent
              ref={cameraRef}
              containerClassName="relative w-full h-[60vh] md:h-[70vh] bg-black rounded-lg overflow-hidden border-4 border-black shadow-neo"
              videoClassName="w-full h-full object-contain"
            />
            {renderOverlay()}
          </div>

          <div className="flex gap-4 my-4">
            {hasCaptured ? (
              <>
                {/* Show retake button in idle or failure states */}
                {(processingState === 'idle' || processingState === 'failure') && (
                  <button
                    onClick={handleRetake}
                    className="btn bg-red-300 border-4 border-black text-black shadow-neo flex items-center hover:bg-red-400"
                  >
                    <ArrowLeft className="w-6 h-6 mr-2" />
                    Retake
                  </button>
                )}
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