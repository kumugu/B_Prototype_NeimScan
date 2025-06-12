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

    try {
      // 진행률 시뮬레이션
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 15, 90));
      }, 300);

      // 한글, 영어, 번체중국어 동시 인식
      const worker: Worker = await createWorker('kor+eng+chi_tra');
      
      const { data } = await worker.recognize(imageData);
      
      clearInterval(progressInterval);
      setProgress(100);

      const extractedName = extractNameWithKoreanHanja(data.text);
      
      const ocrResult: OCRResult = {
        text: data.text,
        confidence: data.confidence,
        extractedName: extractedName || undefined
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

  const extractNameWithKoreanHanja = (text: string): string | null => {
    // 한글 이름 패턴 (2-4자)
    const koreanNamePattern = /[가-힣]{2,4}/g;
    
    // 한자 이름 패턴 (2-4자)
    const hanjaNamePattern = /[\u4e00-\u9fff]{2,4}/g;
    
    const koreanNames = text.match(koreanNamePattern) || [];
    const hanjaNames = text.match(hanjaNamePattern) || [];
    
    const allNames = [...koreanNames, ...hanjaNames];
    
    if (allNames.length === 0) return null;
    
    // 일반적인 한국 성씨 (한글)
    const koreanSurnames = [
      '김', '이', '박', '최', '정', '강', '조', '윤', '장', '임',
      '한', '오', '서', '신', '권', '황', '안', '송', '전', '홍',
      '유', '고', '문', '양', '손', '배', '조', '백', '허', '노',
      '하', '곽', '성', '차', '주', '우', '구', '신', '원', '석',
      '선', '설', '마', '길', '연', '방', '위', '표', '명', '기',
      '반', '왕', '금', '옥', '육', '인', '맹', '남', '탁', '국'
    ];
    
    // 일반적인 한국 성씨 (한자 표기)
    const koreanHanjaSurnames = [
      '金', '李', '朴', '崔', '鄭', '姜', '趙', '尹', '張', '林',
      '韓', '吳', '徐', '申', '權', '黃', '安', '宋', '田', '洪',
      '劉', '高', '文', '楊', '孫', '裵', '曺', '白', '許', '盧',
      '河', '郭', '成', '車', '朱', '禹', '具', '辛', '元', '石',
      '宣', '薛', '馬', '吉', '延', '方', '魏', '表', '明', '奇',
      '潘', '王', '琴', '玉', '陸', '印', '孟', '南', '卓', '鞠',
      '陳', '魚', '殷', '片', '大', '房', '候', '廉', '秋', '皇',
      '甘', '太', '蔡', '施', '孔', '邊', '都', '蘇', '秦', '史',
      '異', '卜', '嚴', '齊', '興', '閔', '康', '桂', '편', '예',
      '채', '변', '배', '민', '류', '소', '진', '엄', '도', '공'
    ];
    
    // 성씨 우선 검증 (한글 성씨부터)
    for (const name of koreanNames) {
      const firstChar = name.charAt(0);
      if (koreanSurnames.includes(firstChar)) {
        return name;
      }
    }
    
    // 한자 성씨 검증
    for (const name of hanjaNames) {
      const firstChar = name.charAt(0);
      if (koreanHanjaSurnames.includes(firstChar)) {
        return name;
      }
    }
    
    // 성씨 매칭이 안 된 경우, 가장 적절한 길이의 이름 반환
    const validNames = allNames.filter(name => name.length >= 2 && name.length <= 4);
    if (validNames.length > 0) {
      // 3자 이름을 우선 선택 (가장 일반적인 한국 이름 길이)
      const threeCharNames = validNames.filter(name => name.length === 3);
      if (threeCharNames.length > 0) return threeCharNames[0];
      
      // 2자 이름 선택
      const twoCharNames = validNames.filter(name => name.length === 2);
      if (twoCharNames.length > 0) return twoCharNames[0];
      
      return validNames[0];
    }
    
    return allNames[0] || null;
  };

  const resetOCR = useCallback(() => {
    setIsProcessing(false);
    setProgress(0);
    setResult(null);
    setError(null);
  }, []);

  return {
    recognizeText,
    isProcessing,
    progress,
    result,
    error,
    resetOCR
  };
};
