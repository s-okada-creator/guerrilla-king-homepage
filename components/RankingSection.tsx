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

  // モックデータ（後でAPIから取得）
  const mockRankings: RankingItem[] = [
    { rank: 1, username: 'GR-A3X9K2', points: 150 },
    { rank: 1, username: 'GR-B7Y2M1', points: 150 },
    { rank: 3, username: 'GR-C4Z8N3', points: 120 },
    { rank: 4, username: 'GR-D1W5O4', points: 100 },
    { rank: 5, username: 'GR-E9V6P5', points: 90 },
    { rank: 6, username: 'GR-F2U7Q6', points: 80 },
    { rank: 7, username: 'GR-G5T8R7', points: 70 },
    { rank: 8, username: 'GR-H8S9T8', points: 60 },
    { rank: 9, username: 'GR-I1R0U9', points: 50 },
    { rank: 10, username: 'GR-J4Q1V0', points: 45 },
    { rank: 11, username: 'GR-K7P2W1', points: 40 },
    { rank: 12, username: 'GR-L0O3X2', points: 35 },
    { rank: 13, username: 'GR-M3N4Y3', points: 30 },
    { rank: 14, username: 'GR-N6M5Z4', points: 25 },
    { rank: 15, username: 'GR-O9L6A5', points: 20 },
    { rank: 16, username: 'GR-P2K7B6', points: 18 },
    { rank: 17, username: 'GR-Q5J8C7', points: 15 },
    { rank: 18, username: 'GR-R8I9D8', points: 12 },
    { rank: 19, username: 'GR-S1H0E9', points: 10 },
    { rank: 20, username: 'GR-T4G1F0', points: 8 },
    { rank: 21, username: 'GR-U7F2G1', points: 6 },
    { rank: 22, username: 'GR-V0E3H2', points: 5 },
    { rank: 23, username: 'GR-W3D4I3', points: 4 },
    { rank: 24, username: 'GR-X6C5J4', points: 3 },
    { rank: 25, username: 'GR-Y9B6K5', points: 2 },
  ];

  useEffect(() => {
    // 現在の回数を取得（後でAPIから取得）
    // ローカルストレージから取得、なければ1
    const storedRound = localStorage.getItem('currentRound');
    if (storedRound) {
      setCurrentRound(parseInt(storedRound, 10));
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
      <div className="space-y-2">
        {mockRankings.map((item, index) => (
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
    </div>
  );
}
