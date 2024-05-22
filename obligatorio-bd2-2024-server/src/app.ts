import dotenv from 'dotenv';
import Server from './models/server.model';
import { pool } from './db/config';
import express from 'express';
import userRoutes from './routes/user.routes';

dotenv.config();

const server = new Server();

server.listen();
