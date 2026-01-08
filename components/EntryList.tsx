'use client';

import { useState, useEffect } from 'react';

export default function EntryList() {
  const [entryList, setEntryList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/entries');
      const data = await response.json();
      setEntryList(data.entries || []);
    } catch (error) {
      console.error('Failed to fetch entries:', error);
      // フォールバック: ローカルストレージから取得
      const storedEntryList = localStorage.getItem('entryList');
      if (storedEntryList) {
        try {
          setEntryList(JSON.parse(storedEntryList));
        } catch (e) {
          setEntryList([]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
    
    // 定期的に更新（5秒ごと）
    const interval = setInterval(() => {
      fetchEntries();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl bg-black/70 p-6 backdrop-blur-sm shadow-2xl md:p-8 mt-6">
        <p className="text-center text-white/60">読み込み中...</p>
      </div>
    );
  }

  if (entryList.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-black/70 p-6 backdrop-blur-sm shadow-2xl md:p-8 mt-6">
      <h3 className="text-xl font-bold text-white mb-4 text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        エントリー済みリスト
      </h3>
      <p className="text-center text-white/60 text-sm mb-4">
        エントリー済み: {entryList.length}名
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {entryList.map((member, index) => (
          <div
            key={index}
            className="bg-white/10 rounded-lg px-4 py-2 text-white text-center hover:bg-white/15 transition-colors"
          >
            {member || '（未入力）'}
          </div>
        ))}
      </div>
    </div>
  );
}
