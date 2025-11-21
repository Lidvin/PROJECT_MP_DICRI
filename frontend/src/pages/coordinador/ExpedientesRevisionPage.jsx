
import { useEffect, useState } from 'react';
import api from '../../api/apiClient';

const ID_ESTADO_APROBADO = 3;
const ID_ESTADO_RECHAZADO = 4;

const ExpedientesRevisionPage = () => {
  const [expedientes, setExpedientes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedExpediente, setSelectedExpediente] = useState(null); 
  const [detalleExpediente, setDetalleExpediente] = useState(null); 
  const [indiciosDetalle, setIndiciosDetalle] = useState([]); 

  const [justificacion, setJustificacion] = useState('');
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState('');

  const cargar = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/api/expedientes');
      const lista = (data.data || []).filter(
        (e) =>
          e.NombreEstado === 'REGISTRADO' ||
          e.NombreEstado === 'EN_REVISION'
      );
      setExpedientes(lista);
    } catch (err) {
      console.error(err);
      setError('Error al cargar expedientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const aprobarExpediente = async (idExp) => {
    setActualizando(true);
    setError('');
    try {
      await api.put(`/api/expedientes/${idExp}/estado`, {
        idEstadoNuevo: ID_ESTADO_APROBADO,
        justificacion: null,
      });
      await cargar();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al aprobar expediente';
      setError(msg);
    } finally {
      setActualizando(false);
    }
  };

  const rechazarExpediente = async (e) => {
    e.preventDefault();
    if (!selectedExpediente) return;

    if (!justificacion.trim()) {
      setError('Debe escribir una justificación para el rechazo.');
      return;
    }

    setActualizando(true);
    setError('');

    try {
      await api.put(`/api/expedientes/${selectedExpediente.IdExpediente}/estado`, {
        idEstadoNuevo: ID_ESTADO_RECHAZADO,
        justificacion,
      });
      await cargar();
      setSelectedExpediente(null);
      setJustificacion('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al rechazar expediente';
      setError(msg);
    } finally {
      setActualizando(false);
    }
  };

  
  
  
  const verDetalle = async (exp) => {
    setDetalleExpediente(null);
    setIndiciosDetalle([]);

    try {
      setDetalleExpediente(exp);

      const { data } = await api.get(`/api/indicios/expediente/${exp.IdExpediente}`);
      setIndiciosDetalle(data.data || []);
    } catch (err) {
      console.error('Error al cargar indicios para detalle:', err);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Expedientes en Revisión</h1>

      {error && (
        <p style={{ color: 'red', marginBottom: '0.5rem' }}>{error}</p>
      )}

      <div className="card">
        <h2 className="section-title">Listado</h2>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Número</th>
                <th>Título</th>
                <th>Técnico</th>
                <th>Estado</th>
                <th>Fecha Registro</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {expedientes.map((exp) => (
                <tr key={exp.IdExpediente}>
                  <td>{exp.IdExpediente}</td>
                  <td>{exp.NumeroExpediente}</td>
                  <td>{exp.Titulo}</td>
                  <td>{exp.TecnicoRegistro}</td>
                  <td>{exp.NombreEstado}</td>
                  <td>{new Date(exp.FechaRegistro).toLocaleString()}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    
                    {/* NUEVO: Ver detalles */}
                    <button
                      className="btn btn-secondary"
                      style={{ marginRight: '0.5rem' }}
                      onClick={() => verDetalle(exp)}
                    >
                      Ver detalles
                    </button>

                    <button
                      className="btn btn-primary"
                      disabled={actualizando}
                      onClick={() => aprobarExpediente(exp.IdExpediente)}
                      style={{ marginRight: '0.5rem' }}
                    >
                      Aprobar
                    </button>

                    <button
                      className="btn btn-danger"
                      disabled={actualizando}
                      onClick={() => setSelectedExpediente(exp)}
                    >
                      Rechazar
                    </button>
                  </td>
                </tr>
              ))}

              {expedientes.length === 0 && (
                <tr>
                  <td colSpan="7">No hay expedientes pendientes.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ─────────────────────────────────────────────── */}
      {/* MODAL DE RECHAZO                                */}
      {/* ─────────────────────────────────────────────── */}
      {selectedExpediente && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div className="card" style={{ width: '420px' }}>
            <h3 className="section-title" style={{ marginTop: 0 }}>
              Rechazar expediente #{selectedExpediente.IdExpediente}
            </h3>

            <p>
              <strong>Número:</strong> {selectedExpediente.NumeroExpediente}
            </p>

            <form onSubmit={rechazarExpediente}>
              <div className="form-group">
                <label>Justificación *</label>
                <textarea
                  value={justificacion}
                  onChange={(e) => setJustificacion(e.target.value)}
                  required
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.5rem',
                }}
              >
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedExpediente(null);
                    setJustificacion('');
                  }}
                >
                  Cancelar
                </button>

                <button type="submit" className="btn btn-danger" disabled={actualizando}>
                  Confirmar rechazo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────── */}
      {/* NUEVO: MODAL DE DETALLES                        */}
      {/* ─────────────────────────────────────────────── */}
      {detalleExpediente && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div className="card" style={{ width: '900px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 className="section-title" style={{ marginTop: 0 }}>
              Expediente #{detalleExpediente.IdExpediente}
            </h3>

            <p><strong>Número:</strong> {detalleExpediente.NumeroExpediente}</p>
            <p><strong>Título:</strong> {detalleExpediente.Titulo}</p>
            <p><strong>Técnico:</strong> {detalleExpediente.TecnicoRegistro}</p>
            <p><strong>Estado:</strong> {detalleExpediente.NombreEstado}</p>
            <p>
              <strong>Fecha Registro:</strong>{' '}
              {new Date(detalleExpediente.FechaRegistro).toLocaleString()}
            </p>

            <hr className="hr-soft" />

            <h4 className="section-title">Indicios adjuntos</h4>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Descripción</th>
                  <th>Color</th>
                  <th>Tamaño</th>
                  <th>Peso</th>
                  <th>Ubicación</th>
                  <th>Fecha registro</th>
                </tr>
              </thead>
              <tbody>
                {indiciosDetalle.map((i) => (
                  <tr key={i.IdIndicio}>
                    <td>{i.IdIndicio}</td>
                    <td>{i.Descripcion}</td>
                    <td>{i.Color}</td>
                    <td>{i.Tamano}</td>
                    <td>
                      {i.Peso != null ? `${i.Peso} ${i.UnidadPeso || ''}` : ''}
                    </td>
                    <td>{i.Ubicacion}</td>
                    <td>{new Date(i.FechaRegistro).toLocaleString()}</td>
                  </tr>
                ))}

                {indiciosDetalle.length === 0 && (
                  <tr>
                    <td colSpan="7">No hay indicios registrados.</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setDetalleExpediente(null);
                  setIndiciosDetalle([]);
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpedientesRevisionPage;

