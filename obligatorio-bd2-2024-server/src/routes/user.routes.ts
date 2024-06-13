import { Router } from 'express';
import {
	createUser,
	getPoints,
	loginUser,
	renewToken,
} from '../controllers/user.controller';

const router = Router();

router.post('/new', createUser);
router.get('/points', getPoints);
router.post('/login', loginUser);
router.post('/renew', renewToken);

export default router;
