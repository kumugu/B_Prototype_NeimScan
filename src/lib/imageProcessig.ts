export const preprocessImage = (imageData: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      // 원본 이미지 그리기
      ctx.drawImage(img, 0, 0);
      
      // 이미지 데이터 가져오기
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // 그레이스케일 변환 및 대비 향상
      for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        
        // 대비 향상 (contrast enhancement)
        const enhanced = Math.min(255, Math.max(0, (gray - 128) * 1.5 + 128));
        
        data[i] = enhanced;     // Red
        data[i + 1] = enhanced; // Green
        data[i + 2] = enhanced; // Blue
        // Alpha 채널은 그대로 유지
      }
      
      // 처리된 이미지 데이터를 캔버스에 다시 그리기
      ctx.putImageData(imageData, 0, 0);
      
      // Base64로 변환하여 반환
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    
    img.src = imageData;
  });
};