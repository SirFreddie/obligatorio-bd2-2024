import { Router } from 'express';
import { createUser, getPoints } from '../controllers/user.controller';

const router = Router();

router.post('/new', createUser);
router.get('/points', getPoints);

export default router;
