# Google Authentication Setup Guide

Googleログインを実現するには、GoogleとSupabaseの連携設定が必要です。
少し手順が多いですが、これをクリアすれば「マンションのオートロック」が完成します！

## Step 1: Google Cloud Consoleでの設定

1.  [Google Cloud Console](https://console.cloud.google.com/) にアクセスし、Googleアカウントでログインします。
2.  左上のプロジェクト選択から「新しいプロジェクト」を作成（名前は `cultivation-log` など）。
3.  **「APIとサービス」 > 「OAuth同意画面」** を開きます。
    - User Type: **外部 (External)** を選択し「作成」。
    - アプリ情報: アプリ名（Cultivation Log）、ユーザーサポートメール（自分のメール）を入力。
    - デベロッパーの連絡先: 自分のメールを入力。
    - 「保存して次へ」を押し続け、ダッシュボードに戻る。
4.  **「認証情報」 > 「認証情報を作成」 > 「OAuthクライアントID」** を選択。
    - アプリケーションの種類: **ウェブアプリケーション**
    - 名前: `Supabase Auth` など
    - **承認済みのリダイレクト URI** に以下を追加:
      - Supabase管理画面の `Authentication > URL Configuration > Site URL` (例: `https://YOUR_PROJECT_ID.supabase.co`)
      - **重要**: 正確なURLは Supabase > Auth > Providers > Google の "Callback URL" (for OAuth) に書いてあります。これをコピーして貼り付けてください。
    - 「作成」を押すと、**クライアントID** と **クライアントシークレット** が表示されます。この画面を閉じないで！

## Step 2: Supabaseでの設定

1.  Supabaseのダッシュボードに戻ります。
2.  **Authentication > Providers** から **Google** を選択し、**Enable** にします。
3.  先ほどGoogle Cloudで発行された情報を貼り付けます:
    - **Client ID**: (Google Cloudからコピー)
    - **Client Secret**: (Google Cloudからコピー)
4.  「Save」を押して保存します。

## Step 3: アプリの起動確認

これで準備完了です！
ターミナルで `npm run dev` を実行し、ブラウザで `http://localhost:5173` を開いてください。
「Continue with Google」ボタンを押して、ログインできれば成功です！
