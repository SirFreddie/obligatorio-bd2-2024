import { pool } from '../db/config';
import { Request, Response } from 'express';

export const getCareers = async (req: Request, res: Response) => {
	try {
		const query = `SELECT * FROM career`;
		const response = await pool.query(query);

		return res.status(200).json({
			ok: true,
			message: 'All careers',
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
