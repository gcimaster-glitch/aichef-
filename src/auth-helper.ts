/**
 * 認証ヘルパー - JWT & bcrypt
 * 
 * このモジュールは、AICHEFS アプリケーションの認証機能を提供します。
 * - JWT トークン生成・検証
 * - bcrypt パスワードハッシュ化・検証
 * - セッション管理
 */

import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

// ========================================
// 型定義
// ========================================

export interface JWTPayload {
  member_id?: string;
  household_id?: string;
  email: string;
  name: string;
  member_type?: string;
  role?: string; // 'user' | 'admin'
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// ========================================
// JWT 関連関数
// ========================================

/**
 * JWT アクセストークン生成
 * @param payload - トークンペイロード
 * @param secret - JWT シークレット
 * @param expiresIn - 有効期限（デフォルト: 7日）
 * @returns JWT トークン文字列
 */
export async function generateAccessToken(
  payload: JWTPayload,
  secret: string,
  expiresIn: string = '7d'
): Promise<string> {
  const secretKey = new TextEncoder().encode(secret);
  
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secretKey);
}

/**
 * JWT リフレッシュトークン生成
 * @param payload - トークンペイロード
 * @param secret - JWT シークレット
 * @param expiresIn - 有効期限（デフォルト: 30日）
 * @returns JWT トークン文字列
 */
export async function generateRefreshToken(
  payload: JWTPayload,
  secret: string,
  expiresIn: string = '30d'
): Promise<string> {
  const secretKey = new TextEncoder().encode(secret);
  
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secretKey);
}

/**
 * JWT トークンペア生成（アクセス + リフレッシュ）
 * @param payload - トークンペイロード
 * @param secret - JWT シークレット
 * @returns トークンペア
 */
export async function generateTokenPair(
  payload: JWTPayload,
  secret: string
): Promise<TokenPair> {
  const accessToken = await generateAccessToken(payload, secret);
  const refreshToken = await generateRefreshToken(payload, secret);
  
  return { accessToken, refreshToken };
}

/**
 * JWT トークン検証
 * @param token - JWT トークン
 * @param secret - JWT シークレット
 * @returns デコードされたペイロード
 * @throws トークンが無効または期限切れの場合
 */
export async function verifyToken(
  token: string,
  secret: string
): Promise<JWTPayload> {
  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);
    return payload as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Authorization ヘッダーから Bearer トークンを抽出
 * @param authHeader - Authorization ヘッダー値
 * @returns トークン文字列 or null
 */
export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // "Bearer " を除去
}

// ========================================
// bcrypt パスワードハッシュ関連関数
// ========================================

/**
 * パスワードをハッシュ化（Web Crypto API使用、Cloudflare Workers対応）
 * @param password - 平文パスワード
 * @param saltRounds - ソルトラウンド数（デフォルト: 10）
 * @returns ハッシュ化されたパスワード
 */
export async function hashPassword(
  password: string,
  saltRounds: number = 10
): Promise<string> {
  try {
    // bcryptjsを試す
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    // Cloudflare Workersでbcryptjsが動作しない場合、Web Crypto APIにフォールバック
    console.warn('bcryptjs failed, falling back to Web Crypto API:', error);
    
    // ソルト生成
    const saltBytes = crypto.getRandomValues(new Uint8Array(16));
    const saltHex = Array.from(saltBytes).map(b => b.toString(16).padStart(2, '0')).join('');
    
    // パスワード + ソルトをハッシュ化
    const encoder = new TextEncoder();
    const data = encoder.encode(password + saltHex);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // ソルトとハッシュを結合して返す（bcrypt形式ではないが識別可能）
    return `$sha256$${saltHex}$${hashHex}`;
  }
}

