
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ecommerceService } from '../../services/ecommerceService';
import { Order, Bill, Status } from '../../types';
import { User, Package, FileText, ChevronRight, LogOut, Clock } from 'lucide-react';

const Profile: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const customerId = localStorage.getItem('customer_id');

  useEffect(() => {
    if (!customerId) {
      navigate('/checkout');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [orderRes, billRes] = await Promise.all([
          ecommerceService.getOrders(),
          ecommerceService.getBills()
        ]);
        // Filter by user ID (simulated logic)
        setOrders(orderRes.data);
        setBills(billRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [customerId, navigate]);

  if (loading) return <div className="py-20 text-center">Cargando perfil...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-black">
            JD
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900">Hola, Juan Pérez</h2>
            <p className="text-slate-500 font-medium">juan@example.com · Miembro desde Oct 2023</p>
          </div>
        </div>
        <button 
          onClick={() => { localStorage.removeItem('customer_id'); navigate('/'); }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all border border-red-100"
        >
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Mis Pedidos */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Package size={24} className="text-blue-600" />
              Mis Pedidos
            </h3>
            <span className="text-xs font-bold text-slate-400 uppercase bg-slate-100 px-3 py-1 rounded-full">{orders.length} pedidos</span>
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
                    <p className="text-xs text-slate-400 font-medium">Pedido #{bill.order_id} · {bill.bill_date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900">${bill.amount.toFixed(2)}</p>
                  <button className="text-xs font-bold text-blue-600 hover:underline">Descargar PDF</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
