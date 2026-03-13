# Lead Scorer — G4 Educação Challenge

Ferramenta de priorização de pipeline B2B para equipes de vendas.
Desenvolvida por **Lucas Honda** como parte do processo seletivo para AI Master.

## Setup

```bash
npm install
npm run dev
```

Acesse em `http://localhost:3000`.

---

## Estrutura

```
submissions/lucas-honda/
├── app/
│   ├── page.tsx              # Dashboard do Vendedor
│   ├── manager/page.tsx      # Visão do Manager
│   ├── components/
│   │   ├── DealTable.tsx     # Tabela de deals com score
│   │   ├── ScoreBadge.tsx    # Badge colorido (verde/amarelo/vermelho)
│   │   ├── ScoreBreakdown.tsx# Modal com breakdown dos 4 fatores
│   │   └── ManagerView.tsx   # Cards por agente + ranking
│   └── api/
│       ├── deals/            # GET — deals ativos com score
│       ├── all-deals/        # GET — todos os deals (para manager)
│       └── meta/             # GET — opções de filtros
├── lib/
│   ├── data.ts               # Parse e merge dos 4 CSVs (servidor)
│   └── scoring.ts            # Lógica de score (4 componentes)
└── data/                     # CSVs originais
```

## Lógica de Score (0–100 pts)

**A. Stage + Momentum (30pts)** — Engaging <30d=30, 30-60d=22, 60-180d=12, >180d=4 (zumbi)

**B. Produto / Ticket (25pts)** — GTK 500=25 até MG Special=3

**C. Qualidade da Conta (25pts)** — Enterprise=25 até sem conta=0

**D. Win Rate do Agente (20pts)** — Calculado do histórico real de Won/Lost
