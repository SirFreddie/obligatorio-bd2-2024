import jwt from 'jsonwebtoken';

const generateJWT = (payload: { uid: string }) => {
	return new Promise((resolve, reject) => {
		jwt.sign(
			payload,
			process.env.SECRETKEY || '',
			{
				expiresIn: '1h',
			},
			(err, token) => {
				if (err) {
					console.error(err);
					reject('Could not generate the JWT');
				} else {
					resolve(token);
				}
			}
		);
	});
};

export default generateJWT;
