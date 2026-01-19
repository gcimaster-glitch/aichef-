# 🔐 AICHEFS 会員機能・管理者機能 調査レポート

## 📅 調査日時
- **日付**: 2026-01-18
- **担当**: AI開発アシスタント

---

## 📊 現状サマリー（一言で）

**会員機能と管理者機能はフロントエンド・バックエンド共に実装済みだが、正式なmembersテーブルではなくhouseholdsテーブルで認証管理している簡易実装。本格運用には認証強化とmembersテーブル移行が必要。**

---

## 🎯 実装状況の詳細

### ✅ **既に実装済みの機能**

#### 1. **会員機能（Households認証方式）**

##### **フロントエンド実装**
| 機能 | 状態 | 実装箇所 |
|-----|------|---------|
| ログイン画面 | ✅ 完成 | `/login` (line 32-105) |
| 会員登録画面 | ✅ 完成 | `/register` (埋め込み) |
| ダッシュボード | ✅ 完成 | `/dashboard` |

##### **バックエンドAPI実装**
| エンドポイント | メソッド | 状態 | 機能 |
|-------------|---------|------|------|
| `/api/auth/login` | POST | ✅ 実装済み | householdsテーブルでログイン認証 |
| `/api/auth/register` | POST | ✅ 実装済み | householdsテーブルに新規会員登録 |

**認証フロー**:
```typescript
// ログイン処理（src/index.tsx line ~6077）
1. householdsテーブルからemail検索
2. password_hashでパスワード照合
3. セッションID生成（uuid）
4. household_id返却

// 登録処理（src/index.tsx line ~6100）
1. メールアドレス重複チェック
2. パスワード8文字以上検証
3. パスワードハッシュ化
4. householdsテーブルに新規レコード作成
```

**⚠️ 現在の問題点**:
- 本来の`members`テーブルは使用していない（データ0件）
- `households`テーブルで認証を代替している
- セッション管理が簡易的（JWTなし、member_sessionsテーブル未使用）
- パスワードハッシュ化が弱い（単純ハッシュのみ）

---

#### 2. **管理者機能**

##### **フロントエンド実装**
| 機能 | 状態 | 実装箇所 |
|-----|------|---------|
| 管理者ログイン画面 | ✅ 完成 | `/admin-login` (line 786-851) |
| 管理者ダッシュボード | ✅ 完成 | `/admin` (line 110-778) |
| ユーザー管理画面 | ✅ 完成 | ダッシュボード内 |
| 寄付管理画面 | ✅ 完成 | ダッシュボード内 |
| 統計ダッシュボード | ✅ 完成 | `/api/admin/stats` |

##### **バックエンドAPI実装**
| エンドポイント | メソッド | 状態 | 機能 |
|-------------|---------|------|------|
| `/api/auth/admin-login` | POST | ✅ 実装済み | 管理者ログイン（ハードコード認証） |
| `/api/admin/stats` | GET | ✅ 実装済み | ダッシュボード統計情報 |
| `/api/admin/users` | GET | ✅ 実装済み | ユーザー一覧取得 |
| `/api/admin/users/:id` | GET | ✅ 実装済み | ユーザー詳細取得 |
| `/api/admin/donations` | GET | ✅ 実装済み | 寄付一覧取得 |
| `/api/admin/donations/stats` | GET | ✅ 実装済み | 寄付統計情報 |
| `/api/admin/campaigns` | GET | ✅ 実装済み | メールキャンペーン一覧 |
| `/api/admin/analytics` | GET | ✅ 実装済み | アクセス解析 |
| `/api/admin/ads` | GET | ✅ 実装済み | 広告一覧 |

**管理者認証情報（src/index.tsx line ~6152）**:
```typescript
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "aichef2026"; // ⚠️ ハードコード
```

**⚠️ 現在の問題点**:
- 管理者認証がソースコード内にハードコード
- `admin_users`テーブルが存在するが使用していない（1件のみ登録）
- セッション管理なし
- 権限管理なし（全管理者が同じ権限）

---

### 📊 **データベース現状**

#### **会員関連テーブル**

| テーブル名 | レコード数 | 用途 | 使用状況 |
|-----------|----------|------|---------|
| `members` | **0件** | 会員情報 | ❌ **未使用** |
| `households` | **81件** | 世帯情報 | ✅ **認証に流用中** |
| `member_sessions` | 不明 | セッション管理 | ❌ **未使用** |
| `admin_users` | **1件** | 管理者情報 | ❌ **未使用** |

