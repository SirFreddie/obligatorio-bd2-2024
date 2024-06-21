import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const validateStudent = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.header('Authorization');

	if (!token) {
		return res.status(401).json({
			ok: false,
			message: 'No token provided.',
		});
	}

	const { role } = jwt.decode(token) as JwtPayload;

	if (role !== 'student') {
		return res.status(401).json({
			ok: false,
			message: 'User not authorized.',
		});
	}

	next();
};
