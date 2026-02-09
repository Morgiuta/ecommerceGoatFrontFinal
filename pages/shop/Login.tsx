
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ecommerceService } from '../../services/ecommerceService';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await ecommerceService.login({ email, password });
      localStorage.setItem('vortex_user', JSON.stringify(res.data));
      navigate('/');
    } catch (err) {
      alert("Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-slate-900">Bienvenido</h2>
        <p className="text-slate-400 font-medium">Ingresa para continuar con tu compra</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Email</label>
          <input 
            type="email" 
            required 
            className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500/20"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Contraseña</label>
          <input 
            type="password" 
            required 
            className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500/20"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button 
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
        >
          {loading ? "CARGANDO..." : "INGRESAR"}
        </button>
      </form>
    </div>
  );
};

export default Login;
