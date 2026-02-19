
import React, { useState, useEffect } from 'react';
import { ecommerceService } from '../services/ecommerceService';
import { Product, Category } from '../types';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);


  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category_id: 0,
    image_url: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        ecommerceService.getProducts(),
        ecommerceService.getCategories()
      ]);
      console.log("PRODUCTS BACK:", prodRes.data);
      console.log("PRODUCTS RAW:", prodRes.data);
      console.log("IMAGE CHECK:", prodRes.data.map(p => p.image_url));

      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category_id: product.category_id,
      image_url: product.image_url || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (product: Product) => {
    if (confirm('¿Eliminar producto?')) {
      await ecommerceService.deleteProduct(product.id);
      fetchData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (formData.price <= 0) {
      alert('El precio debe ser mayor a 0');
      return;
    }
  
    if (formData.stock <= 0) {
      alert('El stock debe ser mayor a 0');
      return;
    }
  
    setUploadingImage(true);
  
    try {
      let finalImageUrl = formData.image_url;
  
      if (imageFile) {
        finalImageUrl = await uploadImageToCloudinary();
      }
  
      const payload = {
        ...formData,
        image_url: finalImageUrl
      };
  
      if (editingProduct) {
        await ecommerceService.updateProduct(editingProduct.id, payload);
      } else {
        await ecommerceService.createProduct({ ...payload, active: true });
      }
  
      setIsModalOpen(false);
      setImageFile(null);
      fetchData();
  
    } catch (err) {
      console.error(err);
      alert("Error al guardar producto");
    } finally {
      setUploadingImage(false);
    }
  };

  const uploadImageToCloudinary = async () => {
    if (!imageFile) return null;
  
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  
    const data = new FormData();
    data.append("file", imageFile);
    data.append("upload_preset", uploadPreset);
  
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: data
      }
    );
  
    const file = await res.json();
  
    if (!res.ok) {
      throw new Error(file.error?.message || "Error subiendo imagen");
    }
  
    return file.secure_url;
  };
  

  const columns = [
    {
      header: 'Imagen',
      accessor: (item: Product) => (
        item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="h-12 w-12 object-contain rounded border"
          />
        ) : (
          <span className="text-gray-400">📷</span>
        )
      )
    },
    { header: 'Nombre', accessor: 'name' as keyof Product },
    { 
      header: 'Categoría', 
      accessor: (item: Product) => item.category?.name || 'S/C'
    },
    { 
      header: 'Precio', 
      accessor: (item: Product) => `$${item.price.toFixed(2)}`
    },
    { 
      header: 'Stock', 
      accessor: (item: Product) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          item.stock < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {item.stock} unidades
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Inventario de Productos</h2>
          <p className="text-slate-500">Gestiona los productos disponibles en la tienda.</p>
        </div>
        <button 
          onClick={() => {
            setEditingProduct(null);
            setFormData({ name: '', description: '', price: 0, stock: 0, category_id: categories[0]?.id || 0 });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center"
        >
          <Plus size={20} className="mr-2" /> Agregar Producto
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={products} 
        onEdit={(item) => handleEdit(item as Product)} 
        onDelete={(item) => handleDelete(item as Product)}
        loading={loading}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Producto</label>
            <input 
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
            <select 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
              value={formData.category_id}
              onChange={e => setFormData({...formData, category_id: parseInt(e.target.value)})}
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Precio ($)</label>
              <input 
                type="number"
                step="0.01"
                min="0.01"
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                value={formData.price}
                onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
              <input 
                type="number"
                min="1"
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                value={formData.stock}
                onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})}
              />
            </div>
            <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Imagen del Producto
            </label>

            <input 
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  setImageFile(e.target.files[0]);
                }
              }}
              className="w-full border p-2 rounded-lg bg-white text-sm cursor-pointer"
            />

            {/* Imagen actual (cuando edita y no seleccionó nueva) */}
            {editingProduct && formData.image_url && !imageFile && (
              <div className="mt-3">
                <p className="text-xs text-slate-500 mb-1">Imagen actual:</p>
                <img
                  src={formData.image_url}
                  alt="Actual"
                  className="h-24 object-contain border rounded-lg p-1"
                />
              </div>
            )}

            {/* Preview nueva imagen seleccionada */}
            {imageFile && (
              <div className="mt-3">
                <p className="text-xs text-slate-500 mb-1">Vista previa:</p>
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="h-24 object-contain border rounded-lg p-1"
                />
              </div>
            )}
          </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold mt-2">
            Guardar Cambios
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Products;
