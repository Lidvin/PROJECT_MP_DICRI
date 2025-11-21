
import { Link } from 'react-router-dom';

const TecnicoDashboard = () => {
  return (
    <div className="page">
      <h1 className="page-title">Panel del Técnico</h1>

      <div className="card">
        <p>
          Desde este panel puede registrar nuevos expedientes, gestionar sus casos
          y cargar los indicios asociados a cada expediente.
        </p>

        <ul>
          <li>
            <Link to="/tecnico/expedientes">Ver / gestionar expedientes</Link>
          </li>
          <li>
            <Link to="/tecnico/expedientes/nuevo">Registrar nuevo expediente</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TecnicoDashboard;

