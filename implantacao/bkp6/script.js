const img = document.getElementById("mapImage");
const container = document.getElementById("mapContainer");
const wrapper = document.getElementById("mapWrapper");
const filterStatus = document.getElementById("filterStatus");

let scale = 0.5;
let todosPontos = [];
let isDragging = false;
let startX, startY;
let translateX = 0, translateY = 0;
let initialDist = -1;

fetch('json.json')
    .then(res => res.json())
    .then(data => {
        todosPontos = data;
        if (img.complete) inicializar();
    });

img.onload = inicializar;

function inicializar() {
    desenharPontos(todosPontos);
    updateTransform();
}

function desenharPontos(pontosParaExibir) {
    document.querySelectorAll(".ponto").forEach(p => p.remove());
    const w = img.offsetWidth;
    const h = img.offsetHeight;

    pontosParaExibir.forEach(p => {
        const div = document.createElement("div");
        div.className = `ponto ${p.status}`;
        div.style.left = (p.x * w) + "px";
        div.style.top = (p.y * h) + "px";
        div.onclick = (e) => { e.stopPropagation(); mostrarDetalhes(p); };
        container.appendChild(div);
    });
}

function updateTransform() {
    scale = Math.min(Math.max(0.1, scale), 4);
    container.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

// ARRASTE DESKTOP
wrapper.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.pageX - translateX;
    startY = e.pageY - translateY;
});
window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    translateX = e.pageX - startX;
    translateY = e.pageY - startY;
    updateTransform();
});
window.addEventListener("mouseup", () => { isDragging = false; });

// ZOOM MOUSE
wrapper.addEventListener("wheel", (e) => {
    e.preventDefault();
    if (e.deltaY < 0) scale *= 1.1;
    else scale /= 1.1;
    updateTransform();
}, { passive: false });

// TOUCH MOBILE
wrapper.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].pageX - translateX;
        startY = e.touches[0].pageY - translateY;
    } else if (e.touches.length === 2) {
        isDragging = false;
        initialDist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
    }
}, { passive: false });

wrapper.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (e.touches.length === 1 && isDragging) {
        translateX = e.touches[0].pageX - startX;
        translateY = e.touches[0].pageY - startY;
    } else if (e.touches.length === 2) {
        const currentDist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
        const factor = currentDist / initialDist;
        scale *= factor;
        initialDist = currentDist;
    }
    updateTransform();
}, { passive: false });

wrapper.addEventListener("touchend", () => { isDragging = false; initialDist = -1; });

// BOTÕES
document.getElementById("zoomIn").onclick = () => { scale *= 1.2; updateTransform(); };
document.getElementById("zoomOut").onclick = () => { scale /= 1.2; updateTransform(); };
document.getElementById("zoomReset").onclick = () => { 
    scale = 0.5; translateX = 0; translateY = 0; updateTransform(); 
};

// FILTRO
filterStatus.onchange = () => {
    const s = filterStatus.value;
    const filtrados = todosPontos.filter(p => s === "todos" || p.status === s);
    desenharPontos(filtrados);
};

// MODAL
function mostrarDetalhes(p) {
    const modal = document.getElementById("modalLote");
    const info = document.getElementById("detalheLote");
    const cores = { disponivel: '#2ecc71', reservado: '#ff9800', vendido: '#e74c3c' };
    
    info.innerHTML = `
        <h2 style="margin-top:0; color:#333">Quadra ${p.quadra} - Lote ${p.lote}</h2>
        <div style="background:${cores[p.status]}; color:#fff; display:inline-block; padding:10px 25px; border-radius:25px; font-weight:bold; margin-bottom:20px; font-size:14px">
            ${p.status.toUpperCase()}
        </div>
        <button onclick="document.getElementById('modalLote').style.display='none'" 
                style="width:100%; padding:18px; background:#333; color:#fff; border:none; border-radius:15px; font-weight:bold; font-size:16px; cursor:pointer">
            VOLTAR AO MAPA
        </button>`;
    modal.style.display = "block";
}

window.onclick = (e) => { if(e.target.className === 'modal') e.target.style.display = 'none'; };