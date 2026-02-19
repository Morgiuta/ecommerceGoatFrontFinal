
import axios from 'axios';

const api = axios.create({
  // Usamos 127.0.0.1 en lugar de localhost para evitar demoras/errores de IPv6 (::1)
  baseURL: 'http://127.0.0.0:8000/api/v1/',
  //baseURL: 'https://ecommercegoatbackfinal.onrender.com/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
});

/*export const apiRoot = axios.create({
   baseURL: 'https://ecommercegoatbackfinal.onrender.com/',
   headers: {
     'Content-Type': 'application/json',
   },
 });
*/

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Mejorar el logging para diagnosticar problemas de red
    if (!error.response) {
      console.error('Network Error: No se pudo contactar con el servidor. ¿Está el backend encendido en el puerto 8000?');
    }
    const message = error.response?.data?.detail || error.message || 'Error desconocido';
    console.error('API Error Details:', {
      message,
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method
    });
    return Promise.reject(error);
  }
);

export default api;
