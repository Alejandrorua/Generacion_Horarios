import jwt from 'jsonwebtoken';

// Middleware para verificar si el usuario está logueado (Token válido)
export const verificarToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Espera formato: Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verificado; // Guardamos los datos del usuario deserializados en el objeto de la petición
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token inválido o expirado.' });
  }
};

// Middleware para restringir por roles específicos (Ej: 'Administrador', 'Profesor')
export const permitirRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ 
        error: 'Permisos insuficientes', 
        message: `Esta acción requiere uno de los siguientes roles: [${rolesPermitidos.join(', ')}]` 
      });
    }
    next();
  };
};