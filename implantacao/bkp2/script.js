const mapa = document.getElementById("mapa");
const mapContainer = document.getElementById("map-container");
const lista = document.getElementById("lista");

let pontos = [];
let editandoId = null;

// -----------------------------------------------
// UTILITÁRIOS
// -----------------------------------------------
function gerarId() {
    return Date.now().toString();
}

function atualizarLista() {
    lista.innerHTML = "";

    pontos.forEach(p => {
        const div = document.createElement("div");
        div.className = "itemLista";
        div.innerHTML = `
            ${p.status.toUpperCase()} - QD ${p.quadra} LT ${p.lote}  
            <button onclick="apagarPonto('${p.id}'); event.stopPropagation()">🗑</button>
        `;
        div.onclick = () => entrarModoEdicao(p.id);
        lista.appendChild(div);
    });
}

function desenharPontos() {
    document.querySelectorAll(".ponto").forEach(e => e.remove());

    pontos.forEach(p => {
        const ponto = document.createElement("div");
        ponto.className = "ponto";

        ponto.style.left = (p.x * mapa.width) + "px";
        ponto.style.top = (p.y * mapa.height) + "px";

        ponto.onclick = (ev) => {
            ev.stopPropagation();
            menuPonto(p.id);
        };

        mapContainer.appendChild(ponto);
    });
}

// ------------------------------------------------
// MENU DO PONTO (EDITAR / APAGAR)
// ------------------------------------------------
function menuPonto(id) {
    const opcao = prompt("Digite:\n1 - Mover ponto\n2 - Apagar ponto");

    if (opcao === "1") {
        entrarModoEdicao(id);
    }

    if (opcao === "2") {
        apagarPonto(id);
    }
}

// ------------------------------------------------
// APAGAR PONTO
// ------------------------------------------------
function apagarPonto(id) {
    if (!confirm("Tem certeza que deseja apagar este ponto?")) return;

    pontos = pontos.filter(p => p.id !== id);

    desenharPontos();
    atualizarLista();
}

// ------------------------------------------------
// ADICIONAR / EDITAR PONTO
// ------------------------------------------------
mapContainer.addEventListener("click", function (ev) {
    const rect = mapa.getBoundingClientRect();
    const x = (ev.clientX - rect.left) / mapa.width;
    const y = (ev.clientY - rect.top) / mapa.height;

    if (editandoId) {
        let p = pontos.find(pt => pt.id === editandoId);
        p.x = x;
        p.y = y;

        editandoId = null;
        desenharPontos();
        atualizarLista();
        return;
    }

    const quadra = prompt("Quadra?");
    const lote = prompt("Lote?");
    const status = prompt("Status (D ou R)?").toLowerCase() === "r" ? "reservado" : "disponível";

    pontos.push({
        id: gerarId(),
        quadra,
        lote,
        status,
        x,
        y
    });

    desenharPontos();
    atualizarLista();
});

function entrarModoEdicao(id) {
    editandoId = id;
    alert("Clique no mapa para mover o ponto selecionado.");
}

// ------------------------------------------------
// EXPORTAR JSON
// ------------------------------------------------
function exportarJSON() {
    const texto = JSON.stringify(pontos, null, 2);
    document.getElementById("exportArea").value = texto;
}

// ------------------------------------------------
// IMPORTAR JSON
// ------------------------------------------------
function importarJSON() {
    try {
        const texto = document.getElementById("importArea").value;
        const dados = JSON.parse(texto);

        if (!Array.isArray(dados)) {
            alert("JSON inválido!");
            return;
        }

        pontos = dados;

        atualizarLista();
        desenharPontos();

        alert("Importado com sucesso!");
    } catch (e) {
        alert("Erro no JSON!");
    }
}
