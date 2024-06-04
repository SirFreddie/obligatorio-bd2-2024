import cors from 'cors';
import express, { Application } from 'express';
import gameRoutes from '../routes/game.routes';
import userRoutes from '../routes/user.routes';
import teamRoutes from '../routes/team.routes';
import careerRoutes from '../routes/career.routes';
import { EmailService } from '../email/email.service';
import { pool } from '../db/config';

class Server {
	private app: Application;
	private port: string;
	private apiPaths = {
		users: '/api/users',
		teams: '/api/teams',
		games: '/api/games',
		careers: '/api/careers',
	};

	constructor() {
		this.app = express();
		this.port = process.env.PORT || '3000';

		// Middlewares
		this.middlewares();

		// Routes
		this.routes();

		// Email sender
		// this.emailSender();
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
		this.app.use(this.apiPaths.users, userRoutes);
		this.app.use(this.apiPaths.teams, teamRoutes);
		this.app.use(this.apiPaths.games, gameRoutes);
		this.app.use(this.apiPaths.careers, careerRoutes);
	}

	private async emailSender() {
		try {
			const emailService = new EmailService();
			const query = `
							SELECT mail
							FROM user
					`;
			const [rows] = (await pool.query(query)) as any;

			const emailAddresses = rows.map((row: any) => row.mail);

			emailService.sendEmail({
				to: emailAddresses,
				subject: 'Test email',
				htmlBody: '<h1>Test email</h1>',
			});
		} catch (error: any) {
			console.log(error);
		}
	}
}

export default Server;
