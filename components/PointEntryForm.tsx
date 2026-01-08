'use client';

import { useState, useEffect } from 'react';

interface PointEntryFormProps {
  entryPeriodDays?: number;
  releaseDate?: Date;
}

export default function PointEntryForm({ 
  entryPeriodDays = 2,
  releaseDate 
}: PointEntryFormProps) {
  const [gameUsername, setGameUsername] = useState('');
  const [points, setPoints] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [entryStartDate, setEntryStartDate] = useState<Date | null>(null);
  const [entryEndDate, setEntryEndDate] = useState<Date | null>(null);
  const [isEntryPeriodActive, setIsEntryPeriodActive] = useState(true);
  const [entryList, setEntryList] = useState<string[]>([]);
  const [dailyEntries, setDailyEntries] = useState<Record<string, number>>({});

  useEffect(() => {
    // リリース日の設定（デフォルトは1月9日）
    const defaultReleaseDate = releaseDate || new Date('2026-01-09T00:00:00');
    const today = new Date();
    
    // エントリー開始日と終了日の設定
    const storedStartDate = localStorage.getItem('entryStartDate');
    const storedEndDate = localStorage.getItem('entryEndDate');
    const storedEntryList = localStorage.getItem('entryList');
    const storedDailyEntries = localStorage.getItem('dailyEntries');
    
    if (storedStartDate && storedEndDate) {
      const startDate = new Date(storedStartDate);
      const endDate = new Date(storedEndDate);
      setEntryStartDate(startDate);
      setEntryEndDate(endDate);
      setIsEntryPeriodActive(today >= startDate && today < endDate);
    } else {
      // 初回設定：リリース日から2日間
      const startDate = defaultReleaseDate;
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + entryPeriodDays);
      setEntryStartDate(startDate);
      setEntryEndDate(endDate);
      setIsEntryPeriodActive(today >= startDate && today < endDate);
      localStorage.setItem('entryStartDate', startDate.toISOString());
      localStorage.setItem('entryEndDate', endDate.toISOString());
    }

    // エントリーリストの取得
    if (storedEntryList) {
      setEntryList(JSON.parse(storedEntryList));
    }

    // 1日のエントリー回数の取得
    if (storedDailyEntries) {
      setDailyEntries(JSON.parse(storedDailyEntries));
    }
  }, [entryPeriodDays, releaseDate]);

  // 今日の日付をキーとして取得
  const getTodayKey = () => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  };

  // 1日のエントリー回数をチェック
  const checkDailyEntryLimit = (username: string): boolean => {
    const todayKey = getTodayKey();
    const userKey = `${todayKey}-${username.trim().toLowerCase()}`;
    const entryCount = dailyEntries[userKey] || 0;
    return entryCount < 3;
  };

  // 今日のエントリー回数を取得
  const getTodayEntryCount = (username: string): number => {
    const todayKey = getTodayKey();
    const userKey = `${todayKey}-${username.trim().toLowerCase()}`;
    return dailyEntries[userKey] || 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    const normalizedUsername = gameUsername.trim();
    
    if (!normalizedUsername) {
      setError('ゲーム内ユーザー名を入力してください');
      return;
    }

    // エントリー期間外の場合、エントリーリストをチェック
    if (!isEntryPeriodActive) {
      const isRegistered = entryList.some(
        (name) => name.trim().toLowerCase() === normalizedUsername.toLowerCase()
      );
      
      if (!isRegistered) {
        setError('エントリーされていません');
        return;
      }
    }

    // 1日3回制限のチェック
    if (!checkDailyEntryLimit(normalizedUsername)) {
      setError('1日のエントリー回数（3回）を超えています。明日再度お試しください。');
      return;
    }
    
    // 確認ダイアログを表示
    setShowConfirmDialog(true);
  };

  const handleConfirm = async () => {
    setShowConfirmDialog(false);
    setLoading(true);

    try {
      const normalizedUsername = gameUsername.trim();
      const todayKey = getTodayKey();
      const userKey = `${todayKey}-${normalizedUsername.toLowerCase()}`;

      // エントリー期間中の場合、エントリーリストに追加
      if (isEntryPeriodActive) {
        if (!entryList.some(name => name.trim().toLowerCase() === normalizedUsername.toLowerCase())) {
          const updatedList = [...entryList, normalizedUsername];
          setEntryList(updatedList);
          localStorage.setItem('entryList', JSON.stringify(updatedList));
        }
      }

      // 1日のエントリー回数を更新
      const updatedDailyEntries = {
        ...dailyEntries,
        [userKey]: (dailyEntries[userKey] || 0) + 1
      };
      setDailyEntries(updatedDailyEntries);
      localStorage.setItem('dailyEntries', JSON.stringify(updatedDailyEntries));

      // TODO: API実装後に接続
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      setPoints('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('ポイントの登録に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const todayEntryCount = gameUsername.trim() ? getTodayEntryCount(gameUsername.trim()) : 0;

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* エントリー期間表示 */}
        {entryStartDate && entryEndDate && (
          <div className="rounded-lg bg-blue-500/20 p-3 text-sm text-blue-200 border border-blue-500/30">
            {isEntryPeriodActive ? (
              <p>
                エントリー期間: {formatDate(entryStartDate)} ～ {formatDate(entryEndDate)}
              </p>
            ) : (
              <p className="text-red-300">
                エントリー期間は終了しました
              </p>
            )}
          </div>
        )}

        <div>
          <label htmlFor="game-username" className="block mb-2 text-sm font-medium text-white">
            ゲーム内ユーザー名
          </label>
          <input
            id="game-username"
            type="text"
            value={gameUsername}
            onChange={(e) => setGameUsername(e.target.value)}
            placeholder="ゲーム内ユーザー名を入力"
            required
            className="w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder-white/50 border border-white/20 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-white/60">
            ゲーム内で使用しているユーザー名を正確に入力してください
          </p>
          {gameUsername.trim() && todayEntryCount > 0 && (
            <p className="mt-1 text-xs text-yellow-400">
              本日のエントリー回数: {todayEntryCount}/3回
            </p>
          )}
        </div>

        <div>
          <label htmlFor="points" className="block mb-2 text-sm font-medium text-white">
            ポイント
          </label>
          <input
            id="points"
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            placeholder="0"
            min="0"
            required
            className="w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder-white/50 border border-white/20 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-white/60">
            獲得したポイントを入力してください
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/20 p-3 text-sm text-red-200 border border-red-500/30">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg bg-green-500/20 p-3 text-sm text-green-200 border border-green-500/30">
            ポイントを登録しました！
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '登録中...' : 'ポイントを記入する'}
        </button>
      </form>

      {/* 確認ダイアログ */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-black/90 rounded-2xl p-6 max-w-md w-full border border-white/20 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">確認</h3>
            <p className="text-white mb-2">
              ゲーム内ユーザー名: <span className="font-semibold text-yellow-400">{gameUsername}</span>
            </p>
            <p className="text-white mb-2">
              ポイント: <span className="font-semibold text-yellow-400">{points}pt</span>
            </p>
            <p className="text-red-300 text-sm mb-6">
              文字が違えば登録が正しくポイントを換算されませんが、本当にお名前の確認よろしいですか？
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 rounded-lg bg-white/10 px-4 py-3 font-semibold text-white transition-all hover:bg-white/20"
              >
                キャンセル
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-all hover:bg-blue-700"
              >
                確認して送信
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
