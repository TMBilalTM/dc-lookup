// pages/api/profile.js

import jwt from 'jsonwebtoken'; // JSON Web Token (JWT) kütüphanesi
import { getUserByEmail } from '@/../models/User'; // Kullanıcıyı e-posta ile bulmak için model fonksiyonu

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // 1. Token'i al
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // 2. Token'i doğrula ve kullanıcı e-postasını çıkar
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decodedToken.email;

    // 3. Veritabanından kullanıcıyı e-posta ile bul
    const user = await getUserByEmail(userEmail);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 4. Kullanıcı profili bilgilerini döndür
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at // Kullanıcı oluşturulma tarihi, veritabanı şemasına göre ayarlanmalıdır
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
