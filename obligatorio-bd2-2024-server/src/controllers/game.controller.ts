import { pool } from '../db/config';
import { Request, Response } from 'express';

export const getGames = async (req: Request, res: Response) => {
	try {
		const query = `
            SELECT *
            FROM game;
        `;
		const [games] = await pool.query(query);

		return res.status(200).json({
			ok: true,
			data: games,
		});
	} catch (error: any) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			message: 'Internal server error',
		});
	}
};

export const createGame = async (req: Request, res: Response) => {
	try {
		const game: {
			stage: string;
			team_id_local: string;
			team_id_visitor: string;
			date: Date;
		} = req.body;

		const query = `
            INSERT INTO game (stage, team_id_local, team_id_visitor, date, local_result, visitor_result)
            VALUES (?, ?, ?, ?, null, null);
        `;
		const values = [
			game.stage,
			game.team_id_local,
			game.team_id_visitor,
			new Date(game.date),
		];
		const response = await pool.query(query, values);

		return res.status(200).json({
			ok: true,
			message: 'Game created',
			data: response[0],
		});
	} catch (error: any) {
		console.log(error);
		if (error.code === 'ER_DUP_ENTRY') {
			return res.status(409).json({
				ok: false,
				message: 'There is already a game with that ID',
			});
		}
		return res.status(500).json({
			ok: false,
			message: 'Internal server error',
		});
	}
};
