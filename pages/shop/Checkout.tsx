
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ecommerceService } from '../../services/ecommerceService';
import { CheckCircle2, ShieldCheck, MapPin, CreditCard, ArrowRight, ShoppingBag } from 'lucide-react';
import { DeliveryMethod, Status, PaymentType } from '../../types';

const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const userStr = localStorage.getItem('vortex_user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // 1. Crear Factura (Bill)
      const billRes = await ecommerceService.createBill({
        bill_number: `VORTEX-${Date.now()}`,
        discount: 0,
        date: new Date().toISOString().split('T')[0],
        total: cartTotal,
        payment_type: PaymentType.CARD,
        client_id: user.id
      });

      // 2. Crear Pedido (Order)
      const orderRes = await ecommerceService.createOrder({
        total: cartTotal,
        delivery_method: DeliveryMethod.HOME_DELIVERY,
        status: Status.PENDING,
        client_id: user.id,
        bill_id: billRes.data.id
      });

      // 3. Crear Detalles (OrderDetails) - Uno por uno como requiere la API
      for (const item of cart) {
        await ecommerceService.createOrderDetail({
          quantity: item.quantity,
          price: item.product.price,
          order_id: orderRes.data.id,
          product_id: item.product.id
        });
      }

      setSuccess(true);
      clearCart();
    } catch (err) {
      alert("Error al procesar la compra. Verifica el stock de los productos.");
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="max-w-2xl mx-auto py-20 text-center space-y-6">
      <div className="flex justify-center text-green-500">
        <CheckCircle2 size={100} strokeWidth={1} />
      </div>
      <h2 className="text-4xl font-black text-slate-900">¡Compra Exitosa!</h2>
      <p className="text-slate-500 text-lg">Tu pedido está siendo procesado por nuestro equipo.</p>
      <button onClick={() => navigate('/profile')} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200">
        Ver mis pedidos
      </button>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-7xl mx-auto">
      <div className="lg:col-span-7 space-y-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 text-indigo-600">
            <MapPin size={28} />
            <h2 className="text-2xl font-bold">Envío</h2>
          </div>
          <div className="p-6 border-2 border-indigo-600 bg-indigo-50 rounded-2xl">
             <p className="font-bold text-slate-900">Dirección Predeterminada</p>
             <p className="text-sm text-slate-600">Calle Principal 123, Ciudad Central</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 text-indigo-600">
            <CreditCard size={28} />
            <h2 className="text-2xl font-bold">Pago</h2>
          </div>
          <div className="p-4 border rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-slate-100 rounded-md"></div>
              <span className="font-bold">Tarjeta de Crédito ending in 4242</span>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase">Exp 12/26</span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl sticky top-24">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
             <ShoppingBag size={24} className="text-indigo-400" />
             Resumen
          </h3>
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {cart.map(item => (
              <div key={item.product.id} className="flex justify-between items-center text-sm">
                <span className="text-slate-400">{item.quantity}x {item.product.name}</span>
                <span className="font-bold">${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 space-y-6">
            <div className="flex justify-between items-end">
              <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Total a Pagar</span>
              <span className="text-5xl font-black text-indigo-400">${cartTotal.toFixed(2)}</span>
            </div>
            <button 
              disabled={loading || cart.length === 0}
              onClick={handlePlaceOrder}
              className="w-full bg-indigo-600 py-5 rounded-2xl font-black text-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-indigo-600/30 disabled:opacity-50"
            >
              {loading ? "PROCESANDO..." : (
                <>
                  CONFIRMAR COMPRA
                  <ArrowRight size={24} />
                </>
              )}
            </button>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            <ShieldCheck size={14} className="text-green-500" />
            Transacción 100% Protegida
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
