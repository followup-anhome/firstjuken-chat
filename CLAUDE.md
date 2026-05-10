# CLAUDE.md — firstjuken-chat

このリポジトリは **ファースト住建（株式会社ファースト住建）** 専用の現場チャットアプリです。
フォローアップ株式会社が開発・運用しています。

## このリポジトリについて

- 対象クライアント：ファースト住建（現場チャット用途）
- 対応言語：日本語 / Tagalog / Tiếng Việt（3言語）
- 元リポジトリ：`workplace-chat` の `first-juken` ブランチからクリーンスタート（git履歴は引き継いでいない）
- 作成日：2026-05-10

## 設定の重要事項

### モード設定（`lib/config.ts`）
- `MODE` は `"first"` 固定（デフォルト）
- 環境変数 `NEXT_PUBLIC_MODE` は通常設定不要

### Anthropic API
- モデル：`claude-haiku-4-5-20251001` を使用（undated alias は使用禁止）
- APIキー：first-juken-key（フォローアップ株式会社の専用キー）

## 5/13以降のクリーンアップ予定タスク（Y-2）

`lib/config.ts` の他モード（full/demo/school/uno/followup）設定を完全削除する。

### 理由
- このリポジトリは firstjuken-chat 専用
- 他モードの設定（BRAND/LANG_CODES/ROOMS/FEATURES/FOOTER_TEXT）は実行時に参照されない死んだコード
- 完全クリーンアップで「混乱の元を捨てる」

### 具体的作業
1. `AppMode` 型を `"first"` のみに変更
2. `BRAND`・`LANG_CODES`・`ROOMS`・`FEATURES`・`FOOTER_TEXT` から first 以外のキーを削除
3. `Record<AppMode, ...>` のジェネリック型を整理
4. `MODE` 決定ロジック自体を撤廃して `MODE = "first"` をハードコードしてもよい
5. ビルド・型チェック・本番動作確認

### 重要な制約
- **5/12のファースト住建プレゼン本番完了 + 運用安定後** に着手すること
- プレゼン直前に大きな変更を入れない（過去 2026-03-28 にAPI一括修正でバグ混入の前例あり）

## ローカル開発時の注意

### Claude Code 経由での dev 起動の落とし穴

Claude Code（Anthropic公式CLIツール）から `npm run dev` を起動すると、
`ANTHROPIC_API_KEY` 環境変数が **空文字** で子プロセスに継承されます。
これにより `.env.local` の `ANTHROPIC_API_KEY` が dotenv の標準動作で
**上書きされず無視され**、API Route で「API key not configured」エラーが発生します。

### 解決策

dev 起動時に明示的に `unset` してから npm を実行します。

Bash の場合：

```bash
unset ANTHROPIC_API_KEY && npm run dev
```

PowerShell の場合：

```powershell
$env:ANTHROPIC_API_KEY = $null
npm run dev
```

### 影響範囲

| 環境 | 影響 |
|---|---|
| Claude Code 経由のローカル dev | 発生 → 上記で解決 |
| 通常の PowerShell/cmd で dev 起動 | 影響なし |
| Vercel 本番デプロイ | 影響なし（Vercelが環境変数を直接設定） |

### 検証履歴
- 発見日：2026-05-10
- `ANTHROPIC_MODEL` は OS 環境変数になく `.env.local` から正常読込された一方、
  `ANTHROPIC_API_KEY` は Claude Code が空文字で継承させていることが診断ログで判明。
- `unset ANTHROPIC_API_KEY` を起動コマンドに含めることで `.env.local` が正常反映される。
