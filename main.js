import { App } from "./src/app.js";
import dotenv from 'dotenv'
import { pool } from "./src/config/db.js";

async function bootstrap() {
  dotenv.config()
  const app = App(process.env.PORT || 4000);
  await pool.connect()
  await app.listen();
}

bootstrap();
