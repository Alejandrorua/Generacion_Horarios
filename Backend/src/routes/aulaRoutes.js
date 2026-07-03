import { Router } from 'express';
import { getAulas, createAula } from '../controllers/aulaController.js';
const router = Router();

router.route('/').get(getAulas).post(createAula);
export default router;