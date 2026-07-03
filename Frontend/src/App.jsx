import { useState, useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Materias from './views/Materias';
import Aulas from './views/Aulas';
import Grupos from './views/Grupos';
import Horarios from './views/Horarios';
import UsuariosRoles from './views/UsuariosRoles';

export default function App() {
  const { user, loading } = useContext(AuthContext);
  const [view, setView] = useState('dashboard');

  // Evita destellos de pantalla mientras se lee el localStorage
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Si no está autenticado, se fuerza la vista del Login
  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pl-64">
      {/* Barra de Navegación Lateral */}
      <Sidebar currentView={view} setView={setView} />
      
      {/* Contenedor de Vistas Dinámicas */}
      <main className="w-full max-w-7xl mx-auto min-h-screen">
        {view === 'dashboard' && <Dashboard />}
        {view === 'materias' && <Materias />}
        {view === 'infraestructura' && <Aulas />}
        {view === 'grupos' && <Grupos />}
        {view === 'horarios' && <Horarios />}
        {view === 'usuarios' && <UsuariosRoles />}
        
        {/* Vistas complementarias opcionales */}
        {(view === 'inscripciones' || view === 'roles') && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-800 uppercase mb-2">Módulo en Desarrollo</h2>
            <p className="text-slate-500 text-sm">La interfaz para la gestión de {view} estará disponible próximamente.</p>
          </div>
        )}
      </main>
    </div>
  );
}