function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export default function Layout({ children }) {
  const token = localStorage.getItem('token');
  const user = token ? parseJwt(token) : null;
  const isAdmin = user?.role === 'admin';

  function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-black text-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-wide">Barbearia Unifor 💈</h1>

          <nav className="flex items-center gap-3">
            {isAdmin && (
              <a href="/dashboard" className="text-sm px-3 py-2 rounded-lg hover:bg-gray-800 transition">Dashboard</a>
            )}

            <a href="/appointments" className="text-sm px-3 py-2 rounded-lg hover:bg-gray-800 transition">Meus Agendamentos</a>

            {isAdmin && (
              <a href="/admin" className="text-sm px-3 py-2 rounded-lg hover:bg-gray-800 transition">Admin</a>
            )}

            <button onClick={handleLogout} className="text-sm bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition">Sair</button>
          </nav>
        </div>
      </header>

      <main className="px-6 py-8">{children}</main>
    </div>
  );
}