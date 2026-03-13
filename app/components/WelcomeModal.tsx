"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "g4-welcome-v2";

const features = [
  {
    icon: "🎯",
    title: "Pipeline Inteligente",
    desc: "Todos os leads rankeados por score. Filtre por prioridade, risco ou etapa em um clique.",
    color: "border-emerald-500/30 bg-emerald-500/5",
    iconBg: "bg-emerald-500/15",
  },
  {
    icon: "📊",
    title: "Insights de Dados",
    desc: "Distribuição de scores, tendências por produto e performance por vendedor em gráficos interativos.",
    color: "border-blue-500/30 bg-blue-500/5",
    iconBg: "bg-blue-500/15",
  },
  {
    icon: "👥",
    title: "Visão de Equipe",
    desc: "Win rate e volume de cada vendedor. Identifique quem precisa de suporte e quem está se destacando.",
    color: "border-purple-500/30 bg-purple-500/5",
    iconBg: "bg-purple-500/15",
  },
  {
    icon: "📡",
    title: "Alertas no Slack",
    desc: "Relatórios automáticos diários com top leads e zumbis direto no canal do seu time.",
    color: "border-amber-500/30 bg-amber-500/5",
    iconBg: "bg-amber-500/15",
  },
];

export function WelcomeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Show on first visit
    if (!localStorage.getItem(STORAGE_KEY)) {
      setOpen(true);
    }

    // Listen for reopen event (triggered by "?" button in Navbar)
    function handleReopen() {
      setOpen(true);
    }
    window.addEventListener("reopen-welcome", handleReopen);
    return () => window.removeEventListener("reopen-welcome", handleReopen);
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Bem-vindo ao Lead Scorer"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="relative px-6 pt-7 pb-5 text-center border-b border-gray-800">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-4">
            <span className="text-2xl">🏆</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-1">
            Bem-vindo ao Lead Scorer
          </h2>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">
            Inteligência comercial para vendedores e gestores da G4. Priorize
            os leads certos e feche mais negócios.
          </p>

          {/* Close button */}
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
            aria-label="Fechar"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Feature tiles */}
        <div className="grid grid-cols-2 gap-3 p-5">
          {features.map((f) => (
            <div
              key={f.title}
              className={`rounded-xl border p-4 ${f.color}`}
            >
              <div className={`w-9 h-9 rounded-lg ${f.iconBg} flex items-center justify-center text-lg mb-3`}>
                {f.icon}
              </div>
              <div className="text-sm font-semibold text-white mb-1">{f.title}</div>
              <div className="text-xs text-gray-400 leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="px-5 pb-5">
          <button
            onClick={dismiss}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-colors"
          >
            Começar a usar →
          </button>
          <p className="text-center text-xs text-gray-600 mt-2">
            Dica: clique em <span className="text-gray-400 font-medium">?</span> na barra de navegação para reabrir este guia.
          </p>
        </div>
      </div>
    </div>
  );
}
