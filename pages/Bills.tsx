
import React, { useState, useEffect } from 'react';
import { ecommerceService } from '../services/ecommerceService';
import { Bill } from '../types';
import DataTable from '../components/DataTable';
import { Download } from 'lucide-react';

const Bills: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await ecommerceService.getBills();
        setBills(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);

  const columns = [
    { header: 'Nº Factura', accessor: 'id' as keyof Bill },
    { header: 'ID Pedido', accessor: 'order_id' as keyof Bill },
    { 
      header: 'Cliente', 
      accessor: (item: Bill) => item.order?.client ? `${item.order.client.first_name} ${item.order.client.last_name}` : 'N/A'
    },
    { header: 'Fecha Emisión', accessor: 'bill_date' as keyof Bill },
    { 
      header: 'Monto Total', 
      accessor: (item: Bill) => `$${item.amount.toFixed(2)}`
    },
    { 
      header: 'Impuestos', 
      accessor: (item: Bill) => `$${item.tax.toFixed(2)}`
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Facturación</h2>
        <p className="text-slate-500">Historial de facturas generadas por ventas.</p>
      </div>

      <DataTable 
        columns={columns} 
        data={bills} 
        loading={loading}
        onView={(bill) => alert(`Generando PDF para factura #${(bill as Bill).id}...`)}
      />
    </div>
  );
};

export default Bills;
