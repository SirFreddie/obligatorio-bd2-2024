import cors from 'cors';
import express, { Application } from 'express';
import matchRoutes from '../routes/match.routes';

class Server {
	private app: Application;
	private port: string;
	private apiPaths = {
		matches: '/api/matches',
	};

	constructor() {
		this.app = express();
		this.port = process.env.PORT || '3000';

		// Middlewares
		this.middlewares();

		// Routes
		this.routes();
	}

	public listen(): void {
		this.app.listen(this.port, () => {
			console.log(`Server running on port `, this.port);
		});
	}

	private middlewares(): void {
		// CORS
		this.app.use(cors());

		// Read and parse body
		this.app.use(express.json());
	}

	private routes(): void {
		this.app.use(this.apiPaths.matches, matchRoutes);
	}
}

export default Server;
