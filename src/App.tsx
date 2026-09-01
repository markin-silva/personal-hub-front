export function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-6 text-center shadow-lg">
        <h1 className="text-xl font-bold text-emerald-400 sm:text-2xl">
          Personal Hub — Mobile First
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Fundação frontend estruturada e pronta para o módulo de treinos.
        </p>
        <button className="mt-6 w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold py-2.5 px-4 rounded-lg transition-colors cursor-pointer">
          Iniciar Treino
        </button>
      </div>
    </main>
  )
}

export default App
