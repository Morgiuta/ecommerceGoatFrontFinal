import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ecommerceService } from "../../services/ecommerceService";
import { Bill } from "../../types";

const BillsPage: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBills = async () => {
      const res = await ecommerceService.getBills();

      const ordered = res.data.sort(
        (a: Bill, b: Bill) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setBills(ordered);
    };

    fetchBills();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-8">
      <h1 className="text-3xl font-black text-slate-900">
        Historial de Facturas
      </h1>

      {bills.map(bill => {
        const formattedDate = new Date(bill.date).toLocaleDateString();

        return (
          <div
            key={bill.id_key}
            onClick={() => navigate(`/bills/${bill.id_key}`)}
            className="bg-white p-6 rounded-3xl border hover:shadow-md cursor-pointer"
          >
            <p className="font-bold">
              Factura #{bill.id_key}
            </p>
            <p className="text-xs text-slate-400">
              {formattedDate}
            </p>
            <p className="text-2xl font-black mt-2">
              ${Number(bill.total).toFixed(2)}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default BillsPage;