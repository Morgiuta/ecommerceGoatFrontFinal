import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ecommerceService } from "../../services/ecommerceService";
import { Order } from "../../types";

interface OrderDetailItem {
  id_key: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
}

const statusColorMap: Record<number, string> = {
  1: "bg-yellow-100 text-yellow-700",   // Pendiente
  2: "bg-blue-100 text-blue-700",       // En progreso
  3: "bg-green-100 text-green-700",     // Entregado
  4: "bg-red-100 text-red-700"          // Cancelado
};

const deliveryMap: Record<number, string> = {
  1: "Drive Thru",
  2: "Retiro en Mano",
  3: "Envío a Domicilio"
};

const statusMap: Record<number, string> = {
  1: "Pendiente",
  2: "En Progreso",
  3: "Entregado",
  4: "Cancelado"
};

const paymentMap: Record<number, string> = {
  1: "Efectivo",
  2: "Tarjeta",
  3: "Débito",
  4: "Crédito",
  5: "Transferencia Bancaria"
};

const OrderDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [details, setDetails] = useState<OrderDetailItem[]>([]);

  const storedUser = JSON.parse(localStorage.getItem("vortex_user") || "{}");
  const customerId = Number(storedUser?.id_key);

  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderRes, detailsRes] = await Promise.all([
          ecommerceService.getOrderById(Number(id)),
          ecommerceService.getOrderDetails()
        ]);

        const fetchedOrder = orderRes.data;

        // 🔒 Validación de seguridad
        if (Number(fetchedOrder.client_id) !== customerId) {
          navigate("/orders");
          return;
        }

        setOrder(fetchedOrder);

        // 🔥 Filtrar productos de este pedido
        const filteredDetails = detailsRes.data.filter(
          (item: OrderDetailItem) =>
            Number(item.order_id) === Number(id)
        );

        setDetails(filteredDetails);

      } catch (error) {
        console.error(error);
        navigate("/orders");
      }
    };

    fetchData();
  }, [id, customerId, navigate]);

  const handleCancelOrder = async () => {
    if (!order) return;
  
    try {
      setCanceling(true);
  
      // 1️⃣ Cancelar pedido
      await ecommerceService.cancelOrder(order.id_key);
  
      // 2️⃣ Restaurar stock manualmente
      for (const item of order.details) {
  
        const productRes = await ecommerceService.getProductById(
          item.product.id_key
        );
  
        const product = productRes.data;
  
        const updatedProduct = {
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock + item.quantity,
          image_url: product.image_url,
          category_id: product.category_id,
          active: product.active
        };
  
        await ecommerceService.updateProduct(
          product.id,
          updatedProduct
        );
      }
  
      setOrder({
        ...order,
        status: 4
      });
  
    } catch (error) {
      console.error(error);
    } finally {
      setCanceling(false);
    }
  };

  if (!order) return <div className="py-20 text-center">Cargando...</div>;

  const formattedDate = new Date(order.date).toLocaleDateString();

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-10">
  
      <h1 className="text-4xl font-black">
        Pedido #{order.id_key}
      </h1>
  
      {/* INFO GENERAL */}
      <div className="bg-white p-8 rounded-3xl border shadow-sm grid md:grid-cols-2 gap-8">
  
      <div className="space-y-4">

        {/* ESTADO + CANCELACIÓN */}
        <div className="space-y-3">
          <div>
            <p className="text-xs uppercase font-bold text-slate-400">
              Estado
            </p>
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase ${statusColorMap[order.status]}`}
            >
              {statusMap[order.status]}
            </span>
          </div>

          {/* Botón activo si PENDING o IN_PROGRESS */}
          {[1, 2].includes(order.status) && (
            <button
              onClick={handleCancelOrder}
              disabled={canceling}
              className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition disabled:opacity-50"
            >
              {canceling ? "Cancelando..." : "Cancelar Pedido"}
            </button>
          )}

          {/* Botón inactivo si DELIVERED */}
          {order.status === 3 && (
            <button
              type="button"
              disabled
              className="bg-gray-300 text-gray-600 text-xs font-bold px-4 py-2 rounded-xl cursor-not-allowed"
              title="No se pueden devolver pedidos entregados"
            >
              Pedido Entregado
            </button>
          )}
        </div>

        {/* FECHA */}
        <div>
          <p className="text-xs uppercase font-bold text-slate-400">
            Fecha
          </p>
          <p className="font-semibold">
            {new Date(order.date).toLocaleDateString()}
          </p>
        </div>

        {/* MÉTODO DE ENVÍO */}
        <div>
          <p className="text-xs uppercase font-bold text-slate-400">
            Método de Envío
          </p>
          <p className="font-semibold">
            {deliveryMap[order.delivery_method]}
          </p>
        </div>

        </div>
  
        <div className="space-y-4">
  
          <div>
            <p className="text-xs uppercase font-bold text-slate-400">
              Método de Pago
            </p>
            <p className="font-semibold">
              {paymentMap[order.bill.payment_type]}
            </p>
          </div>
          
          <div>
            <p className="text-xs uppercase font-bold text-slate-400">
              Factura
            </p>

            <button
              onClick={() => navigate(`/bills/${order.bill.id_key}`)}
              className="font-semibold text-blue-600 hover:underline"
            >
              {order.bill.bill_number}
            </button>
          </div>
  
          <div>
            <p className="text-xs uppercase font-bold text-slate-400">
              Total Pagado
            </p>
            <p className="text-2xl font-black">
              ${Number(order.total).toFixed(2)}
            </p>
          </div>
  
        </div>
  
      </div>
  
      {/* PRODUCTOS */}
      <div className="space-y-6">
  
        <h2 className="text-2xl font-black">
          Productos Comprados
        </h2>
  
        {order.details.map((item: any) => {
  
          const subtotal = item.quantity * item.price;
  
          return (
            <div
              key={item.id_key}
              className="bg-white p-6 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
  
              <div className="flex items-center gap-6">
  
                <img
                  src={item.product.image_url}
                  className="w-24 h-24 object-cover rounded-2xl border"
                />
  
                <div className="space-y-1">
                  <p className="font-bold text-lg">
                    {item.product.name}
                  </p>
  
                  <p className="text-sm text-slate-500">
                    Precio unitario: ${Number(item.price).toFixed(2)}
                  </p>
  
                  <p className="text-sm text-slate-500">
                    Cantidad: {item.quantity}
                  </p>
  
                </div>
  
              </div>
  
              <div className="text-right">
                <p className="text-xs uppercase font-bold text-slate-400">
                  Subtotal
                </p>
                <p className="text-xl font-black">
                  ${subtotal.toFixed(2)}
                </p>
              </div>
  
            </div>
          );
        })}
  
      </div>
  
    </div>
  );
};

export default OrderDetailPage;