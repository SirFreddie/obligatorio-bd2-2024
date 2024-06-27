import { pool } from '../db/config';
import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import generateJWT from '../helpers/generate-jwt';

export const createUser = async (req: Request, res: Response) => {
	let connection;
	try {
		connection = await pool.getConnection();

		await connection.beginTransaction();

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
		await connection.query(query, values);

		const studentQuery = `
                INSERT INTO student (student_id, first_place_prediction, second_place_prediction)
                VALUES (?, ?, ?);
            `;
		const studentValues = [
			user.user_id,
			user.first_place_prediction,
			user.second_place_prediction,
		];
		await connection.query(studentQuery, studentValues);

		const careerQuery = `
                INSERT INTO student_career (career_id, student_id)
                VALUES (?, ?);
            `;
		const careerValues = [user.career, user.user_id];
		await connection.query(careerQuery, careerValues);

		await connection.commit();

		return res.status(200).json({
			ok: true,
			message: 'Created user',
			data: user,
		});
	} catch (error: any) {
		if (connection) {
			await connection.rollback();
		}
		console.error(error);
		if (error.code === 'ER_DUP_ENTRY') {
			return res.status(409).json({
				ok: false,
				message: 'Ya existe un usuario con esa CI.',
			});
		}
		if (error.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
			return res.status(400).json({
				ok: false,
				message: 'Las predicciones no pueden ser iguales.',
			});
		}
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

export const getPoints = async (req: Request, res: Response) => {
	try {
		const query = `
            SELECT u.name, u.surname, u.user_id, s.points
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
			message: 'Internal server error.',
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
				message: 'Email o contraseña incorrecta.',
			});
		}

		const user = userResponse[0];
		const validPassword = bcryptjs.compareSync(password, user.password);

		if (!validPassword) {
			return res.status(401).json({
				message: 'Email o contraseña incorrecta.',
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

		const payload = {
			uid: user.user_id,
			role,
		};
		const token = await generateJWT(payload);

		if (role === 'student') {
			const studentQuery = `
				SELECT * FROM student WHERE student_id = ?;
			`;
			const [studentResponse]: any = await pool.query(studentQuery, [
				user.user_id,
			]);

			user.points = studentResponse[0].points;
		}

		delete user.password;
		user.role = role;

		return res.status(200).json({
			ok: true,
			message: 'Email y contraseña correctos.',
			data: {
				user,
				token,
			},
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			ok: false,
			message: 'Internal server error.',
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

	const { uid, role } = jwt.decode(token) as JwtPayload;

	try {
		const payload = {
			uid,
			role,
		};
		const newToken = await generateJWT(payload);

		const userQuery = `
						SELECT * FROM user WHERE user_id = ?;
				`;
		const [userResponse]: any = await pool.query(userQuery, [uid]);

		if (userResponse.length === 0) {
			return res.status(404).json({
				errors: [{ msg: 'Usuario no encontrado.' }],
			});
		}

		const user = userResponse[0];

		let userRole = 'student';

		const adminQuery = `
            SELECT * FROM admin WHERE admin_id = ?;
		`;
		const [adminResponse]: any = await pool.query(adminQuery, [user.user_id]);

		if (adminResponse.length > 0) {
			userRole = 'admin';
		}

		if (userRole === 'student') {
			const studentQuery = `
				SELECT * FROM student WHERE student_id = ?;
			`;
			const [studentResponse]: any = await pool.query(studentQuery, [
				user.user_id,
			]);

			user.points = studentResponse[0].points;
		}

		delete user.password;
		user.role = userRole;

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

export const getStatistics = async (req: Request, res: Response) => {
	try {
		const query = `
			SELECT
			c.name AS career_name,
			AVG(
					CASE
							WHEN p.local_result = g.local_result AND p.visitor_result = g.visitor_result THEN 1
							ELSE 0
					END
			) * 100 AS accuracy_percentage
			FROM
					career c
			JOIN
					student_career sc ON c.career_id = sc.career_id
			JOIN
					student s ON sc.student_id = s.student_id
			JOIN
					prediction p ON s.student_id = p.student_id
			JOIN
					game g ON p.stage = g.stage AND p.team_id_local = g.team_id_local AND p.team_id_visitor = g.team_id_visitor
			GROUP BY
					c.name;
		`;

		const [statistics]: any = await pool.query(query);
		return res.status(200).json({
			ok: true,
			data: {
				statistics,
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