/**
 * パスワード検証（bcrypt と Web Crypto API の両方に対応）
 * @param password - 平文パスワード
 * @param hash - ハッシュ化されたパスワード
 * @returns 一致する場合 true、それ以外 false
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    // bcryptハッシュの場合
    if (hash.startsWith('$2')) {
      return await bcrypt.compare(password, hash);
    }
    
    // Web Crypto APIハッシュの場合
    if (hash.startsWith('$sha256$')) {
      const parts = hash.split('$');
      if (parts.length !== 4) return false;
      
      const saltHex = parts[2];
      const storedHashHex = parts[3];
      
      // パスワード + ソルトをハッシュ化
      const encoder = new TextEncoder();
      const data = encoder.encode(password + saltHex);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const computedHashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      return computedHashHex === storedHashHex;
    }
    
    // 古いSHA-256ハッシュ（ソルトなし、後方互換性）
    if (hash.length === 64) {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const computedHashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return computedHashHex === hash;
    }
    
    return false;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

// ========================================
// セッション管理関数
// ========================================

/**
 * セッションID生成
 * @returns UUID v4 文字列
 */
export function generateSessionId(): string {
  return crypto.randomUUID();
}

/**
 * セッション作成（D1 Database）
 * @param db - D1 Database インスタンス
 * @param memberId - 会員ID
 * @param token - アクセストークン
 * @param refreshToken - リフレッシュトークン
 * @param expiresAt - 有効期限
 * @returns セッションID
 */
export async function createSession(
  db: D1Database,
  memberId: string,
  token: string,
  refreshToken: string,
  expiresAt: string
): Promise<string> {
  const sessionId = generateSessionId();
  
  await db.prepare(`
    INSERT INTO member_sessions (
      session_id, member_id, token, refresh_token, 
      expires_at, created_at
    ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `).bind(sessionId, memberId, token, refreshToken, expiresAt).run();
  
  return sessionId;
}

/**
 * セッション取得
 * @param db - D1 Database インスタンス
 * @param sessionId - セッションID
 * @returns セッション情報 or null
 */
export async function getSession(
  db: D1Database,
  sessionId: string
): Promise<any> {
  return await db.prepare(`
    SELECT * FROM member_sessions 
    WHERE session_id = ? AND is_active = 1
  `).bind(sessionId).first();
}

/**
 * セッション無効化
 * @param db - D1 Database インスタンス
 * @param sessionId - セッションID
 */
export async function invalidateSession(
  db: D1Database,
  sessionId: string
): Promise<void> {
  await db.prepare(`
    UPDATE member_sessions 
    SET is_active = 0, updated_at = CURRENT_TIMESTAMP
    WHERE session_id = ?
  `).bind(sessionId).run();
}

/**
 * 期限切れセッションのクリーンアップ
 * @param db - D1 Database インスタンス
 */
export async function cleanupExpiredSessions(
  db: D1Database
): Promise<void> {
  await db.prepare(`
    DELETE FROM member_sessions 
    WHERE expires_at < datetime('now')
  `).run();
}

// ========================================
// 認証ミドルウェアヘルパー
// ========================================

/**
 * リクエストから JWT を検証してユーザー情報を取得
 * @param authHeader - Authorization ヘッダー
 * @param secret - JWT シークレット
 * @returns ユーザー情報 or null
 */
export async function authenticateRequest(
  authHeader: string | null,
  secret: string
): Promise<JWTPayload | null> {
  const token = extractBearerToken(authHeader);
  if (!token) return null;
  
  try {
    return await verifyToken(token, secret);
  } catch (error) {
    return null;
  }
}

// ========================================
// パスワードバリデーション
// ========================================

/**
 * パスワード強度チェック
 * @param password - パスワード
 * @returns バリデーション結果
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('パスワードは8文字以上である必要があります');
  }
  
  if (!/[A-Za-z]/.test(password)) {
    errors.push('パスワードには英字を含める必要があります');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('パスワードには数字を含める必要があります');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * メールアドレスバリデーション
 * @param email - メールアドレス
 * @returns 有効な場合 true
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
