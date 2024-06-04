import { pool } from '../db/config';
import { Request, Response } from 'express';

export const createUser = async (req: Request, res: Response) => {
	try {
		const user: {
			user_id: number;
			name: string;
			surname: string;
			mail: string;
			password: string;
			first_place_prediction: string;
			second_place_prediction: string;
		} = req.body;

		const query = `
            INSERT INTO user (user_id, name, surname, email, password)
            VALUES (?, ?, ?, ?, ?);
        `;
		const values = [
			user.user_id,
			user.name,
			user.surname,
			user.mail,
			user.password,
		];
		await pool.query(query, values);

		const studentQuery = `
                INSERT INTO student (student_id, first_place_prediction, second_place_prediction)
                VALUES (?, ?);
            `;
		const studentValues = [user.user_id, 0];
		await pool.query(studentQuery, studentValues);

		return res.status(200).json({
			ok: true,
			message: 'Created user',
			data: user,
		});
	} catch (error: any) {
		console.log(error);
		if (error.code === 'ER_DUP_ENTRY') {
			return res.status(409).json({
				ok: false,
				message: 'There is already a user with that CI',
			});
		}
		return res.status(500).json({
			ok: false,
			message: 'Internal server error',
		});
	}
};

export const getPoints = async (req: Request, res: Response) => {
	try {
		const query = `
            SELECT u.name, u.surname, s.points
            FROM user u
            JOIN student s ON u.user_id = s.student_id
						ORDER BY s.points DESC;
        `;
		const [rows] = await pool.query(query);

		return res.status(200).json({
			ok: true,
			data: rows,
		});
	} catch (error: any) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			message: 'Internal server error',
		});
	}
};
