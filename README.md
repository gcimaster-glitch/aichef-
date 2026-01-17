# AICHEFS - AI献立作成サービス

このプロジェクトはCloudflare PagesとGitHubで自動デプロイされています。

## 本番環境
- URL: https://aichefs.net/
- GitHub: https://github.com/gcimaster-glitch/aichef-

## 自動デプロイ
- main ブランチへのプッシュで自動デプロイ
- プルリクエストでプレビュー環境を自動生成

## 技術スタック
- Hono Framework
- Cloudflare Workers
- Cloudflare D1 (SQLite)
- TypeScript
- Tailwind CSS

## ローカル開発
```bash
npm install
npm run build
npm run dev:d1
```

## デプロイ
```bash
npm run deploy
```

