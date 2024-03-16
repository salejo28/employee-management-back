import dotenv from 'dotenv'
dotenv.config()

export default {
  db_user: process.env.DB_USER,
  db_host: process.env.DB_HOST,
  db_database: process.env.DB_DATABASE,
  db_password: process.env.DB_PASSWORD,
}