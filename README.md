# ⚡ Shan Dian · 闪电

Sistema web responsivo (mobile-first) para cadastro rápido de produtos de uma
loja de eletrônicos através da **leitura do código de barras** pela câmera do
celular ou webcam.

Estética **terminal / cyberpunk ultra-escura**, bilíngue **PT-BR / 中文**,
com login por e-mail e senha.

| | |
|---|---|
| **Frontend** | Next.js 14 (App Router) · React 18 · Tailwind CSS |
| **Backend / DB / Auth** | Supabase (PostgreSQL + Auth + RLS) |
| **Scanner** | `html5-qrcode` (EAN-13, EAN-8, UPC, Code-128, QR…) |
| **Hospedagem / CI-CD** | Vercel (deploy automático via GitHub) |
| **i18n** | Contexto React + dicionário JSON (Português / Chinês) |

Tudo roda no **plano gratuito (free tier)** de Supabase e Vercel.

---

## 📁 Estrutura

```
supabase/schema.sql        → script SQL (tabela products + RLS)
src/app/layout.tsx         → fontes, providers (i18n + auth)
src/app/page.tsx           → página principal (gate de login → app)
src/lib/i18n.tsx           → dicionário PT/ZH + contexto de tradução
src/lib/auth.tsx           → contexto de autenticação (Supabase Auth)
src/lib/supabaseClient.ts  → cliente Supabase do navegador
src/components/            → Card, Header, BarcodeScanner, ProductForm,
                             Dashboard, LoginScreen
```

---

## 🚀 Passo a passo (100% grátis)

### 1) Supabase (banco + autenticação)

1. Crie uma conta em **https://supabase.com** e clique em **New Project**.
2. Escolha um nome, uma senha para o banco e uma região próxima. Aguarde ~2 min.
3. No menu lateral vá em **SQL Editor → New query**, cole todo o conteúdo de
   [`supabase/schema.sql`](supabase/schema.sql) e clique em **Run**.
   Isso cria a tabela `products` e as políticas de segurança (RLS).
4. Vá em **Project Settings → API** e copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. (Opcional) Em **Authentication → Providers → Email**, desative
   *"Confirm email"* para que a dona da loja entre imediatamente após se
   registrar, sem precisar confirmar o e-mail.

### 2) GitHub (código-fonte)

```bash
git clone https://github.com/zettaceo/Shan-Dian-.git
cd Shan-Dian-
git checkout claude/shan-dian-barcode-scanner-f6z1d1
```

O código já está versionado neste repositório — basta conectá-lo à Vercel.

### 3) Rodar localmente (opcional)

```bash
cp .env.local.example .env.local     # preencha as 2 variáveis do Supabase
npm install
npm run dev                          # http://localhost:3000
```

> A câmera exige **HTTPS** ou **localhost**. No celular, use a URL da Vercel.

### 4) Vercel (deploy + CI/CD)

1. Crie uma conta em **https://vercel.com** e clique em **Add New → Project**.
2. **Import Git Repository** e selecione `zettaceo/Shan-Dian-`.
3. Em **Environment Variables**, adicione as duas variáveis:
   | Nome | Valor |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | *(Project URL do Supabase)* |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(anon key do Supabase)* |
4. Clique em **Deploy**. Em ~1 min o app estará no ar em `https://SEU-APP.vercel.app`.
5. Cada `git push` para a branch conectada **redeploya automaticamente** (CI/CD).

### 5) Primeiro acesso

1. Abra a URL da Vercel no celular.
2. Na tela de login clique em **Criar conta**, informe e-mail e senha.
3. Faça login → escaneie um código de barras → preencha os campos → **Salvar**.
4. O produto aparece na lista **"Últimos cadastros"** (estilo log de terminal).

---

## 🌐 Internacionalização (i18n)

O toggle **PT / 中文** no cabeçalho troca todos os textos da interface em tempo
real e memoriza a preferência no navegador. As traduções ficam em um único
dicionário em [`src/lib/i18n.tsx`](src/lib/i18n.tsx) — para adicionar um texto,
inclua a mesma chave nos blocos `pt` e `zh`.

## 🔐 Segurança

- Autenticação por e-mail/senha via **Supabase Auth**.
- **Row Level Security (RLS)**: cada usuária só enxerga e altera os produtos que
  ela mesma cadastrou (`owner_id = auth.uid()`).
- A `anon key` é pública por design — a proteção real é feita pelas políticas RLS.

## 🎨 Design

Tema ultra-escuro (`#0a0a0a`), painéis com bordas finas, fontes **monospace**,
títulos de seção com **semáforos** (🔴🟡🟢) e **badges** técnicos no canto,
verde neon para ações/status OK e laranja/dourado para destaques — recriando a
estética da referência enviada.
