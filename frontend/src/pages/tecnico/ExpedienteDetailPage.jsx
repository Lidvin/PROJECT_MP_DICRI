
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/apiClient';


const ID_ESTADO_REGISTRADO = 1;

const ExpedienteDetailPage = () => {
  const { id } = useParams(); 
  const [expediente, setExpediente] = useState(null);
  const [indicios, setIndicios] = useState([]);
  const [loadingExp, setLoadingExp] = useState(true);
  const [loadingIndicios, setLoadingIndicios] = useState(true);
  const [error, setError] = useState('');

  
  const [descripcion, setDescripcion] = useState('');
  const [color, setColor] = useState('');
  const [tamano, setTamano] = useState('');
  const [peso, setPeso] = useState('');
  const [unidadPeso, setUnidadPeso] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [errorIndicio, setErrorIndicio] = useState('');
  const [guardandoIndicio, setGuardandoIndicio] = useState(false);

  
  const [editingIndicio, setEditingIndicio] = useState(null); 
  const [editDescripcion, setEditDescripcion] = useState('');
  const [editColor, setEditColor] = useState('');
  const [editTamano, setEditTamano] = useState('');
  const [editPeso, setEditPeso] = useState('');
  const [editUnidadPeso, setEditUnidadPeso] = useState('');
  const [editUbicacion, setEditUbicacion] = useState('');
  const [editActivo, setEditActivo] = useState(true);
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);
  const [errorEdicion, setErrorEdicion] = useState('');

  
  const [cambiandoEstado, setCambiandoEstado] = useState(false);
  const [errorCambioEstado, setErrorCambioEstado] = useState('');

  const cargarExpediente = async () => {
    setLoadingExp(true);
    setError('');

    try {
      
      const { data } = await api.get('/api/expedientes');
      const exp = (data.data || []).find((e) => e.IdExpediente === Number(id));
      setExpediente(exp || null);
      if (!exp) setError('Expediente no encontrado');
    } catch (err) {
      console.error(err);
      setError('Error al cargar expediente');
    } finally {
      setLoadingExp(false);
    }
  };

  const cargarIndicios = async () => {
    setLoadingIndicios(true);
    try {
      const { data } = await api.get(`/api/indicios/expediente/${id}`);
      setIndicios(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingIndicios(false);
    }
  };

  useEffect(() => {
    cargarExpediente();
    cargarIndicios();
  }, [id]);

  const handleCrearIndicio = async (e) => {
    e.preventDefault();
    setErrorIndicio('');

    try {
      setGuardandoIndicio(true);
      await api.post('/api/indicios', {
        idExpediente: Number(id),
        descripcion,
        color,
        tamano,
        peso: peso ? Number(peso) : null,
        unidadPeso,
        ubicacion,
      });

      
      setDescripcion('');
      setColor('');
      setTamano('');
      setPeso('');
      setUnidadPeso('');
      setUbicacion('');

      await cargarIndicios();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Error al crear indicio';
      setErrorIndicio(msg);
    } finally {
      setGuardandoIndicio(false);
    }
  };

  
  const abrirEdicion = (indicio) => {
    setEditingIndicio(indicio);
    setEditDescripcion(indicio.Descripcion || '');
    setEditColor(indicio.Color || '');
    setEditTamano(indicio.Tamano || '');
    setEditPeso(indicio.Peso != null ? indicio.Peso : '');
    setEditUnidadPeso(indicio.UnidadPeso || '');
    setEditUbicacion(indicio.Ubicacion || '');
    setEditActivo(indicio.Activo !== false); 
    setErrorEdicion('');
  };

  
  const handleEditarIndicio = async (e) => {
    e.preventDefault();
    if (!editingIndicio) return;

    setErrorEdicion('');
    try {
      setGuardandoEdicion(true);
      await api.put(`/api/indicios/${editingIndicio.IdIndicio}`, {
        descripcion: editDescripcion,
        color: editColor,
        tamano: editTamano,
        peso: editPeso !== '' ? Number(editPeso) : null,
        unidadPeso: editUnidadPeso,
        ubicacion: editUbicacion,
        activo: editActivo,
      });

      await cargarIndicios();
      setEditingIndicio(null);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Error al actualizar indicio';
      setErrorEdicion(msg);
    } finally {
      setGuardandoEdicion(false);
    }
  };

  
  const handleCambiarEstadoRegistrado = async () => {
    setErrorCambioEstado('');

    const confirma = window.confirm(
      '¿Desea cambiar el estado del expediente a REGISTRADO para que sea revisado nuevamente?'
    );
    if (!confirma) return;

    try {
      setCambiandoEstado(true);
      await api.put(`/api/expedientes/${id}/estado`, {
        idEstadoNuevo: ID_ESTADO_REGISTRADO,
        justificacion: 'Reenvío a estado REGISTRADO desde técnico para nueva revisión',
      });

      await cargarExpediente();
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        'Error al cambiar el estado del expediente';
      setErrorCambioEstado(msg);
    } finally {
      setCambiandoEstado(false);
    }
  };

  if (loadingExp) {
    return (
      <div className="page">
        <p>Cargando expediente...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  if (!expediente) {
    return (
      <div className="page">
        <p>No se encontró el expediente.</p>
      </div>
    );
  }

  const estado = expediente.NombreEstado;
  const isAprobado = estado === 'APROBADO';
  const isRechazado = estado === 'RECHAZADO';
  const isEditable = !isAprobado; 

  return (
    <div className="page">
      <h1 className="page-title">
        Expediente #{expediente.IdExpediente} — {expediente.NumeroExpediente}
      </h1>

      {/* Datos del expediente */}
      <div className="card">
        <h2 className="section-title">Información del expediente</h2>
        <p><strong>Título:</strong> {expediente.Titulo}</p>
        <p><strong>Estado:</strong> {expediente.NombreEstado}</p>
        <p><strong>Técnico que registró:</strong> {expediente.TecnicoRegistro}</p>
        <p><strong>Observaciones:</strong> {expediente.JustificacionRechazo || 'Sin observaciones'}</p>  
        <p>
          <strong>Fecha de registro:</strong>{' '}
          {new Date(expediente.FechaRegistro).toLocaleString()}
        </p>
      </div>

      {/* Indicios */}
      <div className="card">
        <h2 className="section-title">Indicios registrados</h2>

        {loadingIndicios ? (
          <p>Cargando indicios...</p>
        ) : (
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
                <th>Activo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {indicios.map((i) => (
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
                  <td>{i.Activo === false ? 'No' : 'Sí'}</td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      onClick={() => abrirEdicion(i)}
                      disabled={!isEditable}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
              {indicios.length === 0 && (
                <tr>
                  <td colSpan="9">No hay indicios registrados para este expediente.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Formulario nuevo indicio + botón cambiar estado (solo si se puede editar) */}
      {isEditable && (
        <div className="card">
          <h2 className="section-title">Agregar nuevo indicio</h2>
          <form onSubmit={handleCrearIndicio}>
            <div className="form-group">
              <label>Descripción *</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Color</label>
                <input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Tamaño</label>
                <input
                  value={tamano}
                  onChange={(e) => setTamano(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Peso</label>
                <input
                  type="number"
                  step="0.01"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Unidad de peso</label>
                <input
                  value={unidadPeso}
                  onChange={(e) => setUnidadPeso(e.target.value)}
                  placeholder="kg, g, lb..."
                />
              </div>
              <div className="form-group">
                <label>Ubicación</label>
                <input
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                />
              </div>
            </div>

            {errorIndicio && (
              <p style={{ color: 'red', marginTop: '0.5rem' }}>{errorIndicio}</p>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={guardandoIndicio}
              >
                {guardandoIndicio ? 'Guardando...' : 'Añadir indicio'}
              </button>

              {/* Botón para reenviar a REGISTRADO solo si está RECHAZADO */}
              {isRechazado && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCambiarEstadoRegistrado}
                  disabled={cambiandoEstado}
                >
                  {cambiandoEstado
                    ? 'Cambiando estado...'
                    : 'Guardar'}
                </button>
              )}
            </div>

            {errorCambioEstado && (
              <p style={{ color: 'red', marginTop: '0.5rem' }}>{errorCambioEstado}</p>
            )}
          </form>
        </div>
      )}

      {/* Modal de edición de indicio */}
      {editingIndicio && (
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
          <div className="card" style={{ width: '480px' }}>
            <h3 className="section-title" style={{ marginTop: 0 }}>
              Editar indicio #{editingIndicio.IdIndicio}
            </h3>

            <form onSubmit={handleEditarIndicio}>
              <div className="form-group">
                <label>Descripción *</label>
                <textarea
                  value={editDescripcion}
                  onChange={(e) => setEditDescripcion(e.target.value)}
                  required
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Color</label>
                  <input
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Tamaño</label>
                  <input
                    value={editTamano}
                    onChange={(e) => setEditTamano(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Peso</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editPeso}
                    onChange={(e) => setEditPeso(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Unidad de peso</label>
                  <input
                    value={editUnidadPeso}
                    onChange={(e) => setEditUnidadPeso(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Ubicación</label>
                  <input
                    value={editUbicacion}
                    onChange={(e) => setEditUbicacion(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={editActivo}
                      onChange={(e) => setEditActivo(e.target.checked)}
                      style={{ marginRight: '0.35rem' }}
                    />
                    Activo
                  </label>
                </div>
              </div>

              {errorEdicion && (
                <p style={{ color: 'red', marginTop: '0.5rem' }}>{errorEdicion}</p>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.5rem',
                  marginTop: '0.75rem',
                }}
              >
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingIndicio(null)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={guardandoEdicion}
                >
                  {guardandoEdicion ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpedienteDetailPage;

