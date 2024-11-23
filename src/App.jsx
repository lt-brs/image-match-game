import React, { useRef, useState, useEffect } from 'react';
import CameraComponent from './CameraComponent';
import { Camera, Check, ArrowLeft, Loader, X, Trophy, Users, ArrowLeftCircle, IterationCw } from 'lucide-react';
import { initializeCLIPModel, classifyImage } from './CLIP.mjs';

import image1 from './pics/image1.png';
import image2 from './pics/image2.png';
import image3 from './pics/image3.png';
import image4 from './pics/image4.png';


const input_prompt = "Take a photo of a human";


function  generateSmartContrasts(originalPrompt,  numContrasts  =  3)  {
  //  Simple  word  splitting  and  analysis
  const  words  =  originalPrompt.toLowerCase().split(' ');

  //  Try  to  identify  key  objects  and  actions
  const  contrasts  =  [];

  //  If  prompt  contains  "a"  or  "an",  it's  likely  describing  an  object
  if  (words.includes('a')  ||  words.includes('an'))  {
       contrasts.push(`not ${originalPrompt}`);
       contrasts.push(`a different kind of ${words[words.length-1]}`);
       contrasts.push(`something completely different than ${words[words.length-1]}`);
   }

  //  If  prompt  contains  action  words  (ing)
  if  (originalPrompt.includes('ing'))  {
       contrasts.push(`${originalPrompt.replace('ing',  'ing  not')}`);
       contrasts.push(`a static scene without action`);
   }

  //  If  prompt  mentions  a  place
  const  places  =  ['park',  'house',  'beach',  'room',  'street'];
  const  foundPlace  =  words.find(word  =>  places.includes(word));
  if  (foundPlace)  {
       contrasts.push(`the same but not in a ${foundPlace}`);
       contrasts.push(`an empty ${foundPlace}`);
   }

  //  Take  only  requested  number  of  contrasts
   contrasts.splice(numContrasts);

  //  Return  original  +  contrasts
  return [originalPrompt,  ...contrasts];
}



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
    
    const prompts = generateSmartContrasts(formattedPrompt);
    //console.log(prompts)

    const result = await classifyImage(model, base64Image,
      //prompts
     
      [
        formattedPrompt,
        "a photo of an animal",
        "a photo of foood",
        "a photo of a chair",
        "a photo of a vegetable",
      ]
      
    );

    //const result = await checkImageWithSmartContrasts(base64Image,  input_prompt)
    
    const bestClass = getBestClass(result);
    console.log(result)
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
  const [showSocialPage, setShowSocialPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [streakCount, setStreakCount] = useState(0);

  // Updated friendsData with dynamic user photo
  const getFriendsData = () => {
    const baseData = [
      { id: 1, name: "Sarah", streak: 15, timestamp: "2 hours ago", image: image1 },
      { id: 2, name: "Mike", streak: 8, timestamp: "4 hours ago", image: image2 },
      { id: 3, name: "Emma", streak: 12, timestamp: "5 hours ago", image: image3 },
      { id: 4, name: "John", streak: 20, timestamp: "6 hours ago", image: image4 }
    ];

    // Add user's photo if available
    if (base64Image) {
      const userPhoto = {
        id: 0,
        name: "You",
        streak: streakCount,
        timestamp: "Just now",
        image: base64Image
      };
      return [...baseData, userPhoto];
    }

    return baseData;
  };

  // Sort friends by streak count
  const getSortedFriends = () => {
    return getFriendsData().sort((a, b) => b.streak - a.streak);
  };

  const StreakCounter = ({ count }) => (
    <div className="w-full max-w-md bg-orange-300 rounded-lg border-4 border-black p-3 shadow-neo mb-4 flex items-center justify-center gap-2  bg-pale-yellow card">
      <Trophy className="w-6 h-6 text-black" />
      <span className="text-xl font-bold">{count} Streak</span>
    </div>
  );

  useEffect(() => {
    const initCamera = async () => {
      setIsLoading(true);
      try {
        await cameraRef.current?.startCamera();
      } catch (error) {
        console.error('Failed to initialize camera:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!showSuccessPage && !showSocialPage) {
      initCamera();
    }

    return () => {
      if (cameraRef.current) {
        cameraRef.current.cleanup?.();
      }
    };
  }, [showSuccessPage, showSocialPage]);

  const handleCapturePhoto = () => {
    cameraRef.current.capturePhoto();
    setHasCaptured(true);
    setProcessingState('idle');
  };

  const handleRetake = async () => {
    setIsLoading(true);
    try {
      await cameraRef.current.retakePhoto();
      setHasCaptured(false);
      setBase64Image(null);
      setProcessingState('idle');
      setShowSuccessPage(false);
      setShowSocialPage(false);
    } catch (error) {
      console.error('Error retaking photo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    setShowSocialPage(true);
  };

  const handleBack = () => {
    setShowSocialPage(false);
  };

  const handleHome = async () => {
    setShowSuccessPage(false);
    setShowSocialPage(false);
    setHasCaptured(false);
    setBase64Image(null);
    setProcessingState('idle');
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      await cameraRef.current?.startCamera();
    } catch (error) {
      console.error('Failed to initialize camera:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidate = async () => {
    const base64Data = cameraRef.current.getBase64Image();
    setBase64Image(base64Data);
    setProcessingState('processing');
    
    try {
      const { success } = await mockModelProcess(base64Data);
      if (success) {
        setProcessingState('success');
        setStreakCount(prevCount => prevCount + 1);
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

  const renderOverlay = () => {
    if (isLoading) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="flex flex-col items-center gap-4">
            <Loader className="w-12 h-12 text-white animate-spin" />
            <p className="text-white text-xl font-bold">Starting camera...</p>
          </div>
        </div>
      );
    }

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
              <div className="pyro">
                <div className="before"></div>
                <div className="after"></div>
              </div>
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

  if (showSocialPage) {
    return (
      <div className="min-h-screen bg-pale-violet flex flex-col items-center p-4">
        <div className="w-full max-w-md flex flex-col items-center gap-4">
          <div className="w-full flex items-center justify-center mb-4">
            <h2 className="text-2xl font-bold">Friends' Photos</h2>
          </div>

          <div className="w-full bg-white border-4 border-black rounded-lg p-4 mb-4">
            <h3 className="text-xl font-bold mb-2">Today's Prompt:</h3>
            <p className="text-lg">{input_prompt}</p>
          </div>

          <div className="w-full flex flex-col gap-4 overflow-y-auto max-h-[60vh] p-2">
            {getSortedFriends().map(friend => (
              <div key={friend.id} className="bg-green-300 border-4 border-black rounded-lg p-4 shadow-neo">
                <div className="ribbon">
                  <span>SO COOL</span>
                </div>
                <div className="flex flex-col">
                  <div className="w-full mb-3">
                    <img
                      src={friend.image}
                      alt={`${friend.name}'s photo`}
                      className="w-full h-48 object-cover rounded-lg border-2 border-black"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{friend.name}</span>
                      <span className="text-sm text-gray-600">• {friend.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      <span className="font-bold text-lg">{friend.streak}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="h-96"></div>
          <div className="h-96"></div>
          <div className="h-96"></div>
          <div className="h-96"></div>


    <div style={{position: "fixed", bottom: "0", width: "100%", display: "flex", justifyContent: "center"}} className='bg-orange p-4'>
        <button
          onClick={handleHome}
          className="btn bg-blue-300 border-4 border-black text-black shadow-neo w-full py-3 mt-4 text-lg font-bold hover:bg-blue-400 badge m-4"
          style={{maxWidth: "70vw", bottom: "4vh",}}
        >
          Back to Home
        </button>
  </div>
        

       
        </div>
      </div>
    );
  }
  
  if (showSuccessPage) {
    return (
      <div className="min-h-screen bg-pale-violet flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md flex flex-col items-center gap-4">
          <StreakCounter count={streakCount} />
          <div className="bg-green-300 p-8 border-4 border-black w-full rounded-lg card">
            <div className="flex flex-col items-center gap-8">
              <h1 className="text-3xl font-bold text-center">
                🔥 Keep it up 🔥
              </h1>
              
              <img src={base64Image} className="mb-4">
              </img>
              
              <div className="flex justify-between w-full gap-4">
                <button
                  onClick={handleHome}
                  className="btn bg-orange-300  text-black  flex-1  font-bold hover:bg-orange-399"
                >
                  EXIT
                </button>
                <button
                  onClick={handleShare}
                  className="btn bg-blue-300 border-4 border-black text-black shadow-neo flex-1 py-3 text-lg font-bold hover:bg-blue-400 badge"
                >
                  Share & See
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="pyro">
          <div className="before"></div>
          <div className="after"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-sky-blue min-h-screen flex flex-col items-center p-4 md:p-6">
      <div className="w-full max-w-md flex flex-col items-center gap-4">
        <div 
          className="card bg-pale-red w-full border-4 border-black" 
          style={{ transform: 'skewY(-2.5deg)' }}
        >
          <h1 className="title p-3 md:p-4 text-center text-4xl font-bold">
            SpotOn
          </h1>
        </div>

        <div 
          className="marquee bg-pale-yellow w-full p-2" 
          style={{ transform: 'skewX(7deg)', marginTop: "1rem" }}
        >
          <div className="marquee-content">
            <span>{input_prompt}</span>
            <span>{input_prompt}</span>
            <span>{input_prompt}</span>
            <span>{input_prompt}</span>
            <span>{input_prompt}</span>
          </div>
        </div>

        <div className="card bg-green-300 rounded-lg shadow-neo w-full border-4 border-black">
          <div className="card-body flex flex-col items-center p-0">
            <div className="relative w-full">
              <CameraComponent
                ref={cameraRef}
                containerClassName="relative w-full h-[55vh] md:h-[70vh] bg-black overflow-hidden border-4 border-black"
                videoClassName="w-full h-full object-contain"
              />
              {renderOverlay()}
            </div>

            <div className="flex gap-4 my-4">
              {hasCaptured ? (
                <>
                  {(processingState === 'idle' || processingState === 'failure') && (
                    <button
                      onClick={handleRetake}
                      className="btn bg-pale-violet border-4 border-black text-black shadow-neo flex items-center hover:bg-red-400"
                    >
                      <IterationCw className="w-6 h-3 m-8" />
                      
                    </button>
                  )}
                  {processingState === 'idle' && (
                    <button
                      onClick={handleValidate}
                      className="btn bg-soft-blue border-4 border-black text-black shadow-neo flex items-center hover:bg-green-400 badge"
                    >
                      <Check className="w-6 h-6 m-" />
                      Validate
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={handleCapturePhoto}
                  disabled={isLoading}
                  className={`badge bg-orange text-white items-center ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-400'
                  }`}
                >
                  <Camera className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;