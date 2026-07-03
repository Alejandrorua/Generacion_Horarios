import { Router } from 'express';
import { verificarToken, permitirRoles } from '../middlewares/authMiddleware.js';
import { getRoles, createRol, getUsuarios, registrarUsuario, login } from '../controllers/authController.js';
import { getEdificios, createEdificio } from '../controllers/infraestructuraController.js';
import { getAulas, createAula } from '../controllers/aulaController.js'
import { getMaterias, createMateria, agregarPrerrequisito } from '../controllers/materiaController.js';
import { getGrupos, createGrupo } from '../controllers/grupoController.js';
import { getHorarioCompleto, createHorarioClase, generarHorarioAutomatico, getInscripciones, inscribirEstudiante} from '../controllers/horarioController.js';

const router = Router();

// Públicas
router.post('/auth/login', login);
router.post('/auth/registro', registrarUsuario);

// Usuarios y Roles
router.get('/auth/usuarios', verificarToken, getUsuarios);
router.route('/auth/roles')
    .get(verificarToken, getRoles)
    .post(verificarToken, permitirRoles('Administrador'), createRol);

// Infraestructura (Edificios y Aulas)
router.route('/edificios')
    .get(getEdificios)
    .post(verificarToken, permitirRoles('Administrador'), createEdificio);
router.route('/aulas')
    .get(getAulas)
    .post(verificarToken, permitirRoles('Administrador'), createAula);

// Materias y Dependencias
router.route('/materias')
    .get(getMaterias)
    .post(verificarToken, permitirRoles('Administrador'), createMateria);
router.post('/materias/prerrequisitos', verificarToken, permitirRoles('Administrador'), agregarPrerrequisito);

// Operación Académica (Grupos, Horarios e Inscripciones)
router.route('/grupos')
    .get(getGrupos)
    .post(verificarToken, permitirRoles('Administrador'), createGrupo);

// ========================================================
// CORRECCIÓN AQUÍ: Cambiado a '/horarios' (Plural) para coincidir con tu Frontend
// ========================================================
router.route('/horarios')
    .get(getHorarioCompleto)
    .post(verificarToken, permitirRoles('Administrador'), createHorarioClase);

// ========================================================
// CORRECCIÓN AQUÍ: Cambiado a '/horarios/procesar' 
// Ahora coincide exactamente con api.post('/horarios/procesar')
// ========================================================
router.route('/horarios/procesar')
    .post(verificarToken, permitirRoles('Administrador'), generarHorarioAutomatico);

router.route('/inscripciones')
    .get(verificarToken, getInscripciones)
    .post(verificarToken, inscribirEstudiante);

export default router;