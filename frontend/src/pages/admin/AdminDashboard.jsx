
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div>
      <h1>Panel del Administrador</h1>
      <p>Gestión de usuarios, reportes y auditoría.</p>
      <ul>
        <li>
          <Link to="/admin/usuarios">Gestión de usuarios</Link>
        </li>
        <li>
          <Link to="/admin/reportes">Reportes</Link>
        </li>
        <li>
          <Link to="/admin/auditoria">Auditoría</Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminDashboard;

