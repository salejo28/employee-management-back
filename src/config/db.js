import  pg from "pg";
import keys from './keys.js'

const {Pool} = pg

export const pool = new Pool({
  user: keys.db_user,
  host: keys.db_host,
  database: keys.db_database,
  password: keys.db_password,
  port: 5432,
});
