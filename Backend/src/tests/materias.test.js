import request from 'supertest';
import app from '../app.js';
import pool from '../config/db.js';

afterAll(async () => {
  // Cerrar el pool de conexiones al terminar las pruebas de este archivo
  await pool.end();
});

describe('=== Tests de la API de Materias ===', () => {

  it('Debería obtener el listado de materias con su array de prerrequisitos', async () => {
    const res = await request(app)
      .get('/api/materias');

    // Comprobamos que el servidor responda OK (200)
    expect(res.statusCode).toEqual(200);
    
    // Comprobamos que la respuesta sea un arreglo de elementos
    expect(Array.isArray(res.body)).toBeTruthy();

    // Si existen materias cargadas, validamos la estructura interna que diseñamos
    if (res.body.length > 0) {
      const primeraMateria = res.body[0];
      expect(primeraMateria).toHaveProperty('id_materia');
      expect(primeraMateria).toHaveProperty('codigo_materia');
      expect(primeraMateria).toHaveProperty('nombre_materia');
      expect(primeraMateria).toHaveProperty('prerrequisitos');
      // Validamos que 'prerrequisitos' sea efectivamente un arreglo (gracias al json_agg de Postgres)
      expect(Array.isArray(primeraMateria.prerrequisitos)).toBeTruthy();
    }
  });

  it('Debería denegar la creación de materias si no se envía un Token', async () => {
    const res = await request(app)
      .post('/api/materias')
      .send({
        codigo_materia: 'INF-999',
        nombre_materia: 'Materia de Prueba Insegura',
        creditos: 3,
        descripcion: 'Ninguna'
      });

    // Debe rebotar con 401 debido al middleware 'verificarToken'
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error', 'Acceso denegado. Token no proporcionado.');
  });
});