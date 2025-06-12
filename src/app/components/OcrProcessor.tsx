'use client';

import { useState } from 'react';
import { createWorker } from 'tesseract.js';

export default function OcrProcessor({ imageData }: { imageData: string }) {
  const [result, setResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const processImage = async () => {
    if (!imageData) return;
    
    setIsProcessing(true);
    
    try {
      // Tesseract.js 6.0 버전 호환 코드
      const worker = await createWorker('kor+eng');
      const { data } = await worker.recognize(imageData);
      setResult(data.text);
      await worker.terminate();
    } catch (error) {
      console.error('OCR 오류:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mt-4 w-full max-w-md">
      <button 
        onClick={processImage} 
        disabled={isProcessing}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
      >
        {isProcessing ? '처리 중...' : '텍스트 인식하기'}
      </button>
      
      {result && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="font-bold">인식된 텍스트:</h3>
          <p className="mt-2">{result}</p>
        </div>
      )}
    </div>
  );
}
