# Lead Scorer — G4 Educação · Challenge 003

**Desenvolvido por Lucas de Paula** · AI Master Challenge
🔗 **Live:** https://lead-scorer-g4.vercel.app
🔑 **Token de acesso:** `g4admin2024` (perfil Admin) · `g4viewer2024` (Viewer)

---

## Executive Summary

O Lead Scorer é uma aplicação web que transforma um pipeline de ~8.800 oportunidades B2B em inteligência acionável. Cada deal recebe um score de 0–100 calculado a partir de quatro fatores calibrados contra os dados reais do CRM (stage + momentum, produto/ticket, qualidade da conta e win rate histórico do vendedor). O resultado: o vendedor abre a plataforma na segunda-feira de manhã e sabe imediatamente onde focar — sem feeling, sem planilha manual.

---

## Abordagem

### 1. Leitura e análise manual dos dados
Antes de qualquer prompt, li o desafio inteiro e analisei os quatro CSVs diretamente em planilha. Objetivo: entender a estrutura real dos dados, as distribuições e as features disponíveis — sem deixar a IA criar vieses antes de eu ter minha própria leitura.

Principais insights da análise exploratória:
- **~71% dos deals em Engaging** têm mais de 90 dias (zumbis) — o problema de foco é real
- **GTK 500 custa 486× mais que MG Special** — o produto tem peso enorme na prioridade
- **Win rate varia de ~20% a ~70%** entre vendedores do mesmo time — dado valioso e ignorado
- Ciclo médio saudável de Engaging: **~52 dias**

### 2. Definição de produto com agente PM
Com os dados entendidos, usei um agente de Product Manager (Claude) para pensar no produto — não para gerá-lo, mas para estruturar a visão: quais features entravam, quais eram escopo futuro, qual era a jornada do usuário-alvo (vendedor na segunda de manhã).

Decisões tomadas nessa fase:
- **Interface web** (não CLI/notebook) — a Head de RevOps pediu algo que "o vendedor abre"
- **Score explicável** com breakdown por componente — explainability é mais útil que accuracy
- **Três visões**: Pipeline (vendedor), Equipe (manager), Admin (configuração)
- **Fora do escopo inicial**: IA generativa, Slack, autenticação robusta

### 3. Scoring engine — 4 componentes (0–100 pts)

| Componente | Peso | Lógica |
|---|---|---|
| **A. Stage + Momentum** | 30pts | Engaging ≤30d=30 · 31–60d=22 · 61–90d=12 · +90d=4 (zumbi) · Prospecting com conta=10 |
| **B. Produto / Ticket** | 25pts | GTK 500=25 · GTX Plus Pro=22 · GTXPro=20 · MG Special=3 |
| **C. Qualidade da Conta** | 25pts | Enterprise(>$2B rev)=25 · Large=18 · Mid-market=11 · SMB=6 · Sem conta=0 · +3 subsidiária |
| **D. Win Rate do Vendedor** | 20pts | Calculado do histórico real Won/Lost · >70%=20 · >50%=15 · >30%=10 · ≤30%=5 |

**Por que esses pesos?** Stage/Momentum é o indicador mais acionável no dia a dia — um deal parado há 6 meses não merece o mesmo foco que um deal quente. Produto captura impacto de receita. Conta filtra leads sem qualificação. Win rate diferencia vendedores e ajusta a expectativa de conversão.

### 4. Iteração de features
A aplicação foi construída de forma incremental. Cada feature foi avaliada pelo critério: *"o vendedor conseguiria usar isso amanhã?"*

Features implementadas:
- KPI cards clicáveis com funil fechado (Saudável + Em risco + Prospecting + Zumbis = total)
- ScoreBreakdown modal com explicação componente a componente
- Action tags por deal (🚀 Prioridade máxima · ⚠️ Contato urgente · 💀 Zumbi · ➡️ Avançar)
- Filtros por vendedor, manager e região
- Visão de equipe com win rate e ranking por agente
- Coach de IA (Gemini 2.0 Flash) — análise contextual por deal com ação recomendada
- Integração Slack com webhook salvo no Supabase
- Anotações por deal (localStorage)
- Responsivo mobile

---

## Resultado

- **2.092 deals ativos** scorados e rankeados em tempo real
- **Score ≥70 (Alta prioridade):** ~34 deals — onde o vendedor deveria estar hoje
- **1.479 zumbis (+90d):** visibilidade imediata do que precisa revisão urgente
- **Explainability total:** qualquer vendedor consegue entender por que um deal tem score 83
- **Coach de IA:** Gemini analisa cada deal individualmente e retorna urgência + ação concreta

---

## Recomendações (para escalar)

1. **Autenticação por usuário** — hoje é token compartilhado; em produção, cada vendedor teria seu login e veria apenas o próprio pipeline
2. **Score dinâmico com ML** — o modelo de regras é ótimo para começar; com 6–12 meses de dados novos, um modelo supervisionado (XGBoost/logistic regression) pode substituir os pesos fixos
3. **Integração com CRM real** — substituir os CSVs por webhooks do HubSpot/Salesforce para dados em tempo real
4. **Alertas automáticos** — o Slack já está conectado; automatizar relatórios diários via cron
5. **Histórico de score** — rastrear como o score de cada deal evolui ao longo do tempo

---

## Limitações

- **Autenticação simplificada** — token único sem RLS por usuário; inadequado para produção com dados sensíveis
- **Dados estáticos** — o pipeline é lido dos CSVs no Supabase; sem integração em tempo real com CRM
- **Score baseado em regras** — pesos definidos heuristicamente; não validados contra dados de conversão futura
- **Anotações no localStorage** — notas salvas no navegador; não persistem entre dispositivos
- **Sem testes automatizados** — prova de conceito funcional; precisaria de test coverage antes de produção
- **API key Gemini exposta no servidor** — segura no Vercel env vars, mas precisa de rate limiting em produção

---

## Setup local

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# Preencher NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
# SUPABASE_SERVICE_ROLE_KEY, ADMIN_TOKEN, VIEWER_TOKEN, GEMINI_API_KEY

# 3. Rodar
npm run dev
# Acesse http://localhost:3000
```

### Tabela Supabase necessária (para integração Slack)
```sql
create table if not exists app_settings (
  key        text primary key,
  value      text not null,
  updated_at timestamptz default now()
);
alter table app_settings enable row level security;
```

---

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase · Gemini 2.0 Flash · Vercel
