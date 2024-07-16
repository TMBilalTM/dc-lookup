import bcrypt from 'bcryptjs';
import sequelize from '@/../utils/db';
import User from '@/../models/User'; // Kullanıcı modelini ekleyin

const saltRounds = 10; // bcrypt hash işlemi için kullanılacak tuzlama turu

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, password } = req.body;

  try {
    // Basic input validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    // Hashing the password with bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Sequelize ile MySQL veritabanına bağlanma
    await sequelize.authenticate();
    console.log('Connected to the database.');

    // Kullanıcı modeli üzerinden işlemler yapılabilir
    // Yeni bir kullanıcı oluşturma
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword // Hashlenmiş şifreyi kullan
    });

    // Başarılı kayıt durumunda
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
