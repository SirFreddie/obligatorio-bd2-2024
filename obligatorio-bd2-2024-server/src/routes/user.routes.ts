import { Router } from 'express';
import {
	createUser,
	getPoints,
	isValidToken,
	loginUser,
} from '../controllers/user.controller';

const router = Router();

router.post('/new', createUser);
router.get('/points', getPoints);
router.post('/login', loginUser);
router.get('/isValidToken', isValidToken)

export default router;
