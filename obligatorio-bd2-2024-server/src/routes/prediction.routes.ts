import { Router } from 'express';
import {
	createPrediction,
	getPredictions,
	getStudentPredictions,
	updatePrediction,
} from '../controllers/prediction.controller';

const router = Router();

router.get('/', getPredictions);
router.get('/:studentId', getStudentPredictions);
router.put('/', updatePrediction);
router.post('/new', createPrediction);

export default router;
