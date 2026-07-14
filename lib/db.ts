import { Pool } from 'pg';

const pool = new Pool(
  process.env.POSTGRES_URL
    ? {
        connectionString: process.env.POSTGRES_URL,
        // Vercel vyžaduje SSL
        ssl: { rejectUnauthorized: false }
      }
    : {
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DB || process.env.POSTGRES_DATABASE,
        password: process.env.POSTGRES_PASSWORD,
        port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      }
);

export const query = (text: string, params?: any[]) => pool.query(text, params);
