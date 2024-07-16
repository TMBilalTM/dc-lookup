// pages/api/login.js

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/../models/User';
import db from '@/../utils/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  try {
    // Veritabanına bağlan
    await db.sync();

    // Kullanıcıyı veritabanından bul
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Şifreleri karşılaştır
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Token oluştur
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Token'i istemciye gönder
    res.status(200).json({ token });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
}
