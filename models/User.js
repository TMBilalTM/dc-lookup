// models/User.js

import { DataTypes } from 'sequelize';
import sequelize from '@/../utils/db'; // Sequelize bağlantısı

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // Email adresinin benzersiz olması gerektiğini belirtiyoruz
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'), // current_timestamp() yerine literal olarak CURRENT_TIMESTAMP kullanıyoruz
    allowNull: false
  }
}, {
  timestamps: false, // Sequelize tarafından otomatik olarak oluşturulan createdAt ve updatedAt sütunlarını devre dışı bırakıyoruz
});
export const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });
    return user;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw new Error('Error fetching user');
  }
};
export default User;
