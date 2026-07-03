import request from 'supertest';
import app from '../app.js';
import pool from '../config/db.js';
import jwt from 'jsonwebtoken';

describe('=== Aula Controller Tests ===', () => {
  let adminToken;

  beforeAll(async () => {
    adminToken = jwt.sign({ id_usuario: 1, rol: 'Administrador' }, process.env.JWT_SECRET || 'secret');
    await pool.query("INSERT INTO edificios (id_edificio, nombre_edificio) VALUES (1, 'Bloque Central') ON CONFLICT DO NOTHING");
  });

  afterAll(async () => {
    await pool.query("DELETE FROM aulas WHERE codigo_aula = 'TEST-LAB'");
    await pool.end();
  });

  it('Caso 1: Debería listar las aulas registradas', async () => {
    const res = await request(app).get('/api/aulas');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('Caso 2: Debería rechazar la creación de un aula si no es administrador', async () => {
    const res = await request(app).post('/api/aulas').send({ codigo_aula: 'TEST-LAB', capacidad: 30 });
    expect(res.statusCode).toEqual(401);
  });

  it('Caso 3: Debería crear un aula exitosamente con token de Administrador', async () => {
    const res = await request(app)
      .post('/api/aulas')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ id_edificio: 1, codigo_aula: 'TEST-LAB', capacidad: 25, tipo_aula: 'Laboratorio' });
      
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('codigo_aula', 'TEST-LAB');
  });

  it('Caso 4: Debería fallar si se intenta crear un aula con datos inválidos', async () => {
    const res = await request(app)
      .post('/api/aulas')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ codigo_aula: '', capacidad: -5 }); // Capacidad no pasa el CHECK de la BD
      
    expect(res.statusCode).toEqual(400);
  });
});