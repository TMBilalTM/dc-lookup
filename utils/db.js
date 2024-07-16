// utils/db.js

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  define: {
    timestamps: true // Varsayılan olarak createdAt ve updatedAt sütunlarını eklemesini sağlar
  }
});

export default sequelize;
