const img = document.getElementById("mapImage");
const container = document.getElementById("mapContainer");
const wrapper = document.getElementById("mapWrapper");
const lista = document.getElementById("lista");
const jsonArea = document.getElementById("jsonArea");
const jsonAplicar = document.getElementById("jsonAplicar");

let pontos = [];
let editandoID = null;
let scale = 1;

// Variáveis para Arraste (Pan)
let isDragging = false;
let mouseMovido = false;
let startX, startY, scrollLeft, scrollTop;

// ---------------- CONTROLE DE ZOOM ----------------
function updateZoom() {
    container.style.transform = `scale(${scale})`;
}

document.getElementById("zoomIn").onclick = () => { scale *= 1.2; updateZoom(); };
document.getElementById("zoomOut").onclick = () => { scale /= 1.2; updateZoom(); };
document.getElementById("zoomReset").onclick = () => { scale = 1; updateZoom(); };

// ---------------- LÓGICA DE PAN (ARRASTAR) ----------------
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

    // Se mover mais de 5px, é considerado arraste, não clique
    if (Math.abs(walkX) > 5 || Math.abs(walkY) > 5) mouseMovido = true;

    wrapper.scrollLeft = scrollLeft - walkX;
    wrapper.scrollTop = scrollTop - walkY;
});

wrapper.addEventListener("mouseup", () => isDragging = false);
wrapper.addEventListener("mouseleave", () => isDragging = false);

// ---------------- DESENHAR PONTOS ----------------
function desenharPontos() {
    document.querySelectorAll(".ponto").forEach(p => p.remove());

    // Usamos as dimensões naturais da imagem para posicionamento relativo estável
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

// ---------------- ADICIONAR / EDITAR ----------------
img.addEventListener("click", (ev) => {
    if (mouseMovido) return; // Se arrastou o mapa, não cria ponto

    const rect = img.getBoundingClientRect();
    // Normaliza a posição considerando o zoom atual (escala)
    const x = (ev.clientX - rect.left) / rect.width;
    const y = (ev.clientY - rect.top) / rect.height;

    if (editandoID) {
        let p = pontos.find(pt => pt.id === editandoID);
        p.x = x;
        p.y = y;
        editandoID = null;
        desenharPontos();
        return;
    }

    const quadra = prompt("Quadra:");
    if (quadra === null) return;
    const lote = prompt("Lote:");
    const st = prompt("Status (D=Disponível / R=Reservado / V=Vendido)").toLowerCase();

    let status = "disponivel";
    if (st === "r") status = "reservado";
    if (st === "v") status = "vendido";

    pontos.push({
        id: Date.now().toString(),
        quadra, lote, status, x, y
    });

    desenharPontos();
});

// ---------------- LISTA E GESTÃO ----------------
function atualizarLista() {
    lista.innerHTML = "";
    pontos.forEach(p => {
        const item = document.createElement("div");
        item.textContent = `Q${p.quadra} - L${p.lote} — [${p.status.toUpperCase()}]`;
        item.onclick = () => focarPonto(p);
        lista.appendChild(item);
    });
}

function focarPonto(p) {
    // Scrolla o mapa até o ponto clicado na lista
    const realWidth = img.offsetWidth;
    const realHeight = img.offsetHeight;
    wrapper.scrollTo({
        left: (p.x * realWidth * scale) - (wrapper.clientWidth / 2),
        top: (p.y * realHeight * scale) - (wrapper.clientHeight / 2),
        behavior: 'smooth'
    });
    // Opcional: abre o menu de edição
    setTimeout(() => selecionarPonto(p.id), 500);
}

function selecionarPonto(id) {
    const p = pontos.find(pt => pt.id === id);
    const acao = prompt("1 = Editar posição\n2 = Alterar status\n3 = Apagar");

    if (acao === "1") {
        editandoID = id;
        alert("Clique no mapa para escolher a nova posição.");
    } else if (acao === "2") {
        const st = prompt("D = Disponível | R = Reservado | V = Vendido").toLowerCase();
        if (st === "d") p.status = "disponivel";
        if (st === "r") p.status = "reservado";
        if (st === "v") p.status = "vendido";
        desenharPontos();
    } else if (acao === "3") {
        pontos = pontos.filter(pt => pt.id !== id);
        desenharPontos();
    }
}

// ---------------- IMPORT/EXPORT ----------------
document.getElementById("btnExportar").onclick = () => {
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
        alert("Sucesso!");
    } catch (e) {
        alert("Erro no JSON!");
    }
};