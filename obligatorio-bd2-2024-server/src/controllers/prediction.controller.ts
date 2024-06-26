import { pool } from '../db/config';
import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

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
	const token = req.header('Authorization');
	if (!token) {
		return res.status(401).json({
			ok: false,
			message: 'No token provided.',
		});
	}
	const { uid } = jwt.decode(token) as JwtPayload;
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
			uid,
			prediction.team_id_local,
			prediction.team_id_visitor,
			prediction.stage,
		];
		const response = await pool.query(query, values);

		return res.status(200).json({
			ok: true,
			message: 'Predicción creada.',
			data: response[0],
		});
	} catch (error: any) {
		console.log(error);
		if (error.code === 'ER_DUP_ENTRY') {
			return res.status(409).json({
				ok: false,
				message: 'Ya has hecho una predicción para este juego.',
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

export const getStudentPredictions = async (req: Request, res: Response) => {
	try {
		const { studentId } = req.params;

		const query = `
						SELECT *
						FROM prediction
						WHERE student_id = ?;
				`;
		const [prediction] = await pool.query(query, [studentId]);

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

export const updatePrediction = async (req: Request, res: Response) => {
	const token = req.header('Authorization');
	if (!token) {
		return res.status(401).json({
			ok: false,
			message: 'No token provided.',
		});
	}
	const { uid } = jwt.decode(token) as JwtPayload;
	try {
		const {
			stage,
			local_result,
			visitor_result,
			team_id_local,
			team_id_visitor,
		} = req.body;

		const queryCheck = `
						SELECT *
						FROM game
						WHERE team_id_local = ? AND team_id_visitor = ? AND stage = ?;
				`;
		const queryCheckValues = [team_id_local, team_id_visitor, stage];

		const [game] = await pool.query(queryCheck, queryCheckValues);
		console.log(game);

		if (!game[0]) {
			return res.status(400).json({
				ok: false,
				message: 'Este partido no existe.',
			});
		}

		if (game[0].local_result !== null || game[0].visitor_result !== null) {
			return res.status(400).json({
				ok: false,
				message: 'Este partido ya terminó.',
			});
		}

		const query = `
						UPDATE prediction
						SET local_result = ?, visitor_result = ?
						WHERE student_id = ? AND team_id_local = ? AND team_id_visitor = ? AND stage = ?;
				`;
		const values = [
			local_result,
			visitor_result,
			uid,
			team_id_local,
			team_id_visitor,
			stage,
		];
		const response = await pool.query(query, values);

		return res.status(200).json({
			ok: true,
			message: 'Predicción actualizada.',
			data: response[0],
		});
	} catch (error: any) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			message: 'Internal server error.',
		});
	}
};
