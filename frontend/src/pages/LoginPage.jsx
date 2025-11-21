
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [usuarioLogin, setUsuarioLogin] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(usuarioLogin, contrasenia);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate('/', { replace: true });
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2 className="login-title">MP DICRI - Login</h2>

        <div className="login-field">
          <label>Usuario</label>
          <input
            type="text"
            value={usuarioLogin}
            onChange={(e) => setUsuarioLogin(e.target.value)}
            required
          />
        </div>

        <div className="login-field">
          <label>Contraseña</label>
          <input
            type="password"
            value={contrasenia}
            onChange={(e) => setContrasenia(e.target.value)}
            required
          />
        </div>

        {error && <div className="login-error">{error}</div>}

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