#### **membersテーブル構造（未使用）**
```sql
CREATE TABLE members (
  member_id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  profile_image_url TEXT,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login_at DATETIME,
  full_name TEXT,
  gender TEXT,
  relationship TEXT,
  phone TEXT,
  prefecture TEXT,
  member_type TEXT DEFAULT 'free',
  membership_expires_at TEXT,
  monthly_generation_count INTEGER DEFAULT 0,
  last_generation_month TEXT
)
```

**高機能な設計**:
- ✅ 会員タイプ管理（free/premium）
- ✅ 月間生成回数制限
- ✅ プロフィール情報
- ✅ ステータス管理

#### **householdsテーブル（認証流用中）**
```sql
-- 本来の用途: 世帯プロファイル管理
-- 現在の用途: 会員認証（email, password_hash追加）
```

**問題点**:
- 世帯情報と会員情報が混在
- 1世帯=1会員の制約
- スケーラビリティが低い

---

## 🔴 実装が不足している機能

### **緊急度：高（本番運用に必須）**

#### 1. **セキュアな認証システム**
- ❌ JWT（JSON Web Token）未実装
- ❌ セッション管理（member_sessionsテーブル未使用）
- ❌ パスワードハッシュがbcrypt/argon2ではない
- ❌ CSRF対策なし
- ❌ レート制限なし

#### 2. **membersテーブルへの移行**
- ❌ householdsからmembersへの認証ロジック切り替え
- ❌ 既存81ユーザーのデータ移行スクリプト
- ❌ householdsとmembersの関連付け（1会員:N世帯）

#### 3. **管理者認証の強化**
- ❌ admin_usersテーブルの活用
- ❌ ハードコード認証からDB認証へ移行
- ❌ 管理者セッション管理
- ❌ 権限レベル管理（super_admin/admin/moderator）

---

### **緊急度：中（機能拡張に必要）**

#### 4. **会員機能の拡張**
- ❌ パスワードリセット機能
- ❌ メールアドレス変更機能
- ❌ プロフィール編集機能
- ❌ アカウント削除機能
- ❌ 二段階認証（2FA）

#### 5. **会員タイプ管理**
- ❌ Free/Premiumの機能差分実装
- ❌ 月間生成回数制限の実装
- ❌ サブスクリプション管理
- ❌ 自動更新処理

#### 6. **管理者機能の拡張**
- ❌ ユーザー編集機能
- ❌ ユーザー停止/復活機能
- ❌ バルク操作（一括削除等）
- ❌ 監査ログ（admin操作履歴）

---

### **緊急度：低（将来的な改善）**

#### 7. **ソーシャルログイン**
- ❌ Google OAuth
- ❌ LINE Login
- ❌ Apple ID

#### 8. **高度なセッション管理**
- ❌ デバイス管理（複数デバイスログイン）
- ❌ セッション強制無効化
- ❌ 自動ログアウト

---

## 📋 実装ロードマップ

### **Phase 1: 認証強化（最優先）🔴**
**期間**: 2-3日  
**目標**: 本番運用可能なセキュリティレベルに到達

1. **JWT実装**
   - [ ] JWTライブラリ導入（jose or jsonwebtoken）
   - [ ] トークン生成・検証ロジック
   - [ ] リフレッシュトークン機構

2. **パスワードハッシュ強化**
   - [ ] bcrypt導入（Cloudflare Workers互換）
   - [ ] ソルト付きハッシュ化
   - [ ] 既存パスワードの再ハッシュ化

3. **セッション管理**
   - [ ] member_sessionsテーブル活用
   - [ ] セッション有効期限管理
   - [ ] ログアウト処理

4. **管理者認証DB化**
   - [ ] admin_usersテーブル活用
   - [ ] ハードコード削除
   - [ ] 管理者セッション管理

**成果物**:
- ✅ JWTベースの認証システム
- ✅ セキュアなパスワード管理
- ✅ セッション管理機能

---

### **Phase 2: membersテーブル移行（重要）🟡**
**期間**: 3-5日  
**目標**: 会員システムの正常化

1. **データ移行スクリプト作成**
   - [ ] households → members データ移行SQL
   - [ ] household_id と member_id の関連付け
   - [ ] ロールバックスクリプト

