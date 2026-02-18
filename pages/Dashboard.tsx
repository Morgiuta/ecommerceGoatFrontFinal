
import React, { useState, useEffect } from 'react';
import { ecommerceService } from '../services/ecommerceService';
import { 
  Users, ShoppingCart, Package, TrendingUp, 
  Activity, AlertCircle, RefreshCw, ChevronRight 
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    clients: 0,
    products: 0,
    orders: 0,
    revenue: 0
  });
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cRes, pRes, oRes, hRes] = await Promise.all([
        ecommerceService.getClients(),
        ecommerceService.getProducts(),
        ecommerceService.getOrders(),
        ecommerceService.getHealth()
      ]);

      setStats({
        clients: cRes.data.length,
        products: pRes.data.length,
        orders: oRes.data.length,
        revenue: oRes.data.reduce((acc, o) => acc + o.total, 0)
      });
      setHealth(hRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const metricCards = [
    { label: 'Clientes', value: stats.clients, icon: Users, color: 'bg-blue-500' },
    { label: 'Ventas', value: stats.orders, icon: ShoppingCart, color: 'bg-indigo-500' },
    { label: 'Productos', value: stats.products, icon: Package, color: 'bg-purple-500' },
    { label: 'Ingresos', value: `$${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Panel de Control</h1>
          <p className="text-slate-500 font-medium">Visualización de métricas en tiempo real.</p>
        </div>
        <button onClick={loadData} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-indigo-600">
           <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((m, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
            <div className={`w-12 h-12 ${m.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform`}>
              <m.icon size={24} />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{m.label}</p>
            <p className="text-4xl font-black text-slate-900">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Salud del Sistema</h3>
            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${health?.status === 'healthy' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
              {health?.status || 'Buscando...'}
            </span>
          </div>
          
          <div className="space-y-4">
            {health?.checks && Object.entries(health.checks).map(([key, value]: [any, any]) => (
              <div key={key} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors">
                 <div className="flex items-center gap-4">
                   <div className={`w-2 h-2 rounded-full ${value.status === 'up' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                   <span className="font-bold text-slate-700 capitalize">{key}</span>
                 </div>
                 <div className="text-right">
                    <p className="text-xs font-bold text-slate-400">{value.latency_ms ? `${value.latency_ms}ms` : 'Activo'}</p>
                    {value.health && <p className="text-[10px] text-indigo-500 font-black uppercase">{value.health}</p>}
                 </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white space-y-6 shadow-2xl shadow-indigo-600/20">
              <Activity size={32} className="text-indigo-200" />
              <h3 className="text-xl font-bold">Estado del Almacén</h3>
              <p className="text-indigo-100 text-sm leading-relaxed">Hay productos con bajo stock. Se recomienda revisar el inventario y reabastecer para evitar interrupciones en ventas.</p>
              <button className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors">Ver Alertas</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
