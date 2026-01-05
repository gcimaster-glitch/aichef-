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

### ビジネスモデル

- **無料で利用可能** - すべての機能を無料で提供
- **広告収入** - バナー広告とアフィリエイトで運営
- **メルマガ配信** - 週1回のレシピ情報配信

## 主な機能

### ✅ 完成している機能

1. **Apple風ランディングページ** 🆕
   - プレミアム感のあるデザイン
   - ヒーローセクション、問題提起、ソリューション、特徴、使い方、料金、CTA
   - 家族写真と豊富な献立画像
   - メルマガ登録、お問い合わせフォーム
   - モバイルレスポンシブ対応

2. **AIチャット形式の質問入力**
   - 家族構成、人数
   - 予算（300〜1500円/人）
   - 調理時間（15〜60分）
   - アレルギー、苦手な食材

3. **1ヶ月分の献立自動生成**
   - 主菜・副菜・汁物の3品セット
   - 家族人数に合わせた分量調整
   - **600種類以上のレシピから自動選択** 🆕
     - 主菜: 351品（和食・洋食・中華）
     - 副菜: 231品（野菜中心、卵・豆腐、その他）
     - 汁物: 121品（味噌汁、スープ、その他）
   - **子供向けスコア対応** 🆕
     - 0-100点のスコアで子供の年齢に合わせた献立選択

4. **献立カレンダー表示（改善版）**
   - グリッド表示で見やすいレイアウト
   - 日付ごとのカード表示
   - 曜日表示
   - 推定調理時間の表示
   - ホバーエフェクトで選択しやすく

5. **印刷機能** ✨
   - A4サイズで印刷可能
   - 10日分を1ページに収録
   - 1ヶ月分（30日）を3ページで印刷
   - 印刷専用CSS最適化

6. **広告管理機能** 💰
   - 広告枠の設置と管理
   - バナー広告・アフィリエイト対応
   - クリック数・表示回数トラッキング
   - 効果測定レポート
   - サンプル広告6枠配置済み

7. **メルマガ機能** 📧
   - 登録/解除機能
   - 購読者データベース管理
   - 配信履歴記録
   - フッターに登録フォーム設置

8. **お問い合わせ機能** 💬
   - チャット式問い合わせフォーム
   - スレッド管理
   - 問い合わせ履歴保存
   - ステータス管理（open/resolved）

### 🔄 未実装・今後の機能
   - 1ヶ月分（30日）を3ページで出力
   - 印刷専用CSS最適化
   - 印刷ボタンをワンクリックで実行

5. **広告管理機能** 💰 **NEW!**
   - 広告枠の設置（ヘッダー、サイドバー、フッター、カレンダー下部）
   - バナー広告とアフィリエイトリンクに対応
   - クリック数・表示回数のトラッキング
   - 広告効果測定（収益最適化）
   - サンプル広告を設置済み（管理画面から変更可能）

6. **メルマガ機能** 📧 **NEW!**
   - メルマガ登録・解除
   - 購読者管理
   - 配信履歴の記録
   - フッターに登録フォームを設置

7. **お問い合わせ機能** 💬 **NEW!**
   - チャット形式の問い合わせフォーム
   - 問い合わせ履歴の管理
   - スレッド形式で会話を記録

8. **データベース（Cloudflare D1）**
   - **レシピマスタ（703件）** 🆕
     - 主菜: 351件（和食・洋食・中華）
     - 副菜: 231件（野菜中心、卵・豆腐など）
     - 汁物: 121件（味噌汁、スープ、その他）
   - **食材マスタ（154件）**
   - **レシピ-食材関連データ（47件）**
   - 会員管理テーブル（準備済み）
   - メルマガ購読者テーブル
   - 問い合わせテーブル
   - 広告管理テーブル（6枠設置済み）

### 🚧 今後の実装予定（優先度順）

#### 優先度 HIGH（基本機能として必須）
- **子供向け質問の追加** 🆕
  - チャット質問に「お子さんの年齢」を追加
  - 年齢別の献立最適化ロジック実装

- **AI対話機能の強化** 🆕
  - OpenAI API連携
  - 献立生成後の対話継続
  - 「なぜこの献立？」の説明機能
  - 献立の差し替え・調整機能

