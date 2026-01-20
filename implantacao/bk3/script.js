const img = document.getElementById("mapImage");
const lista = document.getElementById("lista");
const jsonArea = document.getElementById("jsonArea");
const jsonAplicar = document.getElementById("jsonAplicar");

let pontos = [];
let editandoID = null;

// ---------------- DESENHAR PONTOS ----------------
function desenharPontos() {
    document.querySelectorAll(".ponto").forEach(p => p.remove());

    const rect = img.getBoundingClientRect();
    const realWidth = rect.width;
    const realHeight = rect.height;

    pontos.forEach(p => {
        const div = document.createElement("div");
        div.className = `ponto ${p.status}`;
        div.style.left = (p.x * realWidth) + "px";
        div.style.top = (p.y * realHeight) + "px";

        div.onclick = (ev) => {
            ev.stopPropagation();
            selecionarPonto(p.id);
        };

        img.parentElement.appendChild(div);
    });

    atualizarLista();
}


// ---------------- ADICIONAR / EDITAR ----------------
img.addEventListener("click", (ev) => {
    const rect = img.getBoundingClientRect();

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
    const lote = prompt("Lote:");
    const st = prompt("Status (D=Disponível / R=Reservado / V=Vendido)").toLowerCase();

    let status = "disponivel";
    if (st === "r") status = "reservado";
    if (st === "v") status = "vendido";

    pontos.push({
        id: Date.now().toString(),
        quadra,
        lote,
        status,
        x,
        y
    });

    desenharPontos();
});


// ---------------- LISTA À ESQUERDA ----------------
function atualizarLista() {
    lista.innerHTML = "";
    pontos.forEach(p => {
        const item = document.createElement("div");
        item.textContent = `Q${p.quadra} - L${p.lote} — ${p.status}`;
        item.onclick = () => selecionarPonto(p.id);
        lista.appendChild(item);
    });
}

function selecionarPonto(id) {
    const p = pontos.find(pt => pt.id === id);

    const acao = prompt(
        "1 = Editar posição\n2 = Alterar status\n3 = Apagar"
    );

    if (acao === "1") {
        editandoID = id;
        alert("Clique no mapa para escolher a nova posição.");
    }

    if (acao === "2") {
        const st = prompt("D = Disponível | R = Reservado | V = Vendido").toLowerCase();
        if (st === "d") p.status = "disponivel";
        if (st === "r") p.status = "reservado";
        if (st === "v") p.status = "vendido";
        desenharPontos();
    }

    if (acao === "3") {
        pontos = pontos.filter(pt => pt.id !== id);
        desenharPontos();
    }
}


// ---------------- EXPORTAR ----------------
document.getElementById("btnExportar").onclick = () => {
    jsonArea.value = JSON.stringify(pontos, null, 2);
    jsonArea.style.display = "block";
    jsonAplicar.style.display = "none";
};


// ---------------- IMPORTAR ----------------
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
    } catch (e) {
        alert("JSON inválido!");
    }
};
