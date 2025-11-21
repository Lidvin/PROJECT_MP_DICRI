
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { usuario, logout } = useAuth();

  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <h2 className="app-sidebar-title">MP DICRI</h2>
        <p className="app-sidebar-user">
          {usuario ? `${usuario.nombre} (${usuario.rol})` : ''}
        </p>

        <nav>
          <Link to="/">Inicio</Link>

          {usuario?.rol === 'TECNICO' && (
            <>
              <Link to="/tecnico/expedientes">Mis expedientes</Link>
              <Link to="/tecnico/expedientes/nuevo">Nuevo expediente</Link>
            </>
          )}

          {usuario?.rol === 'COORDINADOR' && (
            <>
              <Link to="/coordinador/expedientes-revision">
                Expedientes en revisión
              </Link>
            </>
          )}

          {usuario?.rol === 'ADMIN' && (
            <>
              <Link to="/admin/usuarios">Usuarios</Link>
              <Link to="/admin/reportes">Reportes</Link>
              <Link to="/admin/auditoria">Auditoría</Link>
            </>
          )}
        </nav>

        <button onClick={logout}>Cerrar sesión</button>
      </aside>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

