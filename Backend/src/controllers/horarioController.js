import pool from '../config/db.js';
import { SchedulerEngine } from '../services/schedulerEngine.js';

// 1. Obtener la grilla completa leyendo directamente de la VISTA de Postgres
export const getHorarioCompleto = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vista_horario_completo ORDER BY dia, hora_inicio');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Asignar un horario a un grupo (Con manejo de colisión de aula/hora nativo de Postgres)
export const createHorarioClase = async (req, res) => {
  const { id_grupo, dia, hora_inicio, hora_fin, id_aula } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO horarios_clase (id_grupo, dia, hora_inicio, hora_fin, id_aula) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id_grupo, dia, hora_inicio, hora_fin, id_aula]
    );
    res.status(201).json({ message: "Horario asignado con éxito", data: result.rows[0] });
  } catch (error) {
    // Si Postgres lanza un error debido al CONSTRAINT de exclusión de choques
    if (error.code === '23P11') { 
      return res.status(409).json({ 
        error: "Conflicto de Horario", 
        message: "El aula ya está ocupada en ese día y rango horario seleccionado." 
      });
    }
    res.status(400).json({ error: error.message });
  }
};

// ... Funciones para la generacion de horarios ...

export const generarHorarioAutomatico = async (req, res) => {
  const { periodo_academico, codigo_grupo_defecto } = req.body; // Ej: "2026-1", "Sección A"

  if (!periodo_academico) {
    return res.status(400).json({ error: "El periodo académico es requerido." });
  }

  const client = await pool.connect();

  try {
    // 1. Obtener datos de la Base de Datos para el motor
    const materiasRes = await pool.query('SELECT id_materia FROM materias');
    const aulasRes = await pool.query('SELECT id_aula FROM aulas');
    
    // Traemos usuarios que pertenezcan al rol de Profesor (Asumiendo que el id_rol de Profesor es 2)
    const profesoresRes = await pool.query('SELECT id_usuario FROM usuarios WHERE id_rol = 2 AND activo = TRUE');

    if (materiasRes.rows.length === 0 || aulasRes.rows.length === 0 || profesoresRes.rows.length === 0) {
      return res.status(400).json({ 
        error: "Faltan datos", 
        message: "Asegúrese de tener materias, aulas y profesores registrados para proceder." 
      });
    }

    // 2. Ejecutar el Algoritmo CSP
    const engine = new SchedulerEngine(materiasRes.rows, profesoresRes.rows, aulasRes.rows);
    const resultado = engine.generateSchedule();

    // 3. Persistir en la Base de Datos mediante una Transacción Segura
    await client.query('BEGIN');

    for (const asignacion of resultado.assignments) {
      // A. Crear el grupo operativo de la materia para este periodo
      const grupoRes = await client.query(
        `INSERT INTO grupos (id_materia, id_profesor, codigo_grupo, periodo_academico, cupo_maximo)
         VALUES ($1, $2, $3, $4, 30)
         ON CONFLICT (id_materia, codigo_grupo, periodo_academico) 
         DO UPDATE SET id_profesor = EXCLUDED.id_profesor
         RETURNING id_grupo`,
        [asignacion.id_materia, asignacion.id_profesor, codigo_grupo_defecto || 'U', periodo_academico]
      );

      const id_grupo = grupoRes.rows[0].id_grupo;

      // B. Insertar la franja horaria calculada por el CSP
      await client.query(
        `INSERT INTO horarios_clase (id_grupo, dia, hora_inicio, hora_fin, id_aula)
         VALUES ($1, $2, $3, $4, $5)`,
        [id_grupo, asignacion.dia, asignacion.hora_inicio, asignacion.hora_fin, asignacion.id_aula]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: "Horario automatizado generado y guardado con éxito.",
      eficiencia: `${resultado.fitnessScore.toFixed(2)}%`,
      clases_programadas: resultado.assignments.length
    });

  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ 
      error: "Error durante la generación distribuida", 
      message: error.message 
    });
  } finally {
    client.release();
  }
};

// INSCRIPCIONES
export const getInscripciones = async (req, res) => {
  try {
    const result = await pool.query('SELECT i.*, u.nombre, u.apellido FROM inscripciones i JOIN usuarios u ON i.id_usuario = u.id_usuario');
    res.json(result.rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const inscribirEstudiante = async (req, res) => {
  const { id_usuario, id_grupo } = req.body;
  try {
    const result = await pool.query('INSERT INTO inscripciones (id_usuario, id_grupo) VALUES ($1, $2) RETURNING *', [id_usuario, id_grupo]);
    res.status(201).json(result.rows[0]);
  } catch (error) { res.status(400).json({ error: error.message }); }
};