
import React, { useState, useEffect } from 'react';
import { ecommerceService } from '../services/ecommerceService';
import { Order, Status } from '../types';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await ecommerceService.getOrders();
      setOrders(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const columns = [
    { header: 'Nº Pedido', accessor: 'id' as keyof Order },
    { 
      header: 'Cliente', 
      accessor: (item: Order) => item.client ? `${item.client.first_name} ${item.client.last_name}` : 'N/A'
    },
    { 
      header: 'Total', 
      accessor: (item: Order) => `$${item.total.toFixed(2)}`
    },
    { 
      header: 'Estado', 
      accessor: (item: Order) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          item.status === Status.DELIVERED ? 'bg-green-100 text-green-700' :
          item.status === Status.IN_PROGRESS ? 'bg-blue-100 text-blue-700' :
          item.status === Status.CANCELED ? 'bg-red-100 text-red-700' :
          'bg-amber-100 text-amber-700'
        }`}>
          {Status[item.status].toUpperCase()}
        </span>
      )
    },
    { header: 'Fecha', accessor: 'date' as keyof Order },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Pedidos</h2>
        <p className="text-slate-500">Consulta el historial de ventas y detalles.</p>
      </div>

      <DataTable 
        columns={columns} 
        data={orders} 
        onView={(item) => handleViewDetails(item as Order)}
        loading={loading}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={`Detalles del Pedido #${selectedOrder?.id}`}
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-slate-500">Cliente</p>
              <p className="font-bold">{selectedOrder.client?.first_name} {selectedOrder.client?.last_name}</p>
              <p className="text-sm">{selectedOrder.client?.email}</p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 mb-3 border-b pb-2">Artículos</h4>
              <div className="space-y-3">
                {selectedOrder.details?.map((detail, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <div>
                      <p className="font-medium">{detail.product?.name || 'Producto Desconocido'}</p>
                      <p className="text-slate-500">Cantidad: {detail.quantity}</p>
                    </div>
                    <p className="font-bold text-slate-700">
                      ${(detail.quantity * detail.price).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t flex justify-between items-center">
              <span className="text-lg font-bold text-slate-800">Total:</span>
              <span className="text-2xl font-extrabold text-blue-600">${selectedOrder.total.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="w-full bg-slate-800 text-white py-2 rounded-lg font-medium hover:bg-slate-900 transition-colors"
            >
              Cerrar
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
