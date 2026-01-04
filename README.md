# Aメニュー - 献立メーカー

**考えなくていい、悩まなくていい。今日から1ヶ月分の晩ごはんが決まります。**

## 概要

Aメニューは、主婦向けの晩御飯メニュー自動生成システムです。
AIチャット形式で質問に答えるだけで、家族構成・予算・調理時間・好みに合わせた
1ヶ月分の献立が完成します。

### コンセプト

- **Googleエンジニア** × **調理のプロ** × **書類コンサルタント** の知見を統合
- 低予算ほど食材を使い回し、無駄を減らす設計
- 主婦の「考える負担」を軽減する

## 主な機能

### ✅ 完成している機能

1. **AIチャット形式の質問入力**
   - 家族構成、人数
   - 予算（300〜1500円/人）
   - 調理時間（15〜60分）
   - アレルギー、苦手な食材

2. **1ヶ月分の献立自動生成**
   - 主菜・副菜・汁物の3品セット
   - 家族人数に合わせた分量調整
   - **100種類以上のレシピから自動選択**
     - 主菜: 60品（鶏唐揚げ、豚カツ、鮭塩焼き、麻婆豆腐、カレー、すき焼きなど）
     - 副菜: 40品（ポテサラ、きんぴら、おひたし、温野菜など）
     - 汁物: 30品（味噌汁、豚汁、中華スープ、コーンスープなど）

3. **献立カレンダー表示（改善版）**
   - グリッド表示で見やすいレイアウト
   - 日付ごとのカード表示
   - 曜日表示
   - 推定調理時間の表示
   - ホバーエフェクトで選択しやすく

4. **印刷機能（NEW!）** ✨
   - A4サイズで印刷可能
   - 10日分を1ページに収録
   - 1ヶ月分（30日）を3ページで出力
   - 印刷専用CSS最適化
   - 印刷ボタンをワンクリックで実行

5. **データベース（Cloudflare D1）**
   - レシピマスタ（110件）
   - 家族プロファイル
   - 献立計画

### 🚧 今後の実装予定

- 買い物リスト生成（週ごと）
- 献立の差し替え機能
- レシピ詳細表示
- 食材使い回し最適化ロジック
- 季節・魚頻度の考慮
- 500レシピへの拡充

## 技術スタック

### フロントエンド
- **HTML/CSS/JavaScript** (Vanilla)
- **Tailwind CSS** (CDN)
- **Axios** (HTTP Client)
- **Font Awesome** (Icons)

### バックエンド
- **Hono** (軽量Webフレームワーク)
- **Cloudflare Workers/Pages** (エッジランタイム)
- **Cloudflare D1** (SQLiteベースDB)
- **TypeScript**

### 開発環境
- **Wrangler** (Cloudflare CLI)
- **Vite** (ビルドツール)
- **PM2** (プロセス管理)

## ローカル開発

### 前提条件

- Node.js 18以上
- npm
- Wrangler CLI

### セットアップ

