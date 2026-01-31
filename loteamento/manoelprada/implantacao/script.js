const img = document.getElementById("mapImage");
const container = document.getElementById("mapContainer");
const wrapper = document.getElementById("mapWrapper");
const filterStatus = document.getElementById("filterStatus");
const filterParcela = document.getElementById("filterParcela");

let scale = 0.5, translateX = 0, translateY = 0;
let isDragging = false, startX, startY, initialDist = -1;

// FILTRO
filterStatus.addEventListener('change', aplicarFiltros);
filterParcela.addEventListener('change', aplicarFiltros);


// CARREGAR DADOS
let lotes = [];

fetch('dados.json')
  .then(res => res.json())
  .then(data => {
    lotes = data;
    const init = () => {
      const w = img.offsetWidth;
      const h = img.offsetHeight;

      lotes.forEach(p => {
        const div = document.createElement("div");
        div.className = `ponto ${p.status}`;
        div.dataset.status = p.status;
        div.dataset.parcela = p.dados_financeiros.valor_parcela_300x;

        div.style.left = (p.x * w) + "px";
        div.style.top = (p.y * h) + "px";

        div.onclick = (e) => {
          e.stopPropagation();
          mostrarDetalhes(p);
        };

        container.appendChild(div);
      });

      updateTransform();
    };

    if (img.complete) init(); else img.onload = init;
  });

function updateTransform() {
    scale = Math.min(Math.max(0.1, scale), 4);
    container.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

// INTERAÇÃO (PAN & ZOOM)
const start = (x, y) => { isDragging = true; startX = x - translateX; startY = y - translateY; };
const move = (x, y) => { if (isDragging) { translateX = x - startX; translateY = y - startY; updateTransform(); } };

wrapper.addEventListener("mousedown", (e) => start(e.pageX, e.pageY));
window.addEventListener("mousemove", (e) => move(e.pageX, e.pageY));
window.addEventListener("mouseup", () => isDragging = false);

wrapper.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) start(e.touches[0].pageX, e.touches[0].pageY);
    else if (e.touches.length === 2) {
        isDragging = false;
        initialDist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
    }
}, { passive: false });

wrapper.addEventListener("touchmove", (e) => {
    if (e.touches.length === 2) {
        e.preventDefault();
        const dist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
        scale *= (dist / initialDist);
        initialDist = dist;
        updateTransform();
    } else move(e.touches[0].pageX, e.touches[0].pageY);
}, { passive: false });

wrapper.addEventListener("touchend", () => { isDragging = false; initialDist = -1; });
wrapper.addEventListener("wheel", (e) => { e.preventDefault(); scale *= (e.deltaY < 0 ? 1.1 : 0.9); updateTransform(); }, { passive: false });

// CONTROLES
document.getElementById("zoomIn").onclick = () => { scale *= 1.2; updateTransform(); };
document.getElementById("zoomOut").onclick = () => { scale /= 1.2; updateTransform(); };
document.getElementById("zoomReset").onclick = () => { scale = 0.5; translateX = 0; translateY = 0; updateTransform(); };

// MODAL COMPACTO
function mostrarDetalhes(p) {
    const modal = document.getElementById("modalLote");
    const info = document.getElementById("detalheLote");

    const cores = {
        disponivel: '#2ecc71',
        reservado: '#ff9800',
        vendido: '#e74c3c'
    };

    info.innerHTML = `
        <h3>Q${p.quadra} · Lote ${p.lote}</h3>

        <span style="
            background:${cores[p.status]};
            color:#fff;
            padding:5px 14px;
            border-radius:14px;
            font-size:12px;
            font-weight:bold;
            display:inline-block;
            margin-bottom:10px;">
            ${p.status.toUpperCase()}
        </span>

        <div style="text-align:left;font-size:13px;line-height:1.5;margin-top:10px;">
            <strong>Confrontante:</strong> ${p.dados_geometricos.confrontante}<br>
            <strong>Área:</strong> ${p.dados_geometricos.area_m2} m²<br>
            <strong>Frente:</strong> ${p.dados_geometricos.frente} m<br>
            <strong>Fundo:</strong> ${p.dados_geometricos.fundo} m<br>
            <strong>Laterais:</strong> ${p.dados_geometricos.esquerda} m / ${p.dados_geometricos.direita} m<br><br>

            <strong>Entrada:</strong> R$ ${p.dados_financeiros.entrada.toLocaleString('pt-BR')}<br>
            <strong>Parcela (300x):</strong> R$ ${p.dados_financeiros.valor_parcela_300x.toLocaleString('pt-BR')}
        </div>

        <button class="btn-fechar" onclick="document.getElementById('modalLote').style.display='none'">
            Fechar
        </button>
    `;

    modal.style.display = "flex";
}


window.onclick = (e) => { if(e.target.id === 'modalLote') e.target.style.display = 'none'; };

function aplicarFiltros() {
    const status = filterStatus.value;
    const parcelaFiltro = filterParcela.value;

    document.querySelectorAll('.ponto').forEach(p => {
        const pStatus = p.dataset.status;
        const parcela = parseFloat(p.dataset.parcela);

        let okStatus = (status === 'todos' || pStatus === status);
        let okParcela = true;

        if (parcelaFiltro === 'ate300') okParcela = parcela <= 300;
        if (parcelaFiltro === '300a350') okParcela = parcela > 300 && parcela <= 350;
        if (parcelaFiltro === 'acima350') okParcela = parcela > 350;

        p.style.display = (okStatus && okParcela) ? 'block' : 'none';
    });
}
