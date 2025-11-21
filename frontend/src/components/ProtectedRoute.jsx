
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { usuario, token } = useAuth();

  if (!token || !usuario) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(usuario.rol)) {
    
    return <Navigate to="/no-autorizado" replace />;
  }

  return children;
};

export default ProtectedRoute;

