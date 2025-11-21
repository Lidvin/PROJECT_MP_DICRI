
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/apiClient';

const ExpedientesListPage = () => {
  const [expedientes, setExpedientes] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/expedientes');
      setExpedientes(data.data || []);
    } catch (error) {
      console.error('Error al cargar expedientes', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  return (
    <div className="page">
      <h1 className="page-title">Mis expedientes</h1>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <h2 className="section-title" style={{ margin: 0 }}>
            Listado de expedientes
          </h2>
          <Link to="/tecnico/expedientes/nuevo" className="btn btn-primary">
            + Nuevo expediente
          </Link>
        </div>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Número</th>
                <th>Título</th>
                <th>Estado</th>
                <th>Fecha registro</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {expedientes.map((exp) => (
                <tr key={exp.IdExpediente}>
                  <td>{exp.IdExpediente}</td>
                  <td>{exp.NumeroExpediente}</td>
                  <td>{exp.Titulo}</td>
                  <td>{exp.NombreEstado}</td>
                  <td>{new Date(exp.FechaRegistro).toLocaleString()}</td>
                  <td>
                    <Link to={`/tecnico/expedientes/${exp.IdExpediente}`}>
                      Ver detalle / indicios
                    </Link>
                  </td>
                </tr>
              ))}
              {expedientes.length === 0 && (
                <tr>
                  <td colSpan="6">No hay expedientes registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ExpedientesListPage;