2. **認証ロジック切り替え**
   - [ ] `/api/auth/login` をmembersテーブルに変更
   - [ ] `/api/auth/register` をmembersテーブルに変更
   - [ ] 既存セッションの互換性確保

3. **テスト・検証**
   - [ ] 既存81ユーザーでログインテスト
   - [ ] 新規登録テスト
   - [ ] パスワード変更テスト

**成果物**:
- ✅ membersテーブルベースの認証
- ✅ 81ユーザーの移行完了
- ✅ データ整合性確保

---

### **Phase 3: 会員機能拡張（機能追加）🟢**
**期間**: 5-7日  
**目標**: ユーザー体験の向上

1. **基本機能**
   - [ ] パスワードリセット（メール送信）
   - [ ] プロフィール編集
   - [ ] メールアドレス変更
   - [ ] アカウント削除

2. **会員タイプ管理**
   - [ ] Free会員の生成回数制限（月10回）
   - [ ] Premium会員の無制限生成
   - [ ] サブスクリプション状態管理

**成果物**:
- ✅ 完全な会員管理機能
- ✅ Free/Premium差分実装

---

### **Phase 4: 管理者機能拡張（運用改善）🟢**
**期間**: 3-5日  
**目標**: 管理者の運用効率向上

1. **ユーザー管理強化**
   - [ ] ユーザー編集機能
   - [ ] ユーザー停止/復活
   - [ ] バルク操作

2. **監査・ログ機能**
   - [ ] 管理者操作ログ
   - [ ] ユーザー行動ログ
   - [ ] レポート機能

**成果物**:
- ✅ 高度な管理者機能
- ✅ 監査ログシステム

---

## 🎯 今すぐ着手すべき作業（最優先3つ）

### **1. JWT実装（2日）**
```typescript
// 例: JWT生成
import { SignJWT } from 'jose';

async function generateToken(member_id: string, email: string) {
  const secret = new TextEncoder().encode(env.JWT_SECRET);
  return await new SignJWT({ member_id, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);
}
```

### **2. パスワードハッシュ強化（1日）**
```typescript
// bcrypt互換（Cloudflare Workers）
import bcrypt from 'bcryptjs';

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
```

### **3. 管理者認証DB化（1日）**
```sql
-- admin_usersテーブルに初期管理者を登録
INSERT INTO admin_users (admin_id, email, password_hash, name, role)
VALUES (
  'admin_001',
  'admin@aichefs.jp',
  '$2a$10$...',  -- bcryptハッシュ
  '管理者',
  'super_admin'
);
```

---

## 📊 現在の実装完成度

```
全体進捗: ████████░░░░░░░░░░░ 40%

認証システム     : ████░░░░░░ 40% (基本実装済み、強化必要)
会員機能         : ██████░░░░ 60% (UI完成、バックエンド要強化)
管理者機能       : ███████░░░ 70% (ダッシュボード完成、認証要強化)
セキュリティ     : ██░░░░░░░░ 20% (大幅な改善必要)
データベース設計 : ████████░░ 80% (テーブル設計完璧、未使用多数)
```

---

## 💡 推奨アクション（優先順位順）

### **🔴 今週中（緊急）**
1. ✅ JWT実装
2. ✅ bcryptパスワードハッシュ化
3. ✅ 管理者認証DB化

### **🟡 来週中（重要）**
4. ✅ membersテーブル移行
5. ✅ セッション管理実装
6. ✅ パスワードリセット機能

### **🟢 今月中（推奨）**
7. ✅ 会員タイプ管理
8. ✅ 管理者権限システム
9. ✅ 監査ログ

---

## 📌 結論

### **良い点 ✅**
- フロントエンド・バックエンド共に基本実装済み
- データベース設計が優秀（membersテーブルが高機能）
- 管理者ダッシュボードが完成している
- 81件の既存ユーザーが存在

### **問題点 ❌**
- セキュリティが弱い（JWT/bcrypt未実装）
- membersテーブルが未使用（householdsで代替）
- 管理者認証がハードコード
- セッション管理なし

### **最終評価**
**現状**: 🟡 **プロトタイプレベル完成、本番運用には要強化**

**推奨**: Phase 1（認証強化）を最優先で実施し、セキュリティレベルを本番水準に引き上げる。その後、Phase 2（membersテーブル移行）で会員システムを正常化。

---

**📅 次回レビュー推奨日**: Phase 1完了後（3日後）
