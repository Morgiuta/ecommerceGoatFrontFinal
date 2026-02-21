
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ecommerceService } from '../../services/ecommerceService';
import { Product, Review } from '../../types';
import { useCart } from '../../context/CartContext';
import { ChevronLeft, ShoppingCart, ShieldCheck, Truck, RotateCcw, Star, Send } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
  
      try {
        const [prodRes, revRes] = await Promise.all([
          ecommerceService.getProducts(),
          ecommerceService.getReviews()
        ]);
  
        const found = prodRes.data.find(
          p => Number(p.id) === Number(id)
        );
  
        setProduct(found || null);
  
        const filteredReviews = revRes.data.filter(
          r => Number(r.product_id) === Number(id)
        );
  
        setReviews(filteredReviews);
  
        if (found) {
          setSelectedImage(
            found.image_url ||
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
          );
        }
  
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProduct();
  }, [id]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
  
    try {
      await ecommerceService.createReview({
        product_id: product.id,
        rating: newReview.rating,
        comment: newReview.comment
      });
  
      alert("Reseña enviada para moderación.");
  
      setNewReview({ rating: 5, comment: '' });
  
    } catch (err) {
      console.error(err);
      alert("Error al enviar reseña.");
    }

    const revRes = await ecommerceService.getReviews();
    setReviews(
      revRes.data.filter(
        r => r.product_id === product.id && r.status === 'approved'
      )
    );
  };

  const averageRating =
  reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  if (loading) return <div className="py-20 text-center">Cargando detalles...</div>;
  if (!product) return <div className="py-20 text-center text-red-500">Producto no encontrado.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <Link to="/" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors group">
        <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
        Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-[2rem] overflow-hidden bg-slate-100 border border-slate-200">
            <img 
              src={selectedImage || product.image_url}
              className="w-full h-full object-cover"
              alt={product.name}
            />
          </div>

          {/* Si en el futuro soportamos múltiples imágenes */}
          {product.images && product.images.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img: string, index: number) => (
                <div 
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-square rounded-xl overflow-hidden cursor-pointer border transition-all ${
                    selectedImage === img
                      ? "border-blue-600"
                      : "border-slate-200 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="thumb" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-8 flex flex-col justify-center">
          <div className="space-y-4">
            <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-bold uppercase">
              {product.category?.name || 'Nuevo'}
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex text-amber-400">
                {[1,2,3,4,5].map(i => (
                  <Star
                    key={i}
                    size={18}
                    fill={i <= Math.round(averageRating) ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <span className="text-sm text-slate-500 font-medium">({reviews.length} reseñas verificadas)</span>
            </div>
          </div>

          <p className="text-lg text-slate-600 leading-relaxed">
            {product.description}
          </p>

          <div className="space-y-6">
            <div className="flex items-baseline space-x-2">
              <span className="text-5xl font-black text-blue-600">${product.price.toFixed(2)}</span>
              <span className="text-slate-400 line-through text-lg font-medium">${(product.price * 1.2).toFixed(2)}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <button 
                onClick={() => addToCart(product)}
                className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
               >
                <ShoppingCart size={20} />
                <span>Añadir al Carrito</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t">
            <div className="flex items-center space-x-3 text-sm font-medium text-slate-600">
              <Truck size={24} className="text-blue-500" />
              <span>Envío Gratis</span>
            </div>
            <div className="flex items-center space-x-3 text-sm font-medium text-slate-600">
              <RotateCcw size={24} className="text-blue-500" />
              <span>30 días devolución</span>
            </div>
            <div className="flex items-center space-x-3 text-sm font-medium text-slate-600">
              <ShieldCheck size={24} className="text-blue-500" />
              <span>Garantía 2 años</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="pt-12 border-t space-y-12">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-slate-900 mb-8">Opiniones de Clientes</h3>
          
          <div className="space-y-8">
            {reviews.length > 0 ? reviews.map(rev => (
              <div key={rev.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-slate-800">{rev.user_name}</p>
                    <div className="flex text-amber-400 mt-1">
                      {[1,2,3,4,5].map(i => (
                        <Star
                          key={i}
                          size={14}
                          fill={i <= rev.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                  </div>              
                </div>
                <p className="text-slate-600 text-sm italic">"{rev.comment}"</p>
              </div>
            )) : (
              <p className="text-slate-500 text-center italic py-10">No hay reseñas aprobadas todavía. ¡Sé el primero!</p>
            )}
          </div>

          {/* Add Review Form */}
          <div className="mt-12 bg-slate-900 text-white p-8 rounded-[2rem] space-y-6">
            <h4 className="text-xl font-bold">Cuéntanos tu experiencia</h4>
            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Tu calificación</label>
                <div className="flex space-x-2">
                  {[1,2,3,4,5].map(i => (
                    <button 
                      key={i} 
                      type="button" 
                      onClick={() => setNewReview({...newReview, rating: i})}
                      className={i <= newReview.rating ? "text-amber-400" : "text-slate-700"}
                    >
                      <Star size={24} fill={i <= newReview.rating ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Tu comentario</label>
                <textarea 
                  required
                  className="w-full bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-blue-500/50 outline-none text-white text-sm min-h-[100px]"
                  placeholder="¿Qué te pareció este producto?"
                  value={newReview.comment}
                  onChange={e => setNewReview({...newReview, comment: e.target.value})}
                />
              </div>
              <button className="flex items-center justify-center space-x-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all">
                <Send size={18} />
                <span>Enviar Comentario</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
