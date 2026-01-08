'use client';

import { useState, useEffect } from 'react';

interface PointEntryFormProps {
  eventPeriodDays?: number; // 開催期間（エントリー締め切り後）
  isFirstRelease?: boolean; // 初回リリースかどうか
  isTestMode?: boolean; // テストモードかどうか
}

export default function PointEntryForm({ 
  eventPeriodDays = 5,
  isFirstRelease = true,
  isTestMode = true // テストモードを有効化
}: PointEntryFormProps) {
  const [gameUsername, setGameUsername] = useState('');
  const [points, setPoints] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showEntryConfirmDialog, setShowEntryConfirmDialog] = useState(false);
  const [entryStartDate, setEntryStartDate] = useState<Date | null>(null);
  const [entryEndDate, setEntryEndDate] = useState<Date | null>(null);
  const [eventEndDate, setEventEndDate] = useState<Date | null>(null);
  const [isEntryPeriodActive, setIsEntryPeriodActive] = useState(true);
  const [isEventPeriodActive, setIsEventPeriodActive] = useState(true);
  const [entryList, setEntryList] = useState<string[]>([]);
  const [dailyEntries, setDailyEntries] = useState<Record<string, number>>({});
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const today = new Date();
    
    const storedStartDate = localStorage.getItem('entryStartDate');
    const storedEndDate = localStorage.getItem('entryEndDate');
    const storedEventEndDate = localStorage.getItem('eventEndDate');
    const storedEntryList = localStorage.getItem('entryList');
    const storedDailyEntries = localStorage.getItem('dailyEntries');
    const storedRegisteredUsername = localStorage.getItem('registeredUsername');
    
    // テストモードの場合は常に新しい期間を設定
    if (isTestMode) {
      // テスト用：今日の20時から20時10分まで（エントリー期間）
      const startDate = new Date(today);
      startDate.setHours(20, 0, 0, 0);
      const endDate = new Date(today);
      endDate.setHours(20, 10, 0, 0);
      
      // 開催期間：20時11分から20時20分まで
      const eventEnd = new Date(today);
      eventEnd.setHours(20, 20, 0, 0);
      
      setEntryStartDate(startDate);
      setEntryEndDate(endDate);
      setEventEndDate(eventEnd);
      setIsEntryPeriodActive(today >= startDate && today <= endDate);
      setIsEventPeriodActive(today <= eventEnd);
      
      localStorage.setItem('entryStartDate', startDate.toISOString());
      localStorage.setItem('entryEndDate', endDate.toISOString());
      localStorage.setItem('eventEndDate', eventEnd.toISOString());
    } else if (storedStartDate && storedEndDate && storedEventEndDate) {
      const startDate = new Date(storedStartDate);
      const endDate = new Date(storedEndDate);
      const eventEnd = new Date(storedEventEndDate);
      setEntryStartDate(startDate);
      setEntryEndDate(endDate);
      setEventEndDate(eventEnd);
      setIsEntryPeriodActive(today >= startDate && today <= endDate);
      setIsEventPeriodActive(today <= eventEnd);
    } else {
      // 初回設定
      let startDate: Date;
      let endDate: Date;
      
      if (isFirstRelease) {
        // 今回のみ特別：8日から9日23:59:59まで
        startDate = new Date('2026-01-08T00:00:00');
        endDate = new Date('2026-01-09T23:59:59');
      } else {
        // 通常：今日の0時から23:59:59まで
        startDate = new Date(today);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);
      }
      
      // 開催期間：エントリー終了日の翌日から5日間
      const eventEnd = new Date(endDate);
      eventEnd.setDate(eventEnd.getDate() + 1); // エントリー終了日の翌日
      eventEnd.setHours(0, 0, 0, 0);
      eventEnd.setDate(eventEnd.getDate() + eventPeriodDays); // 5日間追加
      eventEnd.setHours(23, 59, 59, 999);
      
      setEntryStartDate(startDate);
      setEntryEndDate(endDate);
      setEventEndDate(eventEnd);
      setIsEntryPeriodActive(today >= startDate && today <= endDate);
      setIsEventPeriodActive(today <= eventEnd);
      
      localStorage.setItem('entryStartDate', startDate.toISOString());
      localStorage.setItem('entryEndDate', endDate.toISOString());
      localStorage.setItem('eventEndDate', eventEnd.toISOString());
    }

    if (storedEntryList) {
      setEntryList(JSON.parse(storedEntryList));
    }

    if (storedDailyEntries) {
      setDailyEntries(JSON.parse(storedDailyEntries));
    }

    // 登録済みかチェック
    if (storedRegisteredUsername) {
      setIsRegistered(true);
      setGameUsername(storedRegisteredUsername);
    }
  }, [eventPeriodDays, isFirstRelease, isTestMode]);

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

  // エントリー期間中のエントリー処理
  const handleEntrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    const normalizedUsername = gameUsername.trim();
    
    // 既に登録済みの場合
    if (isRegistered) {
      setError('既にエントリー済みです。名前は変更できません。');
      return;
    }

    // 確認ダイアログを表示
    setShowEntryConfirmDialog(true);
  };

  // エントリー確認処理
  const handleEntryConfirm = async () => {
    setShowEntryConfirmDialog(false);
    setLoading(true);

    try {
      const normalizedUsername = gameUsername.trim();
      
      // APIに送信
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: normalizedUsername }),
      });

      if (!response.ok) {
        throw new Error('Failed to register entry');
      }

      // ローカルストレージにも保存（フォールバック用）
      const updatedList = [...entryList, normalizedUsername];
      setEntryList(updatedList);
      localStorage.setItem('entryList', JSON.stringify(updatedList));
      localStorage.setItem('registeredUsername', normalizedUsername);
      
      setIsRegistered(true);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // エントリーリストを再取得
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      setError('エントリーの登録に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  // エントリー期間後のポイント記入処理
  const handlePointSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    const normalizedUsername = gameUsername.trim();
    
    if (!normalizedUsername) {
      setError('ゲーム内ユーザー名を入力してください');
      return;
    }

    // エントリーリストをチェック
    const isRegisteredUser = entryList.some(
      (name) => name.trim().toLowerCase() === normalizedUsername.toLowerCase()
    );
    
    if (!isRegisteredUser) {
      setError('エントリーされていません');
      return;
    }

    // 開催期間外の場合
    if (!isEventPeriodActive) {
      setError('開催期間が終了しました');
      return;
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
    setShowEntryConfirmDialog(false);
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const formatDateTime = (date: Date) => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  };

  const formatTime = (date: Date) => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const todayEntryCount = gameUsername.trim() ? getTodayEntryCount(gameUsername.trim()) : 0;

  // エントリー期間中の表示
  if (isEntryPeriodActive) {
    return (
      <>
        <form onSubmit={handleEntrySubmit} className="space-y-4">
          {/* エントリー期間表示 */}
          {entryStartDate && entryEndDate && (
            <div className="rounded-lg bg-blue-500/20 p-3 text-sm text-blue-200 border border-blue-500/30">
              <p>
                エントリー期間: {formatTime(entryStartDate)} ～ {formatTime(entryEndDate)}
              </p>
              {isTestMode && (
                <p className="text-xs mt-1 text-yellow-300">テストモード</p>
              )}
            </div>
          )}

          {/* タイトル */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">エントリーしますか？</h2>
            <p className="text-sm text-white/60">エントリーは登録すると名前は変えられません</p>
          </div>

          {/* ゲーム内ユーザー名（任意） */}
          <div>
            <label htmlFor="game-username-entry" className="block mb-2 text-sm font-medium text-white">
              ゲーム内ユーザー名（任意）
            </label>
            <input
              id="game-username-entry"
              type="text"
              value={gameUsername}
              onChange={(e) => !isRegistered && setGameUsername(e.target.value)}
              placeholder="ゲーム内ユーザー名または自由記入"
              disabled={isRegistered}
              className="w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder-white/50 border border-white/20 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-white/60">
              ゲーム内ユーザー名または自由記入（任意）
            </p>
            {isRegistered && (
              <p className="mt-1 text-xs text-yellow-400">
                既にエントリー済みです。名前は変更できません。
              </p>
            )}
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/20 p-3 text-sm text-red-200 border border-red-500/30">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-green-500/20 p-3 text-sm text-green-200 border border-green-500/30">
              エントリーが完了しました！
            </div>
          )}

          {!isRegistered && (
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '登録中...' : 'エントリーする'}
            </button>
          )}
        </form>

        {/* エントリー確認ダイアログ */}
        {showEntryConfirmDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-black/90 rounded-2xl p-6 max-w-md w-full border border-white/20 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4">確認</h3>
              <p className="text-white mb-2">
                ゲーム内ユーザー名: <span className="font-semibold text-yellow-400">{gameUsername || '（未入力）'}</span>
              </p>
              <p className="text-red-300 text-sm mb-6">
                エントリーは登録すると名前は変えられません。本当にお間違いないですか？
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 rounded-lg bg-white/10 px-4 py-3 font-semibold text-white transition-all hover:bg-white/20"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleEntryConfirm}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-all hover:bg-blue-700"
                >
                  確認してエントリー
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // エントリー期間後のポイント記入フォーム
  return (
    <>
      <form onSubmit={handlePointSubmit} className="space-y-4">
        {/* 開催期間表示 */}
        {eventEndDate && (
          <div className="rounded-lg bg-green-500/20 p-3 text-sm text-green-200 border border-green-500/30">
            {isEventPeriodActive ? (
              <p>
                開催期間中: {formatTime(eventEndDate)}まで
              </p>
            ) : (
              <p className="text-red-300">
                開催期間は終了しました
              </p>
            )}
            {isTestMode && (
              <p className="text-xs mt-1 text-yellow-300">テストモード</p>
            )}
          </div>
        )}

        {/* ゲーム内ユーザー名 */}
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

        {/* ポイント */}
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
          disabled={loading || !isEventPeriodActive}
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
