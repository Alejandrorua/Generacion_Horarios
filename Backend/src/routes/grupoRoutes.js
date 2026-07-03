import { Router } from 'express';
import { getGrupos, createGrupo } from '../controllers/grupoController.js';
const router = Router();

router.route('/').get(getGrupos).post(createGrupo);
export default router;