'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export const useCamera = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPermissionGranted, setIsPermissionGranted] = useState<boolean>(false);

  const startCamera = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('이 브라우저는 카메라를 지원하지 않습니다.');
      }

      // 명시적 타입 선언으로 오류 해결
      let constraints: MediaStreamConstraints = {
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      let mediaStream;
      
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (facingModeError) {
        console.warn('후면 카메라 접근 실패, 기본 카메라 시도:', facingModeError);
        // 새로운 constraints 객체 생성
        constraints = { video: true } as MediaStreamConstraints;
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      }

      setStream(mediaStream);
      setIsPermissionGranted(true);
      setError(null);
      
      return true;
    } catch (err) {
      let errorMessage = '카메라 접근에 실패했습니다.';
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage = '카메라 접근 권한이 거부되었습니다. 브라우저 설정에서 카메라 권한을 허용해주세요.';
        } else if (err.name === 'NotFoundError') {
          errorMessage = '카메라를 찾을 수 없습니다.';
        } else if (err.name === 'NotReadableError') {
          errorMessage = '카메라가 다른 애플리케이션에서 사용 중입니다.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      setIsPermissionGranted(false);
      return false;
    }
  }, []);

  // 스트림이 변경될 때 video 요소에 설정
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(playError => {
        console.error('Video play error:', playError);
        setError('비디오 재생에 실패했습니다.');
      });
    }
  }, [stream]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsPermissionGranted(false);
      setError(null);
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, [stream]);

  const captureImage = useCallback((): string | null => {
    if (!videoRef.current || !isPermissionGranted || videoRef.current.videoWidth === 0) {
      return null;
    }
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) return null;
    
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    return canvas.toDataURL('image/jpeg', 0.8);
  }, [isPermissionGranted]);

  // 컴포넌트 언마운트 시 카메라 정리
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

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
