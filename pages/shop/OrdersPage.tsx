import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ecommerceService } from "../../services/ecommerceService";
import { Order, Status } from "../../types";
import { ChevronRight, Clock } from "lucide-react";

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("vortex_user") || "{}");
  const customerId = Number(storedUser?.id_key);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await ecommerceService.getOrdersByClient(customerId);

      const ordered = res.data.sort(
        (a: Order, b: Order) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setOrders(ordered);
    };

    fetchOrders();
  }, [customerId]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-10">
      <h1 className="text-3xl font-black text-slate-900">
        Historial de Pedidos
      </h1>

      {orders.map(order => {
        const formattedDate = new Date(order.date).toLocaleDateString();

        return (
          <div
            key={order.id_key}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
            onClick={() => navigate(`/orders/${order.id_key}`)}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-black text-slate-900">
                  Pedido #{order.id_key}
                </p>
                <div className="flex items-center text-xs text-slate-400 font-bold gap-2">
                  <Clock size={12} />
                  {formattedDate}
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                order.status === Status.DELIVERED
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"
              }`}>
                {Status[order.status]}
              </span>
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-2xl font-black text-slate-900">
                ${Number(order.total || 0).toFixed(2)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrdersPage;