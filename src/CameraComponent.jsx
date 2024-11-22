// src/CameraComponent.jsx
import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';

const CameraComponent = forwardRef(
  ({ containerClassName, videoClassName }, ref) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);

    // Start camera stream
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Use back camera on mobile
            width: { ideal: 640 },
            height: { ideal: 360 },
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        alert(
          "Error accessing camera. Please ensure you've granted camera permissions."
        );
      }
    };

    // Stop camera stream
    const stopCamera = () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
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
    useEffect(() => {
      return () => {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      };
    }, [stream]);

    // Expose functions to parent component
    useImperativeHandle(ref, () => ({
      startCamera,
      stopCamera,
      capturePhoto,
    }));

    return (
      <div className={containerClassName}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={videoClassName}
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }
);

export default CameraComponent;
