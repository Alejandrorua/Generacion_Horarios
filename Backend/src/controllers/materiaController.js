import pool from '../config/db.js';

// 1. OBTENER MATERIAS CON SUS PRERREQUISITOS (Versión Corregida)
export const getMaterias = async (req, res) => {
  try {
    const query = `
      SELECT 
        m.id_materia, 
        m.codigo_materia, 
        m.nombre_materia, 
        m.creditos, 
        m.descripcion,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', mp.id_materia_prerrequisito, 
                'codigo', p.codigo_materia, 
                'nombre', p.nombre_materia
              )
            )
            FROM materias_prerrequisitos mp
            JOIN materias p ON mp.id_materia_prerrequisito = p.id_materia
            WHERE mp.id_materia = m.id_materia
          ), 
          '[]'::json
        ) AS prerrequisitos
      FROM materias m
      ORDER BY m.codigo_materia;
    `;
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. CREAR UNA NUEVA MATERIA (¡Esta es la que te faltaba!)
export const createMateria = async (req, res) => {
  const { codigo_materia, nombre_materia, creditos, descripcion } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO materias (codigo_materia, nombre_materia, creditos, descripcion) VALUES ($1, $2, $3, $4) RETURNING *',
      [codigo_materia, nombre_materia, creditos, descripcion]
    );
    // console.log(result)
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 3. ASIGNAR UN PRERREQUISITO A UNA MATERIA
export const agregarPrerrequisito = async (req, res) => {
  const { id_materia, id_materia_prerrequisito } = req.body;
  
  if (id_materia === id_materia_prerrequisito) {
    return res.status(400).json({ error: "Una materia no puede ser prerrequisito de sí misma." });
  }

  try {
    await pool.query(
      'INSERT INTO materias_prerrequisitos (id_materia, id_materia_prerrequisito) VALUES ($1, $2)',
      [id_materia, id_materia_prerrequisito]
    );
    res.status(201).json({ message: 'Prerrequisito asignado correctamente.' });
  } catch (error) {
    res.status(400).json({ error: 'Error al asignar el prerrequisito. Verifique que no esté duplicado o que ambas materias existan.' });
  }
};