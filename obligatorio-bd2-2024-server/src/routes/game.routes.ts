import { Router } from 'express';
import { createGame, getGames } from '../controllers/game.controller';

const router = Router();

router.get('/', getGames);
router.post('/new', createGame);

export default router;
