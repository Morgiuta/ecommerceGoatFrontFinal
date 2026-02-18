import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ecommerceService } from '../../services/ecommerceService';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+[1-9]\d{1,14}$/;

interface Errors {
  name?: string;
  lastname?: string;
  email?: string;
  telephone?: string;
  password?: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: Errors = {};

    const trimmedName = name.trim();
    const trimmedLastname = lastname.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = telephone.trim();

    if (!trimmedName) {
      newErrors.name = "El nombre es obligatorio";
    } else if (trimmedName.length > 100) {
      newErrors.name = "Máximo 100 caracteres";
    }

    if (!trimmedLastname) {
      newErrors.lastname = "El apellido es obligatorio";
    } else if (trimmedLastname.length > 100) {
      newErrors.lastname = "Máximo 100 caracteres";
    }

    if (!trimmedEmail) {
      newErrors.email = "El email es obligatorio";
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = "Formato de email inválido";
    }

    if (!trimmedPhone) {
      newErrors.telephone = "El teléfono es obligatorio";
    } else if (!phoneRegex.test(trimmedPhone)) {
      newErrors.telephone = "Debe estar en formato internacional (+5491123456789)";
    }

    if (!password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (password.length < 6) {
      newErrors.password = "Debe tener al menos 6 caracteres";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      await ecommerceService.createClient({
        name: name.trim(),
        lastname: lastname.trim(),
        email: email.trim().toLowerCase(),
        telephone: telephone.trim(),
        password
      });

      navigate('/login');

    } catch (err: any) {
      const serverMessage = err.response?.data?.detail || "";
    
      if (
        serverMessage.includes("duplicate key") ||
        serverMessage.includes("ix_clients_email") ||
        serverMessage.includes("already exists")
      ) {
        setErrors({
          email: "Este mail ya existe"
        });
      } else {
        setErrors({
          email: "Error al crear la cuenta"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field?: string) =>
    `w-full bg-slate-100 rounded-2xl p-4 border ${
      field ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-indigo-200"
    } focus:ring-2 transition-all`;

  return (
    <div className="max-w-md mx-auto mt-20 p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl space-y-8">
      
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-slate-900">Crear Cuenta</h2>
        <p className="text-slate-400 font-medium">Registrate para comenzar a comprar</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Nombre */}
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
            Nombre *
          </label>
          <input
            type="text"
            className={inputStyle(errors.name)}
            value={name}
            onChange={e => setName(e.target.value)}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-2">{errors.name}</p>
          )}
        </div>

        {/* Apellido */}
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
            Apellido *
          </label>
          <input
            type="text"
            className={inputStyle(errors.lastname)}
            value={lastname}
            onChange={e => setLastname(e.target.value)}
          />
          {errors.lastname && (
            <p className="text-red-500 text-xs mt-2">{errors.lastname}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
            Email *
          </label>
          <input
            type="email"
            className={inputStyle(errors.email)}
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-2">{errors.email}</p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
            Teléfono *
          </label>
          <input
            type="text"
            placeholder="+5491123456789"
            className={inputStyle(errors.telephone)}
            value={telephone}
            onChange={e => setTelephone(e.target.value)}
          />
          {errors.telephone && (
            <p className="text-red-500 text-xs mt-2">{errors.telephone}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
            Contraseña *
          </label>
          <input
            type="password"
            className={inputStyle(errors.password)}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-2">{errors.password}</p>
          )}
        </div>

        <button
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 disabled:opacity-50"
        >
          {loading ? "CREANDO..." : "REGISTRARSE"}
        </button>

        <button
          type="button"
          onClick={() => navigate('/login')}
          className="w-full border border-slate-200 text-slate-700 py-4 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all"
        >
          INGRESAR
        </button>

      </form>
    </div>
  );
};

export default Register;
