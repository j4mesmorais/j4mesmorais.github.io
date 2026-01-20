const img = document.getElementById("mapImage");
const container = document.getElementById("mapContainer");
const lista = document.getElementById("lista");
const btnSalvar = document.getElementById("salvarEdicao");
const btnApagar = document.getElementById("apagarPonto");

let lotes = [];
let editandoID = null;
let ultimoDotSelecionado = null;

// Criar ponto ao clicar na imagem
img.addEventListener("click", function (event) {

    if (editandoID !== null) return; // Bloqueia criar ponto enquanto edita

    const rect = img.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const quadra = document.getElementById("quadra").value;
    const lote = document.getElementById("lote").value;
    const status = document.getElementById("status").value;

    const id = Date.now().toString();

    lotes.push({ id, quadra, lote, status, x, y });

    criarPonto(id, x, y, status);
    atualizarLista();
});

// Criar ponto no mapa
function criarPonto(id, x, y, status) {
    const dot = document.createElement("div");
    dot.className = "dot " + status;
    dot.style.left = (x * 100) + "%";
    dot.style.top = (y * 100) + "%";
    dot.dataset.id = id;

    dot.addEventListener("click", function (ev) {
        ev.stopPropagation();
        selecionarPonto(id, dot);
    });

    container.appendChild(dot);
}

// Selecionar ponto para editar ou excluir
function selecionarPonto(id, dot) {

    if (ultimoDotSelecionado) {
        ultimoDotSelecionado.classList.remove("selected");
    }

    dot.classList.add("selected");
    ultimoDotSelecionado = dot;

    editandoID = id;

    const lote = lotes.find(l => l.id === id);

    document.getElementById("quadra").value = lote.quadra;
    document.getElementById("lote").value = lote.lote;
    document.getElementById("status").value = lote.status;

    btnSalvar.style.display = "block";
    btnApagar.style.display = "block";
}

// Salvar alterações no ponto
btnSalvar.addEventListener("click", () => {

    if (editandoID === null) return;

    const quadra = document.getElementById("quadra").value;
    const lote = document.getElementById("lote").value;
    const status = document.getElementById("status").value;

    let item = lotes.find(l => l.id === editandoID);

    item.quadra = quadra;
    item.lote = lote;
    item.status = status;

    const dot = [...document.querySelectorAll(".dot")].find(d => d.dataset.id === editandoID);
    dot.className = "dot " + status;

    finalizarEdicao();
    atualizarLista();
});

// Apagar ponto selecionado
btnApagar.addEventListener("click", () => {

    if (editandoID === null) return;

    // Remover do array
    lotes = lotes.filter(l => l.id !== editandoID);

    // Remover do mapa
    const dot = [...document.querySelectorAll(".dot")].find(d => d.dataset.id === editandoID);
    if (dot) dot.remove();

    finalizarEdicao();
    atualizarLista();
});

// Limpar estado de edição
function finalizarEdicao() {
    editandoID = null;
    btnSalvar.style.display = "none";
    btnApagar.style.display = "none";

    if (ultimoDotSelecionado) {
        ultimoDotSelecionado.classList.remove("selected");
        ultimoDotSelecionado = null;
    }
}

// Atualizar lista lateral
function atualizarLista() {
    lista.innerHTML = "";
    lotes.forEach((l) => {
        lista.innerHTML += `
            <div><b>Q${l.quadra} L${l.lote}</b> — ${l.status.toUpperCase()}
            <br>x: ${l.x.toFixed(4)}, y: ${l.y.toFixed(4)}</div>
        `;
    });
}

// =============================
// EXPORTAR JSON PARA PAINEL
// =============================
document.getElementById("exportar").addEventListener("click", () => {
    const json = JSON.stringify(lotes, null, 2);
    document.getElementById("exportText").value = json;
    document.getElementById("exportPanel").style.display = "flex";
});

function fecharExport() {
    document.getElementById("exportPanel").style.display = "none";
}

// =============================
// IMPORTAR JSON
// =============================
document.getElementById("importar").addEventListener("click", () => {
    document.getElementById("importPanel").style.display = "flex";
});

function fecharImport() {
    document.getElementById("importPanel").style.display = "none";
}

function importarJSON() {
    const texto = document.getElementById("importText").value;

    try {
        const dados = JSON.parse(texto);

        // limpar pontos anteriores
        document.querySelectorAll(".dot").forEach(d => d.remove());

        lotes = dados;

        // recriar os pontos no mapa
        lotes.forEach(l => {
            criarPonto(l.id, l.x, l.y, l.status);
        });

        atualizarLista();
        fecharImport();
        alert("JSON importado com sucesso!");

    } catch (e) {
        alert("JSON inválido!");
    }
}

