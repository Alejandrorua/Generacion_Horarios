import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar({ currentView, setView }) {
  const { user, logoutUser } = useContext(AuthContext);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', roles: ['Administrador', 'Profesor', 'Estudiante'] },
    { id: 'materias', label: 'Materias y Prerrequisitos', icon: '📚', roles: ['Administrador', 'Profesor', 'Estudiante'] },
    { id: 'infraestructura', label: 'Edificios y Aulas', icon: '🏛️', roles: ['Administrador', 'Profesor'] },
    { id: 'grupos', label: 'Grupos Académicos', icon: '👥', roles: ['Administrador', 'Profesor', 'Estudiante'] },
    { id: 'horarios', label: 'Horarios de Clase', icon: '⏱️', roles: ['Administrador', 'Profesor', 'Estudiante'] },
    { id: 'inscripciones', label: 'Inscripciones / Matrícula', icon: '📝', roles: ['Administrador', 'Estudiante'] },
    { id: 'usuarios', label: 'Usuarios y Roles', icon: '🔒', roles: ['Administrador'] },
  ];

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-slate-100 flex flex-col justify-between fixed left-0 top-0 shadow-xl border-r border-indigo-950/30">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">🗓️</span>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">UniSched</h1>
        </div>

        <nav className="space-y-1">
          {menuItems.map(item => {
            if (!item.roles.includes(user?.rol)) return null;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${currentView === item.id
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/20 border border-indigo-500/10'
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                  }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 bg-slate-950/70 border-t border-slate-805/30 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-indigo-300/50 uppercase tracking-wider font-semibold">Conectado como</p>
          <p className="text-sm font-semibold text-slate-200 truncate max-w-[140px]">{user?.nombre}</p>
          <span className="text-[10px] bg-slate-800/60 text-indigo-400 border border-indigo-950/20 px-2 py-0.5 rounded-full font-mono">{user?.rol}</span>
        </div>
        <button onClick={logoutUser} className="p-2 hover:bg-slate-800/50 rounded-xl text-rose-400 transition-colors cursor-pointer" title="Cerrar sesión">
          🚪
        </button>
      </div>
    </div>
  );
}