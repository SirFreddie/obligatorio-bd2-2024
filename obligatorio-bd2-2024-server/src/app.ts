import dotenv from 'dotenv';
import Server from './models/server.model';
import { pool } from './db/config';

dotenv.config();

const server = new Server();

const getUsers = async () => {
	try {
		const result = await pool.query('SELECT * FROM USER');
		console.log(result);
	} catch (error) {
		console.error(error);
	}
};

server.listen();

getUsers();
