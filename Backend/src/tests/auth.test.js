import request from 'supertest';
import app from '../app.js';
import pool from '../config/db.js';

// Configuración previa a los tests
beforeAll(async () => {
  // Opcional: Asegurarse de que existan los roles mínimos en la base de datos de pruebas
  await pool.query("INSERT INTO roles (id_rol, nombre_rol) VALUES (1, 'Administrador') ON CONFLICT DO NOTHING");
});

// Limpieza posterior a los tests
afterAll(async () => {
  // Limpiamos el usuario de prueba y cerramos la conexión de la base de datos
  await pool.query("DELETE FROM usuarios WHERE email = 'testuser@universidad.com'");
  await pool.end(); 
});

describe('=== Tests de Autenticación (Auth API) ===', () => {

  it('Debería registrar un nuevo usuario exitosamente', async () => {
    const res = await request(app)
      .post('/api/auth/registro')
      .send({
        id_rol: 1,
        nombre: 'Alejandro',
        apellido: 'Prueba',
        email: 'testuser@universidad.com',
        password: 'password123'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Usuario registrado con éxito');
    expect(res.body.usuario).toHaveProperty('email', 'testuser@universidad.com');
  });

  it('Debería fallar al intentar loguearse con credenciales incorrectas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@universidad.com',
        password: 'clave_incorrecta'
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error');
  });

  it('Debería loguearse con éxito y retornar un Token JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@universidad.com',
        password: 'password123'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.usuario).toHaveProperty('rol', 'Administrador');
  });
});