/**
 * 認証ミドルウェア
 * 
 * Protected APIルート用の認証ミドルウェアを提供します。
 */

import { Context } from 'hono';
import { authenticateRequest } from './auth-helper';

/**
 * 認証ミドルウェア
 * Authorization ヘッダーから JWT を検証し、ユーザー情報を c.set() にセット
 * 
 * 使用例:
 * app.get('/api/protected', requireAuth, async (c) => {
 *   const user = c.get('user');
 *   return c.json({ user });
 * });
 */
export async function requireAuth(c: Context, next: Function) {
  const authHeader = c.req.header('Authorization');
  const jwtSecret = c.env.JWT_SECRET || 'default-secret-change-in-production';
  
  const user = await authenticateRequest(authHeader, jwtSecret);
  
  if (!user) {
    return c.json({ error: '認証が必要です' }, 401);
  }
  
  // ユーザー情報をコンテキストにセット
  c.set('user', user);
  
  await next();
}

/**
 * 管理者認証ミドルウェア
 * 管理者権限を持つユーザーのみアクセス可能
 */
export async function requireAdmin(c: Context, next: Function) {
  const authHeader = c.req.header('Authorization');
  const jwtSecret = c.env.JWT_SECRET || 'default-secret-change-in-production';
  
  const user = await authenticateRequest(authHeader, jwtSecret);
  
  if (!user || user.role !== 'admin') {
    return c.json({ error: '管理者権限が必要です' }, 403);
  }
  
  // 管理者情報をコンテキストにセット
  c.set('admin', user);
  
  await next();
}

/**
 * オプショナル認証ミドルウェア
 * 認証トークンがあれば検証するが、なくてもOK
 */
export async function optionalAuth(c: Context, next: Function) {
  const authHeader = c.req.header('Authorization');
  const jwtSecret = c.env.JWT_SECRET || 'default-secret-change-in-production';
  
  const user = await authenticateRequest(authHeader, jwtSecret);
  
  if (user) {
    c.set('user', user);
  }
  
  await next();
}
