import { pool } from '../db/config';
import { Request, Response } from 'express';

export const createUser = async (req: Request, res: Response) => {
	try {
		const user: {
			CI: number;
			name: string;
			surname: string;
			mail: string;
			password: string;
			role: string;
		} = req.body;

		const query = `
            INSERT INTO user (CI, name, surname, mail, password, role)
            VALUES (?, ?, ?, ?, ?, ?);
        `;
		const values = [
			user.CI,
			user.name,
			user.surname,
			user.mail,
			user.password,
			user.role,
		];
		await pool.query(query, values);

		if (user.role === 'estudiante'){
			const studentQuery = `
                INSERT INTO student (CI_student, points)
                VALUES (?, ?);
            `;
			const studentValues = [user.CI, 0];
			await pool.query(studentQuery, studentValues);
		} else if (user.role === 'admin'){
			const adminQuery = `
                INSERT INTO admin (CI_admin)
                VALUES (?);
            `;
			const adminValues = [user.CI];
			await pool.query(adminQuery, adminValues);
		}

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
            JOIN student s ON u.CI = s.CI_student;
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
