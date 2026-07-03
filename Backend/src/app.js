import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/routes.js';

// import authRoutes from './routes/authRoutes.js'; // <-- Nueva ruta
// import materiaRoutes from './routes/materiaRoutes.js';
// import aulaRoutes from './routes/aulaRoutes.js';
// import grupoRoutes from './routes/grupoRoutes.js';
// import horarioRoutes from './routes/horarioRoutes.js';


const app = express();

app.use(cors());
app.use(express.json());


// Inyección única de endpoints estructurados
app.use('/api', apiRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// // Endpoints de Autenticación
// app.use('/api/auth', authRoutes);

// // Endpoints de Negocio (Horarios, Materias, etc.)
// app.use('/api/materias', materiaRoutes);
// app.use('/api/aulas', aulaRoutes);
// app.use('/api/grupos', grupoRoutes);
// app.use('/api/horarios', horarioRoutes);

// app.use((req, res) => {
//   res.status(404).json({ error: 'Ruta no encontrada' });
// });

export default app;