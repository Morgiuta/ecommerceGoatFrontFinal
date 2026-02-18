import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ecommerceService } from "../../services/ecommerceService";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+[1-9]\d{1,14}$/;

interface Errors {
  name?: string;
  lastname?: string;
  email?: string;
  telephone?: string;
}

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("vortex_user") || "{}");
  const clientId = storedUser?.id_key;

  const inputStyle = (field?: string) =>
    `w-full bg-slate-100 rounded-2xl p-4 border ${
      field
        ? "border-red-400 focus:ring-red-200"
        : "border-slate-200 focus:ring-indigo-200"
    } focus:ring-2 transition-all`;
  
  
    const [errors, setErrors] = useState<Errors>({});

  const [form, setForm] = useState<any>({
    name: "",
    lastname: "",
    email: "",
    telephone: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const newErrors: Errors = {};
  
    const trimmedName = form.name?.trim() || "";
    const trimmedLastname = form.lastname?.trim() || "";
    const trimmedEmail = form.email?.trim().toLowerCase() || "";
    const trimmedPhone = form.telephone?.trim() || "";
  
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
  
    setErrors(newErrors);
    console.log("Errores de validación:", newErrors);

    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (!clientId) {
      navigate("/");
      return;
    }

    const fetchClient = async () => {
      try {
        const res = await ecommerceService.getClients();
        const myClient = res.data.find((c: any) => c.id_key === clientId);
        setForm(myClient);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId, navigate]);

  const handleSave = async () => {

    if (!validate()) {
      console.log("Validación falló");
      return;
    }
  
    setSaving(true);
  
    try {
      await ecommerceService.updateClient(clientId, {
        name: form.name.trim(),
        lastname: form.lastname.trim(),
        email: form.email.trim().toLowerCase(),
        telephone: form.telephone.trim()
      });
  
      const updatedUser = {
        ...storedUser,
        name: form.name.trim(),
        lastname: form.lastname.trim(),
        email: form.email.trim().toLowerCase(),
        telephone: form.telephone.trim()
      };
  
      localStorage.setItem("vortex_user", JSON.stringify(updatedUser));
  
      navigate("/profile");
  
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
        alert("Error al actualizar perfil");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20">Cargando...</div>;

  return (
    <div className="max-w-xl mx-auto mt-16 bg-white p-10 rounded-3xl shadow-lg space-y-6">

      <h2 className="text-2xl font-black text-slate-900">
        Editar Perfil
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
            Nombre *
          </label>
          <input
            className={inputStyle(errors.name)}
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-2">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
            Apellido *
          </label>
          <input
            className={inputStyle(errors.lastname)}
            value={form.lastname}
            onChange={e => setForm({ ...form, lastname: e.target.value })}
          />
          {errors.lastname && (
            <p className="text-red-500 text-xs mt-2">{errors.lastname}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
            Email *
          </label>
          <input
            type="email"
            className={inputStyle(errors.email)}
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-2">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
            Teléfono
          </label>
          <input
            className={inputStyle(errors.telephone)}
            value={form.telephone}
            onChange={e => setForm({ ...form, telephone: e.target.value })}
          />
          {errors.telephone && (
            <p className="text-red-500 text-xs mt-2">{errors.telephone}</p>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 disabled:opacity-50"
        >
          {saving ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
        </button>

        <button
          onClick={() => navigate("/profile")}
          className="px-6 py-3 rounded-2xl font-bold border border-slate-200 hover:bg-slate-50"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
