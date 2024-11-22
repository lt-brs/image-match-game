import React, { useRef, useState } from 'react';
import { Camera } from 'lucide-react';

const CameraComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);

  // Start camera stream
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsStreaming(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Error accessing camera. Please ensure you've granted camera permissions.");
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsStreaming(false);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  // Take photo and create download
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.style.display = 'none';
      
      // Draw video frame to canvas
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0);
      
      // Convert to PNG and trigger download
      const imgUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `photo-${new Date().toISOString()}.png`;
      link.href = imgUrl;
      link.click();
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-2xl mx-auto">
      {/* Camera preview */}
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        <video 
          ref={videoRef}
          autoPlay 
          playsInline
          className="w-full h-full object-cover"
        />
        
        {/* Hidden canvas for capturing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        {!isStreaming ? (
          <button 
            onClick={startCamera}
            className="btn btn-primary"
          >
            Start Camera
          </button>
        ) : (
          <>
            <button 
              onClick={capturePhoto}
              className="btn btn-primary"
            >
              <Camera className="w-6 h-6 mr-2" />
              Take Photo
            </button>
            <button 
              onClick={stopCamera}
              className="btn btn-outline"
            >
              Stop Camera
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CameraComponent;