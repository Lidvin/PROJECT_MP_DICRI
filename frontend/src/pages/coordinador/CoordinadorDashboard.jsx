
import { Link } from 'react-router-dom';

const CoordinadorDashboard = () => {
  return (
    <div className="page">
      <h1 className="page-title">Panel del Coordinador</h1>

      <div className="card">
        <p>
          Desde aquí puede revisar los expedientes registrados por los técnicos y
          aprobarlos o rechazarlos según corresponda.
        </p>

        <ul>
          <li>
            <Link to="/coordinador/expedientes-revision">
              Expedientes pendientes de revisión
            </Link>
          </li>
        </ul>cls
      </div>
    </div>
  );
};

export default CoordinadorDashboard;

