import { Router } from 'express';
import { getMaterias, createMateria, agregarPrerrequisito } from '../controllers/materiaController.js';
import { verificarToken, permitirRoles } from '../middlewares/authMiddleware.js';

const router = Router();

// Rutas base
router.route('/')
  .get(getMaterias)
  .post(verificarToken, permitirRoles('Administrador'), createMateria);

// Nueva ruta para añadir prerrequisitos (Solo Admin)
router.route('/prerrequisitos')
  .post(verificarToken, permitirRoles('Administrador'), agregarPrerrequisito);

export default router;