import { useEffect, useState } from 'react';
import api from '../api/axios';
import CRUDGrid from '../components/CRUDGrid';

export default function Aulas() {
  const [aulas, setAulas] = useState([]);
  const [edificios, setEdificios] = useState([]);
  const [activeTab, setActiveTab] = useState('aulas'); // 'aulas' o 'edificios'

  // Modales
  const [showAulaModal, setShowAulaModal] = useState(false);
  const [showEdificioModal, setShowEdificioModal] = useState(false);

  // Formulario Aula
  const [aulaForm, setAulaForm] = useState({ id_edificio: '', codigo_aula: '', capacidad: '', tipo_aula: 'Teoría' });
  // Formulario Edificio
  const [edificioForm, setEdificioForm] = useState({ nombre_edificio: '' });

  const fetchAulasAndEdificios = async () => {
    try {
      const [resAulas, resEdificios] = await Promise.all([
        api.get('/aulas'),
        api.get('/edificios')
      ]);
      setAulas(resAulas.data);
      setEdificios(resEdificios.data);
    } catch (err) {
      console.error("Error al cargar aulas/edificios:", err);
    }
  };

  useEffect(() => {
    fetchAulasAndEdificios();
  }, []);

  const handleCreateAula = async (e) => {
    e.preventDefault();
    try {
      await api.post('/aulas', aulaForm);
      setShowAulaModal(false);
      setAulaForm({ id_edificio: '', codigo_aula: '', capacidad: '', tipo_aula: 'Teoría' });
      fetchAulasAndEdificios();
    } catch (err) {
      alert(err.response?.data?.error || "Error al crear aula");
    }
  };

  const handleCreateEdificio = async (e) => {
    e.preventDefault();
    try {
      await api.post('/edificios', edificioForm);
      setShowEdificioModal(false);
      setEdificioForm({ nombre_edificio: '' });
      fetchAulasAndEdificios();
    } catch (err) {
      alert(err.response?.data?.error || "Error al crear edificio");
    }
  };

  // Columnas para la grilla de aulas
  const aulaColumns = [
    { 
      key: 'codigo_aula', 
      label: 'Código Aula', 
      render: (item) => <span className="font-mono font-extrabold text-slate-800 bg-slate-100 px-2 py-1 rounded-md border border-slate-200/50">{item.codigo_aula}</span> 
    },
    { 
      key: 'tipo_aula', 
      label: 'Tipo', 
      render: (item) => (
        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
          item.tipo_aula === 'Laboratorio' 
            ? 'bg-purple-50 text-purple-700 border border-purple-200' 
            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        }`}>
          {item.tipo_aula}
        </span>
      ) 
    },
    { 
      key: 'capacidad', 
      label: 'Capacidad', 
      render: (item) => <span className="font-medium text-slate-700">{item.capacidad} Estudiantes</span> 
    },
    { 
      key: 'nombre_edificio', 
      label: 'Edificio Asignado', 
      render: (item) => <span className="font-semibold text-indigo-600">{item.nombre_edificio || 'Sin Asignar'}</span> 
    }
  ];

  // Columnas para la grilla de edificios
  const edificioColumns = [
    {
      key: 'id_edificio',
      label: 'ID Edificio',
      render: (item) => <span className="font-mono font-bold text-slate-400">#{item.id_edificio}</span>
    },
    {
      key: 'nombre_edificio',
      label: 'Nombre del Edificio / Bloque',
      render: (item) => <strong className="text-slate-800 font-bold text-base">{item.nombre_edificio}</strong>
    },
    {
      key: 'ubicacion_detallada',
      label: 'Ubicación / Detalles',
      render: (item) => <span className="text-slate-500">{item.ubicacion_detallada || 'Sin especificaciones'}</span>
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Cabecera Principal */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Infraestructura Académica</h2>
          <p className="text-sm text-slate-500">Gestión de pabellones universitarios, salones estándar y laboratorios.</p>
        </div>

        {/* Tab Selector */}
        <div className="bg-slate-100/80 p-1.5 rounded-xl flex items-center border border-slate-200/50">
          <button 
            onClick={() => setActiveTab('aulas')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'aulas' 
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/20' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🏫 Aulas
          </button>
          <button 
            onClick={() => setActiveTab('edificios')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'edificios' 
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/20' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🏛️ Edificios
          </button>
        </div>
      </div>

      {/* Renderizado de Pestañas */}
      {activeTab === 'aulas' ? (
        <CRUDGrid 
          title="Gestión de Aulas"
          subtitle="Listado físico de ambientes del campus habilitados para dictado."
          data={aulas}
          columns={aulaColumns}
          onAdd={() => setShowAulaModal(true)}
          searchPlaceholder="Buscar aulas por código o tipo..."
        />
      ) : (
        <CRUDGrid 
          title="Pabellones y Edificios"
          subtitle="Lista de estructuras físicas que albergan los salones de clase."
          data={edificios}
          columns={edificioColumns}
          onAdd={() => setShowEdificioModal(true)}
          searchPlaceholder="Buscar edificios..."
        />
      )}

      {/* Modal Añadir Aula */}
      {showAulaModal && (
        <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-extrabold text-slate-900 mb-4">Registrar Aula</h3>
            <form onSubmit={handleCreateAula} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Edificio de Ubicación</label>
                <select 
                  required 
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-white outline-none focus:border-indigo-500 transition-all" 
                  value={aulaForm.id_edificio} 
                  onChange={e => setAulaForm({...aulaForm, id_edificio: e.target.value})}
                >
                  <option value="">Seleccione un Edificio...</option>
                  {edificios.map(ed => (
                    <option key={ed.id_edificio} value={ed.id_edificio}>{ed.nombre_edificio}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Código del Aula / Salón</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Ej: A-302, Lab-Redes" 
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-indigo-500 transition-all bg-white" 
                  value={aulaForm.codigo_aula} 
                  onChange={e => setAulaForm({...aulaForm, codigo_aula: e.target.value})} 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Capacidad (Estudiantes)</label>
                <input 
                  type="number" 
                  required 
                  min="1" 
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-indigo-500 transition-all bg-white" 
                  value={aulaForm.capacidad} 
                  onChange={e => setAulaForm({...aulaForm, capacidad: e.target.value})} 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tipo de Aula</label>
                <select 
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-indigo-500 transition-all bg-white" 
                  value={aulaForm.tipo_aula} 
                  onChange={e => setAulaForm({...aulaForm, tipo_aula: e.target.value})}
                >
                  <option value="Teoría">Teoría (Salón Estándar)</option>
                  <option value="Laboratorio">Laboratorio Especializado</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 mt-5">
                <button 
                  type="button" 
                  onClick={() => setShowAulaModal(false)} 
                  className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold shadow-md transition-all"
                >
                  Registrar Aula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Añadir Edificio */}
      {showEdificioModal && (
        <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-extrabold text-slate-900 mb-4">Registrar Edificio / Pabellón</h3>
            <form onSubmit={handleCreateEdificio} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre del Edificio / Bloque</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Ej: Pabellón B, Bloque de Sistemas" 
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-indigo-500 transition-all bg-white" 
                  value={edificioForm.nombre_edificio} 
                  onChange={e => setEdificioForm({ nombre_edificio: e.target.value })} 
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 mt-5">
                <button 
                  type="button" 
                  onClick={() => setShowEdificioModal(false)} 
                  className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold shadow-md transition-all"
                >
                  Registrar Edificio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}