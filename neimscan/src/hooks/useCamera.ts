import { useState, useCallback, useRef, useEffect } from 'react';

export const useCamera = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPermissionGranted, setIsPermissionGranted] = useState<boolean>(false);

  const startCamera = useCallback(async () => {
    try {
      const constraints = {
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setIsPermissionGranted(true);
      setError(null);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '카메라 접근에 실패했습니다.';
      setError(errorMessage);
      setIsPermissionGranted(false);
      return false;
    }
  }, []);

  const stopCamera = useCallback(() => {
    stream?.getTracks().forEach(track => track.stop());
    setStream(null);
  }, [stream]);

  const captureImage = useCallback((): string | null => {
    if (!videoRef.current || !isPermissionGranted) return null;
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) return null;
    
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    // 이미지 전처리 (그레이스케일 변환)
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      data[i] = data[i + 1] = data[i + 2] = gray;
    }
    
    context.putImageData(imageData, 0, 0);
    
    return canvas.toDataURL('image/jpeg');
  }, [isPermissionGranted]);

  return {
    videoRef,
    startCamera,
    stopCamera,
    captureImage,
    stream,
    error,
    isPermissionGranted
  };
};
