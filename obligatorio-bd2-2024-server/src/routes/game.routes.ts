import { Router } from 'express';
import {
	createGame,
	getGames,
	updateGame,
} from '../controllers/game.controller';
import { validateJWT } from '../middlewares/validate-jwt';
import { validateAdmin } from '../middlewares/validate-admin';

const router = Router();

router.get('/', getGames);
router.post('/new', [validateJWT, validateAdmin], createGame);
router.put('/', [validateJWT, validateAdmin], updateGame);

export default router;
