
import { Link } from 'react-router-dom';

const NoAutorizadoPage = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Acceso no autorizado</h1>
      <p>No tienes permisos para acceder a esta sección.</p>
      <Link to="/">Ir al inicio</Link>
    </div>
  );
};

export default NoAutorizadoPage;

