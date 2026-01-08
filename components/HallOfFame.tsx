'use client';

interface HallOfFameMember {
  username: string;
  wins: number;
  totalPoints: number;
  rounds: number[];
}

export default function HallOfFame() {
  // モックデータ（後でAPIから取得）
  // 5回以上1位を取った人が殿堂入り
  const hallOfFameMembers: HallOfFameMember[] = [
    {
      username: 'GR-A3X9K2',
      wins: 6,
      totalPoints: 1130,
      rounds: [1, 6, 8, 10, 12, 15],
    },
    {
      username: 'GR-B7Y2M1',
      wins: 5,
      totalPoints: 950,
      rounds: [2, 5, 9, 11, 14],
    },
  ];

  return (
    <div className="rounded-2xl bg-gradient-to-br from-purple-900/80 via-purple-800/80 to-indigo-900/80 p-6 backdrop-blur-sm shadow-2xl md:p-8 border-2 border-purple-500/50">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 mb-2 drop-shadow-[0_2px_8px_rgba(255,215,0,0.5)]">
          殿堂入り
        </h2>
        <p className="text-white/80 text-sm">5回以上1位を獲得した伝説のプレイヤー</p>
      </div>
      <div className="space-y-4">
        {hallOfFameMembers.map((member, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-yellow-500/20 via-yellow-400/20 to-yellow-500/20 rounded-lg p-6 border-2 border-yellow-400/40 shadow-lg"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">👑</span>
                  <h3 className="text-2xl font-bold text-yellow-300">{member.username}</h3>
                </div>
                <div className="ml-11 space-y-1">
                  <p className="text-white">
                    <span className="font-semibold">優勝回数:</span> {member.wins}回
                  </p>
                  <p className="text-white">
                    <span className="font-semibold">総ポイント:</span> {member.totalPoints}pt
                  </p>
                  <p className="text-white/80 text-sm">
                    <span className="font-semibold">優勝回:</span> 第{member.rounds.join('回、第')}回
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {hallOfFameMembers.length === 0 && (
        <div className="text-center py-8 text-white/60">
          <p>殿堂入りメンバーはまだいません</p>
          <p className="text-sm mt-2">5回以上1位を獲得すると殿堂入りできます</p>
        </div>
      )}
    </div>
  );
}

