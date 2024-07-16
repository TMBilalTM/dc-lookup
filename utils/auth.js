import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// JWT oluşturma fonksiyonu
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

// JWT doğrulama fonksiyonu
export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}