- **買い物リスト生成機能**
  - API: `GET /api/plans/:planId/shopping`
  - 週ごとに分割、食材カテゴリ別表示
  - 分量の合計計算
  
- **献立差し替え機能**
  - API: `POST /api/plans/:planId/swap`
  - 差し替え理由選択（時間がない/食材がない/気分）
  - 週の連動を維持

- **レシピ-食材関連データの拡充**
  - 現在: 33レシピ × 平均4.7食材 = 47件
  - 目標: 703レシピ × 平均5食材 = 約3,500件
  - 買い物リスト機能の前提条件

#### 優先度 MEDIUM（UX向上）
- レシピ詳細表示モーダル
- 食材使い回し最適化ロジック

#### 優先度 LOW（将来拡張）
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

### 主要テーブルとデータ状況

| テーブル名 | 説明 | 件数（本番DB） | 備考 |
|-----------|------|---------------|------|
| **recipes** | レシピマスタ（主菜/副菜/汁物） | 103件 | 主菜60, 副菜40, 汁物30 + 初期3件 |
| **ingredients** | 食材マスタ | 154件 | 野菜、肉魚、調味料など |
| **recipe_ingredients** | レシピ-食材関連 | 47件 | 33レシピ分、残り70レシピは未定義 |
| **households** | 家族プロファイル | - | ユーザーが作成 |
| **meal_plans** | 献立計画 | - | ユーザーが生成 |
| **meal_plan_days** | 日別献立 | - | 献立計画の詳細 |
| **shopping_lists** | 買い物リスト | - | **未実装** |

詳細は `migrations/0001_initial_schema.sql` を参照

### データ投入履歴

- **0001_initial_schema.sql**: DBスキーマ定義（16テーブル）
- **seed.sql**: マスタデータ（アレルゲン、季節、価格帯など）
- **0003_minimal_recipes.sql**: 初期3レシピ（rcp_001〜003）
- **0004_rich_recipes.sql**: 100レシピ追加（main_011〜060, side_041〜070, soup_071〜100）
- **0005_ingredients_master.sql**: 食材マスタ125件追加
- **0010_recipe_ingredients_batch1.sql**: レシピ-食材関連47件（主菜10, 副菜10, 汁物5, 初期3）

## 推奨される次のステップ

### Phase 1: データ完全化（優先度: HIGH）

1. **レシピ-食材関連データの完全投入**
   - 現状: 33レシピのみ定義済み
   - 目標: 全103レシピに食材を紐付け（約500件）
   - 方法: バッチ処理で10レシピずつ投入
   - **重要**: 買い物リスト機能の前提条件

### Phase 2: 基本機能実装（優先度: HIGH）

2. **買い物リスト生成機能**
   - API: `GET /api/plans/:planId/shopping`
   - 週ごとの集計、食材カテゴリ別表示
   - 分量の合計計算

3. **献立差し替え機能**
   - API: `POST /api/plans/:planId/swap`
   - 理由選択、週の連動維持

### Phase 3: UX向上（優先度: MEDIUM）

4. **レシピ詳細表示モーダル**
   - レシピタイトルクリックで詳細表示

5. **食材使い回し最適化ロジック**
   - 低予算時の reuse_keys 重み調整

### Phase 4: 拡張機能（優先度: LOW）

6. **季節・魚頻度の考慮**
   - 旬の食材優先、魚料理回数制御

7. **レシピ拡充**
   - 103件 → 500件へ拡大

## 広告管理・収益化

### 広告枠の配置

| 広告枠名 | ページ | 位置 | サイズ | 説明 |
|---------|--------|------|--------|------|
| `slot_top_header` | TOPページ | ヘッダー下 | 728x90 | 最初に目に入る横長バナー |
| `slot_top_sidebar` | TOPページ | サイドバー | 300x250 | 右側の大型広告枠 |
| `slot_top_footer` | TOPページ | フッター | 728x90 | ページ下部のバナー |
| `slot_calendar_top` | カレンダー | 上部 | 728x90 | カレンダー表示前 |
| `slot_calendar_inline` | カレンダー | 中間 | 728x90 | 15日目付近に表示 |
| `slot_calendar_bottom` | カレンダー | 下部 | 728x90 | カレンダー表示後 |

### 広告の設置方法

