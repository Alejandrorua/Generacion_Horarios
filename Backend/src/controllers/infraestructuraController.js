import pool from '../config/db.js';

// EDIFICIOS
export const getEdificios = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM edificios ORDER BY id_edificio');
    res.json(result.rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const createEdificio = async (req, res) => {
  const { nombre_edificio } = req.body;
  try {
    const result = await pool.query('INSERT INTO edificios (nombre_edificio) VALUES ($1) RETURNING *', [nombre_edificio]);
    res.status(201).json(result.rows[0]);
  } catch (error) { res.status(400).json({ error: error.message }); }
};

// AULAS
// export const getAulas = async (req, res) => {
//   try {
//     const result = await pool.query('SELECT a.*, e.nombre_edificio FROM aulas a LEFT JOIN edificios e ON a.id_edificio = e.id_edificio');
//     res.json(result.rows);
//   } catch (error) { res.status(500).json({ error: error.message }); }
// };

// export const createAula = async (req, res) => {
//   const { id_edificio, codigo_aula, capacidad, tipo_aula } = req.body;
//   try {
//     const result = await pool.query(
//       'INSERT INTO aulas (id_edificio, codigo_aula, capacidad, tipo_aula) VALUES ($1, $2, $3, $4) RETURNING *',
//       [id_edificio, codigo_aula, capacidad, tipo_aula]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (error) { res.status(400).json({ error: error.message }); }
// };