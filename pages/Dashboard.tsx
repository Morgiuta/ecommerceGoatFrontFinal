
import React, { useState, useEffect } from 'react';
import { ecommerceService } from '../services/ecommerceService';
import { 
  Users, ShoppingCart, Package, TrendingUp, 
  Activity, AlertCircle, RefreshCw, ChevronRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { Status } from '../types';


const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    clients: 0,
    products: 0,
    orders: 0,
    revenue: 0
  });
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dailySales, setDailySales] = useState<any[]>([]);


  const loadData = async () => {
    setLoading(true);
    try {
      const [cRes, pRes, oRes, hRes] = await Promise.all([
        ecommerceService.getClients(),
        ecommerceService.getProducts(),
        ecommerceService.getOrders(),
        ecommerceService.getHealth()
      ]);

      // Filtrar canceladas
      const validOrders = oRes.data.filter(o => o.status !== Status.CANCELED);

      const salesByDay: Record<string, { total: number; count: number }> = {};

      validOrders.forEach(order => {
        const day = order.date.split('T')[0];

        if (!salesByDay[day]) {
          salesByDay[day] = { total: 0, count: 0 };
        }

        salesByDay[day].total += order.total;
        salesByDay[day].count += 1;
      });

      const formattedSales = Object.entries(salesByDay)
        .map(([date, values]) => ({
          date,
          total: values.total,
          count: values.count
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      setDailySales(formattedSales);

      setStats({
        clients: cRes.data.length,
        products: pRes.data.length,
        orders: validOrders.length,
        revenue: validOrders.reduce((acc, o) => acc + o.total, 0)
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
    { label: 'Ventas', value: stats.orders, icon: ShoppingCart, color: 'bg-indigo-500', link: '/orders' },
    { label: 'Productos', value: stats.products, icon: Package, color: 'bg-purple-500', link: '/products' },
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
      {metricCards.map((m, idx) => {
        const CardContent = (
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group cursor-pointer">
            <div className={`w-12 h-12 ${m.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform`}>
              <m.icon size={24} />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{m.label}</p>
            <p className="text-4xl font-black text-slate-900">{m.value}</p>

            {m.link && (
              <p className="mt-4 text-sm font-bold text-indigo-600 flex items-center gap-1">
                {m.label === 'Ventas' ? 'Ir a ventas' : 'Ir a productos'}
                <ChevronRight size={16} />
              </p>
            )}
          </div>
        );

        return m.link ? (
          <Link key={idx} to={m.link}>
            {CardContent}
          </Link>
        ) : (
          <div key={idx}>{CardContent}</div>
        );
      })}

      </div>

      {/* GRAFICO UNICO */}
      <div className="mt-8">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm w-full">
          
          <h3 className="text-xl font-bold text-slate-800 mb-6">
            Ventas por Día (Mes Actual)
          </h3>

          <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dailySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Bar
                dataKey="count"
                fill="#6366F1"
                radius={[6, 6, 0, 0]}
                name="Cantidad de Ventas"
              />
            </ComposedChart>
          </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
