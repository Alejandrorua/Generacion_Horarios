import pool from '../config/db.js';

export const getAulas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM public.aulas
      INNER JOIN public.edificios ON aulas.id_edificio = edificios.id_edificio
      ORDER BY aulas.id_aula ASC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createAula = async (req, res) => {
  const { id_edificio, codigo_aula, capacidad, tipo_aula } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO aulas (id_edificio, codigo_aula, capacidad, tipo_aula) VALUES ($1, $2, $3, $4) RETURNING *',
      [id_edificio, codigo_aula, capacidad, tipo_aula]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};