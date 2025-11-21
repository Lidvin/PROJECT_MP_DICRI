
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import LoginPage from './pages/LoginPage';
import NoAutorizadoPage from './pages/NoAutorizadoPage';

import TecnicoDashboard from './pages/tecnico/TecnicoDashboard';
import ExpedientesListPage from './pages/tecnico/ExpedientesListPage';
import ExpedienteFormPage from './pages/tecnico/ExpedienteFormPage';
import ExpedienteDetailPage from './pages/tecnico/ExpedienteDetailPage';

import CoordinadorDashboard from './pages/coordinador/CoordinadorDashboard';
import ExpedientesRevisionPage from './pages/coordinador/ExpedientesRevisionPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import UsuariosPage from './pages/admin/UsuariosPage';
import ReportesPage from './pages/admin/ReportesPage';
import AuditoriaPage from './pages/admin/AuditoriaPage';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Login */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/no-autorizado" element={<NoAutorizadoPage />} />

          {/* Rutas protegidas con layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute roles={['TECNICO', 'COORDINADOR', 'ADMIN']}>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard general según rol */}
            <Route
              index
              element={
                <HomeRedirect />
              }
            />

            {/* TÉCNICO */}
            <Route
              path="tecnico"
              element={
                <ProtectedRoute roles={['TECNICO']}>
                  <TecnicoDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="tecnico/expedientes"
              element={
                <ProtectedRoute roles={['TECNICO']}>
                  <ExpedientesListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="tecnico/expedientes/nuevo"
              element={
                <ProtectedRoute roles={['TECNICO']}>
                  <ExpedienteFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="tecnico/expedientes/:id"
              element={
                <ProtectedRoute roles={['TECNICO']}>
                  <ExpedienteDetailPage />
                </ProtectedRoute>
              }
            />

            {/* COORDINADOR */}
            <Route
              path="coordinador"
              element={
                <ProtectedRoute roles={['COORDINADOR']}>
                  <CoordinadorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="coordinador/expedientes-revision"
              element={
                <ProtectedRoute roles={['COORDINADOR']}>
                  <ExpedientesRevisionPage />
                </ProtectedRoute>
              }
            />

            {/* ADMIN */}
            <Route
              path="admin"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/usuarios"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <UsuariosPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/reportes"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <ReportesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/auditoria"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <AuditoriaPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};


import { useAuth } from './context/AuthContext';
const HomeRedirect = () => {
  const { usuario } = useAuth();

  if (!usuario) return <Navigate to="/login" replace />;

  if (usuario.rol === 'TECNICO') return <Navigate to="/tecnico/expedientes" replace />;
  if (usuario.rol === 'COORDINADOR') return <Navigate to="/coordinador/expedientes-revision" replace />;
  if (usuario.rol === 'ADMIN') return <Navigate to="/admin/reportes" replace />;

  return <Navigate to="/login" replace />;
};

export default App;

