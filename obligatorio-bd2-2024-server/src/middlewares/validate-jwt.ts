import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const validateJWT = async (
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

	try {
		jwt.verify(token, process.env.SECRETKEY!);
		next();
	} catch (error) {
		console.error(error);
		return res.status(401).json({
			ok: false,
			message: 'User not authenticated.',
		});
	}
};
