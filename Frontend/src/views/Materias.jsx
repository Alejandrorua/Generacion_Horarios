import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Materias() {
  const [materias, setMaterias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ codigo_materia: '', nombre_materia: '', creditos: 0, descripcion: '' });

  const fetchMaterias = async () => {
    try {
      const { data } = await api.get('/materias');
      setMaterias(data);
    } catch (err) { alert(err.response?.data?.error || 'Error al cargar materias'); }
  };

  useEffect(() => { fetchMaterias(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/materias', formData);
      setShowModal(false);
      setFormData({ codigo_materia: '', nombre_materia: '', creditos: 0, descripcion: '' });
      fetchMaterias();
    } catch (err) { alert(err.response?.data?.error); }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Plan de Materias</h2>
          <p className="text-sm text-slate-500">Mapeo curricular de asignaturas y sus prerrequisitos lógicos.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-xl transition-all shadow-md">
          + Nueva Materia
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-xs uppercase font-semibold">
              <th className="p-4">Código</th>
              <th className="p-4">Nombre</th>
              <th className="p-4">Créditos</th>
              <th className="p-4">Prerrequisitos</th>
            </tr>
          </thead>
          <tbody className="text-slate-700 text-sm divide-y divide-slate-50">
            {materias.map((m) => (
              <tr key={m.id_materia} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4 font-mono text-blue-600 font-bold">{m.codigo_materia}</td>
                <td className="p-4 font-medium text-slate-900">{m.nombre_materia}</td>
                <td className="p-4">{m.creditos} pts</td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {m.prerrequisitos?.length > 0 ? (
                      m.prerrequisitos.map(pr => (
                        <span key={pr.id} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md border border-slate-200">{pr.codigo}</span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">Ninguno</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Moderno */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Registrar Nueva Materia</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Código de la Materia</label>
                <input type="text" required placeholder="Ej: INF-101" className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-500 transition-colors" value={formData.codigo_materia} onChange={e => setFormData({...formData, codigo_materia: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre Descriptivo</label>
                <input type="text" required className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-500 transition-colors" value={formData.nombre_materia} onChange={e => setFormData({...formData, nombre_materia: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Créditos Académicos</label>
                <input type="number" required className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-500 transition-colors" value={formData.creditos} onChange={e => setFormData({...formData, creditos: parseInt(e.target.value)})} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md">Guardar Materia</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}