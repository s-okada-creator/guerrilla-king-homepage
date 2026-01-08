'use client';

import BackgroundVideo from '@/components/BackgroundVideo';
import PointEntryForm from '@/components/PointEntryForm';
import RulesSection from '@/components/RulesSection';
import RankingSection from '@/components/RankingSection';
import HistoricalWinners from '@/components/HistoricalWinners';

export default function Home() {
  return (
    <main className="relative min-h-screen w-full">
      {/* 背景動画 */}
      <BackgroundVideo />

      {/* スクロール可能なコンテンツ */}
      <div className="relative z-10">
        {/* フォームセクション */}
        <section className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            {/* タイトル */}
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-4xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] md:text-5xl">
                ゲリラ王
              </h1>
              <p className="text-xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                メンバーシップ限定
              </p>
            </div>

            {/* ポイント記入フォーム */}
            <div className="rounded-2xl bg-black/70 p-6 backdrop-blur-sm shadow-2xl md:p-8">
              <PointEntryForm 
                eventPeriodDays={5}
                isFirstRelease={true}
              />
            </div>
          </div>
        </section>

        {/* ルール説明セクション */}
        <section className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            <RulesSection />
          </div>
        </section>

        {/* ランキングセクション */}
        <section className="min-h-screen flex items-start justify-center p-4 pt-16">
          <div className="w-full max-w-4xl">
            <RankingSection />
          </div>
        </section>

        {/* 歴代ゲリラ王セクション */}
        <section className="min-h-screen flex items-start justify-center p-4 pt-16 pb-16">
          <div className="w-full max-w-4xl">
            <HistoricalWinners />
          </div>
        </section>
      </div>
    </main>
  );
}
