import { pool } from '../db/config';
import { Request, Response } from 'express';

export const getGames = async (req: Request, res: Response) => {
	try {
		const query = `
            SELECT g.*, tl.teamCode as teamLocaleCode, tv.teamCode as teamVisitorCode
      FROM game g
      JOIN team tl ON g.team_id_local = tl.team_id
      JOIN team tv ON g.team_id_visitor = tv.team_id
      ORDER BY g.date;
        `;
		const [games] = await pool.query(query);

		return res.status(200).json({
			ok: true,
			data: games,
		});
	} catch (error: any) {
		console.error(error);
		return res.status(500).json({
			ok: false,
			message: 'Internal server error.',
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
			message: 'Partido creado',
			data: response[0],
		});
	} catch (error: any) {
		console.error(error);
		if (error.code === 'ER_DUP_ENTRY') {
			return res.status(409).json({
				ok: false,
				message: 'Ya hay un juego con ese ID.',
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

export const updateGame = async (req: Request, res: Response) => {
	let connection;
	try {
		connection = await pool.getConnection();
		await connection.beginTransaction();

		const game: {
			stage: string;
			team_id_local: string;
			team_id_visitor: string;
			local_result: number;
			visitor_result: number;
		} = req.body;

		const updateGameQuery = `
						UPDATE game
						SET local_result = ?, visitor_result = ?
						WHERE stage = ? AND team_id_local = ? AND team_id_visitor = ?;
				`;
		const updateGameValues = [
			game.local_result,
			game.visitor_result,
			game.stage,
			game.team_id_local,
			game.team_id_visitor,
		];
		await connection.query(updateGameQuery, updateGameValues);

		const getPredictionsQuery = `
						SELECT *
						FROM prediction
						WHERE stage = ? AND team_id_local = ? AND team_id_visitor = ?;
				`;
		const getPredictionsValues = [
			game.stage,
			game.team_id_local,
			game.team_id_visitor,
		];

		const [predictions] = await connection.query(
			getPredictionsQuery,
			getPredictionsValues
		);

		const updatePredictionsQuery = `
						UPDATE prediction
						SET points = ?
						WHERE stage = ? AND team_id_local = ? AND team_id_visitor = ?;
				`;

		const updateUsersQuery = `
						UPDATE student
						SET points = points + ?
						WHERE student_id = ?;
				`;

		const getStudentsQuery = `
						SELECT *
						FROM student
						WHERE student_id = ?;
				`;

		for (const prediction of predictions) {
			let points = 0;
			if (game.stage === 'Final') {
				const firtsPlaceTeam =
					game.local_result > game.visitor_result
						? game.team_id_local
						: game.team_id_visitor;
				const secondPlaceTeam =
					game.local_result < game.visitor_result
						? game.team_id_local
						: game.team_id_visitor;

				const getStudentsValues = [prediction.student_id];
				const [student] = await connection.query(
					getStudentsQuery,
					getStudentsValues
				);

				if (student[0].first_place_prediction === firtsPlaceTeam) {
					points += 10;
				}
				if (student[0].second_place_prediction === secondPlaceTeam) {
					points += 5;
				}
			}

			if (
				prediction.local_result === game.local_result &&
				prediction.visitor_result === game.visitor_result
			) {
				points += 4;
			} else if (
				prediction.local_result === game.local_result ||
				prediction.visitor_result === game.visitor_result
			) {
				points += 2;
			}

			const updatePredictionValues = [
				points,
				game.stage,
				game.team_id_local,
				game.team_id_visitor,
			];
			await connection.query(updatePredictionsQuery, updatePredictionValues);
			const updateStudentValues = [points, prediction.student_id];
			await connection.query(updateUsersQuery, updateStudentValues);
		}

		await connection.commit();

		return res.status(200).json({
			ok: true,
			message: 'Juego cargado y predicciones puntuadas.',
		});
	} catch (error: any) {
		if (connection) {
			await connection.rollback();
		}
		console.error(error);
		return res.status(500).json({
			ok: false,
			message: 'Internal server error.',
		});
	} finally {
		if (connection) {
			await connection.release();
		}
	}
};
