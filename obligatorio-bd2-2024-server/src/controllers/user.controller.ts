import { pool } from '../db/config';
import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import generateJWT from '../helpers/generate-jwt';

export const createUser = async (req: Request, res: Response) => {
	try {
		const user: {
			user_id: number;
			name: string;
			surname: string;
			email: string;
			password: string;
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
				message: 'User not found',
			});
		}

		const user = userResponse[0];
		const validPassword = bcryptjs.compareSync(password, user.password);

		if (!validPassword) {
			return res.status(401).json({
				msg: 'Password is not correct',
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

		const token = await generateJWT(user.user_id.toString(), role);

		delete user.password

		return res.status(200).json({
			ok: true,
			message: 'Correct email and password',
			data: {
				user,
				token,
			},
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			message: 'Internal server error',
		});
	}
};

export const isValidToken = async (req: Request, res: Response) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({
            msg: 'No token provided'
        });
    }

    try {
        jwt.verify(token, process.env.SECRETKEY || '');

        res.status(200).send(true);

    } catch (error) {
        console.error(error);
        res.status(401).json({
            msg: "Invalid token"
        });
    }
};
