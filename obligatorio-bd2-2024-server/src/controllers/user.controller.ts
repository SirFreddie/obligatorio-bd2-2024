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
		const values = [user.CI, user.name, user.surname, user.mail, user.password, user.role];
		const response = await pool.query(query, values);

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
