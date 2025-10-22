import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ACCESS_TOKEN_EXPIRY = '3h';

export function generateAccessToken(userData) {
  const now = Math.floor(Date.now() / 1000);
  
  return jwt.sign({
    iss: 'swifty-server',
    sub: userData.id.toString(),
    aud: 'swifty-client',
    iat: now,
    jti: crypto.randomUUID(),
    id: userData.id,
    student_id: userData.student_id,
    name: userData.name
  }, JWT_SECRET, { 
    expiresIn: ACCESS_TOKEN_EXPIRY
  });
}

export function generateRefreshToken() {
  return crypto.randomBytes(64).toString('hex');
}

export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
}

export function getRefreshTokenExpiry() {
  const now = new Date();
  return new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
}