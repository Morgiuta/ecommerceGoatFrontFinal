
import React from 'react';
import { Edit2, Trash2, Eye } from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  loading?: boolean;
}

const DataTable = <T extends { id: number | string }>({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  onView,
  loading 
}: DataTableProps<T>) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white p-8 text-center rounded-lg border border-slate-200">
        <p className="text-slate-500">No se encontraron datos.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="px-6 py-4">{col.header}</th>
            ))}
            {(onEdit || onDelete || onView) && <th className="px-6 py-4 text-right">Acciones</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
              {columns.map((col, idx) => (
                <td key={idx} className="px-6 py-4 text-sm text-slate-700">
                  {typeof col.accessor === 'function' 
                    ? col.accessor(item) 
                    : (item[col.accessor] as React.ReactNode)}
                </td>
              ))}
              {(onEdit || onDelete || onView) && (
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    {onView && (
                      <button onClick={() => onView(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Eye size={18} />
                      </button>
                    )}
                    {onEdit && (
                      <button onClick={() => onEdit(item)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg">
                        <Edit2 size={18} />
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(item)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
