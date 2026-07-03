import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({ materias: 0, aulas: 0, grupos: 0, inscripciones: 0 });

  useEffect(() => {
    // Consume las APIs de manera simultánea para poblar los contadores rápidamente
    const loadMetrics = async () => {
      try {
        const [m, a, g, i] = await Promise.all([
          api.get('/materias'), api.get('/aulas'), api.get('/grupos'), api.get('/inscripciones')
        ]);
        setMetrics({ materias: m.data.length, aulas: a.data.length, grupos: g.data.length, inscripciones: i.data.length });
      } catch (err) { console.error("Error cargando métricas"); }
    };
    loadMetrics();
  }, []);

  const cards = [
    { title: 'Asignaturas Activas', value: metrics.materias, icon: '📚', color: 'text-sky-600 bg-sky-50 border-sky-100' },
    { title: 'Aulas Disponibles', value: metrics.aulas, icon: '🏛️', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { title: 'Secciones / Grupos', value: metrics.grupos, icon: '👥', color: 'text-violet-600 bg-violet-50 border-violet-100' },
    { title: 'Alumnos Matriculados', value: metrics.inscripciones, icon: '📝', color: 'text-amber-600 bg-amber-50 border-amber-100' },
  ];

  return (
    <div className="p-6 font-sans">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Panel General</h2>
        <p className="text-sm text-slate-500">Estado analítico de la infraestructura académica actual.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, idx) => {
          const borderClass = card.color.split(' ')[2];
          return (
            <div 
              key={idx} 
              className={`bg-white p-5 rounded-2xl border ${borderClass} shadow-sm flex items-center justify-between transition-all hover:scale-[1.02] hover:shadow-md duration-200`}
            >
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.title}</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-2">{card.value}</p>
              </div>
              <div className={`p-3.5 rounded-xl text-2xl ${card.color.split(' ').slice(0, 2).join(' ')}`}>
                {card.icon}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}