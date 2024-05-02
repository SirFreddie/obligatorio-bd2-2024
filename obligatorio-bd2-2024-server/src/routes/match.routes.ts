import { Router } from 'express';

export const router = Router();

router.get('/', (req, res) => {
	return res.status(200).json({
		ok: true,
		msg: 'test',
	});
});

export default router;
