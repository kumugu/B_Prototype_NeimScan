'use client';

import { useState, useCallback } from 'react';
import { createWorker, type Worker } from 'tesseract.js';

interface OCRResult {
  text: string;
  confidence: number;
  extractedName?: string;
}

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
    setResult(null);

    try {
      // Tesseract.js 6.0 방식: 언어를 직접 전달
      const worker: Worker = await createWorker('kor+eng');
      
      // 진행률 시뮬레이션 (6.0에서는 logger가 제거됨)
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const { data } = await worker.recognize(imageData);
      
      clearInterval(progressInterval);
      setProgress(100);

      const extractedName = extractKoreanName(data.text);
      
      const ocrResult: OCRResult = {
        text: data.text,
        confidence: data.confidence,
        extractedName
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

  // 한국 이름 패턴 추출
  const extractKoreanName = (text: string): string | undefined => {
    // 한글 2-4자 패턴 추출
    const koreanNamePattern = /[가-힣]{2,4}/g;
    const names = text.match(koreanNamePattern);
    
    if (!names || names.length === 0) return undefined;
    
    // 일반적인 한국 성씨 우선 검출
    const commonSurnames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권', '황', '안', '송', '전', '홍'];
    
    for (const name of names) {
      const firstChar = name.charAt(0);
      if (commonSurnames.includes(firstChar) && name.length >= 2 && name.length <= 4) {
        return name;
      }
    }
    
    // 성씨 매칭이 안되면 첫 번째 2-4자 한글 반환
    return names.find(name => name.length >= 2 && name.length <= 4);
  };

  return {
    recognizeText,
    isProcessing,
    progress,
    result,
    error,
    clearResult: () => setResult(null)
  };
};