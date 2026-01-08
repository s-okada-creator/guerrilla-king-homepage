# ゲリラ王メンバーシップ限定ホームページ

## セットアップ

1. 依存関係のインストール
```bash
npm install
```

2. 動画ファイルの配置
`video.mp4` を `public/video.mp4` に配置してください。

3. Supabaseの設定（オプション）
データベースを使用する場合は、以下の環境変数を設定してください：

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Supabaseのテーブル作成SQL:
```sql
CREATE TABLE entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_entries_created_at ON entries(created_at);
```

4. 開発サーバーの起動
```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 機能

- **背景動画**: 5秒の動画をループ再生
- **エントリー**: ゲーム内ユーザー名または自由記入でエントリー
- **ポイント記入**: 獲得したポイントを自己申告
- **エントリー済みリスト**: 全ユーザーで共有されるエントリーリスト

## 技術スタック

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (データベース)
