'use client';

interface HistoricalWinner {
  round: number;
  winner: string;
  points: number;
  date: string;
}

export default function HistoricalWinners() {
  // モックデータ（後でAPIから取得）
  const historicalWinners: HistoricalWinner[] = [
    { round: 1, winner: 'GR-A3X9K2', points: 150, date: '2024年1月' },
    { round: 2, winner: 'GR-B7Y2M1', points: 180, date: '2024年2月' },
    { round: 3, winner: 'GR-C4Z8N3', points: 200, date: '2024年3月' },
    { round: 4, winner: 'GR-D1W5O4', points: 165, date: '2024年4月' },
    { round: 5, winner: 'GR-E9V6P5', points: 190, date: '2024年5月' },
    { round: 6, winner: 'GR-A3X9K2', points: 175, date: '2024年6月' },
    { round: 7, winner: 'GR-F2U7Q6', points: 210, date: '2024年7月' },
    { round: 8, winner: 'GR-A3X9K2', points: 195, date: '2024年8月' },
    { round: 9, winner: 'GR-G5T8R7', points: 185, date: '2024年9月' },
    { round: 10, winner: 'GR-A3X9K2', points: 220, date: '2024年10月' },
  ];

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

