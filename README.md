# 🍽️ AIChef - AI献立作成＆買い物リスト自動生成アプリ

**「家族の笑顔を、AIが毎日サポート」**

---

## 🌐 本番環境

### **メインURL（推奨）**
**https://aichef.pages.dev**

### **最新デプロイURL**
https://f3a70841.aichef-595.pages.dev

---

## 📱 主な機能

1. **AI献立自動生成**
   - 家族構成、予算、アレルギーを考慮した献立を自動作成
   - 主菜・副菜・汁物をバランスよく組み合わせ

2. **買い物リスト自動生成**
   - 献立から必要な食材を自動集計
   - 数量を自動計算

3. **レシピデータベース**
   - 高品質レシピ：295件
   - 材料データ：286件
   - カテゴリ：主菜・副菜・汁物

4. **アレルギー対応**
   - 特定食材を自動除外
   - 安心・安全な献立提案

5. **予算管理**
   - 1人あたりの予算設定
   - 予算内で自動調整

---

## 🚀 技術スタック

| レイヤー | 技術 |
|---------|-----|
| **フロントエンド** | HTML + Tailwind CSS + Vanilla JS |
| **バックエンド** | Hono（TypeScript） |
| **ランタイム** | Cloudflare Workers |
| **データベース** | Cloudflare D1（SQLite） |
| **認証** | JWT（jose） + bcrypt/Web Crypto |
| **デプロイ** | Cloudflare Pages |
| **バージョン管理** | Git + GitHub |

---

## 🔐 セキュリティ

- **セキュリティレベル**: 90/100（本番運用可能）
- **JWT認証**: アクセストークン（7日）+ リフレッシュトークン（30日）
- **パスワードハッシュ化**: bcrypt + Web Crypto API
- **管理者認証**: DB管理（ハードコード削除済み）

---

## 📊 プロジェクト統計

| 指標 | 値 |
|-----|-----|
| **総ファイル数** | 237ファイル |
| **コード行数** | 23,661行 |
| **総コミット数** | 235コミット |
| **レシピ数** | 295件 |
| **材料数** | 286件 |

---

## 🎯 主要APIエンドポイント

### **認証API**
- `POST /api/auth/register` - 新規会員登録
- `POST /api/auth/login` - ログイン
- `POST /api/auth/admin-login` - 管理者ログイン

### **献立API**
- `POST /api/plans/generate` - 献立自動生成
- `GET /api/plans/history` - 献立履歴取得

### **レシピAPI**
- `GET /api/recipes/:recipe_id` - レシピ詳細
- `GET /api/recipes/category/:role` - カテゴリ別レシピ

### **その他**
- `GET /api/health` - ヘルスチェック
- `POST /api/households` - 家族グループ作成

---

## 👤 管理者アカウント

- **Email**: admin@aichefs.jp
- **Password**: aichef2026
- **URL**: https://aichef.pages.dev/admin

---

## 📚 ドキュメント

プロジェクト内の詳細ドキュメント：

1. **LAUNCH_REPORT.md** - ローンチ完了レポート
2. **LAUNCH_CHECKLIST.md** - ローンチチェックリスト（84/100点）
3. **FINAL_TEST_REPORT_2026-01-19.md** - 最終テスト結果
4. **GITHUB_INTEGRATION_REPORT.md** - GitHub連携レポート
5. **PHASE1_COMPLETION_REPORT.md** - Phase 1完了レポート
6. **AUDIT_FIX_REPORT_2026-01-18.md** - 監査修正レポート

---

## 🔗 リンク

- **本番環境**: https://aichef.pages.dev
- **GitHubリポジトリ**: https://github.com/gcimaster-glitch/aichef-
- **Cloudflareダッシュボード**: https://dash.cloudflare.com/

---

## 🚀 ローンチ情報

- **ローンチ日**: 2026年1月19日
- **バージョン**: 1.0.0
- **ステータス**: 🚀 本番運用中
- **総合評価**: 84/100点（ローンチ可能）

---

## 📞 サポート

技術的な問題やバグ報告は、GitHubのIssuesまでお願いします：
https://github.com/gcimaster-glitch/aichef-/issues

---

## 🎉 開発チーム

- **プロジェクトオーナー**: てつじ
- **開発担当**: AI開発アシスタント
- **GitHub**: gcimaster-glitch

---

**AIChef で、家族の毎日をもっと豊かに。** 🍽️✨

---

**Last Updated**: 2026年1月19日
