'use client';

import { useState, useRef } from 'react';

export default function Camera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  
  // 카메라 시작
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('카메라 접근 오류:', err);
      alert('카메라 접근 권한을 허용해주세요.');
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <button 
        onClick={startCamera} 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        카메라 시작
      </button>
      <video 
        ref={videoRef}
        autoPlay 
        playsInline 
        className="mt-4 w-full max-w-md h-auto rounded"
      />
    </div>
  );
}
