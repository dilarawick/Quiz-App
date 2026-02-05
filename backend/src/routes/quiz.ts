import { Router } from 'express';
import { getQuestions, createSessionToken, resetSessionToken } from '../controllers/quizController';

const router = Router();

router.get('/questions', getQuestions);
router.post('/session', createSessionToken);
router.put('/session/reset', resetSessionToken);

export default router;