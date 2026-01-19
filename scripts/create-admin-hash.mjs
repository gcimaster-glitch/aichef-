// 管理者パスワードのハッシュを生成
import bcrypt from 'bcryptjs';

const password = 'aichef2026';
const hash = await bcrypt.hash(password, 10);
console.log('Password Hash:', hash);
console.log('\nSQL Command:');
console.log(`UPDATE admin_users SET password_hash = '${hash}' WHERE admin_id = (SELECT admin_id FROM admin_users LIMIT 1);`);
