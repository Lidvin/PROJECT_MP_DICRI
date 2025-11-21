
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null); 
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    
    
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
  }, []);

  const login = async (usuarioLogin, contrasenia) => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', { usuarioLogin, contrasenia });

      const { token, usuario } = data;
      setToken(token);
      setUsuario(usuario);

      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));

      return { ok: true };
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Error al iniciar sesión';
      return { ok: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  };

  return (
    <AuthContext.Provider value={{ usuario, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

