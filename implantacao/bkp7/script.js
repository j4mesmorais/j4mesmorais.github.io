const img = document.getElementById("mapImage");
const container = document.getElementById("mapContainer");
const wrapper = document.getElementById("mapWrapper");
const filterStatus = document.getElementById("filterStatus");

let scale = 0.5, translateX = 0, translateY = 0;
let isDragging = false, startX, startY, initialDist = -1;

// FUNÇÃO DE FILTRO CORRIGIDA
function aplicarFiltros() {
    const statusAlvo = filterStatus.value;
    const pontosDOM = document.querySelectorAll('.ponto');
    pontosDOM.forEach(p => {
        p.style.display = (statusAlvo === 'todos' || p.getAttribute('data-status') === statusAlvo) ? 'block' : 'none';
    });
}

// Escuta a mudança no select
filterStatus.addEventListener('change', aplicarFiltros);

// Carregar Dados e Desenhar
fetch('json.json').then(res => res.json()).then(data => {
    const carregarMapa = () => {
        const w = img.offsetWidth;
        const h = img.offsetHeight;
        container.querySelectorAll('.ponto').forEach(p => p.remove()); // Limpa antes de desenhar
        data.forEach(p => {
            const div = document.createElement("div");
            div.className = `ponto ${p.status}`;
            div.setAttribute('data-status', p.status);
            div.style.left = (p.x * w) + "px";
            div.style.top = (p.y * h) + "px";
            div.onclick = (e) => { e.stopPropagation(); mostrarDetalhes(p); };
            container.appendChild(div);
        });
        updateTransform();
    };
    if (img.complete) carregarMapa(); else img.onload = carregarMapa;
});

function updateTransform() {
    scale = Math.min(Math.max(0.1, scale), 4);
    container.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

// Mouse e Touch
const startMove = (x, y) => { isDragging = true; startX = x - translateX; startY = y - translateY; };
const doMove = (x, y) => { if (isDragging) { translateX = x - startX; translateY = y - startY; updateTransform(); } };

wrapper.addEventListener("mousedown", (e) => startMove(e.pageX, e.pageY));
window.addEventListener("mousemove", (e) => doMove(e.pageX, e.pageY));
window.addEventListener("mouseup", () => isDragging = false);

wrapper.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) startMove(e.touches[0].pageX, e.touches[0].pageY);
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
    } else if (isDragging) {
        doMove(e.touches[0].pageX, e.touches[0].pageY);
    }
}, { passive: false });

wrapper.addEventListener("touchend", () => { isDragging = false; initialDist = -1; });
wrapper.addEventListener("wheel", (e) => { e.preventDefault(); scale *= (e.deltaY < 0 ? 1.1 : 0.9); updateTransform(); }, { passive: false });

// Botões
document.getElementById("zoomIn").onclick = () => { scale *= 1.2; updateTransform(); };
document.getElementById("zoomOut").onclick = () => { scale /= 1.2; updateTransform(); };
document.getElementById("zoomReset").onclick = () => { scale = 0.5; translateX = 0; translateY = 0; updateTransform(); };

function mostrarDetalhes(p) {
    const modal = document.getElementById("modalLote");
    const info = document.getElementById("detalheLote");
    const cores = { disponivel: '#2ecc71', reservado: '#ff9800', vendido: '#e74c3c' };
    info.innerHTML = `
        <h2 style="margin:0">Quadra ${p.quadra} - Lote ${p.lote}</h2>
        <div style="background:${cores[p.status]}; color:#fff; display:inline-block; padding:10px 25px; border-radius:25px; font-weight:bold; margin:20px 0">${p.status.toUpperCase()}</div>
        <button onclick="document.getElementById('modalLote').style.display='none'" style="width:100%; padding:18px; background:#333; color:#fff; border:none; border-radius:15px; font-weight:bold; cursor:pointer">VOLTAR AO MAPA</button>`;
    modal.style.display = "block";
}
window.onclick = (e) => { if(e.target.className === 'modal') e.target.style.display = 'none'; };