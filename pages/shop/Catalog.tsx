
import React, { useState, useEffect } from 'react';
import { ecommerceService } from '../../services/ecommerceService';
import { Product, Category } from '../../types';
import { useCart } from '../../context/CartContext';
import { Plus, ShoppingBag, Star, LayoutGrid, List } from 'lucide-react';

const Catalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          ecommerceService.getProducts(),
          ecommerceService.getCategories()
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filtered = activeCategory 
    ? products.filter(p => p.category_id === activeCategory)
    : products;

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 space-y-4">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="font-bold text-slate-400">Preparando catálogo...</p>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative h-64 md:h-80 rounded-[2.5rem] bg-indigo-600 overflow-hidden flex items-center px-8 md:px-16">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-white/10 skew-x-12 translate-x-1/4"></div>
        <div className="relative z-10 space-y-4 max-w-xl">
           <span className="bg-indigo-400/30 text-indigo-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            Ofertas de Temporada
           </span>
           <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
            Tecnología que redefine tu mundo.
           </h1>
           <p className="text-indigo-100 font-medium">Hasta 12 cuotas sin interés en productos seleccionados.</p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <button 
          onClick={() => setActiveCategory(null)}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${!activeCategory ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border text-slate-500 hover:bg-slate-50'}`}
        >
          Todo
        </button>
        {categories.map(cat => (
          /* Fixed: accessing cat.id instead of non-existent cat.id_key */
          <button 
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === cat.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border text-slate-500 hover:bg-slate-50'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filtered.map(product => (
          /* Fixed: accessing product.id instead of non-existent product.id_key */
          <div key={product.id} className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500">
            <div className="aspect-square bg-slate-50 relative overflow-hidden">
               <img 
                src={product.image_url || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400`} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
               />
               {product.stock < 10 && (
                 <span className="absolute top-4 left-4 bg-rose-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">
                  Últimas {product.stock} u.
                 </span>
               )}
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">{product.category?.name}</p>
                <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">{product.name}</h3>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-black text-slate-900">${product.price.toFixed(2)}</p>
                  <div className="flex items-center text-amber-400">
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <span className="text-[10px] text-slate-400 font-bold ml-1">(12)</span>
                  </div>
                </div>
                <button 
                  onClick={() => addToCart(product)}
                  className="bg-slate-900 text-white p-3 rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-90"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalog;
