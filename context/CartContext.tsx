import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { ecommerceService } from '../services/ecommerceService';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, qty?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [clientId, setClientId] = useState<number | null>(null);

  // 🔹 Detectar usuario
  useEffect(() => {
    const checkUser = () => {
      const userStr = localStorage.getItem('vortex_user');
      const user = userStr ? JSON.parse(userStr) : null;
      setClientId(user?.id_key || null);
    };
  
    checkUser();
  
    // 🔥 Revisar cada vez que cambia la ruta
    const interval = setInterval(checkUser, 500);
  
    return () => clearInterval(interval);
  }, []);

  // 🔹 Cargar carrito según modo
  useEffect(() => {
    const loadCart = async () => {
      if (clientId) {
        const res = await ecommerceService.getCart(clientId);
        const items = res.data.items?.map((item: any) => ({
          product: {
            ...item.product,
            id: item.product.id_key
          },
          quantity: item.quantity
        })) || [];

        setCart(items);
      } else {
        const local = localStorage.getItem('vortex_cart');
        setCart(local ? JSON.parse(local) : []);
      }
    };

    loadCart();
  }, [clientId]);

  // 🔹 Guardar local si no hay cliente
  useEffect(() => {
    if (!clientId) {
      localStorage.setItem('vortex_cart', JSON.stringify(cart));
    }
  }, [cart, clientId]);

  // 🔹 Agregar
  const addToCart = async (product: Product, qty = 1) => {
    if (!clientId) {
      // Modo local
      setCart(prev => {
        const existing = prev.find(i => i.product.id === product.id);
        if (existing) {
          return prev.map(i =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + qty }
              : i
          );
        }
        return [...prev, { product, quantity: qty }];
      });
      return;
    }
  
    try {
      // 1️⃣ Agregar al backend
      await ecommerceService.addToCart(clientId, product.id, qty);
  
      // 2️⃣ Volver a traer carrito actualizado
      const res = await ecommerceService.getCart(clientId);
  
      const items = res.data.items?.map((item: any) => ({
        product: {
          ...item.product,
          id: item.product.id_key
        },
        quantity: item.quantity
      })) || [];
  
      setCart(items);
  
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // 🔹 Eliminar
  const removeFromCart = async (productId: number) => {
    if (!clientId) {
      setCart(prev => prev.filter(i => i.product.id !== productId));
      return;
    }
  
    try {
      await ecommerceService.removeCartItem(clientId, productId);
  
      const res = await ecommerceService.getCart(clientId);
  
      const items = res.data.items?.map((item: any) => ({
        product: {
          ...item.product,
          id: item.product.id_key
        },
        quantity: item.quantity
      })) || [];
  
      setCart(items);
  
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // 🔹 Actualizar
  const updateQuantity = async (productId: number, qty: number) => {
    if (!clientId) {
      // Modo local
      setCart(prev =>
        prev.map(i =>
          i.product.id === productId ? { ...i, quantity: qty } : i
        )
      );
      return;
    }
  
    try {
      // 1️⃣ Actualizar en backend
      await ecommerceService.updateCartItem(clientId, productId, qty);
  
      // 2️⃣ Volver a traer carrito real
      const res = await ecommerceService.getCart(clientId);
  
      const items = res.data.items?.map((item: any) => ({
        product: {
          ...item.product,
          id: item.product.id_key
        },
        quantity: item.quantity
      })) || [];
  
      setCart(items);
  
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const clearCart = async () => {
    if (clientId) {
      await ecommerceService.clearCart(clientId);
      setCart([]);
    } else {
      setCart([]);
      localStorage.removeItem('vortex_cart');
    }
  };

  const cartTotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const cartCount = cart.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};