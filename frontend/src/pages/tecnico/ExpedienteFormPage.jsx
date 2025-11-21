
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/apiClient';

const ExpedienteFormPage = () => {
  const [numeroExpediente, setNumeroExpediente] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setGuardando(true);

      const payload = {
        numeroExpediente: numeroExpediente.trim(),
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
      };

      const { data } = await api.post('/api/expedientes', payload);

      console.log('Respuesta crear expediente:', data);

      
      const expedienteId =
        data?.idExpediente ??
        data?.id ??
        data?.expediente?.idExpediente;

      if (!expedienteId) {
        throw new Error('La API no devolvió el id del expediente');
      }

      
      
      navigate(`/tecnico/expedientes/${expedienteId}`);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Error al crear expediente';
      setError(msg);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Nuevo expediente</h1>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Número de expediente *</label>
              <input
                value={numeroExpediente}
                onChange={(e) => setNumeroExpediente(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Título *</label>
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          {error && (
            <p style={{ color: 'red', marginTop: '0.5rem' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={guardando}
            style={{ marginTop: '0.5rem' }}
          >
            {guardando ? 'Guardando...' : 'Guardar expediente'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpedienteFormPage;

