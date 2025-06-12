'use client';

import Camera from './components/Camera';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">축의금 기록 도우미</h1>
        <p className="text-center mb-4">카메라로 봉투를 촬영하여 축의금을 관리하세요.</p>
        
        <div className="flex flex-col items-center justify-center mt-8">
          <Camera />
          
          <div className="mt-8 text-center text-gray-500">
            <p>카메라 버튼을 눌러 축의금 봉투를 촬영하세요.</p>
            <p>OCR 기능으로 이름을 자동으로 인식합니다.</p>
          </div>
        </div>
      </div>
    </main>
  );
}