export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-blue-50 p-8">
      <div className="max-w-2xl text-center bg-white shadow-xl rounded-2xl p-10 transition-all duration-300 hover:shadow-2xl">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
          Bem vindo(a) <span className="text-blue-600">TMB-Challenge</span>
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Página inicial da aplicação TMB-Challenge.
        </p>
        <a
          href="/orders"
          className="inline-block bg-blue-600 text-white text-lg font-medium px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
        >
          Ir para a Página de Pedidos
        </a>
      </div>
    </main>
  );
}
