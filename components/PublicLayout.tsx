
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const userStr = localStorage.getItem('vortex_user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('vortex_user');
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="text-2xl font-black text-indigo-600 tracking-tighter shrink-0">
            VORTEX<span className="text-slate-900">STORE</span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-md relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input 
              type="text" 
              placeholder="¿Qué buscas hoy?" 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-full border-none focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all"
             />
          </div>

          <div className="flex items-center space-x-5">
            <Link to="/cart" className="relative p-2 text-slate-600 hover:text-indigo-600 transition-colors">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4 border-l pl-4 border-slate-200">
                <Link to="/profile" className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-semibold hidden lg:inline group-hover:text-indigo-600 transition-colors">{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-slate-900 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-200">
                Entrar
              </Link>
            )}

            {user?.is_admin && (
              <Link to="/admin" className="p-2 text-amber-500 hover:bg-amber-50 rounded-full transition-all">
                <Package size={22} />
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm font-medium">© 2024 Vortex Ecommerce System. Built with FastAPI & React.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
