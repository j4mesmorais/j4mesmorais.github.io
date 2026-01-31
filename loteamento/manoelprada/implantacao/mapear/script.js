const img = document.getElementById("mapImage");
const container = document.getElementById("mapContainer");
const wrapper = document.getElementById("mapWrapper");
const lista = document.getElementById("lista");
const jsonArea = document.getElementById("jsonArea");
const jsonAplicar = document.getElementById("jsonAplicar");

let pontos = [];
let editandoID = null;
let scale = 1;

// Controle de Arraste (Pan)
let isDragging = false;
let mouseMovido = false;
let startX, startY, scrollLeft, scrollTop;

// --- ZOOM ---
function updateZoom() {
    container.style.transform = `scale(${scale})`;
}
document.getElementById("zoomIn").onclick = () => { scale *= 1.2; updateZoom(); };
document.getElementById("zoomOut").onclick = () => { scale /= 1.2; updateZoom(); };
document.getElementById("zoomReset").onclick = () => { scale = 1; updateZoom(); };

// --- PAN (ARRASTAR) ---
wrapper.addEventListener("mousedown", (e) => {
    isDragging = true;
    mouseMovido = false;
    startX = e.pageX - wrapper.offsetLeft;
    startY = e.pageY - wrapper.offsetTop;
    scrollLeft = wrapper.scrollLeft;
    scrollTop = wrapper.scrollTop;
});

wrapper.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const x = e.pageX - wrapper.offsetLeft;
    const y = e.pageY - wrapper.offsetTop;
    const walkX = x - startX;
    const walkY = y - startY;
    if (Math.abs(walkX) > 5 || Math.abs(walkY) > 5) mouseMovido = true;
    wrapper.scrollLeft = scrollLeft - walkX;
    wrapper.scrollTop = scrollTop - walkY;
});

wrapper.addEventListener("mouseup", () => isDragging = false);

// --- ORDENAÇÃO E LIMPEZA ---
function ordenarPontos() {
    pontos.sort((a, b) => {
        const qA = parseInt(a.quadra);
        const qB = parseInt(b.quadra);
        if (qA !== qB) return qA - qB;
        return parseInt(a.lote) - parseInt(b.lote);
    });
}

// --- RENDERIZAÇÃO ---
function desenharPontos() {
    ordenarPontos(); 
    document.querySelectorAll(".ponto").forEach(p => p.remove());

    const realWidth = img.offsetWidth;
    const realHeight = img.offsetHeight;

    pontos.forEach(p => {
        const div = document.createElement("div");
        div.className = `ponto ${p.status}`;
        div.style.left = (p.x * realWidth) + "px";
        div.style.top = (p.y * realHeight) + "px";
        div.onclick = (ev) => { 
            ev.stopPropagation(); 
            selecionarPonto(p.id); 
        };
        container.appendChild(div);
    });

    atualizarLista();
}

function focalizarOuPosicionar(p) {
    if (parseFloat(p.x) === 0 && parseFloat(p.y) === 0) {
        // Se não tem posição, já prepara para posicionar no mapa
        editandoID = p.id;
        alert(`O Lote Q${p.quadra}-L${p.lote} não tem posição. Clique agora no mapa para localizá-lo.`);
    } else {
        // Se já tem posição, apenas foca e abre o menu
        focarPonto(p);
    }
}
function atualizarLista() {
    lista.innerHTML = "";
    pontos.forEach(p => {
        const item = document.createElement("div");
        item.textContent = `Q ${p.quadra} - L ${p.lote}`;
        item.setAttribute("data-status", p.status);
        
        // Verifica se o lote não tem localização (x e y iguais a zero)
        if (parseFloat(p.x) === 0 && parseFloat(p.y) === 0) {
            item.classList.add("sem-localizacao");
        }

        item.onclick = () => focalizarOuPosicionar(p);
        lista.appendChild(item);
    });
}

function focarPonto(p) {
    const realWidth = img.offsetWidth;
    const realHeight = img.offsetHeight;
    wrapper.scrollTo({
        left: (p.x * realWidth * scale) - (wrapper.clientWidth / 2),
        top: (p.y * realHeight * scale) - (wrapper.clientHeight / 2),
        behavior: 'smooth'
    });
    setTimeout(() => { selecionarPonto(p.id); }, 300);
}

// --- CLIQUE NO MAPA (CRIAR OU MOVER) ---
img.addEventListener("click", (ev) => {
    if (mouseMovido) return;

    const rect = img.getBoundingClientRect();
    const x = (ev.clientX - rect.left) / rect.width;
    const y = (ev.clientY - rect.top) / rect.height;

    // Se estiver em modo de edição de posição
    if (editandoID) {
        let p = pontos.find(pt => pt.id === editandoID);
        p.x = x; p.y = y;
        editandoID = null;
        desenharPontos();
        return;
    }

    // Novos inputs (garantindo que sejam tratados como números)
    let qInput = prompt("Número da Quadra:");
    if (!qInput) return;
    let lInput = prompt("Número do Lote:");
    if (!lInput) return;

    const qNum = parseInt(qInput);
    const lNum = parseInt(lInput);

    // VERIFICAÇÃO DE EXISTÊNCIA
    const existente = pontos.find(p => parseInt(p.quadra) === qNum && parseInt(p.lote) === lNum);

    if (existente) {
        if (confirm(`Lote ${lNum} da Quadra ${qNum} já existe.\nDeseja MOVER este lote para cá?`)) {
            existente.x = x;
            existente.y = y;
            desenharPontos();
        }
        return;
    }

    // Se não existe, cria novo
    const st = prompt("Status: D=Disponível, R=Reservado, V=Vendido").toLowerCase();
    let status = "disponivel";
    if (st === "r") status = "reservado";
    if (st === "v") status = "vendido";

    pontos.push({ 
        id: Date.now().toString(), 
        quadra: qNum.toString(), 
        lote: lNum.toString(), 
        status, x, y 
    });

    desenharPontos();
});

function selecionarPonto(id) {
    const p = pontos.find(pt => pt.id === id);
    if (!p) return;

    const acao = prompt(`Q${p.quadra}-L${p.lote}\n1 = Mover | 2 = Status | 3 = Apagar`);

    if (acao === "1") {
        editandoID = id;
        alert("Clique na nova posição no mapa.");
    } else if (acao === "2") {
        const st = prompt("D, R ou V").toLowerCase();
        if (st === "d") p.status = "disponivel";
        if (st === "r") p.status = "reservado";
        if (st === "v") p.status = "vendido";
        desenharPontos();
    } else if (acao === "3") {
        if(confirm("Apagar este lote?")) {
            pontos = pontos.filter(pt => pt.id !== id);
            desenharPontos();
        }
    }
}

// Import/Export
document.getElementById("btnExportar").onclick = () => {
    ordenarPontos();
    jsonArea.value = JSON.stringify(pontos, null, 2);
    jsonArea.style.display = "block";
    jsonAplicar.style.display = "none";
};

document.getElementById("btnImportar").onclick = () => {
    jsonArea.style.display = "block";
    jsonAplicar.style.display = "block";
    jsonArea.value = "";
};

jsonAplicar.onclick = () => {
    try {
        pontos = JSON.parse(jsonArea.value);
        desenharPontos();
        alert("Importado com sucesso!");
    } catch (e) { alert("Erro no JSON"); }
};