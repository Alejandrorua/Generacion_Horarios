import { useEffect, useState } from 'react';
import api from '../api/axios';

const getRolBadgeClass = (rolName, rolId) => {
  const name = String(rolName || '').toLowerCase();
  const id = Number(rolId);
  if (name.includes('admin') || id === 1) {
    return 'bg-purple-50 text-purple-700 border border-purple-200';
  } else if (name.includes('profesor') || name.includes('docente') || id === 2) {
    return 'bg-amber-50 text-amber-700 border border-amber-200';
  } else if (name.includes('estudiante') || name.includes('alumno') || id === 3) {
    return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  } else if (name.includes('director') || id === 4) {
    return 'bg-rose-50 text-rose-700 border border-rose-200';
  } else {
    return 'bg-slate-50 text-slate-700 border border-slate-200';
  }
};

export default function UsuariosRoles() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [nuevoRol, setNuevoRol] = useState({ nombre_rol: '', descripcion: '' });

  // Carga inicial de datos desde el backend unificado
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resUsuarios, resRoles] = await Promise.all([
        api.get('/auth/usuarios'),
        api.get('/auth/roles')
      ]);
      setUsuarios(resUsuarios.data);
      setRoles(resRoles.data);
    } catch (err) {
      console.error("Error al cargar control de accesos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Creación de un nuevo Rol operativo (Administrador, Docente, etc)
  const handleCreateRol = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/roles', {
        nombre_rol: nuevoRol.nombre_rol, // Mapea al campo esperado en tu controlador
        descripcion: nuevoRol.descripcion
      });
      setShowRoleModal(false);
      setNuevoRol({ nombre_rol: '', descripcion: '' });
      fetchData(); // Refrescar listas
    } catch (err) {
      alert(err.response?.data?.error || "Error al registrar el rol administrativo");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Usuarios y Permisos del Sistema</h2>
          <p className="text-sm text-slate-500">Gestión de credenciales de acceso, asignación de roles jerárquicos y seguridad.</p>
        </div>
        <button
          onClick={() => setShowRoleModal(true)}
          className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all cursor-pointer"
        >
          🔑 Crear Nuevo Rol
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabla Principal: Gestión de Usuarios (Ocupa 2 columnas) */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-base">Cuentas de Usuario Activas</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-bold text-[11px] uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-3">Nombre Completo</th>
                  <th className="px-6 py-3">Correo Electrónico</th>
                  <th className="px-6 py-3">Rol Asignado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {usuarios.map((u) => (
                  <tr key={u.id_usuario} className="hover:bg-slate-50/80 transition-all">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {u.nombre} {u.apellido || ''}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                      {u.email || u.correo}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getRolBadgeClass(u.nombre_rol || u.rol, u.id_rol)}`}>
                        {u.nombre_rol || u.rol || 'Estudiante'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Panel Lateral: Listado de Roles Existentes */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-4 h-fit">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Roles de Seguridad</h3>
            <p className="text-xs text-slate-400">Niveles de restricción aplicados en los controladores de la API.</p>
          </div>
          <div className="space-y-2.5">
            {roles.map((r) => (
              <div 
                key={r.id_rol || r.id} 
                className="p-3.5 border border-slate-100 rounded-xl bg-slate-50/50 flex flex-col gap-1"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                    {r.nombre_rol || r.nombre}
                  </span>
                  <span className="text-[10px] bg-white border border-slate-200 text-slate-400 font-mono px-1.5 py-0.5 rounded-md">
                    ID: {r.id_rol || r.id}
                  </span>
                </div>
                {r.descripcion && (
                  <p className="text-xs text-slate-500 font-normal leading-relaxed">
                    {r.descripcion}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal para Crear Roles */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Crear Rol Administrativo</h3>
            <p className="text-xs text-slate-400 mb-4">Los nombres deben coincidir con las reglas jerárquicas del middleware.</p>
            
            <form onSubmit={handleCreateRol} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre del Rol</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Ej: Administrador, Docente, Coordinador" 
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-500" 
                  value={nuevoRol.nombre_rol} 
                  onChange={e => setNuevoRol({...nuevoRol, nombre_rol: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Descripción de Permisos</label>
                <textarea 
                  rows="3" 
                  placeholder="Describe qué acciones puede realizar este nivel..." 
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-500 resize-none" 
                  value={nuevoRol.descripcion} 
                  onChange={e => setNuevoRol({...nuevoRol, descripcion: e.target.value})} 
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowRoleModal(false)} 
                  className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm bg-slate-900 text-white rounded-xl hover:bg-slate-800"
                >
                  Guardar Rol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}