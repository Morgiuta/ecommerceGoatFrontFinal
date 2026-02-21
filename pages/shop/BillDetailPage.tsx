import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ecommerceService } from "../../services/ecommerceService";
import { Bill } from "../../types";

const BillDetailPage: React.FC = () => {
  const { id } = useParams();
  const [bill, setBill] = useState<Bill | null>(null);

  useEffect(() => {
    const fetchBill = async () => {
      const res = await ecommerceService.getBillById(Number(id));
      setBill(res.data);
    };

    fetchBill();
  }, [id]);

  if (!bill) return <div className="py-20 text-center">Cargando...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-slate-900">
          Factura #{bill.bill_number}
        </h1>
  
        <span className="text-sm text-slate-500">
          Fecha: {bill.date}
        </span>
      </div>
  
      {/* Card principal */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
  
        {/* Información Cliente */}
        <div className="space-y-2">
          <p className="text-xs uppercase font-bold text-slate-400">
            Facturado a
          </p>
  
          <p className="font-semibold text-slate-900">
            {bill.client?.name} {bill.client?.lastname}
          </p>
  
          <p className="text-sm text-slate-500">
            {bill.client?.email}
          </p>
  
          <p className="text-sm text-slate-500">
            {bill.client?.telephone}
          </p>
        </div>
  
        {/* Método de pago */}
        <div className="space-y-2">
          <p className="text-xs uppercase font-bold text-slate-400">
            Método de Pago
          </p>
  
          <p className="font-medium text-slate-800">
            {(() => {
              switch (bill.payment_type) {
                case 1: return "Efectivo";
                case 2: return "Tarjeta";
                case 3: return "Débito";
                case 4: return "Crédito";
                case 5: return "Transferencia";
                default: return "Desconocido";
              }
            })()}
          </p>
        </div>
  
        {/* Totales */}
        <div className="border-t pt-6 space-y-4">
  
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">
              Subtotal
            </span>
            <span>
              ${Number(bill.total || 0).toFixed(2)}
            </span>
          </div>
  
          {bill.discount > 0 && (
            <div className="flex justify-between text-sm text-red-500">
              <span>
                Descuento
              </span>
              <span>
                - ${Number(bill.discount).toFixed(2)}
              </span>
            </div>
          )}
  
          <div className="flex justify-between text-xl font-black text-slate-900 border-t pt-4">
            <span>Total Final</span>
            <span>
              ${Number((bill.total || 0) - (bill.discount || 0)).toFixed(2)}
            </span>
          </div>
  
        </div>
  
      </div>
  
    </div>
  );
};

export default BillDetailPage;