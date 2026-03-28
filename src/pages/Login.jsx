import { useState } from 'react';
import api from '../services/api';

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit() {
    try {
      if (isRegister) {
        await api.post('/auth/register', {
          name,
          email,
          password
        });

        alert('Conta criada com sucesso. Agora faça login.');
        setIsRegister(false);
        setName('');
        setPassword('');
        return;
      }

      const res = await api.post('/auth/login', {
        email,
        password
      });

      localStorage.setItem('token', res.data.token);

      const user = parseJwt(res.data.token);

      if (user?.role === 'admin') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/appointments';
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao processar solicitação');
      console.log(err);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isRegister ? 'Criar Conta' : 'Login'}
        </h2>

        {isRegister && (
          <input
            className="w-full mb-3 p-3 border rounded-lg"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          className="w-full mb-3 p-3 border rounded-lg"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full mb-4 p-3 border rounded-lg"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition"
        >
          {isRegister ? 'Criar conta' : 'Entrar'}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          {isRegister ? 'Já tem conta?' : 'Ainda não tem conta?'}{' '}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-black font-semibold underline"
          >
            {isRegister ? 'Fazer login' : 'Criar conta'}
          </button>
        </p>
      </div>
    </div>
  );
}