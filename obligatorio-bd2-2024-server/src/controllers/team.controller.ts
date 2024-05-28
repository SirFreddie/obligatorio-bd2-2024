import { pool } from '../db/config';
import { Request, Response } from 'express';

export const getTeams = async (req: Request, res: Response) => {
	try {
		const query = `SELECT * FROM team`;
		const response = await pool.query(query);

		return res.status(200).json({
			ok: true,
			message: 'All teams',
			data: response[0],
		});
	} catch (error: any) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			message: 'Internal server error',
		});
	}
};

export const getTeamById = async (req: Request, res: Response) => {
	try {
		const { idteam } = req.params;
		const query = {
			sql: `SELECT * FROM team WHERE idteam = ?`,
			values: [idteam],
		};
		const response = (await pool.query(query)) as any;

		if (response[0].length === 0) {
			return res.status(404).json({
				ok: false,
				message: 'Team not found',
			});
		}

		return res.status(200).json({
			ok: true,
			message: 'Team by id',
			data: response[0][0],
		});
	} catch (error: any) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			message: 'Internal server error',
		});
	}
};
