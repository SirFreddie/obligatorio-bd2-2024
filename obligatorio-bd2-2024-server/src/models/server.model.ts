import cors from 'cors';
import express, { Application } from 'express';
import gameRoutes from '../routes/game.routes';
import userRoutes from '../routes/user.routes';
import teamRoutes from '../routes/team.routes';
import careerRoutes from '../routes/career.routes';
import predictionRoutes from '../routes/prediction.routes';
import { EmailService } from '../email/email.service';
import { pool } from '../db/config';
import cron from 'node-cron';

class Server {
	private app: Application;
	private port: string;
	private apiPaths = {
		users: '/api/users',
		teams: '/api/teams',
		games: '/api/games',
		careers: '/api/careers',
		predictions: '/api/predictions',
	};

	constructor() {
		this.app = express();
		this.port = process.env.PORT || '3000';

		// Middlewares
		this.middlewares();

		// Routes
		this.routes();

		// Cron jobs
		this.cronJobs();
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
		this.app.use(this.apiPaths.predictions, predictionRoutes);
	}

	private async cronJobs() {
		console.log('Cron job started');
		cron.schedule('0 * * * *', async () => {
			await this.emailSender();
		});
	}

	private async emailSender() {
		console.log('Checking for games starting in 24 hours...');
		try {
			const emailService = new EmailService();

			const getUpcomingGamesQuery = `
					SELECT stage, MIN(date) as first_match_date
					FROM game
					WHERE date >= NOW() AND date <= DATE_ADD(NOW(), INTERVAL 1 DAY)
					GROUP BY stage;
			`;
			const [upcomingGames] = (await pool.query(getUpcomingGamesQuery)) as any;
			const query = `
							SELECT email
							FROM user
					`;
			const [emailAddresses] = (await pool.query(query)) as any[];

			if (upcomingGames?.length === 0) {
				console.log('No games starting in 24 hours.');
				return;
			}
			for (const game of upcomingGames) {
				for (const email of emailAddresses) {
					emailService.sendEmail({
						to: email.email,
						subject: `Penca UCU - Upcoming game: ${game.stage}`,
						htmlBody: `
						<h1>Upcoming game: ${game.stage}</h1>
						<br/>
						<p>First match date: ${game.first_match_date}</p>
						`,
					});
				}
			}
		} catch (error: any) {
			console.error(error);
		}
	}
}

export default Server;
