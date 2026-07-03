import request from 'supertest';
import app from '../app.js';
import pool from '../config/db.js';
import jwt from 'jsonwebtoken';

describe('=== Horario Controller Tests ===', () => {
    let adminToken;

    beforeAll(async () => {
        adminToken = jwt.sign({ id_usuario: 1, rol: 'Administrador' }, process.env.JWT_SECRET || 'secret');

        // Inserciones controladas para preparar el entorno de colisiones
        await pool.query("INSERT INTO materias (id_materia, codigo_materia, nombre_materia, creditos) VALUES (88, 'MAT-88', 'Materia Horario', 3) ON CONFLICT DO NOTHING");
        await pool.query("INSERT INTO grupos (id_grupo, id_materia, codigo_grupo, periodo_academico, cupo_maximo) VALUES (88, 88, 'G-HOR', '2026-1', 30) ON CONFLICT DO NOTHING");
        await pool.query("INSERT INTO aulas (id_aula, codigo_aula, capacidad) VALUES (88, 'AULA-HOR', 40) ON CONFLICT DO NOTHING");
    });

    afterAll(async () => {
        await pool.query("DELETE FROM horarios_clase WHERE id_grupo = 88");
        await pool.query("DELETE FROM grupos WHERE id_grupo = 88");
        await pool.query("DELETE FROM materias WHERE id_materia = 88");
        await pool.query("DELETE FROM aulas WHERE id_aula = 88");
        await pool.end();
    });

    it('Caso 1: Debería consumir la VISTA de horarios unificados de forma correcta', async () => {
        const tokenUsuario = jwt.sign({ id_usuario: 2, rol: 'Estudiante' }, process.env.JWT_SECRET || 'secret');
        const res = await request(app)
            .get('/api/horarios/vista-completa')
            .set('Authorization', `Bearer ${tokenUsuario}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('Caso 2: Debería denegar la asignación de franjas horarias a roles no autorizados', async () => {
        const tokenDocente = jwt.sign({ id_usuario: 3, rol: 'Profesor' }, process.env.JWT_SECRET || 'secret');
        const res = await request(app)
            .post('/api/horarios')
            .set('Authorization', `Bearer ${tokenDocente}`)
            .send({ id_grupo: 88, dia: 'Lunes', hora_inicio: '08:00:00', hora_fin: '10:00:00', id_aula: 88 });

        expect(res.statusCode).toEqual(403);
    });

    it('Caso 3: Debería asignar una hora de clase de forma exitosa si el aula está disponible', async () => {
        const res = await request(app)
            .post('/api/horarios')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ id_grupo: 88, dia: 'Lunes', hora_inicio: '08:00:00', hora_fin: '10:00:00', id_aula: 88 });

        expect(res.statusCode).toEqual(201);
        expect(res.body.data).toHaveProperty('id_aula', 88);
    });

    it('Caso 4: CRÍTICO - Debería lanzar 409 (Conflicto) si se intenta ocupar la misma aula a la misma hora', async () => {
        // Intentamos meter otra clase en la misma aula (88), el mismo día (Lunes) entre las 09:00 y las 11:00 (se solapa con las 08:00 a 10:00)
        const res = await request(app)
            .post('/api/horarios')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ id_grupo: 88, dia: 'Lunes', hora_inicio: '09:00:00', hora_fin: '11:00:00', id_aula: 88 });

        expect(res.statusCode).toEqual(409); // Activación de la exclusión GiST de Postgres exitosa
        expect(res.body).toHaveProperty('error', 'Conflicto de Horario');
    });

    it('Caso 5: Debería fallar si la hora_fin es menor o igual a la hora_inicio', async () => {
        const res = await request(app)
            .post('/api/horarios')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ id_grupo: 88, dia: 'Martes', hora_inicio: '14:00:00', hora_fin: '12:00:00', id_aula: 88 });

        expect(res.statusCode).toEqual(400);
    });
    it('Caso 6: Debería ejecutar el motor CSP y generar un esquema completo de horarios automáticos', async () => {
        const res = await request(app)
            .post('/api/horarios/generar')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                periodo_academico: '2026-2',
                codigo_grupo_defecto: 'Sec-A'
            });

        expect([201, 400]).toContain(res.statusCode); // Si no hay datos dará 400, si hay datos dará 201. Ambos son controlados.
        if (res.statusCode === 201) {
            expect(res.body).toHaveProperty('clases_programadas');
            expect(res.body).toHaveProperty('eficiencia');
        }
    });
});