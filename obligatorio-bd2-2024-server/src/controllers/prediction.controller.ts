import { pool } from '../db/config';
import { Request, Response } from 'express';

export const getPredictions = async (req: Request, res: Response) => {
	try {
		const query = `
            SELECT *
            FROM prediction;
        `;
		const [prediction] = await pool.query(query);

		return res.status(200).json({
			ok: true,
			data: prediction,
		});
	} catch (error: any) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			message: 'Internal server error.',
		});
	}
};

export const createPrediction = async (req: Request, res: Response) => {
	try {
		const prediction: {
			team_id_local: string;
			local_result: number;
			team_id_visitor: string;
			visitor_result: number;
			stage: string;
		} = req.body;

		const query = `
            INSERT INTO prediction (local_result, visitor_result, student_id, team_id_local, team_id_visitor, stage)
            VALUES (?, ?, ?, ?, ?, ?);
        `;
		const values = [
			prediction.local_result,
			prediction.visitor_result,
			48513221,
			prediction.team_id_local,
			prediction.team_id_visitor,
			prediction.stage,
		];
		const response = await pool.query(query, values);

		return res.status(200).json({
			ok: true,
			message: 'Prediction created.',
			data: response[0],
		});
	} catch (error: any) {
		console.log(error);
		if (error.code === 'ER_DUP_ENTRY') {
			return res.status(409).json({
				ok: false,
				message: 'You have already done a prediction for this game.',
			});
		}
		if (error.code === 'ER_SIGNAL_EXCEPTION') {
			return res.status(400).json({
				ok: false,
				message: error.sqlMessage,
			});
		}
		return res.status(500).json({
			ok: false,
			message: 'Internal server error.',
		});
	}
};
