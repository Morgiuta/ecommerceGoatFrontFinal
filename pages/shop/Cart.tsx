
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ChevronLeft } from 'lucide-react';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  if (cart.length === 0) return (
    <div className="max-w-md mx-auto py-20 text-center space-y-6">
      <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-slate-300">
        <ShoppingBag size={48} />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">Tu carrito está vacío</h2>
        <p className="text-slate-500">Parece que aún no has añadido nada interesante.</p>
      </div>
      <Link to="/" className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
        Comenzar a comprar
      </Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-slate-900">Carrito ({cartCount})</h2>
        <Link to="/" className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:underline">
           <ChevronLeft size={18} />
           Seguir comprando
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item.product.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-6 shadow-sm group">
              <div className="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt={item.product.name} />
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.product.name}</h4>
                  <button onClick={() => removeFromCart(item.product.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
                <p className="text-xs text-slate-400 font-bold uppercase">{item.product.category?.name || 'Electrónica'}</p>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-3 bg-slate-50 rounded-xl p-1 border">
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg text-slate-500 transition-all"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-bold text-slate-700 w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg text-slate-500 transition-all"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="text-xl font-black text-slate-900">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-blue-500/20 sticky top-24">
            <h3 className="text-xl font-bold mb-8 flex items-center">
              <ShoppingBag size={24} className="mr-3 text-blue-400" />
              Resumen de Pedido
            </h3>
            
            <div className="space-y-4 text-slate-400 text-sm">
              <div className="flex justify-between">
                <span>Total de artículos</span>
                <span className="text-white font-bold">{cartCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-bold">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío estimado</span>
                <span className="text-green-400 font-bold uppercase text-[10px] tracking-widest mt-1">Gratis</span>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-800">
              <div className="flex justify-between items-end mb-8">
                <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Total a pagar</span>
                <span className="text-4xl font-black text-white">${cartTotal.toFixed(2)}</span>
              </div>
              
              <Link 
                to="/checkout" 
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/30 group"
              >
                <span>IR AL PAGO</span>
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-4 opacity-30 grayscale contrast-150">
               <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="visa" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="mastercard" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-5" alt="paypal" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