1. **データベースに広告を登録**
```sql
INSERT INTO ad_contents (ad_id, slot_id, ad_type, title, link_url, html_code, priority, is_active)
VALUES (
  'ad_001',
  'slot_top_header',
  'banner',
  '広告タイトル',
  'https://example.com/product',
  '<a href="https://example.com/product"><img src="https://example.com/banner.jpg" width="728" height="90"></a>',
  1,
  1
);
```

2. **アフィリエイトコードの設置**
```sql
INSERT INTO ad_contents (ad_id, slot_id, ad_type, title, link_url, html_code, priority, is_active)
VALUES (
  'ad_002',
  'slot_top_sidebar',
  'affiliate_link',
  'Amazon アフィリエイト',
  'https://amzn.to/xxxxx',
  '<iframe src="//rcm-fe.amazon-adsystem.com/..." width="300" height="250"></iframe>',
  1,
  1
);
```

### 広告効果の測定

- **クリック数**: `ad_clicks` テーブルで自動記録
- **表示回数**: `ad_impressions` テーブルで自動記録
- **収益レポート**: データベースから集計可能

```sql
-- クリック数の集計
SELECT ac.title, COUNT(*) as clicks
FROM ad_clicks acl
JOIN ad_contents ac ON acl.ad_id = ac.ad_id
GROUP BY ac.ad_id, ac.title
ORDER BY clicks DESC;

-- 表示回数の集計
SELECT ac.title, COUNT(*) as impressions
FROM ad_impressions ai
JOIN ad_contents ac ON ai.ad_id = ac.ad_id
GROUP BY ac.ad_id, ac.title
ORDER BY impressions DESC;
```

## メルマガ管理

### メルマガ購読者の管理

```sql
-- 購読者一覧
SELECT email, subscribed_at, status
FROM newsletter_subscribers
WHERE status = 'active'
ORDER BY subscribed_at DESC;

-- 配信履歴
SELECT subject, sent_at, recipient_count
FROM newsletter_deliveries
ORDER BY sent_at DESC;
```

### メルマガの配信方法

1. **配信コンテンツをデータベースに登録**
2. **外部メール配信サービス（SendGrid, Mailgun等）と連携**
3. **購読者リストをエクスポートして一斉送信**

## お問い合わせ管理

### 問い合わせの確認

```sql
-- 未対応の問い合わせ
SELECT thread_id, email, name, subject, created_at
FROM support_threads
WHERE status = 'open'
ORDER BY created_at DESC;

-- 問い合わせの詳細
SELECT sm.message, sm.sender_type, sm.created_at
FROM support_messages sm
WHERE sm.thread_id = 'xxxxx'
ORDER BY sm.created_at ASC;
```

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
- **最新デプロイ**: https://bcc0df48.aichef-595.pages.dev ✨ **NEW - ランディングページ + 600レシピ + 子供向け機能**
  - **ランディングページ**: https://bcc0df48.aichef-595.pages.dev/
  - **献立作成アプリ**: https://bcc0df48.aichef-595.pages.dev/app
- **APIヘルスチェック**: https://bcc0df48.aichef-595.pages.dev/api/health
- **プロジェクト名**: aichef
- **開発環境（Sandbox）**: https://3000-i2ssbzavhkm9slw3om8jl-2b54fc91.sandbox.novita.ai

### デプロイ履歴

- **2026-01-05 11:00** - ランディングページ + 600レシピ + 子供向け機能 ✅ **最新**
  - Apple風ランディングページ実装（7セクション構成）
  - 家族写真3枚追加（キッチン、食卓、豊富な献立）
  - レシピ600品追加（主菜300、副菜200、汁物100）
  - 子供向けスコア機能（child_friendly_score 0-100点）
  - 子供年齢情報（children_ages_json）
  - ルーティング分離（/ → ランディング、/app → 献立作成）
  - 合計703レシピ（主菜351、副菜231、汁物121）
- **2026-01-05 02:00** - 収益化機能実装
  - 広告管理機能（6枠設置、トラッキング）
  - メルマガ登録・解除
  - お問い合わせフォーム
  - データベーステーブル12個追加（合計28テーブル）
- **2026-01-04 18:00** - UI改善+印刷機能+100レシピ追加
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
