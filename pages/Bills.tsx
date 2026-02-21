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
    { 
      header: 'Nº Factura', 
      accessor: 'bill_number' as keyof Bill 
    },

    { 
      header: 'ID Interno', 
      accessor: 'id_key' as keyof Bill 
    },

    { 
      header: 'Cliente', 
      accessor: (item: Bill) =>
        item.client
          ? `${item.client.name} ${item.client.lastname}`
          : 'N/A'
    },

    { 
      header: 'Fecha Emisión', 
      accessor: 'date' as keyof Bill 
    },

    {
      header: 'Método de Pago',
      accessor: (item: Bill) => {
        switch (item.payment_type) {
          case 1: return 'Efectivo';
          case 2: return 'Tarjeta';
          case 3: return 'Débito';
          case 4: return 'Crédito';
          case 5: return 'Transferencia';
          default: return 'Desconocido';
        }
      }
    },

    {
      header: 'Descuento',
      accessor: (item: Bill) =>
        `$${Number(item.discount || 0).toFixed(2)}`
    },

    {
      header: 'Total',
      accessor: (item: Bill) =>
        `$${Number(item.total || 0).toFixed(2)}`
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Facturación
        </h2>
        <p className="text-slate-500">
          Historial de facturas generadas por ventas.
        </p>
      </div>

      <DataTable 
        columns={columns} 
        data={bills} 
        loading={loading}
        onView={(bill) => {
          const b = bill as Bill;
          alert(`Generando PDF para factura #${b.bill_number}...`);
        }}
      />
    </div>
  );
};

export default Bills;