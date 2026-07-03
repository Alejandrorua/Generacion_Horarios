import { verificarToken, permitirRoles } from '../middlewares/authMiddleware.js';
import jwt from 'jsonwebtoken';

describe('=== Auth Middleware Tests ===', () => {
  let mockReq, mockRes, nextFunction;

  beforeEach(() => {
    mockReq = { header: jest.fn().mockReturnValue(null) };
    mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    nextFunction = jest.fn();
    process.env.JWT_SECRET = 'test_secret';
  });

  it('Caso 1: Debería denegar el acceso si no hay cabecera Authorization', () => {
    verificarToken(mockReq, mockRes, nextFunction);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Acceso denegado. Token no proporcionado.' });
  });

  it('Caso 2: Debería denegar el acceso si el token es inválido o corrupto', () => {
    mockReq.header = jest.fn().mockReturnValue('Bearer token_falso_y_mal_formado');
    verificarToken(mockReq, mockRes, nextFunction);
    expect(mockRes.status).toHaveBeenCalledWith(403);
  });

  it('Caso 3: Debería permitir el paso (next) si el token es completamente válido', () => {
    const tokenValido = jwt.sign({ id_usuario: 1, rol: 'Estudiante' }, 'test_secret');
    mockReq.header = jest.fn().mockReturnValue(`Bearer ${tokenValido}`);
    
    verificarToken(mockReq, mockRes, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockReq.user).toHaveProperty('rol', 'Estudiante');
  });

  it('Caso 4: permitirRoles debería bloquear si el usuario no cuenta con el rol requerido', () => {
    mockReq.user = { rol: 'Estudiante' };
    const middleware = permitirRoles('Administrador');
    
    middleware(mockReq, mockRes, nextFunction);
    expect(mockRes.status).toHaveBeenCalledWith(403);
  });

  it('Caso 5: permitirRoles debería autorizar si el usuario tiene el rol correcto', () => {
    mockReq.user = { rol: 'Administrador' };
    const middleware = permitirRoles('Administrador', 'Profesor');
    
    middleware(mockReq, mockRes, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });
});