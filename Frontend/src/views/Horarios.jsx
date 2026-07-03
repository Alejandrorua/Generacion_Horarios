import { useEffect, useState } from 'react';
import api from '../api/axios';

// Función para generar colores HSL pasteles de forma determinista para cada curso
const getPastelColor = (name) => {
  if (!name) return { backgroundColor: '#f8fafc', color: '#334155', borderColor: '#e2e8f0' };
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return {
    backgroundColor: `hsla(${hue}, 80%, 95%, 1)`,
    color: `hsla(${hue}, 85%, 25%, 1)`,
    borderColor: `hsla(${hue}, 50%, 80%, 1)`
  };
};

export default function Horarios() {
  const [horarios, setHorarios] = useState([]);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loadingGenerar, setLoadingGenerar] = useState(false);

  // Estados de vista y filtros
  const [vistaCalendario, setVistaCalendario] = useState(true);
  const [filtroAula, setFiltroAula] = useState('');
  const [filtroProfesor, setFiltroProfesor] = useState('');
  const [filtroMateria, setFiltroMateria] = useState('');

  // Estado del modal de generación
  const [showGenModal, setShowGenModal] = useState(false);
  const [periodoGen, setPeriodoGen] = useState('2026-1');
  const [grupoGen, setGrupoGen] = useState('SEC-A');

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const bloquesHorarios = [
    { inicio: '07:00:00', fin: '09:00:00', label: '07:00 - 09:00' },
    { inicio: '09:00:00', fin: '11:00:00', label: '09:00 - 11:00' },
    { inicio: '11:00:00', fin: '13:00:00', label: '11:00 - 13:00' },
    { inicio: '14:00:00', fin: '16:00:00', label: '14:00 - 16:00' },
    { inicio: '16:00:00', fin: '18:00:00', label: '16:00 - 18:00' },
    { inicio: '18:00:00', fin: '20:00:00', label: '18:00 - 20:00' },
  ];

  // 1. ENDPOINT GET: Consumir la lista de horarios ya existentes en la BD
  const fetchHorarios = async () => {
    setLoadingFetch(true);
    try {
      const { data } = await api.get('/horarios');
      setHorarios(data);
    } catch (err) {
      console.error("Error al traer franjas horarias:", err);
    } finally {
      setLoadingFetch(false);
    }
  };

  useEffect(() => { 
    fetchHorarios(); 
  }, []);

  // 2. ENDPOINT POST: Consumir el motor externo /procesar (Scheduler Engine)
  const handleProcesarAlgoritmo = async (e) => {
    e.preventDefault();
    setLoadingGenerar(true);
    try {
      const response = await api.post('/horarios/procesar', {
        periodo_academico: periodoGen,
        codigo_grupo_defecto: grupoGen
      });
      
      alert(`¡Éxito!\n${response.data.message}\nClases programadas: ${response.data.clases_programadas}\nEficiencia: ${response.data.eficiencia}`);
      setShowGenModal(false);
      fetchHorarios();
    } catch (error) {
      alert(error.response?.data?.error || error.response?.data?.message || "Error crítico en el motor de asignación por restricciones");
    } finally {
      setLoadingGenerar(false);
    }
  };

  // Obtener valores únicos para filtros dinámicos
  const uniqueAulas = [...new Set(horarios.map(h => h.codigo_aula || h.id_aula).filter(Boolean))].sort();
  const uniqueProfesores = [...new Set(horarios.map(h => h.profesor).filter(Boolean))].sort();
  const uniqueMaterias = [...new Set(horarios.map(h => h.nombre_materia || h.materia).filter(Boolean))].sort();

  // Filtrado de datos
  const filteredHorarios = horarios.filter(h => {
    const matchAula = filtroAula ? (h.codigo_aula === filtroAula || String(h.id_aula) === filtroAula) : true;
    const matchProf = filtroProfesor ? (h.profesor === filtroProfesor) : true;
    const matchMat = filtroMateria ? ((h.nombre_materia === filtroMateria) || (h.materia === filtroMateria)) : true;
    return matchAula && matchProf && matchMat;
  });

  const clearFilters = () => {
    setFiltroAula('');
    setFiltroProfesor('');
    setFiltroMateria('');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Cabecera Principal */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Distribución Horaria Académica</h2>
          <p className="text-sm text-slate-500">Visualización de distribución espacial de aulas y maestros por bloques.</p>
        </div>
        
        {/* Botón de Generación Inteligente */}
        <button 
          onClick={() => setShowGenModal(true)}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
        >
          ⚙️ Generación CSP Inteligente
        </button>
      </div>

      {/* Panel de Filtros y Configuración de Vista */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
          {/* Filtro por Aula */}
          <select 
            value={filtroAula}
            onChange={e => setFiltroAula(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white outline-none focus:border-indigo-500"
          >
            <option value="">Filtrar por Aula (Todas)</option>
            {uniqueAulas.map(aula => (
              <option key={aula} value={aula}>Aula: {aula}</option>
            ))}
          </select>

          {/* Filtro por Profesor */}
          <select 
            value={filtroProfesor}
            onChange={e => setFiltroProfesor(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white outline-none focus:border-indigo-500"
          >
            <option value="">Filtrar por Docente (Todos)</option>
            {uniqueProfesores.map(prof => (
              <option key={prof} value={prof}>{prof}</option>
            ))}
          </select>

          {/* Filtro por Materia */}
          <select 
            value={filtroMateria}
            onChange={e => setFiltroMateria(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white outline-none focus:border-indigo-500"
          >
            <option value="">Filtrar por Asignatura (Todas)</option>
            {uniqueMaterias.map(mat => (
              <option key={mat} value={mat}>{mat}</option>
            ))}
          </select>
        </div>

        {/* Acciones de Filtro y Switcher de Vista */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {(filtroAula || filtroProfesor || filtroMateria) && (
            <button 
              onClick={clearFilters}
              className="text-xs text-rose-500 hover:text-rose-600 font-semibold px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
            >
              Limpiar filtros
            </button>
          )}

          <div className="bg-slate-100 p-1 rounded-xl flex items-center">
            <button 
              onClick={() => setVistaCalendario(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                vistaCalendario 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              📅 Calendario
            </button>
            <button 
              onClick={() => setVistaCalendario(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                !vistaCalendario 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              📋 Tarjetas
            </button>
          </div>
        </div>
      </div>

      {/* Grid de Horarios Dinámicos */}
      {loadingFetch ? (
        <div className="flex justify-center items-center min-h-[350px] bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            <p className="text-xs text-slate-400 font-medium">Cargando distribución académica...</p>
          </div>
        </div>
      ) : filteredHorarios.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl p-16 text-center max-w-xl mx-auto shadow-sm">
          <span className="text-4xl block mb-4">🗓️</span>
          <p className="text-slate-700 font-bold text-lg mb-1">No hay horarios que coincidan</p>
          <p className="text-slate-400 text-xs max-w-md mx-auto">
            {horarios.length === 0 
              ? 'Presiona el botón superior "Generación CSP Inteligente" para construir la grilla automatizada.' 
              : 'Prueba a cambiar tus filtros de búsqueda en la barra superior.'}
          </p>
        </div>
      ) : vistaCalendario ? (
        /* Vista de Calendario / Timetable Grid */
        <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm bg-white">
          <table className="w-full border-collapse min-w-[950px] text-left table-fixed font-sans">
            <thead>
              <tr className="bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider">
                <th className="p-4 w-36 border-b border-slate-800">Bloque Horario</th>
                {diasSemana.map(d => (
                  <th key={d} className="p-4 border-b border-slate-800">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {bloquesHorarios.map(bloque => (
                <tr key={bloque.inicio} className="hover:bg-slate-50/20">
                  <td className="p-4 font-semibold bg-slate-50/40 align-middle border-r border-slate-100 text-slate-700">
                    <div className="text-xs font-bold">{bloque.label}</div>
                    <div className="text-[9px] text-slate-400 font-mono mt-0.5">Franja estándar</div>
                  </td>
                  {diasSemana.map(d => {
                    const classesInCell = filteredHorarios.filter(h => 
                      (h.dia_semana === d || h.dia === d) && 
                      h.hora_inicio?.slice(0, 5) === bloque.inicio.slice(0, 5)
                    );
                    return (
                      <td key={d} className="p-2 border-r border-slate-100 align-top min-h-[140px] bg-slate-50/10">
                        <div className="flex flex-col gap-2 h-full">
                          {classesInCell.map((c, idx) => {
                            const style = getPastelColor(c.nombre_materia || c.materia);
                            return (
                              <div 
                                key={c.id_horario || idx} 
                                style={{
                                  backgroundColor: style.backgroundColor,
                                  color: style.color,
                                  borderColor: style.borderColor,
                                }}
                                className="p-3 rounded-xl border text-xs shadow-sm flex flex-col gap-1.5 transition-all hover:scale-[1.02] hover:shadow-md duration-200"
                              >
                                <div className="font-extrabold leading-tight text-[11px]">
                                  {c.nombre_materia || c.materia}
                                </div>
                                <div className="flex items-center justify-between text-[10px] opacity-90 font-semibold border-t border-black/5 pt-1 mt-1">
                                  <span>🏫 Aula: {c.codigo_aula || 'S/A'}</span>
                                  <span className="bg-white/40 px-1 rounded font-mono text-[9px]">G: {c.codigo_grupo}</span>
                                </div>
                                <div className="text-[10px] opacity-80 truncate" title={c.profesor || 'Sin Docente'}>
                                  👤 {c.profesor || 'Sin Docente'}
                                </div>
                              </div>
                            );
                          })}
                          {classesInCell.length === 0 && (
                            <span className="text-[10px] text-slate-300 italic block text-center py-8">-</span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Vista de Lista / Tarjetas (Original) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHorarios.map((h, index) => {
            return (
              <div 
                key={h.id_horario || index} 
                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                      {h.dia_semana || h.dia || 'No asignado'}
                    </span>
                    <span className="text-slate-500 font-mono text-xs font-semibold bg-slate-50 px-2 py-1 rounded-md">
                      {h.hora_inicio?.slice(0, 5)} - {h.hora_fin?.slice(0, 5)}
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-0.5">Asignatura / Curso</p>
                  <p className="text-base font-bold text-slate-900 leading-tight mb-3">
                    {h.nombre_materia || h.materia || h.nombre || `Grupo Operativo #${h.id_grupo}`}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-col gap-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      📍 Aula: <strong className="text-slate-950 font-semibold">{h.codigo_aula || h.id_aula || 'S/A'}</strong>
                    </span>
                    <span className="text-slate-400 font-mono font-semibold bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                      Sec: {h.codigo_grupo || h.id_grupo}
                    </span>
                  </div>
                  <div className="text-slate-500 truncate mt-1">
                    👤 Docente: <span className="font-medium text-slate-700">{h.profesor || 'Sin Docente'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Configuración para la Generación Inteligente CSP */}
      {showGenModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Configurar Motor CSP</h3>
                <p className="text-xs text-slate-400">Parámetros para la optimización de asignación de horarios.</p>
              </div>
              <button 
                onClick={() => setShowGenModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold bg-slate-100 p-1.5 rounded-lg"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleProcesarAlgoritmo} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-800 leading-relaxed">
                ⚠️ <strong>Aviso Importante:</strong> La generación automática utiliza algoritmos CSP para cruzar materias, aulas y profesores disponibles. Este proceso agregará nuevos grupos y asignará franjas horarias sin colisiones.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Periodo Académico</label>
                <input 
                  type="text" 
                  required 
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-indigo-500 bg-white" 
                  value={periodoGen}
                  onChange={e => setPeriodoGen(e.target.value)}
                  placeholder="Ej: 2026-1"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Código de Grupo / Sección por Defecto</label>
                <input 
                  type="text" 
                  required 
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-indigo-500 bg-white" 
                  value={grupoGen}
                  onChange={e => setGrupoGen(e.target.value)}
                  placeholder="Ej: SEC-A"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 mt-5">
                <button 
                  type="button" 
                  onClick={() => setShowGenModal(false)} 
                  className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 rounded-xl"
                  disabled={loadingGenerar}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:opacity-90 font-semibold shadow-sm flex items-center gap-1.5"
                  disabled={loadingGenerar}
                >
                  {loadingGenerar ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                      Ejecutando CSP...
                    </>
                  ) : (
                    '⚙️ Generar Horario'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}