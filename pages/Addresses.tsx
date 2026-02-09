
import React, { useState, useEffect } from 'react';
import { ecommerceService } from '../services/ecommerceService';
import { Address, Client } from '../types';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

const Addresses: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ client_id: 0, street: '', city: '', state: '', zip_code: '', is_default: false });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [addrRes, clientRes] = await Promise.all([
        ecommerceService.getAddresses(),
        ecommerceService.getClients()
      ]);
      setAddresses(addrRes.data);
      setClients(clientRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await ecommerceService.createAddress(formData);
    setIsModalOpen(false);
    fetchData();
  };

  const columns = [
    { 
      header: 'Cliente', 
      accessor: (item: Address) => item.client ? `${item.client.first_name} ${item.client.last_name}` : 'N/A'
    },
    { header: 'Calle', accessor: 'street' as keyof Address },
    { header: 'Ciudad', accessor: 'city' as keyof Address },
    { header: 'Estado', accessor: 'state' as keyof Address },
    { 
      header: 'Predeterminada', 
      accessor: (item: Address) => item.is_default ? '✅ Sí' : '❌ No'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Direcciones</h2>
          <p className="text-slate-500">Gestión de puntos de entrega para clientes.</p>
        </div>
        <button 
          onClick={() => {
            setFormData({ client_id: clients[0]?.id || 0, street: '', city: '', state: '', zip_code: '', is_default: false });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center"
        >
          <Plus size={20} className="mr-2" /> Nueva Dirección
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={addresses} 
        loading={loading}
        onDelete={async (addr) => {
          if (confirm('¿Eliminar dirección?')) {
            await ecommerceService.deleteAddress((addr as Address).id);
            fetchData();
          }
        }}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Agregar Dirección">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Seleccionar Cliente</label>
            <select 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              value={formData.client_id}
              onChange={e => setFormData({...formData, client_id: parseInt(e.target.value)})}
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Calle</label>
            <input 
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              value={formData.street}
              onChange={e => setFormData({...formData, street: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ciudad</label>
              <input 
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
              <input 
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                value={formData.state}
                onChange={e => setFormData({...formData, state: e.target.value})}
              />
            </div>
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="is_default"
              className="mr-2"
              checked={formData.is_default}
              onChange={e => setFormData({...formData, is_default: e.target.checked})}
            />
            <label htmlFor="is_default" className="text-sm text-slate-700">Marcar como predeterminada</label>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold">
            Guardar Dirección
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Addresses;
