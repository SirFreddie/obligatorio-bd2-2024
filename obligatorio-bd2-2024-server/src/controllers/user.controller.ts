import { pool } from '../db/config';
import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import generateJWT from '../helpers/generate-jwt';

export const createUser = async (req: Request, res: Response) => {
	try {
		const user: {
			user_id: number;
			name: string;
			surname: string;
			email: string;
			password: string;
			career: number;
			first_place_prediction: string;
			second_place_prediction: string;
		} = req.body;

		const salt = bcryptjs.genSaltSync();
		user.password = bcryptjs.hashSync(req.body.password, salt);

		const query = `
            INSERT INTO user (user_id, name, surname, email, password)
            VALUES (?, ?, ?, ?, ?);
        `;
		const values = [
			user.user_id,
			user.name,
			user.surname,
			user.email,
			user.password,
		];
		await pool.query(query, values);

		const studentQuery = `
                INSERT INTO student (student_id, first_place_prediction, second_place_prediction)
                VALUES (?, ?, ?);
            `;
		const studentValues = [
			user.user_id,
			user.first_place_prediction,
			user.second_place_prediction,
		];
		await pool.query(studentQuery, studentValues);

		const careerQuery = `
                INSERT INTO student_career (career_id, student_id)
                VALUES (?, ?);
            `;
		const careerValues = [user.career, user.user_id];
		await pool.query(careerQuery, careerValues);

		return res.status(200).json({
			ok: true,
			message: 'Created user',
			data: user,
		});
	} catch (error: any) {
		console.error(error);
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
		console.error(error);
		return res.status(500).json({
			ok: false,
			message: 'Internal server error',
		});
	}
};

export const loginUser = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	try {
		const userQuery = `
            SELECT * FROM user WHERE email = ?;
		`;
		const [userResponse]: any = await pool.query(userQuery, [email]);

		if (userResponse.length === 0) {
			return res.status(404).json({
				ok: false,
				message: 'Incorrect email or password.',
			});
		}

		const user = userResponse[0];
		const validPassword = bcryptjs.compareSync(password, user.password);

		if (!validPassword) {
			return res.status(401).json({
				msg: 'Incorrect email or password.',
			});
		}

		let role = 'student';

		const adminQuery = `
            SELECT * FROM admin WHERE admin_id = ?;
		`;
		const [adminResponse]: any = await pool.query(adminQuery, [user.user_id]);

		if (adminResponse.length > 0) {
			role = 'admin';
		}

		const token = await generateJWT(user.user_id.toString());

		delete user.password;
		user.role = role;

		return res.status(200).json({
			ok: true,
			message: 'Correct email and password',
			data: {
				user,
				token,
			},
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			ok: false,
			message: 'Internal server error',
		});
	}
};

export const renewToken = async (req: Request, res: Response) => {
	const token = req.header('Authorization');

	if (!token) {
		return res.status(400).json({
			errors: [{ msg: 'No token.' }],
		});
	}

	const { uid } = jwt.decode(token) as JwtPayload;

	try {
		const newToken = await generateJWT(uid);

		const userQuery = `
						SELECT * FROM user WHERE user_id = ?;
				`;
		const [userResponse]: any = await pool.query(userQuery, [uid]);

		if (userResponse.length === 0) {
			return res.status(404).json({
				errors: [{ msg: 'User not found.' }],
			});
		}

		const user = userResponse[0];

		let role = 'student';

		const adminQuery = `
            SELECT * FROM admin WHERE admin_id = ?;
		`;
		const [adminResponse]: any = await pool.query(adminQuery, [user.user_id]);

		if (adminResponse.length > 0) {
			role = 'admin';
		}

		delete user.password;
		user.role = role;

		return res.status(200).json({
			ok: true,
			data: {
				user,
				token: newToken,
			},
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			errors: [{ msg: 'Internal server error.' }],
		});
	}
};
