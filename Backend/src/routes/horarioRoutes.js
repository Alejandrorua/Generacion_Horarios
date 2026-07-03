import { Router } from 'express';
import { 
  getHorarioCompleto, 
  createHorarioClase, 
  procesarAlgoritmo, // <-- Asegúrate de importar el nombre correcto aquí
  generarHorarioAutomatico
} from '../controllers/horarioController.js';
import { verificarToken, permitirRoles } from '../middleware/authMiddleware.js';

const router = Router();

// ==========================================
// 1. RUTA: /api/horarios/
// Nota: Quitamos el '/horario' singular para evitar colisiones con app.js
// ==========================================
router.route('/')
  .get(getHorarioCompleto)
  .post(verificarToken, permitirRoles('Administrador'), createHorarioClase);

// ==========================================
// 2. RUTA: /api/horarios/procesar
// ACCESO: Protegido por Token y Rol de Administrador
// ==========================================
router.route('/procesar')
  .post(verificarToken, permitirRoles('Administrador'), generarHorarioAutomatico);

export default router;