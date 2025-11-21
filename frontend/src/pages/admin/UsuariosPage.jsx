
import { useEffect, useState } from 'react';
import api from '../../api/apiClient';

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [usuarioLogin, setUsuarioLogin] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [correo, setCorreo] = useState('');
  const [idRol, setIdRol] = useState('2'); 
  const [creando, setCreando] = useState(false);

  const cargar = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/api/usuarios');
      setUsuarios(data.data || []);
    } catch (err) {
      console.error(err);
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setCreando(true);
      await api.post('/api/usuarios', {
        nombreCompleto,
        usuarioLogin,
        contrasenia,
        correo,
        idRol: Number(idRol),
      });

      setNombreCompleto('');
      setUsuarioLogin('');
      setContrasenia('');
      setCorreo('');
      setIdRol('2');

      await cargar();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Error al crear usuario';
      setError(msg);
    } finally {
      setCreando(false);
    }
  };

  const rolNombre = (u) => u.NombreRol || u.Rol || '';

  return (
    <div className="page">
      <h1 className="page-title">Gestión de usuarios</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Lista de usuarios */}
      <div className="card">
        <h2 className="section-title">Usuarios existentes</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Correo</th>
                <th>Activo</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.IdUsuario}>
                  <td>{u.IdUsuario}</td>
                  <td>{u.NombreCompleto}</td>
                  <td>{u.UsuarioLogin}</td>
                  <td>{rolNombre(u)}</td>
                  <td>{u.Correo}</td>
                  <td>{u.Activo ? 'Sí' : 'No'}</td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan="6">No hay usuarios registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Crear usuario */}
      <div className="card">
        <h2 className="section-title">Crear nuevo usuario</h2>
        <form onSubmit={handleCrearUsuario}>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre completo *</label>
              <input
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Usuario login *</label>
              <input
                value={usuarioLogin}
                onChange={(e) => setUsuarioLogin(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Contraseña *</label>
              <input
                type="password"
                value={contrasenia}
                onChange={(e) => setContrasenia(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Correo</label>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Rol *</label>
              <select
                value={idRol}
                onChange={(e) => setIdRol(e.target.value)}
              >
                <option value="1">ADMIN</option>
                <option value="2">TECNICO</option>
                <option value="3">COORDINADOR</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={creando}
            style={{ marginTop: '0.75rem' }}
          >
            {creando ? 'Creando...' : 'Crear usuario'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UsuariosPage;

