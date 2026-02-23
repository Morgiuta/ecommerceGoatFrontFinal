
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Package, Tags, 
  ShoppingCart, Receipt, MessageSquare, LogOut, Store 
} from 'lucide-react';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const menu = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Productos', icon: Package, path: '/admin/products' },
    { label: 'Categorías', icon: Tags, path: '/admin/categories' },
    { label: 'Pedidos', icon: ShoppingCart, path: '/admin/orders' },
    { label: 'Facturación', icon: Receipt, path: '/admin/bills' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <aside className="w-72 bg-slate-900 flex flex-col shrink-0">
        <div className="p-8">
           <h2 className="text-2xl font-black text-white tracking-tighter">
             GOAT<span className="text-indigo-500">ADMIN</span>
           </h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
           {menu.map(item => {
             const active = location.pathname === item.path;
             return (
               <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
               >
                 <item.icon size={22} />
                 <span>{item.label}</span>
               </Link>
             )
           })}
        </nav>

        <div className="p-6 border-t border-slate-800 space-y-4">
           <Link to="/" className="flex items-center gap-3 px-6 py-3 text-slate-400 font-bold hover:text-emerald-400 transition-colors">
              <Store size={22} />
              <span>Ver Tienda</span>
           </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-10">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
