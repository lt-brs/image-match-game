import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';

const CameraComponent = forwardRef(({ containerClassName, videoClassName }, ref) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 660 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert("Error accessing camera. Please ensure you've granted camera permissions.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0);
      const imgUrl = canvas.toDataURL('image/png');
      setCapturedImage(imgUrl);
    }
  };

  const getBase64Image = () => {
    return capturedImage; // This is already in base64 format
  };

  const retakePhoto = async () => {
    setCapturedImage(null);
    await startCamera();
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  useImperativeHandle(ref, () => ({
    startCamera,
    capturePhoto,
    retakePhoto,
    getBase64Image,
  }));

  return (
    <div className={containerClassName}>
      {capturedImage ? (
        <img src={capturedImage} alt="Captured" className={videoClassName} />
      ) : (
        <video ref={videoRef} autoPlay playsInline className={videoClassName} />
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
});

export default CameraComponent;