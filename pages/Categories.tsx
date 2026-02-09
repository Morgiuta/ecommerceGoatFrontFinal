
import React, { useState, useEffect } from 'react';
import { ecommerceService } from '../services/ecommerceService';
import { Category } from '../types';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await ecommerceService.getCategories();
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      await ecommerceService.updateCategory(editingCategory.id, formData);
    } else {
      await ecommerceService.createCategory(formData);
    }
    setIsModalOpen(false);
    fetchCategories();
  };

  const columns = [
    { header: 'ID', accessor: 'id' as keyof Category },
    { header: 'Nombre', accessor: 'name' as keyof Category },
    { header: 'Descripción', accessor: 'description' as keyof Category },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Categorías</h2>
          <p className="text-slate-500">Organiza tus productos por tipo.</p>
        </div>
        <button 
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: '', description: '' });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center"
        >
          <Plus size={20} className="mr-2" /> Nueva Categoría
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={categories} 
        onEdit={(cat) => {
          const item = cat as Category;
          setEditingCategory(item);
          setFormData({ name: item.name, description: item.description });
          setIsModalOpen(true);
        }}
        onDelete={async (cat) => {
          if (confirm('¿Eliminar categoría?')) {
            await ecommerceService.deleteCategory((cat as Category).id);
            fetchCategories();
          }
        }}
        loading={loading}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
            <input 
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
            <textarea 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none h-24"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold">
            Guardar
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;
