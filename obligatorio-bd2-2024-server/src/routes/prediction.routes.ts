import { Router } from 'express';
import {
	createPrediction,
	getPredictions,
	getStudentPredictions,
	updatePrediction,
} from '../controllers/prediction.controller';
import { validateJWT } from '../middlewares/validate-jwt';
import { validateStudent } from '../middlewares/validate-student';

const router = Router();

router.get('/', [validateJWT, validateJWT], getPredictions);
router.get(
	'/:studentId',
	[validateJWT, validateStudent],
	getStudentPredictions
);
router.put('/', [validateJWT, validateStudent], updatePrediction);
router.post('/new', [validateJWT, validateStudent], createPrediction);

export default router;
