import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// エントリーリストを取得
export async function GET() {
  try {
    // Supabaseが設定されていない場合は、空配列を返す
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ entries: [] });
    }

    const { data, error } = await supabase
      .from('entries')
      .select('username')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ entries: [] }, { status: 200 });
    }

    const entries = data?.map(item => item.username) || [];
    return NextResponse.json({ entries });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ entries: [] }, { status: 200 });
  }
}

// エントリーを追加
export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Supabaseが設定されていない場合は、成功を返す（ローカルストレージにフォールバック）
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ success: true });
    }

    const { error } = await supabase
      .from('entries')
      .insert([{ username: username.trim() }]);

    if (error) {
      // 重複エラーは無視（既にエントリー済み）
      if (error.code === '23505') {
        return NextResponse.json({ success: true });
      }
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to add entry' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

