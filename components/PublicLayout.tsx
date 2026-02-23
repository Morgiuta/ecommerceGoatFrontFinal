
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package, Search,ShoppingBag, Mail,MapPin,Phone,Facebook,Instagram,Twitter } from 'lucide-react';
import { useCart } from '../context/CartContext';


const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const userStr = localStorage.getItem('vortex_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const [searchTerm, setSearchTerm] = React.useState('');
  const location = useLocation();


  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
  
    if (q) {
      setSearchTerm(q);
    }
  }, [location.search]);

  const handleLogout = () => {
    localStorage.removeItem('vortex_user');
    navigate('/');
    window.location.reload();
  };

  return (
<div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 font-sans text-slate-900 flex flex-col transition-colors duration-500">
      <nav className="bg-white/70 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="text-2xl font-black text-indigo-600 tracking-tighter shrink-0">
            GOAT<span className="text-slate-900">ECH</span>
          </Link>
          <div className="hidden md:flex flex-1 max-w-md relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input 
              type="text" 
              placeholder="¿Qué buscas hoy?" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchTerm.trim() !== '') {
                  navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
                }
              }}
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

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-300 rounded-t-[3rem] pt-16 pb-8 mt-20">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-start gap-12">
  {/* Brand */}
  <div className="space-y-6">
    <div className="flex items-center gap-2 text-white">
      <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
        <ShoppingBag size={20} />
      </div>
      <span className="text-xl font-black tracking-tight">GOATECH</span>
    </div>
    <p className="text-sm leading-relaxed">
      Líderes en tecnología y electrónica. Ofrecemos los mejores productos con garantía oficial y envío a todo el país.
    </p>
    <div className="flex gap-4">
      <a href="https://facebook.com/" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
        <Facebook size={18} />
      </a>
      <a href="https://instagram.com/" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
        <Instagram size={18} />
      </a>
      <a href="https://x.com/" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
        <Twitter size={18} />
      </a>
    </div>
  </div>
  {/* Contact */}
  <div className="space-y-6">
    <h4 className="text-white font-bold uppercase text-xs tracking-widest">Contacto</h4>
    <ul className="space-y-4 text-sm">
      <li className="flex items-start gap-3">
        <MapPin size={18} className="text-indigo-500 shrink-0" />
        <span>Av. Corrientes 1234, CABA, Argentina</span>
      </li>
      <li className="flex items-center gap-3">
        <Phone size={18} className="text-indigo-500 shrink-0" />
        <span>+54 11 4567-8900</span>
      </li>
      <li className="flex items-center gap-3">
        <Mail size={18} className="text-indigo-500 shrink-0" />
        <span>contacto@goatech.com</span>
      </li>
    </ul>
  </div>
</div>

        <div className="max-w-7xl mx-auto px-8 mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-medium text-slate-500">
            © 2024 Goatech Ecommerce System. Built with FastAPI & React.
          </p>
          <div className="flex gap-6 grayscale opacity-50">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
