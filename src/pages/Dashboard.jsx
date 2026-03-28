import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);

  const token = localStorage.getItem('token');
  const user = token ? parseJwt(token) : null;
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!isAdmin) {
      window.location.href = '/appointments';
      return;
    }

    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      const res = await api.get('/admin/appointments');
      setAppointments(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  const total = appointments.length;
  const finished = appointments.filter((item) => item.status === 'finalizado').length;
  const pending = appointments.filter((item) => item.status === 'pendente').length;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-black to-gray-800 text-white rounded-2xl p-8 shadow-lg mb-8">
          <p className="text-sm uppercase tracking-widest text-gray-300 mb-2">
            Painel Administrativo
          </p>
          <h1 className="text-4xl font-bold mb-3">Barbearia Unifor 💈</h1>
          <p className="text-gray-300 max-w-2xl">
            Acompanhe os agendamentos da barbearia e gerencie os atendimentos.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Agendamentos realizados</p>
            <h2 className="text-3xl font-bold">{total}</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Concluídos</p>
            <h2 className="text-3xl font-bold text-blue-600">{finished}</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Pendentes</p>
            <h2 className="text-3xl font-bold text-yellow-600">{pending}</h2>
          </div>
        </div>
      </div>
    </Layout>
  );
}