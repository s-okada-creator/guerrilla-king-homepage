'use client';

export default function BackgroundVideo() {
  return (
    <div className="fixed inset-0 z-0">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover"
      >
        <source src="/video.mp4" type="video/mp4" />
        お使いのブラウザは動画再生をサポートしていません。
      </video>
      {/* オーバーレイ（視認性向上） */}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}

