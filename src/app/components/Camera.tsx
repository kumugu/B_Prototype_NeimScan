'use client';

import { useCamera } from '@/hooks/useCamera';
import { useOCR } from '@/hooks/useOCR';
import { useState } from 'react';
import { preprocessImage } from '@/lib/imageProcessig';

export default function Camera() {
  const { videoRef, startCamera, stopCamera, captureImage, stream, error: cameraError, isPermissionGranted } = useCamera();
  const { recognizeText, isProcessing, progress, result, error: ocrError, resetOCR } = useOCR();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const handleStartCamera = async () => {
    const success = await startCamera();
    if (!success) {
      console.error('카메라 시작 실패');
    }
  };

  const handleCapture = async () => {
    const imageData = captureImage();
    if (imageData) {
      setCapturedImage(imageData);
      resetOCR();
      
      // 이미지 전처리
      try {
        const processed = await preprocessImage(imageData);
        setProcessedImage(processed);
      } catch (err) {
        console.error('이미지 전처리 실패:', err);
        setProcessedImage(imageData); // 전처리 실패시 원본 사용
      }
    }
  };

  const handleOCR = async () => {
    if (!processedImage) return;
    
    const ocrResult = await recognizeText(processedImage);
    if (ocrResult) {
      console.log('OCR 결과:', ocrResult);
    }
  };

  const resetAll = () => {
    setCapturedImage(null);
    setProcessedImage(null);
    resetOCR();
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      {/* 에러 표시 */}
      {(cameraError || ocrError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-full max-w-md">
          <strong>오류:</strong> {cameraError || ocrError}
        </div>
      )}

      {/* 카메라 컨트롤 */}
      <div className="space-y-2">
        {!isPermissionGranted ? (
          <button 
            onClick={handleStartCamera}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded"
          >
            카메라 시작
          </button>
        ) : (
          <div className="space-x-2">
            <button 
              onClick={handleCapture}
              disabled={isProcessing}
              className="bg-green-500 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
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

      {/* 카메라 화면 */}
      {isPermissionGranted && (
        <video 
          ref={videoRef}
          autoPlay 
          playsInline
          muted
          className="w-full max-w-md h-auto rounded border-2 border-gray-300"
        />
      )}

      {/* 촬영된 이미지 */}
      {capturedImage && (
        <div className="w-full max-w-md space-y-4">
          <h3 className="text-lg font-bold text-center">촬영된 이미지</h3>
          <img 
            src={capturedImage} 
            alt="Captured" 
            className="w-full rounded border-2 border-gray-300"
          />
          
          {/* OCR 버튼 */}
          <div className="flex space-x-2">
            <button 
              onClick={handleOCR}
              disabled={isProcessing}
              className="flex-1 bg-purple-500 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
            >
              {isProcessing ? '텍스트 인식 중...' : '텍스트 인식하기'}
            </button>
            <button 
              onClick={resetAll}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              다시 촬영
            </button>
          </div>
        </div>
      )}

      {/* OCR 진행률 */}
      {isProcessing && (
        <div className="w-full max-w-md">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-blue-700">처리 중...</span>
            <span className="text-sm font-medium text-blue-700">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* OCR 결과 */}
      {result && (
        <div className="w-full max-w-md bg-gray-50 border border-gray-300 rounded p-4">
          <h3 className="text-lg font-bold mb-3">인식 결과</h3>
          
          {result.extractedName && (
            <div className="mb-3 p-3 bg-green-100 border border-green-300 rounded">
              <strong className="text-green-800">추출된 이름:</strong> 
              <span className="ml-2 text-lg font-semibold">{result.extractedName}</span>
            </div>
          )}
          
          <div className="mb-2">
            <strong>신뢰도:</strong> {Math.round(result.confidence)}%
          </div>
          
          <div>
            <strong>전체 텍스트:</strong>
            <pre className="mt-2 p-2 bg-white border rounded text-sm whitespace-pre-wrap">
              {result.text}
            </pre>
          </div>
        </div>
      )}

      {/* 전처리된 이미지 미리보기 (디버깅용) */}
      {processedImage && (
        <details className="w-full max-w-md">
          <summary className="cursor-pointer text-sm text-gray-600">전처리된 이미지 보기</summary>
          <img 
            src={processedImage} 
            alt="Processed" 
            className="w-full mt-2 rounded border border-gray-300"
          />
        </details>
      )}
    </div>
  );
}