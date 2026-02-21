import React, { useState, useEffect } from 'react';
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
  const parsedUser = userStr ? JSON.parse(userStr) : null;
  const customerId = parsedUser ? Number(parsedUser.id_key) : null;

  // NUEVOS ESTADOS
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(DeliveryMethod.DRIVE_THRU);
  const [paymentType, setPaymentType] = useState<PaymentType>(PaymentType.CARD);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);

  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    exp: '',
    cvv: ''
  });

  // CARGAR DIRECCIONES DEL USUARIO
  useEffect(() => {
    if (!customerId) return;
  
    const fetchAddresses = async () => {
      try {
        const res = await ecommerceService.getAddressesByClient(customerId);
  
        const userAddresses = res.data.filter(
          (address: any) => Number(address.client_id) === customerId
        );
  
        setAddresses(userAddresses);
  
      } catch (err) {
        console.error("Error cargando direcciones", err);
      }
    };
  
    fetchAddresses();
  }, [customerId]);

  const simulatePayment = async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1500);
    });
  };

  const handlePlaceOrder = async () => {
    if (!customerId) {
      navigate('/login');
      return;
    }
  
    if (deliveryMethod === DeliveryMethod.HOME_DELIVERY && !selectedAddress) {
      alert("Debes seleccionar una dirección.");
      return;
    }
  
    if (cart.length === 0) {
      alert("El carrito está vacío.");
      return;
    }
  
    setLoading(true);
  
    try {
      // 1️⃣ Simular Pago (siempre exitoso)
      await simulatePayment();
  
      // 2️⃣ Crear Factura
      const billRes = await ecommerceService.createBill({
        bill_number: `VORTEX-${Date.now()}`,
        discount: 0,
        date: new Date().toISOString().split('T')[0],
        total: cartTotal,
        payment_type: paymentType,
        client_id: customerId
      });
      console.log("BILL RESPONSE COMPLETA:", billRes);
      console.log("BILL DATA:", billRes.data);
      // 3️⃣ Crear Pedido
      const orderRes = await ecommerceService.createOrder({
        total: cartTotal,
        delivery_method: deliveryMethod,
        status: Status.PENDING,
        client_id: customerId,
        bill_id: billRes.data.id_key,
        address_id:
          deliveryMethod === DeliveryMethod.HOME_DELIVERY
            ? selectedAddress
            : null
      });
  
      // 4️⃣ Crear Detalles del Pedido
      for (const item of cart) {
        const detailRes = await ecommerceService.createOrderDetail({
          quantity: item.quantity,
          price: item.product.price,
          order_id: orderRes.data.id_key,
          product_id: item.product.id
        });

        console.log("ORDER DETAIL RESPONSE:", detailRes.data);
      }

      
      await ecommerceService.getProducts();
      
      setSuccess(true);
      clearCart();
  
    } catch (err) {
      console.error("Error en checkout:", err);
      alert("Error al procesar la compra.");
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="max-w-2xl mx-auto py-20 text-center space-y-6">
      <CheckCircle2 size={100} className="text-green-500 mx-auto" />
      <h2 className="text-4xl font-black text-slate-900">¡Compra Exitosa!</h2>
      <button onClick={() => navigate('/profile')} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold">
        Ver mis pedidos
      </button>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-7xl mx-auto">

      {/* ENVÍO */}
      <div className="lg:col-span-7 space-y-8">
        <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">

          <div className="flex items-center gap-3 text-indigo-600">
            <MapPin size={28} />
            <h2 className="text-2xl font-bold">Envío</h2>
          </div>

          <select
            value={deliveryMethod}
            onChange={(e) => setDeliveryMethod(Number(e.target.value))}
            className="w-full p-3 border rounded-xl"
          >
            <option value={DeliveryMethod.DRIVE_THRU}>Drive-Thru</option>
            <option value={DeliveryMethod.ON_HAND}>En mano</option>
            <option value={DeliveryMethod.HOME_DELIVERY}>A domicilio</option>
          </select>

          {deliveryMethod === DeliveryMethod.HOME_DELIVERY && (
            <div className="space-y-3">
              {addresses.map((addr: any) => (
                <div
                  key={addr.id_key}
                  onClick={() => setSelectedAddress(addr.id_key)}
                  className={`p-4 border rounded-xl cursor-pointer ${
                    selectedAddress === addr.id_key
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-slate-200"
                  }`}
                >
                  <p className="font-bold">
                    {addr.street} {addr.number}
                  </p>
                  <p className="text-sm text-slate-500">
                    {addr.city}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PAGO */}
        <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
          <div className="flex items-center gap-3 text-indigo-600">
            <CreditCard size={28} />
            <h2 className="text-2xl font-bold">Pago</h2>
          </div>

          <select
            value={paymentType}
            onChange={(e) => setPaymentType(Number(e.target.value))}
            className="w-full p-3 border rounded-xl"
          >
            <option value={PaymentType.CASH}>Efectivo</option>
            <option value={PaymentType.CARD}>Tarjeta</option>
            <option value={PaymentType.DEBIT}>Débito</option>
            <option value={PaymentType.CREDIT}>Crédito</option>
            <option value={PaymentType.BANK_TRANSFER}>Transferencia</option>
          </select>

          {paymentType !== PaymentType.CASH && (
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Número de tarjeta" className="p-3 border rounded-xl" />
              <input placeholder="Nombre en tarjeta" className="p-3 border rounded-xl" />
              <input placeholder="Exp MM/YY" className="p-3 border rounded-xl" />
              <input placeholder="CVV" className="p-3 border rounded-xl" />
            </div>
          )}
        </div>
      </div>

      {/* RESUMEN */}
      <div className="lg:col-span-5">
        <div className="bg-slate-900 text-white p-10 rounded-[3rem] sticky top-24">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
            <ShoppingBag size={24} className="text-indigo-400" />
            Resumen
          </h3>

          <div className="space-y-4 max-h-60 overflow-y-auto">
            {cart.map(item => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.product.name}</span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-slate-800">
            <div className="flex justify-between">
              <span>Total</span>
              <span className="text-3xl font-bold text-indigo-400">${cartTotal.toFixed(2)}</span>
            </div>

            <button
              disabled={loading || cart.length === 0}
              onClick={handlePlaceOrder}
              className="w-full mt-6 bg-indigo-600 py-4 rounded-2xl font-bold"
            >
              {loading ? "Procesando..." : "Confirmar Compra"}
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs">
            <ShieldCheck size={14} className="text-green-500" />
            Transacción Simulada
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;