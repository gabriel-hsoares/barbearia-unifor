import { useEffect, useState } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

function formatDateBR(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    timeZone: 'UTC'
  });
}

export default function Admin() {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceDuration, setServiceDuration] = useState('');
  const [serviceError, setServiceError] = useState('');

  const token = localStorage.getItem('token');
  const user = token ? parseJwt(token) : null;

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      window.location.href = '/agendamentos';
      return;
    }

    loadAppointments();
    loadServices();
  }, []);

  async function loadAppointments() {
    try {
      const res = await api.get('/admin/appointments');
      setAppointments(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function loadServices() {
    try {
      const res = await api.get('/services');
      setServices(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function updateStatus(id, status) {
    try {
      await api.put(`/admin/appointments/${id}`, { status });
      loadAppointments();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao atualizar status');
    }
  }

  function openCreateServiceModal() {
    setEditingService(null);
    setServiceName('');
    setServicePrice('');
    setServiceDuration('');
    setServiceError('');
    setIsServiceModalOpen(true);
  }

  function openEditServiceModal(service) {
    setEditingService(service);
    setServiceName(service.name);
    setServicePrice(String(service.price));
    setServiceDuration(String(service.duration));
    setServiceError('');
    setIsServiceModalOpen(true);
  }

  function closeServiceModal() {
    setIsServiceModalOpen(false);
    setEditingService(null);
    setServiceName('');
    setServicePrice('');
    setServiceDuration('');
    setServiceError('');
  }

  async function handleSaveService() {
    try {
      if (!serviceName || !servicePrice || !serviceDuration) {
        setServiceError('Preencha todos os campos');
        return;
      }

      const payload = {
        name: serviceName,
        price: Number(servicePrice),
        duration: Number(serviceDuration)
      };

      if (editingService) {
        await api.put(`/services/${editingService.id}`, payload);
        alert('Serviço atualizado com sucesso');
      } else {
        await api.post('/services', payload);
        alert('Serviço criado com sucesso');
      }

      closeServiceModal();
      loadServices();
    } catch (err) {
      setServiceError(err.response?.data?.message || 'Erro ao salvar serviço');
    }
  }

  async function handleDeleteService(id) {
    const confirmed = window.confirm('Deseja realmente excluir este serviço?');
    if (!confirmed) return;

    try {
      await api.delete(`/services/${id}`);
      alert('Serviço excluído com sucesso');
      loadServices();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao excluir serviço');
    }
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Painel Admin</h2>
          <p className="text-gray-600">
            Gerencie agendamentos e serviços da barbearia.
          </p>
        </div>

        {/* SERVIÇOS */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Serviços</h3>

            <button
              onClick={openCreateServiceModal}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              + Novo serviço
            </button>
          </div>

          <div className="grid gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <h4 className="text-lg font-semibold">{service.name}</h4>
                  <p className="text-gray-600">Preço: R$ {service.price}</p>
                  <p className="text-gray-600">
                    Duração: {service.duration} min
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => openEditServiceModal(service)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}

            {services.length === 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-md text-gray-500 text-center">
                Nenhum serviço cadastrado.
              </div>
            )}
          </div>
        </section>

        {/* AGENDAMENTOS */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Agendamentos</h3>

          <div className="grid gap-4">
            {appointments.map((a) => (
              <div
                key={a.id}
                className="bg-white p-5 rounded-2xl shadow-md border border-gray-100"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="font-semibold">{a.client_name}</p>
                    <p>{a.service_name}</p>
                    <p>
                      {formatDateBR(a.date)} às{' '}
                      {String(a.time).slice(0, 5)}
                    </p>
                    <p className="mt-1 font-medium">
                      Status: {a.status}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => updateStatus(a.id, 'pendente')}
                      className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition"
                    >
                      Pendente
                    </button>

                    <button
                      onClick={() => updateStatus(a.id, 'cancelado')}
                      className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      Cancelar
                    </button>

                    <button
                      onClick={() => updateStatus(a.id, 'finalizado')}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Finalizar
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {appointments.length === 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-md text-gray-500 text-center">
                Nenhum agendamento encontrado.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* MODAL SERVIÇO */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
            <button
              onClick={closeServiceModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
            >
              ×
            </button>

            <h3 className="text-2xl font-bold mb-4">
              {editingService ? 'Editar serviço' : 'Novo serviço'}
            </h3>

            {serviceError && (
              <div className="mb-4 bg-red-100 text-red-700 px-4 py-3 rounded-lg">
                {serviceError}
              </div>
            )}

            <div className="grid gap-4">
              <input
                type="text"
                placeholder="Nome"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />

              <input
                type="number"
                placeholder="Preço"
                value={servicePrice}
                onChange={(e) => setServicePrice(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />

              <input
                type="number"
                placeholder="Duração"
                value={serviceDuration}
                onChange={(e) => setServiceDuration(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveService}
                className="bg-black text-white px-5 py-3 rounded-lg"
              >
                Salvar
              </button>

              <button
                onClick={closeServiceModal}
                className="bg-gray-300 px-5 py-3 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}