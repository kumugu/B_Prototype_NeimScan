'use client';

import { useCamera } from '@/hooks/useCamera';
import { useState } from 'react';

export default function Camera() {
  const { videoRef, startCamera, stopCamera, captureImage, stream, error, isPermissionGranted } = useCamera();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleStartCamera = async () => {
    const success = await startCamera();
    if (success && videoRef.current) {
      // 스트림 설정 후 명시적으로 재생 시작
      try {
        await videoRef.current.play();
      } catch (playError) {
        console.error('Video play error:', playError);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {!isPermissionGranted ? (
        <button 
          onClick={handleStartCamera}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          카메라 시작
        </button>
      ) : (
        <button 
          onClick={stopCamera}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          카메라 정지
        </button>
      )}

      {isPermissionGranted && (
        <video 
          ref={videoRef}
          autoPlay 
          playsInline
          muted
          className="mt-4 w-full max-w-md h-auto rounded border-2 border-gray-300"
        />
      )}
    </div>
  );
}
