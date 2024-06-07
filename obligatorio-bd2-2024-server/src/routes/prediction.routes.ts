import { Router } from 'express';
import {
	createPrediction,
	getPredictions,
} from '../controllers/prediction.controller';

const router = Router();

router.get('/', getPredictions);
router.post('/new', createPrediction);

export default router;
