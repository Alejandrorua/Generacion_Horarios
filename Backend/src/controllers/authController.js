import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// 1. REGISTRO DE USUARIOS (Con encriptación de contraseña)
export const registrarUsuario = async (req, res) => {
  const { id_rol, nombre, apellido, email, password } = req.body;

  try {
    // Encriptar la contraseña (salts = 10)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await pool.query(
      `INSERT INTO usuarios (id_rol, nombre, apellido, email, password_hash) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id_usuario, nombre, email, id_rol`,
      [id_rol, nombre, apellido, email, passwordHash]
    );

    res.status(201).json({ message: 'Usuario registrado con éxito', usuario: result.rows[0] });
  } catch (error) {
    res.status(400).json({ error: 'El email ya se encuentra registrado o el rol no existe.' });
  }
};

// 2. LOGIN (Verificación y emisión de JWT con Rol)
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Consultar el usuario trayendo el nombre de su rol mediante un JOIN
    const result = await pool.query(
      `SELECT u.*, r.nombre_rol 
       FROM usuarios u 
       JOIN roles r ON u.id_rol = r.id_rol 
       WHERE u.email = $1 AND u.activo = TRUE`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas o usuario inactivo.' });
    }

    const usuario = result.rows[0];

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, usuario.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    // Generar el Token incluyendo el ID, Email y el NOMBRE DEL ROL
    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        email: usuario.email,
        rol: usuario.nombre_rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' } // El token expira en 8 horas
    );

    res.json({
      message: 'Autenticación exitosa',
      token,
      usuario: {
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: usuario.nombre_rol
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRoles = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM roles ORDER BY id_rol');
    res.json(result.rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const createRol = async (req, res) => {
  const { nombre_rol } = req.body;
  try {
    const result = await pool.query('INSERT INTO roles (nombre_rol) VALUES ($1) RETURNING *', [nombre_rol]);
    res.status(201).json(result.rows[0]);
  } catch (error) { res.status(400).json({ error: error.message }); }
};

export const getUsuarios = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT usuarios.id_usuario, usuarios.id_rol, usuarios.nombre, usuarios.apellido, 
             usuarios.email, usuarios.activo, usuarios.fecha_creacion, roles.nombre_rol
      FROM public.usuarios
      INNER JOIN public.roles ON usuarios.id_rol = roles.id_rol
      ORDER BY usuarios.id_usuario ASC
    `);
    res.json(result.rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// export const registrarUsuario = async (req, res) => {
//   const { id_rol, nombre, apellido, email, password } = req.body;
//   try {
//     const salt = await bcrypt.genSalt(10);
//     const passwordHash = await bcrypt.hash(password, salt);
//     const result = await pool.query(
//       `INSERT INTO usuarios (id_rol, nombre, apellido, email, password_hash) 
//        VALUES ($1, $2, $3, $4, $5) RETURNING id_usuario, nombre, email, id_rol`,
//       [id_rol, nombre, apellido, email, passwordHash]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (error) { res.status(400).json({ error: error.message }); }
// };

// export const login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const result = await pool.query(
//       'SELECT u.*, r.nombre_rol FROM usuarios u JOIN roles r ON u.id_rol = r.id_rol WHERE u.email = $1 AND u.activo = TRUE',
//       [email]
//     );
//     if (result.rows.length === 0) return res.status(401).json({ error: 'Usuario no encontrado o inactivo.' });

//     const usuario = result.rows[0];
//     const validPassword = await bcrypt.compare(password, usuario.password_hash);
//     if (!validPassword) return res.status(401).json({ error: 'Contraseña incorrecta.' });

//     const token = jwt.sign({ id_usuario: usuario.id_usuario, email: usuario.email, rol: usuario.nombre_rol }, process.env.JWT_SECRET, { expiresIn: '8h' });
//     res.json({ token, usuario: { nombre: usuario.nombre, rol: usuario.nombre_rol } });
//   } catch (error) { res.status(500).json({ error: error.message }); }
// };