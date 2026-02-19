
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ecommerceService } from '../../services/ecommerceService';
import { Order, Bill, Status } from '../../types';
import { User, Package, FileText, ChevronRight, LogOut, Clock , Pencil} from 'lucide-react';

const Profile: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('vortex_user') || '{}');
  const customerId = storedUser?.id_key;
  const [addresses, setAddresses] = useState<any[]>([]);
  const [newAddress, setNewAddress] = useState({
    street: "",
    number: "",
    city: ""
  });
  //const [addingAddress, setAddingAddress] = useState(false);


  useEffect(() => {
    if (!customerId) {
      navigate('/checkout');
      return;
    }
  
    const fetchData = async () => {
      setLoading(true);
      try {
        const numericClientId = Number(customerId);
  
        const [orderRes, billRes, addressRes] = await Promise.all([
          ecommerceService.getOrdersByClient(numericClientId),
          ecommerceService.getBills(),
          ecommerceService.getAddressesByClient(numericClientId)
        ]);
  
        // 🔥 FILTRADO POR CLIENTE
        const userAddresses = addressRes.data.filter(
          (address: any) => address.client_id === numericClientId
        );
  
        setAddresses(userAddresses);
  
        const userOrders = orderRes.data;
        setOrders(userOrders);
  
        const userBills = billRes.data.filter(bill =>
          userOrders.some(order => order.id === bill.order_id)
        );
  
        setBills(userBills);
  
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [customerId, navigate]);
  

  const handleAddAddress = async () => {
    if (!newAddress.street || !newAddress.number || !newAddress.city) {
      alert("Completá todos los campos");
      return;
    }
  
    try {
      const res = await ecommerceService.createAddress({
        ...newAddress,
        client_id: customerId
      });
  
      setAddresses(prev => [...prev, res.data]);
      setNewAddress({ street: "", number: "", city: "" });
    } catch (err) {
      alert("Error al agregar dirección");
    }
  };
  
  const handleDeleteAddress = async (id: number) => {
    try {
      await ecommerceService.deleteAddress(id);
      setAddresses(addresses.filter(a => a.id_key !== id));
    } catch {
      alert("Error al eliminar dirección");
    }
  };

  const handleDeactivateAccount = async () => {
    const confirmDelete = window.confirm(
      "¿Estás seguro que querés desactivar tu cuenta? Esta acción es irreversible."
    );
  
    if (!confirmDelete) return;
  
    try {
      await ecommerceService.deleteClient(Number(customerId));
  
      // Limpiar sesión
      localStorage.removeItem("vortex_user");
  
      alert("Tu cuenta fue desactivada correctamente.");
  
      navigate("/");
    } catch (error: any) {
      if (error.response?.status === 404) {
        alert("El usuario no existe.");
      } else {
        alert("Error al desactivar la cuenta.");
      }
    }
  };

  if (loading) return <div className="py-20 text-center">Cargando perfil...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-black">
            {storedUser.name?.[0]}{storedUser.lastname?.[0]}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-slate-900">
                {storedUser.name} {storedUser.lastname}
              </h2>
  
              <button
                onClick={() => navigate('/profile/edit')}
                className="p-2 rounded-full hover:bg-slate-100 transition-all"
              >
                <Pencil size={18} className="text-slate-500 hover:text-blue-600" />
              </button>
            </div>
  
            <p className="text-slate-500 font-medium">
              {storedUser.email}
            </p>
          </div>
        </div>
        <button 
          onClick={() => { localStorage.removeItem('vortex_user'); navigate('/'); }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all border border-red-100"
        >
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
        <button 
          onClick={handleDeactivateAccount}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-all shadow-md"
        >
          <User size={20} />
          <span>Desactivar Cuenta</span>
        </button>
      </div>
  
      {/* PRIMERA FILA: Pedidos + Facturas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Mis Pedidos */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Package size={24} className="text-blue-600" />
              Mis Pedidos
            </h3>
            <span className="text-xs font-bold text-slate-400 uppercase bg-slate-100 px-3 py-1 rounded-full">
              {orders.length} pedidos
            </span>
          </div>
          
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all group">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="font-black text-slate-900">Pedido #{order.id}</p>
                    <div className="flex items-center text-xs text-slate-400 font-bold gap-2">
                      <Clock size={12} />
                      {order.date}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    order.status === Status.DELIVERED ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {Status[order.status]}
                  </span>
                </div>
                
                <div className="mt-4 pt-4 border-t flex justify-between items-end">
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Total pagado</p>
                    <p className="text-2xl font-black text-slate-900">${order.total.toFixed(2)}</p>
                  </div>
                  <button className="p-2 text-slate-400 group-hover:text-blue-600 transition-colors">
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Mis Facturas */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <FileText size={24} className="text-blue-600" />
              Facturas & Documentos
            </h3>
          </div>
  
          <div className="space-y-4">
            {bills.map(bill => (
              <div key={bill.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between hover:shadow-lg transition-all cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <FileText size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Factura #{bill.id}</p>
                    <p className="text-xs text-slate-400 font-medium">
                      Pedido #{bill.order_id} · {bill.bill_date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900">${bill.amount.toFixed(2)}</p>
                  <button className="text-xs font-bold text-blue-600 hover:underline">
                    Descargar PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
  
      </div>
  
      {/* SEGUNDA FILA: Direcciones */}
      <div className="space-y-6 mt-10">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-black text-slate-900">
            📍 Mis Direcciones
          </h3>
          <span className="text-xs font-bold text-slate-400 uppercase bg-slate-100 px-3 py-1 rounded-full">
            {addresses.length} direcciones
          </span>
        </div>
  
        <div className="space-y-4">
          {addresses.map(address => (
            <div
              key={address.id_key}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-slate-900">
                  {address.street} {address.number}
                </p>
                <p className="text-sm text-slate-500">
                  {address.city}
                </p>
              </div>
  
              <button
                onClick={() => handleDeleteAddress(address.id_key)}
                className="text-red-500 hover:text-red-700 font-bold"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
  
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
          <h4 className="font-bold text-slate-700">
            Agregar nueva dirección
          </h4>
  
          <div className="grid md:grid-cols-3 gap-4">
            <input
              placeholder="Calle"
              className="bg-white p-3 rounded-xl border border-slate-200"
              value={newAddress.street}
              onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
            />
            <input
              placeholder="Número"
              className="bg-white p-3 rounded-xl border border-slate-200"
              value={newAddress.number}
              onChange={e => setNewAddress({ ...newAddress, number: e.target.value })}
            />
            <input
              placeholder="Ciudad"
              className="bg-white p-3 rounded-xl border border-slate-200"
              value={newAddress.city}
              onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
            />
          </div>
  
          <button
            onClick={handleAddAddress}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700"
          >
            Guardar Dirección
          </button>
        </div>
      </div>
  
    </div>
  );
};

export default Profile;
