'use client';

import { useState, useEffect } from 'react';

interface RankingItem {
  rank: number;
  username: string;
  points: number;
}

export default function RankingSection() {
  const [currentRound, setCurrentRound] = useState(1);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [rankings, setRankings] = useState<RankingItem[]>([]);

  useEffect(() => {
    // 現在の回数を取得（後でAPIから取得）
    const storedRound = localStorage.getItem('currentRound');
    if (storedRound) {
      setCurrentRound(parseInt(storedRound, 10));
    }

    // ランキングデータを取得（後でAPIから取得）
    const storedRankings = localStorage.getItem('rankings');
    if (storedRankings) {
      try {
        setRankings(JSON.parse(storedRankings));
      } catch (e) {
        setRankings([]);
      }
    }

    // 最終更新時刻を設定（毎日0時更新）
    const now = new Date();
    const updateTime = new Date(now);
    updateTime.setHours(0, 0, 0, 0);
    setLastUpdate(updateTime);
  }, []);

  const formatUpdateTime = (date: Date) => {
    return `${date.getMonth() + 1}月${date.getDate()}日 0時更新`;
  };

  return (
    <div className="rounded-2xl bg-black/70 p-6 backdrop-blur-sm shadow-2xl md:p-8">
      <h2 className="text-3xl font-bold text-white mb-2 text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        第{currentRound}回のランキング途中経過
      </h2>
      <p className="text-center text-white/80 mb-6 text-sm">
        トップ25発表（{formatUpdateTime(lastUpdate)}）
      </p>
      {rankings.length === 0 ? (
        <div className="text-center py-12 text-white/60">
          <p>ランキングデータがありません</p>
          <p className="text-sm mt-2">エントリー期間終了後、ランキングが表示されます</p>
        </div>
      ) : (
        <div className="space-y-2">
          {rankings.slice(0, 25).map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-3 hover:bg-white/15 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={`text-lg font-bold w-12 text-right ${
                  item.rank === 1 ? 'text-yellow-400' : 
                  item.rank <= 3 ? 'text-gray-300' : 'text-white'
                }`}>
                  {item.rank}位
                </span>
                <span className="text-white text-lg">{item.username}</span>
              </div>
              <span className="text-xl font-semibold text-yellow-400">
                {item.points}pt
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
