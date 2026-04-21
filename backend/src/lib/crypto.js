import crypto from 'crypto';

const KEY_HEX = process.env.CREDENTIAL_ENCRYPTION_KEY || '';
let KEY = null;
if (KEY_HEX.length === 64) {
  try { KEY = Buffer.from(KEY_HEX, 'hex'); } catch { KEY = null; }
} else if (KEY_HEX.length > 0) {
  console.warn('CREDENTIAL_ENCRYPTION_KEY must be 64 hex chars. Using base64 fallback.');
}

export function encryptCredential(plaintext) {
  if (!KEY) return Buffer.from(plaintext).toString('base64'); // fallback: base64 only (not secure)
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString('base64');
}

export function decryptCredential(ciphertext) {
  if (!KEY) return Buffer.from(ciphertext, 'base64').toString('utf8'); // fallback
  const data = Buffer.from(ciphertext, 'base64');
  const iv = data.subarray(0, 12);
  const authTag = data.subarray(12, 28);
  const encrypted = data.subarray(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
}