\`\`\`bash
# 依存関係インストール
npm install

# ローカルD1データベース初期化
npm run db:migrate:local

# サンプルデータ投入
wrangler d1 execute webapp-production --local --file=seed.sql
wrangler d1 execute webapp-production --local --file=migrations/0003_minimal_recipes.sql

# ビルド
npm run build

# 開発サーバー起動
pm2 start ecosystem.config.cjs

# または直接起動
npx wrangler pages dev dist --d1=webapp-production --local --ip 0.0.0.0 --port 3000
\`\`\`

### アクセス

- **ローカル**: http://localhost:3000
- **APIヘルスチェック**: http://localhost:3000/api/health

## プロジェクト構成

\`\`\`
webapp/
├── src/
│   └── index.tsx           # Hono APIエンドポイント
├── public/
│   └── index.html          # フロントエンド（SPA）
├── migrations/
│   ├── 0001_initial_schema.sql    # DBスキーマ
│   ├── 0002_sample_recipes.sql    # サンプルレシピ（未使用）
│   └── 0003_minimal_recipes.sql   # 最小限レシピ（3品）
├── seed.sql                # 基本マスタデータ
├── ecosystem.config.cjs    # PM2設定
├── wrangler.jsonc          # Cloudflare設定
├── vite.config.ts          # Viteビルド設定
└── package.json
\`\`\`

## API仕様

### エンドポイント

#### `GET /api/health`
ヘルスチェック

#### `POST /api/households`
家族プロファイル作成
\`\`\`json
{
  "title": "岩間家",
  "members_count": 4,
  "members": [{"gender": "male", "age_band": "adult"}],
  "start_date": "2026-01-05",
  "months": 1,
  "budget_tier_per_person": 500,
  "budget_distribution": "average",
  "cooking_time_limit_min": 30,
  "shopping_frequency": "weekly",
  "fish_frequency": "normal",
  "dislikes": [],
  "allergies": {"standard": [], "free_text": []}
}
\`\`\`

#### `GET /api/households/{householdId}`
家族プロファイル取得

#### `POST /api/plans/generate`
献立生成
\`\`\`json
{
  "household_id": "uuid"
}
\`\`\`

#### `GET /api/plans/{planId}`
献立取得

## データベース設計

### 主要テーブル

- **recipes**: レシピマスタ（主菜/副菜/汁物）
- **ingredients**: 食材マスタ
- **households**: 家族プロファイル
- **meal_plans**: 献立計画
- **meal_plan_days**: 日別献立
- **shopping_lists**: 買い物リスト（未実装）

詳細は `migrations/0001_initial_schema.sql` を参照

## 推奨される次のステップ

1. **買い物リスト生成機能の実装**
   - 週ごとの集計
   - 食材カテゴリ別表示

2. **献立差し替え機能**
   - 理由選択（時間がない/食材がない/気分）
   - 週の連動を維持

3. **レシピの拡充**
   - 現在3品 → 50品 → 500品

4. **食材使い回し最適化ロジック**
   - 低予算時の reuse_keys 重み調整
   - 週内の食材連動強化

5. **季節・魚頻度の考慮**
   - 旬の食材優先
   - 週内の魚料理回数制御

## デプロイ

### Cloudflare Pages デプロイ（完了済み）

✅ **プロジェクト名**: aichef
✅ **本番URL**: https://aichef-595.pages.dev
✅ **D1データベース**: aichef-production (ID: 633e7128-1cf4-4607-8d22-60b0251a00f2)

```bash
# ビルド
npm run build

# デプロイ
npx wrangler pages deploy dist --project-name aichef --branch main
```

### D1データベース管理

```bash
# 本番DBにスキーマ適用
npx wrangler d1 execute aichef-production --remote --file=migrations/0001_initial_schema.sql

# 本番DBにデータ投入
npx wrangler d1 execute aichef-production --remote --file=seed.sql
npx wrangler d1 execute aichef-production --remote --file=migrations/0003_minimal_recipes.sql

# 本番DBクエリ実行
npx wrangler d1 execute aichef-production --remote --command="SELECT * FROM recipes"
```

## 公開URL

- **本番環境（Cloudflare Pages）**: https://aichef-595.pages.dev
- **最新デプロイ**: https://3b230f98.aichef-595.pages.dev ✨ NEW
- **APIヘルスチェック**: https://3b230f98.aichef-595.pages.dev/api/health
- **プロジェクト名**: aichef
- **開発環境（Sandbox）**: https://3000-i2ssbzavhkm9slw3om8jl-2b54fc91.sandbox.novita.ai

### デプロイ履歴

- **2026-01-04 18:00** - UI改善+印刷機能+100レシピ追加 ✅ 最新
  - カレンダーをグリッド表示に改善
  - A4印刷機能実装（10日分/ページ）
  - レシピ100件追加（主菜50、副菜30、汁物20）
- **2026-01-04 18:00** - 404エラー修正（HTML インライン化）
- **2026-01-04 17:52** - 初回デプロイ成功（D1バインディング設定完了）

### ⚠️ 重要：D1バインディング設定

Cloudflare Pagesでデータベースを有効にするには、以下の設定が必要です：

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) にログイン
2. **Workers & Pages** → **aichef** を選択
3. **Settings** タブ → **Functions** セクション
4. **D1 database bindings** → **Add binding**
5. 以下を入力：
   - Variable name: `DB`
   - D1 database: `aichef-production`
6. **Save** して再デプロイ

## ライセンス

MIT

## 作成者

てつじ - 会社役員、複数企業の経営者、オープンイノベーションコンサルタント

---

**考えなくていい、悩まなくていい。**  
料理は、作るだけで十分。考える作業は、Aメニューに任せてください。
