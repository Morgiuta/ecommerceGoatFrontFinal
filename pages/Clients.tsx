
import React, { useState, useEffect } from 'react';
import { ecommerceService } from '../services/ecommerceService';
import { Client } from '../types';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Plus, Search } from 'lucide-react';

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await ecommerceService.getClients();
      setClients(response.data);
      setFilteredClients(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    const filtered = clients.filter(c => 
      `${c.first_name} ${c.last_name} ${c.email}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      first_name: client.first_name,
      last_name: client.last_name,
      email: client.email,
      phone: client.phone
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (client: Client) => {
    if (confirm(`¿Estás seguro de eliminar a ${client.first_name}?`)) {
      try {
        await ecommerceService.deleteClient(client.id);
        fetchClients();
      } catch (error) {
        alert('Error al eliminar cliente');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await ecommerceService.updateClient(editingClient.id, formData);
      } else {
        await ecommerceService.createClient({ ...formData, is_admin: false });
      }
      setIsModalOpen(false);
      setEditingClient(null);
      setFormData({ first_name: '', last_name: '', email: '', phone: '' });
      fetchClients();
    } catch (error) {
      alert('Error al guardar cliente');
    }
  };
  
  const columns = [
    { header: 'ID', accessor: 'id' as keyof Client },
    { 
      header: 'Nombre Completo', 
      accessor: (item: Client) => `${item.first_name} ${item.last_name}`
    },
    { header: 'Email', accessor: 'email' as keyof Client },
    { header: 'Teléfono', accessor: 'phone' as keyof Client },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Clientes</h2>
          <p className="text-slate-500">Administra la base de datos de tus usuarios.</p>
        </div>
        <button 
          onClick={() => {
            setEditingClient(null);
            setFormData({ first_name: '', last_name: '', email: '', phone: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus size={20} className="mr-2" /> Nuevo Cliente
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text"
          placeholder="Buscar por nombre o email..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <DataTable 
        columns={columns} 
        data={filteredClients} 
        onEdit={(item) => handleEdit(item as Client)} 
        onDelete={(item) => handleDelete(item as Client)}
        loading={loading}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
              <input 
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                value={formData.first_name}
                onChange={e => setFormData({...formData, first_name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
              <input 
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                value={formData.last_name}
                onChange={e => setFormData({...formData, last_name: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              required
              type="email"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
            <input 
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold mt-4 hover:bg-blue-700 transition-colors"
          >
            {editingClient ? 'Actualizar' : 'Crear Cliente'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Clients;
