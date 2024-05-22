import { createPool } from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config();

export const pool = createPool({
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	port: parseInt(process.env.DB_PORT!, 10),
	multipleStatements: true,
});
