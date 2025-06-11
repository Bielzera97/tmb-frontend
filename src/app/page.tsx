

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to TMB-Challenge</h1>
      <p className="mt-4 text-lg">This is the home page of the TMB-Challenge application.</p>
      <a href="/orders" className="mt-6 text-blue-600 hover:underline">
        Go to Orders Page
      </a>
    </main>
  );
}
