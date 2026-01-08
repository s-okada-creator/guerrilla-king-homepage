'use client';

export default function RulesSection() {
  return (
    <div className="rounded-2xl bg-black/70 p-6 backdrop-blur-sm shadow-2xl md:p-8">
      <h2 className="text-3xl font-bold text-white mb-6 text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        ルール説明
      </h2>
      <div className="space-y-4 text-white">
        <div className="bg-white/10 rounded-lg p-4">
          <h3 className="text-xl font-bold mb-3 text-yellow-400">ポイント換算</h3>
          <p className="mb-2">無料ゲリラで出た以下のアイテムが1ポイントとして換算されます：</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>星4キャラ</li>
            <li>URサポートカード</li>
            <li>UREX</li>
          </ul>
          <p className="mt-3 text-sm text-white/80">
            例：星4キャラが2体出たら2ポイント
          </p>
        </div>
        <div className="bg-white/10 rounded-lg p-4">
          <h3 className="text-xl font-bold mb-3 text-yellow-400">開催期間</h3>
          <p>各回5日間の開催期間です。</p>
        </div>
        <div className="bg-white/10 rounded-lg p-4">
          <h3 className="text-xl font-bold mb-3 text-yellow-400">エントリーについて</h3>
          <p className="text-red-300">
            エントリー期間中にエントリーされなかった場合、ポイントを記入しても「エントリーされていません」と表示されます。
          </p>
        </div>
      </div>
    </div>
  );
}

