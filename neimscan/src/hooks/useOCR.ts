import { useState, useCallback } from 'react';
import { createWorker, type Worker } from 'tesseract.js';
import { OCRResult } from '@/types';

export const useOCR = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<OCRResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recognizeText = useCallback(async (imageData: string): Promise<OCRResult | null> => {
    if (!imageData) return null;

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      // 가장 간단한 v6 방식
      const worker: Worker = await createWorker('kor+eng');
      
      // 진행률 추적을 위한 간단한 타이머
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const { data } = await worker.recognize(imageData);
      
      clearInterval(progressInterval);
      setProgress(100);

      const ocrResult: OCRResult = {
        text: extractName(data.text) || data.text,
        confidence: data.confidence
      };

      setResult(ocrResult);
      await worker.terminate();
      setIsProcessing(false);

      return ocrResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'OCR 처리 중 오류가 발생했습니다.';
      setError(errorMessage);
      setIsProcessing(false);
      return null;
    }
  }, []);

  const extractName = (text: string): string | null => {
    const koreanNamePattern = /[가-힣]{2,4}/g;
    const names = text.match(koreanNamePattern);

    if (!names || names.length === 0) return null;

    const commonSurnames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임'];

    for (const name of names) {
      const firstChar = name.charAt(0);
      if (commonSurnames.includes(firstChar)) {
        return name;
      }
    }

    return names[0];
  };

  return {
    recognizeText,
    isProcessing,
    progress,
    result,
    error
  };
};