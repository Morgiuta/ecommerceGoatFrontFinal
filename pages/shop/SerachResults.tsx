import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { ecommerceService } from '../../services/ecommerceService';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { Plus, Star } from 'lucide-react';

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [inStockOnly, setInStockOnly] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await ecommerceService.getCategories();
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
  
    loadCategories();
    
    const loadData = async () => {
      setLoading(true);
  
      try {
        const categoriesRes = await ecommerceService.getCategories();
  
        const matchedCategory = categoriesRes.data.find((cat: any) =>
          cat.name.toLowerCase() === query.toLowerCase()
        );
  
        const res = await ecommerceService.getFilteredProducts({
          search: matchedCategory ? undefined : query,
          category_id: matchedCategory ? matchedCategory.id : undefined,
          in_stock_only: true,
          active: true,
          skip: 0,
          limit: 100
        });
  
        setProducts(res.data);
  
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    if (query.trim() !== '') {
      loadData();
    } else {
      setProducts([]);
      setLoading(false);
    }
  
  }, [query]);

  const applyFilters = async () => {
    setLoading(true);
  
    try {
      const res = await ecommerceService.getFilteredProducts({
        search: query,
        category_id: selectedCategory,
        min_price: minPrice,
        max_price: maxPrice,
        in_stock_only: inStockOnly,
        active: true,
        skip: 0,
        limit: 100
      });
  
      setProducts(res.data);
  
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = async () => {
    setSelectedCategory(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setInStockOnly(true);
  
    navigate('/search');
  
    setLoading(true);
  
    try {
      const res = await ecommerceService.getFilteredProducts({
        in_stock_only: true,
        active: true,
        skip: 0,
        limit: 100
      });
  
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="font-bold text-slate-400">Buscando productos...</p>
      </div>
    );
  }

  return (
    <div className="flex gap-10">
  
      {/* Sidebar */}
      <div className="w-64 shrink-0 bg-white p-6 rounded-3xl border border-slate-100 h-fit space-y-6">

      <h3 className="font-black text-lg">Filtros</h3>

      {/* Botón limpiar separado */}
      <div>
        <button
          onClick={clearFilters}
          className="text-sm text-red-500 font-bold hover:text-red-600"
        >
          Limpiar filtros
        </button>
      </div>

      {/* Categorías */}
      <div className="space-y-3">
        <p className="text-sm font-bold">Categorías</p>

        {categories.map(cat => (
          <div
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`cursor-pointer text-sm font-medium ${
              selectedCategory === cat.id
                ? 'text-indigo-600 font-bold'
                : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            {cat.name}
          </div>
        ))}
      </div>

      {/* Precio */}
      <div className="space-y-2">
        <p className="text-sm font-bold">Precio</p>
        <input
          type="number"
          placeholder="Mínimo"
          value={minPrice ?? ''}
          className="w-full border rounded-xl px-3 py-2 text-sm"
          onChange={(e) =>
            setMinPrice(e.target.value === '' ? undefined : Number(e.target.value))
          }
        />
        <input
          type="number"
          placeholder="Máximo"
          value={maxPrice ?? ''}
          className="w-full border rounded-xl px-3 py-2 text-sm"
          onChange={(e) =>
            setMaxPrice(e.target.value === '' ? undefined : Number(e.target.value))
          }
        />
      </div>

      <button
        onClick={applyFilters}
        className="w-full bg-indigo-600 text-white py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all"
      >
        Aplicar filtros
      </button>

    </div>
  
      {/* Contenido principal */}
      <div className="flex-1 space-y-8">
  
        <h2 className="text-2xl font-black">
          Resultados para: <span className="text-indigo-600">"{query}"</span>
        </h2>
  
        {products.length === 0 && (
          <p className="text-slate-400 font-medium">
            No encontramos productos con ese nombre.
          </p>
        )}
  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <div key={product.id} className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500">
              
              <Link to={`/productDetail/${product.id}`} className="block">
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
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                      {product.category?.name}
                    </p>
                    <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </div>
  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-black text-slate-900">
                        ${product.price.toFixed(2)}
                      </p>
                      <div className="flex items-center text-amber-400">
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <span className="text-[10px] text-slate-400 font-bold ml-1">
                          (12)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
  
              <div className="px-6 pb-6">
                <button 
                  onClick={() => addToCart(product)}
                  className="bg-slate-900 text-white p-3 rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-90"
                >
                  <Plus size={20} />
                </button>
              </div>
  
            </div>
          ))}
        </div>
  
      </div>
    </div>
  );
};

export default SearchResults;
