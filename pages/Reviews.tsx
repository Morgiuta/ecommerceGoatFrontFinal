
import React, { useState, useEffect } from 'react';
import { ecommerceService } from '../services/ecommerceService';
import { Review } from '../types';
import DataTable from '../components/DataTable';
import { Check, X } from 'lucide-react';

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await ecommerceService.getReviews();
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleStatusUpdate = async (id: number, status: 'approved' | 'rejected') => {
    try {
      await ecommerceService.updateReviewStatus(id, status);
      fetchReviews();
    } catch (error) {
      alert('Error al actualizar estado');
    }
  };

  const columns = [
    { 
      header: 'Producto', 
      accessor: (item: Review) => item.product?.name || 'N/A'
    },
    { header: 'Usuario', accessor: 'user_name' as keyof Review },
    { 
      header: 'Calificación', 
      accessor: (item: Review) => (
        <div className="flex text-amber-400">
          {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
        </div>
      )
    },
    { 
      header: 'Comentario', 
      accessor: (item: Review) => (
        <p className="max-w-xs truncate text-xs text-slate-500">{item.comment}</p>
      )
    },
    { 
      header: 'Estado', 
      accessor: (item: Review) => (
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
          item.status === 'approved' ? 'bg-green-100 text-green-700' :
          item.status === 'rejected' ? 'bg-red-100 text-red-700' :
          'bg-slate-100 text-slate-600'
        }`}>
          {item.status}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Moderación de Reseñas</h2>
        <p className="text-slate-500">Aprueba o rechaza los comentarios de tus clientes.</p>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase">
            <tr>
              <th className="px-6 py-4">Producto / Usuario</th>
              <th className="px-6 py-4">Calificación</th>
              <th className="px-6 py-4">Comentario</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reviews.map((rev) => (
              <tr key={rev.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <p className="font-bold text-sm text-slate-800">{rev.product?.name}</p>
                  <p className="text-xs text-slate-500">{rev.user_name}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex text-amber-400 text-xs">
                    {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs text-slate-600 italic break-words max-w-xs">"{rev.comment}"</p>
                </td>
                <td className="px-6 py-4">
                   <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    rev.status === 'approved' ? 'bg-green-100 text-green-700' :
                    rev.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {rev.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => handleStatusUpdate(rev.id, 'approved')}
                      disabled={rev.status === 'approved'}
                      className="p-1 text-green-600 hover:bg-green-50 rounded disabled:opacity-30"
                      title="Aprobar"
                    >
                      <Check size={18} />
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(rev.id, 'rejected')}
                      disabled={rev.status === 'rejected'}
                      className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-30"
                      title="Rechazar"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reviews;
