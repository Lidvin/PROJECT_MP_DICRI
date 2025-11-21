
import { useState } from 'react';
import api from '../../api/apiClient';

const AuditoriaPage = () => {
  const [registros, setRegistros] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [idUsuario, setIdUsuario] = useState('');
  const [tablaAfectada, setTablaAfectada] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const consultar = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.get('/api/auditoria', {
        params: {
          fechaInicio: fechaInicio || undefined,
          fechaFin: fechaFin || undefined,
          idUsuario: idUsuario || undefined,
          tablaAfectada: tablaAfectada || undefined,
        },
      });
      setRegistros(data.data || []);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Error al consultar auditoría';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Auditoría</h1>

      {/* Filtros */}
      <div className="card">
        <h2 className="section-title">Filtros de búsqueda</h2>
        <form onSubmit={consultar}>
          <div className="form-grid">
            <div className="form-group">
              <label>Fecha inicio</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Fecha fin</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>ID usuario</label>
              <input
                type="number"
                value={idUsuario}
                onChange={(e) => setIdUsuario(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Tabla afectada</label>
              <input
                value={tablaAfectada}
                onChange={(e) => setTablaAfectada(e.target.value)}
                placeholder="Expedientes, Indicios, Usuarios..."
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ marginTop: '0.75rem' }}
          >
            {loading ? 'Consultando...' : 'Consultar'}
          </button>
        </form>

        {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
      </div>

      {/* Resultados */}
      <div className="card">
        <h2 className="section-title">Resultados</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Usuario</th>
              <th>Acción</th>
              <th>Tabla</th>
              <th>ID Registro</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((r) => (
              <tr key={r.IdAuditoria}>
                <td>{r.IdAuditoria}</td>
                <td>{new Date(r.Fecha).toLocaleString()}</td>
                <td>{r.Usuario}</td>
                <td>{r.Accion}</td>
                <td>{r.TablaAfectada}</td>
                <td>{r.IdRegistroAfectado}</td>
              </tr>
            ))}
            {registros.length === 0 && !loading && (
              <tr>
                <td colSpan="6">Sin registros.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditoriaPage;

