# Plano de Desenvolvimento - Pistori & Associados Website

## 🎯 Objetivo Geral
Modernizar e melhorar o website da Pistori & Associados com design mobile-first, navegação responsiva e seções de lançamentos e produtos.

---

## ✅ Fase 1: Navegação e Carousel de Lançamentos (CONCLUÍDO)

### Implementado:
- ✅ **Header Responsivo com Navegação Mobile-First**
  - Logo + Branding no topo
  - Menu hambúrguer em dispositivos mobile (< 768px)
  - Navegação horizontal em desktop (≥ 768px)
  - Links: Produtos, Blog, Institucional, Fale Conosco
  - Botões CTA: "Já sou cliente" e "Fale Conosco"
  - Menu sticky/fixo no topo com sombra

- ✅ **Carousel de Imagens de Lançamentos**
  - Rotação automática a cada 5 segundos
  - 3 slides com imagens dos empreendimentos (topo.png, topo2.png, topo21.png)
  - Transições suaves (0.5s ease-in-out)
  - **Controles de Navegação**:
    - Setas (❮ ❯) em ambos os lados
    - Pagination dots na parte inferior (3 pontos)
    - Indicador visual da slide ativa (dourado #c6a85a)
  - **Interatividade**:
    - Clique em setas para navegar entre slides
    - Clique em dots para ir direto a um slide
    - Autoplay pausa ao passar mouse (hover)
    - Suporte a navegação via teclado (setas ← →)
  - **Responsividade**:
    - Mobile (< 600px): altura 250px
    - Tablet (600px - 1024px): altura 350px
    - Desktop (≥ 1025px): altura 450px

- ✅ **Design Tokens & Variáveis CSS**
  - Cores: gold, dark, gray, light, green, purple, red
  - Tipografia: Segoe UI, Arial sans-serif
  - Espaçamento: xs, sm, md, lg, xl
  - Border radius e shadows padronizadas
  - Todos os estilos refatorados com variáveis CSS

### Arquivos Modificados:
- `hp/index.html` - Estrutura HTML + Estilos CSS inline + JavaScript para menu e carousel

### Testado em:
- ✅ Mobile (375px x 667px) - Carousel com altura 250px, navegação funcional
- ✅ Tablet (768px x 1024px) - Carousel com altura 350px, menu horizontal
- ✅ Desktop (1280px x 800px) - Carousel com altura 450px, visão completa
- ✅ Navegação via setas funcional
- ✅ Navegação via dots funcional
- ✅ Autoplay com intervalo de 5 segundos
- ✅ Transições suaves de slides
- ✅ Sem erros no console
- ✅ Sem overflow de conteúdo

---

## ✅ Fase 2: Seção de Loteamentos com Grid de Cards (CONCLUÍDO)

### Implementado:

#### 2.1 Estrutura de Grid
- ✅ **Grid responsivo** de 1 coluna (mobile) → 2 colunas (tablet) → 4 colunas (desktop)
- ✅ **Primeiro card**: CTA Card com orange background (#F4A300)
- ✅ **Demais cards**: Product cards com background images

#### 2.2 CTA Card (Esquerda)
- ✅ Background gradiente laranja (#F4A300 → #FFB630)
- ✅ Ícone emoji grande (🏔️ 64px)
- ✅ Título: "Loteamentos" (32px, bold, white)
- ✅ Descrição: "Opções de lotes para todos os tipos de bolsos e de sonhos."
- ✅ Botão: "Ver todos os loteamentos" (white bg, orange text, rounded pill)
- ✅ Height: 300px, centered content

#### 2.3 Product Cards (Direita - 3 cards)
Cada card com:
- ✅ Background image (imagens de estoque de propriedades premium)
- ✅ Badge "Loteamento" (orange #F4A300, top-right)
- ✅ Dark overlay gradient (rgba(0,0,0,0.6))
- ✅ Título: Nome do empreendimento (white, 1.4rem)
- ✅ Tags: 2 tags com ícones (🏷️ + 🏠) em orange border
- ✅ Pagination dots: 3 dots no footer (1 ativo em orange)

#### 2.4 Empreendimentos
1. **Quintas do Cerrado** - Imagem de lote natural com vegetação
2. **Portal do Lago** - Imagem de propriedade à beira d'água
3. **Alteza do Lago** - Imagem de condomínio residencial premium

#### 2.5 Design & Cores
- ✅ CTA Button: white background, orange (#F4A300) text, rounded pill
- ✅ Badges: orange (#F4A300) background, white text
- ✅ Tags: orange (#F4A300) border, white background, orange text
- ✅ Pagination dots: gray inactive, orange (#F4A300) active
- ✅ Card overlay: linear gradient dark (rgba(0,0,0,0.6))

### Arquivos Modificados:
- ✅ `hp/index.html` - Substituiu seção "Empreendimentos" por nova seção "products-section" com grid layout

### Imagens Utilizadas:
- ✅ Quintas do Cerrado: https://images.pexels.com/photos/30587969/pexels-photo-30587969.jpeg
- ✅ Portal do Lago: https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg
- ✅ Alteza do Lago: https://images.pexels.com/photos/4426226/pexels-photo-4426226.jpeg

### Testado em:
- ✅ Mobile (375px) - 1 coluna, cards empilhados verticalmente
- ✅ Tablet (768px) - 2 colunas, 2 linhas (CTA + 1 produto | 2 produtos)
- ✅ Desktop (1280px) - 4 colunas, 1 linha (CTA + 3 produtos)
- ✅ Sem erros no console
- ✅ Images carregam corretamente
- ✅ Responsive layout funcional
- ✅ Cards com altura consistente (300px)

---

## 🎨 Fase 3: Página de Produtos Detalhada (FUTURO)

### Planejado:
- Página individual para cada empreendimento
- Galeria de imagens (carousel)
- Detalhes completos (áreas, preços, localizações, amenidades)
- Formulário de contato/agendamento
- Mapa de localização
- Depoimentos/testimonials

---

## 🛠️ Stack Técnico

| Categoria | Tecnologia |
|-----------|-----------|
| **Linguagem** | Vanilla HTML5 / JavaScript / CSS3 |
| **Framework** | Nenhum (Static HTML) |
| **CSS** | Vanilla CSS com variáveis CSS |
| **Build Tool** | Nenhum (HTML estático) |
| **Servidor** | HTTP Server (Python http.server) |
| **Responsividade** | Mobile-First com media queries |

---

## 📐 Design Tokens Atuais

### Cores
```css
--color-primary-gold: #c6a85a
--color-dark: #111111
--color-gray: #666
--color-light: #f4f4f4
--color-launch-green: #2d9b6d
--color-alert-red: #e74c3c
--color-purple: #6b4c9a
```

### Tipografia
```css
--font-family-body: 'Segoe UI', Arial, sans-serif
--font-size-h1: 1.9rem (mobile) / 2.4rem (desktop)
--font-size-h2: 1.6rem
```

### Espaçamento
```css
--spacing-xs: 8px
--spacing-sm: 12px
--spacing-md: 20px
--spacing-lg: 30px
--spacing-xl: 80px
```

### Outros
```css
--radius-sm: 4px
--radius-md: 10px
--shadow-sm: 0 15px 35px rgba(0,0,0,0.06)
--shadow-md: 0 10px 25px rgba(0,0,0,0.1)
```

---

## 📱 Breakpoints Responsivos

| Dispositivo | Largura | Comportamento |
|------------|---------|--------------|
| Mobile | < 768px | Menu hambúrguer, cards empilhados |
| Tablet | 768px - 1024px | Menu horizontal, 2 colunas |
| Desktop | ≥ 1024px | Layout completo, 3 colunas |

---

## 📂 Estrutura de Arquivos

```
hp/
├── index.html (Página principal - 725 linhas)
├── assents/
│   ├── logo.png (Logo Pistori)
│   ├── topo.png (Banner hero)
│   ├── topo2.png (Imagem Provence)
│   └── topo21.png (Social media preview)
└── (futuros: produtos.css, produtos.js, product-details.html)
```

---

## ✨ Próximos Passos

### Imediato (Fase 2):
1. Criar seção de produtos com grid responsivo
2. Adicionar cards para Quintas do Cerrado, Portal do Lago, Alteza do Lago
3. Implementar hover effects e transições
4. Testar responsividade mobile/tablet/desktop

### Médio Prazo (Fase 3):
1. Criar páginas individuais para cada empreendimento
2. Implementar galeria de imagens/carrossel
3. Integrar formulários de contato
4. Adicionar mapa de localização

### Longo Prazo:
1. SEO optimization
2. Analytics integration
3. CMS integration (se necessário)
4. Performance optimization

---

## 🔍 QA Checklist - Fase 1 (CONCLUÍDO)

- ✅ Hamburger menu toggle em mobile
- ✅ Menu fecha ao clicar em links
- ✅ Navegação horizontal em desktop
- ✅ Logo aparece corretamente
- ✅ Banner de lançamentos com 3 colunas em desktop
- ✅ Banner stacks em mobile
- ✅ Cores correspondem ao design
- ✅ Sem erros de console
- ✅ Transições suaves
- ✅ Sem overflow de conteúdo

---

## 📞 Contatos & Informações

- **Email**: contato@imobiliapistori.com.br
- **WhatsApp**: (62) 9XXXX-XXXX
- **Website**: https://www.imobiliariapistori.com.br/

---

**Última atualização**: 04/03/2026  
**Status**: Fase 1 Concluída ✅ | Fase 2 Planejada 📋 | Fase 3 Futuro 🔮
