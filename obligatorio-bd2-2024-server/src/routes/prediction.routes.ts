import { Router } from 'express';
import {
	createPrediction,
	getPredictions,
	getStudentPredictions,
} from '../controllers/prediction.controller';

const router = Router();

router.get('/', getPredictions);
router.get('/:studentId', getStudentPredictions);
router.post('/new', createPrediction);

export default router;
