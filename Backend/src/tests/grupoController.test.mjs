import request from 'supertest';
import app from '../app.js';
import pool from '../config/db.js';
import jwt from 'jsonwebtoken';

describe('=== Grupo Controller Tests ===', () => {
  let adminToken;

  beforeAll(async () => {
    adminToken = jwt.sign({ id_usuario: 1, rol: 'Administrador' }, process.env.JWT_SECRET || 'secret');
    // Forzar datos base obligatorios
    await pool.query("INSERT INTO materias (id_materia, codigo_materia, nombre_materia, creditos) VALUES (99, 'MAT-99', 'Materia Base', 4) ON CONFLICT DO NOTHING");
  });

  afterAll(async () => {
    await pool.query("DELETE FROM grupos WHERE codigo_grupo = 'G-TEST'");
    await pool.query("DELETE FROM materias WHERE id_materia = 99");
    await pool.end();
  });

  it('Caso 1: Debería obtener todos los grupos', async () => {
    const res = await request(app).get('/api/grupos');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('Caso 2: Debería denegar la creación de grupos a usuarios anónimos', async () => {
    const res = await request(app).post('/api/grupos').send({ codigo_grupo: 'G-TEST' });
    expect(res.statusCode).toEqual(401);
  });

  it('Caso 3: Debería registrar un grupo vinculándolo a una materia', async () => {
    const res = await request(app)
      .post('/api/grupos')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ id_materia: 99, codigo_grupo: 'G-TEST', periodo_academico: '2026-1', cupo_maximo: 40 });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('codigo_grupo', 'G-TEST');
  });

  it('Caso 4: Debería rebotar la inserción si el código de grupo ya existe en el mismo periodo', async () => {
    const res = await request(app)
      .post('/api/grupos')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ id_materia: 99, codigo_grupo: 'G-TEST', periodo_academico: '2026-1', cupo_maximo: 40 });

    expect(res.statusCode).toEqual(400); // Falla por restricción UNIQUE de la BD
  });
});