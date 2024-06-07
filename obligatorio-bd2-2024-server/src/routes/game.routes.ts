import { Router } from 'express';
import {
	createGame,
	getGames,
	updateGame,
} from '../controllers/game.controller';

const router = Router();

router.get('/', getGames);
router.post('/new', createGame);
router.put('/', updateGame);

export default router;
