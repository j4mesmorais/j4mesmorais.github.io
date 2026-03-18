# Plano de Desenvolvimento - HP Index

Este documento descreve as características atuais do arquivo `index.html` na pasta `hp` para orientar futuras modificações.

## 1. Identidade Visual (Design System)

### Cores (Variáveis CSS)
- **Primary Gold:** `#c6a85a` (Destaques e botões)
- **Dark:** `#111111` (Header e fundo de seções escuras)
- **Light:** `#f4f4f4` (Fundo de seções claras)
- **Gray:** `#666666` (Textos secundários)
- **Launch Green:** `#2d9b6d` (Indicadores de lançamento)
- **Alert Red:** `#e74c3c` (Alertas)
- **Accent Yellow/Gold:** `#F4A300` (Cards de produtos e badges)

### Tipografia
- **Corpo:** 'Segoe UI', Arial, sans-serif
- **H1:** 1.9rem (Desktop: 2.4rem)
- **H2:** 1.6rem

## 2. Estratégia de Layout

### Header & Navegação
- **Sticky Header:** Permanece no topo ao rolar.
- **Logo:** Imagem + Texto ("Pistori").
- **Menu Desktop:** Links para Produtos, Blog, Institucional, Fale Conosco + Botões de ação.
- **Menu Mobile:** Hamburger icon com transição suave e menu expansível.

### Seções Principais
1.  **Carrossel de Lançamentos:**
    - Slides com imagens em tela cheia (alturas responsivas: 250px mobile, 450px desktop).
    - Navegação por setas e pontos (dots).
    - Autoplay de 5 segundos.
2.  **Intro (Hero):** Título chamativo e breve descrição sobre alto padrão na Grande Goiânia.
3.  **Grade de Produtos (Loteamentos):**
    - Layout flexível (1 coluna mobile, 2 colunas tablet, 4 colunas desktop).
    - **Card CTA:** Destaque para "Loteamentos" com gradiente laranja.
    - **Cards de Produto:** Imagem de fundo, overlay escuro, badges (ex: "Loteamento"), títulos e tags (ex: "🏷️ Lançamento").
4.  **Diferenciais:** Seção com lista de pontos fortes em fundo claro.
5.  **Contato:** Seção escura com link de e-mail e informações de WhatsApp.
6.  **Footer:** Simples com copyright.

## 3. Funcionalidades (JavaScript)
- **Menu Mobile:** Toggle de classe `active` para abrir/fechar.
- **Carrossel:**
    - Lógica de transição via `translateX`.
    - Atualização de estados nos botões e dots.
    - Autoplay com pause no hover.
    - Navegação por teclado (Setas esquerdo/direito).

## 4. Ativos (Assets)
- **Imagens Locais:** `assents/logo.png`, `assents/topo.png`, `assents/topo2.png`, `assents/topo21.png`.
- **Imagens Externas:** Pexels (usadas nos cards de exemplo).

---
*Este plano serve como referência para manter a consistência visual em futuras atualizações.*
