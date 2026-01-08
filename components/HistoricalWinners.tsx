'use client';

import { useState, useEffect } from 'react';

interface HistoricalWinner {
  round: number;
  winner: string;
  points: number;
  date: string;
}

export default function HistoricalWinners() {
  const [historicalWinners, setHistoricalWinners] = useState<HistoricalWinner[]>([]);

  useEffect(() => {
    // 歴代優勝者データを取得（後でAPIから取得）
    const storedWinners = localStorage.getItem('historicalWinners');
    if (storedWinners) {
      try {
        setHistoricalWinners(JSON.parse(storedWinners));
      } catch (e) {
        setHistoricalWinners([]);
      }
    }
  }, []);

  if (historicalWinners.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-black/70 p-6 backdrop-blur-sm shadow-2xl md:p-8">
      <h2 className="text-3xl font-bold text-white mb-6 text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        歴代ゲリラ王
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {historicalWinners.map((winner) => (
          <div
            key={winner.round}
            className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-lg p-4 border border-yellow-500/30 hover:border-yellow-400/50 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-yellow-400">第{winner.round}回</span>
              <span className="text-sm text-white/60">{winner.date}</span>
            </div>
            <div className="text-white">
              <p className="text-lg font-semibold mb-1">{winner.winner}</p>
              <p className="text-sm text-white/80">{winner.points}ポイント</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
