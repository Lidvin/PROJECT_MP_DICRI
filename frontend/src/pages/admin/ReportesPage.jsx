
import { useEffect, useState } from 'react';
import api from '../../api/apiClient';

const ReportesPage = () => {
  const [resumenEstados, setResumenEstados] = useState([]);
  const [expedientes, setExpedientes] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [idEstadoExpediente, setIdEstadoExpediente] = useState('');
  const [loadingResumen, setLoadingResumen] = useState(true);
  const [loadingExpedientes, setLoadingExpedientes] = useState(false);
  const [error, setError] = useState('');

  const cargarResumenEstados = async () => {
    setLoadingResumen(true);
    try {
      const { data } = await api.get('/api/reportes/resumen-estados');
      setResumenEstados(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingResumen(false);
    }
  };

  const cargarExpedientesRango = async (e) => {
    e?.preventDefault();
    setError('');
    setLoadingExpedientes(true);

    try {
      const { data } = await api.get('/api/reportes/expedientes-rango', {
        params: {
          fechaInicio: fechaInicio || undefined,
          fechaFin: fechaFin || undefined,
          idEstadoExpediente: idEstadoExpediente || undefined,
        },
      });
      setExpedientes(data.data || []);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Error al cargar reporte de expedientes';
      setError(msg);
    } finally {
      setLoadingExpedientes(false);
    }
  };

  useEffect(() => {
    cargarResumenEstados();
  }, []);

  return (
    <div className="page">
      <h1 className="page-title">Reportes</h1>

      {/* Resumen por estado */}
      <div className="card">
        <h2 className="section-title">Resumen por estado</h2>
        {loadingResumen ? (
          <p>Cargando resumen...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Estado</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {resumenEstados.map((r, idx) => (
                <tr key={idx}>
                  <td>{r.NombreEstado}</td>
                  <td>{r.Cantidad}</td>
                </tr>
              ))}
              {resumenEstados.length === 0 && (
                <tr>
                  <td colSpan="2">Sin datos.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Expedientes por rango */}
      <div className="card">
        <h2 className="section-title">Expedientes por rango de fechas</h2>

        <form onSubmit={cargarExpedientesRango}>
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
              <label>ID Estado expediente (opcional)</label>
              <input
                type="number"
                value={idEstadoExpediente}
                onChange={(e) => setIdEstadoExpediente(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loadingExpedientes}
            style={{ marginTop: '0.75rem' }}
          >
            {loadingExpedientes ? 'Consultando...' : 'Consultar'}
          </button>
        </form>

        {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}

        <hr className="hr-soft" />

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Número</th>
              <th>Título</th>
              <th>Estado</th>
              <th>Técnico</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {expedientes.map((e) => (
              <tr key={e.IdExpediente}>
                <td>{e.IdExpediente}</td>
                <td>{e.NumeroExpediente}</td>
                <td>{e.Titulo}</td>
                <td>{e.NombreEstado}</td>
                <td>{e.TecnicoRegistro}</td>
                <td>{new Date(e.FechaRegistro).toLocaleString()}</td>
              </tr>
            ))}
            {expedientes.length === 0 && (
              <tr>
                <td colSpan="6">Sin resultados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportesPage;

