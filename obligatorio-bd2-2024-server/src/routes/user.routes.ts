import { Router } from 'express';
import {
	createUser,
	getPoints,
	getStatistics,
	loginUser,
	renewToken,
} from '../controllers/user.controller';
import { validateJWT } from '../middlewares/validate-jwt';
import { validateAdmin } from '../middlewares/validate-admin';

const router = Router();

router.post('/new', createUser);
router.get('/points', getPoints);
router.post('/login', loginUser);
router.post('/renew', [validateJWT], renewToken);
router.get('/statistics', [validateJWT, validateAdmin], getStatistics);

export default router;
