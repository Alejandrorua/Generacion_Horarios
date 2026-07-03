import pool from '../config/db.js';

export const getGrupos = async (req, res) => {
  try {
    // Cruzamos grupos con materias usando id_materia para jalar el nombre real
    const query = `
      SELECT 
        g.id_grupo,
        g.codigo_grupo,
        g.periodo_academico,
		    g.cupo_maximo,
        g.id_materia,
        m.nombre_materia -- Jala la columna exacta que contiene el nombre
      FROM grupos g
      LEFT JOIN materias m ON g.id_materia = m.id_materia
      ORDER BY g.id_grupo DESC;
    `;
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createGrupo = async (req, res) => {
  const { id_materia, id_profesor, codigo_grupo, periodo_academico, cupo_maximo } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO grupos (id_materia, id_profesor, codigo_grupo, periodo_academico, cupo_maximo) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id_materia, id_profesor, codigo_grupo, periodo_academico, cupo_maximo]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};