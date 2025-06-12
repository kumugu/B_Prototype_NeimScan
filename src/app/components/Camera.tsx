'use client';

import { useCamera } from '@/hooks/useCamera';
import { useState } from 'react';

export default function Camera() {
  const { videoRef, startCamera, stopCamera, captureImage, stream, error, isPermissionGranted } = useCamera();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleStartCamera = async () => {
    const success = await startCamera();
    if (!success) {
      console.error('카메라 시작 실패');
    }
  };

  const handleCapture = () => {
    const imageData = captureImage();
    if (imageData) {
      setCapturedImage(imageData);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-md">
          <strong>오류:</strong> {error}
        </div>
      )}
      
      <div className="space-y-4">
        {!isPermissionGranted ? (
          <button 
            onClick={handleStartCamera}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded"
          >
            카메라 시작
          </button>
        ) : (
          <div className="space-x-4">
            <button 
              onClick={handleCapture}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              사진 촬영
            </button>
            <button 
              onClick={stopCamera}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              카메라 정지
            </button>
          </div>
        )}
      </div>

      {isPermissionGranted && (
        <video 
          ref={videoRef}
          autoPlay 
          playsInline
          muted
          className="mt-4 w-full max-w-md h-auto rounded border-2 border-gray-300"
        />
      )}

      {capturedImage && (
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">촬영된 이미지:</h3>
          <img 
            src={capturedImage} 
            alt="Captured" 
            className="w-full max-w-md rounded border-2 border-gray-300"
          />
        </div>
      )}
    </div>
  );
}
