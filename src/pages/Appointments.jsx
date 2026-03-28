import { useEffect, useState } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';

function generateHalfHourOptions() {
  const times = [];
  for (let hour = 8; hour <= 20; hour++) {
    ['00', '30'].forEach((minute) => {
      const formattedHour = String(hour).padStart(2, '0');
      times.push(`${formattedHour}:${minute}`);
    });
  }
  return times;
}

function formatDateBR(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    timeZone: 'UTC'
  });
}

function getStatusColor(status) {
  if (status === 'finalizado') return 'text-blue-600';
  if (status === 'cancelado') return 'text-red-600';
  return 'text-yellow-600';
}

function isPastDateTime(date, time) {
  if (!date || !time) return false;
  const selected = new Date(`${date}T${time}:00`);
  return selected < new Date();
}

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [formError, setFormError] = useState('');
  const [errors, setErrors] = useState({
    serviceId: false,
    date: false,
    time: false
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editServiceId, setEditServiceId] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editStatus, setEditStatus] = useState('pendente');
  const [editError, setEditError] = useState('');

  const halfHourOptions = generateHalfHourOptions();

  async function loadAppointments() {
    const res = await api.get('/appointments');
    setAppointments(res.data);
  }

  async function loadServices() {
    const res = await api.get('/services');
    setServices(res.data);
  }

  useEffect(() => {
    loadAppointments();
    loadServices();
  }, []);

  function validateCreateForm() {
    const newErrors = {
      serviceId: !serviceId,
      date: !date,
      time: !time
    };

    setErrors(newErrors);

    if (newErrors.serviceId || newErrors.date || newErrors.time) {
      setFormError('Preencha os campos em vermelho');
      return false;
    }

    if (isPastDateTime(date, time)) {
      setFormError('Não é permitido agendar horários que já passaram');
      return false;
    }

    setFormError('');
    return true;
  }

  function resetCreateForm() {
    setServiceId('');
    setDate('');
    setTime('');
    setFormError('');
    setErrors({
      serviceId: false,
      date: false,
      time: false
    });
  }

  async function handleCreate() {
    try {
      if (!validateCreateForm()) return;

      await api.post('/appointments', {
        service_id: Number(serviceId),
        date,
        time
      });

      alert('Agendamento criado com sucesso');
      resetCreateForm();
      loadAppointments();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao criar agendamento');
    }
  }

  function openEditModal(appointment) {
    setEditingAppointment(appointment);
    setEditServiceId(String(appointment.service_id));
    setEditDate(appointment.date);
    setEditTime(String(appointment.time).slice(0, 5));
    setEditStatus(appointment.status);
    setEditError('');
    setIsModalOpen(true);
  }

  function closeEditModal() {
    setIsModalOpen(false);
    setEditingAppointment(null);
    setEditServiceId('');
    setEditDate('');
    setEditTime('');
    setEditStatus('pendente');
    setEditError('');
  }

  async function handleSaveEdit() {
    try {
      if (!editServiceId || !editDate || !editTime || !editStatus) {
        setEditError('Preencha todos os campos');
        return;
      }

      if (isPastDateTime(editDate, editTime) && editStatus !== 'cancelado' && editStatus !== 'finalizado') {
        setEditError('Não é permitido agendar horários que já passaram');
        return;
      }

      await api.put(`/appointments/${editingAppointment.id}`, {
        service_id: Number(editServiceId),
        date: editDate,
        time: editTime,
        status: editStatus
      });

      alert('Agendamento atualizado com sucesso');
      closeEditModal();
      loadAppointments();
    } catch (err) {
      setEditError(err.response?.data?.message || 'Erro ao atualizar agendamento');
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Deseja realmente excluir este agendamento?');
    if (!confirmed) return;

    try {
      await api.delete(`/appointments/${id}`);
      alert('Agendamento excluído com sucesso');
      loadAppointments();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao excluir agendamento');
    }
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Meus Agendamentos</h2>

        <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
          <h3 className="text-lg font-semibold mb-4">Novo agendamento</h3>

          {formError && (
            <div className="mb-4 bg-red-100 text-red-700 px-4 py-3 rounded-lg">
              {formError}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Serviço</label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className={`w-full p-3 rounded-lg border ${
                  errors.serviceId ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - R$ {service.price}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Data</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full p-3 rounded-lg border ${
                  errors.date ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Horário</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={`w-full p-3 rounded-lg border ${
                  errors.time ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione</option>
                {halfHourOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleCreate}
            className="bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Agendar
          </button>
        </div>

        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white p-5 rounded-2xl shadow-md border border-gray-100"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h4 className="text-lg font-semibold">{appointment.service_name}</h4>
                  <p className="text-gray-600">
                      {formatDateBR(appointment.date)} às {String(appointment.time).slice(0, 5)}
                  </p>
                  <p className={`font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => openEditModal(appointment)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => handleDelete(appointment.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Excluir
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
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative animate-[fadeIn_.2s_ease-in-out]">
            <button
              onClick={closeEditModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
            >
              ×
            </button>

            <h3 className="text-2xl font-bold mb-4">Editar agendamento</h3>

            {editError && (
              <div className="mb-4 bg-red-100 text-red-700 px-4 py-3 rounded-lg">
                {editError}
              </div>
            )}

            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Serviço</label>
                <select
                  value={editServiceId}
                  onChange={(e) => setEditServiceId(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300"
                >
                  <option value="">Selecione</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - R$ {service.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Data</label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Horário</label>
                <select
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300"
                >
                  <option value="">Selecione</option>
                  {halfHourOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300"
                >
                  <option value="pendente">Pendente</option>
                  <option value="cancelado">Cancelado</option>
                  <option value="finalizado">Finalizado</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveEdit}
                className="bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 transition"
              >
                Salvar alterações
              </button>

              <button
                onClick={closeEditModal}
                className="bg-gray-200 text-gray-800 px-5 py-3 rounded-lg hover:bg-gray-300 transition"
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