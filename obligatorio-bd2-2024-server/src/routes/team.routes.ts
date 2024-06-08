import { Router } from 'express';
import { getTeamById, getTeams } from '../controllers/team.controller';

const router = Router();

router.get('/', getTeams);
router.get('/:team_id', getTeamById);

export default router;
