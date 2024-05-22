import dotenv from 'dotenv';
import Server from './models/server.model';
import { pool } from './db/config';
import express from 'express';

dotenv.config();

const server = new Server();

const app = express();

const getUsers = async () => {
	try {
		const result = await pool.query('SELECT * FROM user');
		console.log(result);
	} catch (error) {
		console.error(error);
	}
};

server.listen();

getUsers();
