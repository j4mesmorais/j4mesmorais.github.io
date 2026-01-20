/* =========================================
   CONFIGURAÇÃO E DADOS GLOBAIS
   ========================================= */
const map = L.map('map').setView([-16.69, -49.25], 9);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Referências DOM (Cache)
const dom = {
    card: document.getElementById('propertyCard'),
    cardImg: document.getElementById('cardImage'),
    cardTitle: document.getElementById('cardTitle'),
    cardDesc: document.getElementById('cardDesc'),
    cardPrice: document.getElementById('cardPrice'),
    cardLink: document.getElementById('cardLink'),
    cardClose: document.querySelector(".card-close"),
    listMobile: document.getElementById("productList"),
    listDesktop: document.getElementById("productListDesktop"),
    sheet: document.getElementById("bottomSheet"),
    layoutDesktop: document.getElementById("layoutDesktop"),
    btnToggleMap: document.getElementById("toggleMap")
};

/* =========================================
   FUNÇÕES DE UI (CARD & LISTA)
   ========================================= */

function openCard(p) {
    if (window.collapseSheet) window.collapseSheet();
    
    dom.cardImg.src = p.image;
    dom.cardTitle.textContent = p.title;
    dom.cardDesc.textContent = p.desc;
    dom.cardPrice.textContent = p.price;
    dom.cardLink.href = p.link;
    
    dom.card.classList.remove("hidden");
    requestAnimationFrame(() => dom.card.classList.add("visible"));
}

function closeCard() {
    dom.card.classList.remove("visible");
}

dom.cardClose.addEventListener("click", closeCard);

/* =========================================
   RENDERIZAÇÃO OTIMIZADA (MAPA E LISTA)
   ========================================= */

const markersGroup = L.layerGroup();
const fragmentMobile = document.createDocumentFragment();
const fragmentDesktop = document.createDocumentFragment();

function createProductItem(p) {
    const item = document.createElement("div");
    item.className = "product-item";
    
    item.innerHTML = `
        <img src="${p.image}" alt="${p.title}" loading="lazy">
        <div class="product-body">
            <div class="product-title">${p.title}</div>
            <div class="product-desc">${p.desc}</div>
        </div>
    `;

    item.addEventListener("click", () => {
        map.setView([p.lat, p.lng], 15);
        openCard(p);
    });

    return item;
}

properties.forEach(p => {
    const customIcon = L.divIcon({
        className: "custom-marker",
        html: `
            <div class="marker-content">
                <img src="${p.image}" alt="marker">
                <div class="marker-title">${p.title}</div>
            </div>
        `,
        iconSize: [140, 60],
        iconAnchor: [70, 60]
    });

    const marker = L.marker([p.lat, p.lng], { icon: customIcon });
    marker.on("click", () => openCard(p));
    markersGroup.addLayer(marker);

    const itemMobile = createProductItem(p);
    const itemDesktop = itemMobile.cloneNode(true);
    
    itemDesktop.addEventListener("click", () => {
        map.setView([p.lat, p.lng], 15);
        openCard(p);
    });

    fragmentMobile.appendChild(itemMobile);
    fragmentDesktop.appendChild(itemDesktop);
});

markersGroup.addTo(map);
dom.listMobile.appendChild(fragmentMobile);
dom.listDesktop.appendChild(fragmentDesktop);


/* =========================================
   BOTTOM SHEET (LÓGICA SIMPLIFICADA)
   ========================================= */
let dragStartY = 0;
let sheetStartH = 0;
let dragging = false;

function setSheetState(state) {
    dom.sheet.classList.remove("sheet-min", "sheet-mid", "sheet-max");
    dom.sheet.classList.add(state);
    dom.sheet.style.height = "";
}

window.collapseSheet = function () {
    setSheetState("sheet-min");
};

const sheetContent = document.querySelector(".sheet-content");

dom.sheet.addEventListener("touchstart", (e) => {
    dragStartY = e.touches[0].clientY;
    sheetStartH = dom.sheet.offsetHeight;
    
    const isAtTop = sheetContent.scrollTop <= 0;
    const isMaximized = dom.sheet.classList.contains("sheet-max");

    if (e.target.closest('.sheet-handle') || isAtTop || !isMaximized) {
        dragging = true;
        dom.sheet.style.transition = "none";
    }
}, { passive: true });

dom.sheet.addEventListener("touchmove", (e) => {
    if (!dragging) return;

    const currentY = e.touches[0].clientY;
    const delta = dragStartY - currentY;
    
    const isMaximized = dom.sheet.classList.contains("sheet-max");
    const isAtTop = sheetContent.scrollTop <= 0;

    if (isMaximized && delta > 0) {
        dragging = false;
        return;
    }

    if (delta < 0 && !isAtTop) {
        dragging = false;
        return;
    }

    const newHeight = sheetStartH + delta;

    if (newHeight > window.innerHeight * 0.88 + 20 || newHeight < 40) return;

    if (e.cancelable) e.preventDefault();
    dom.sheet.style.height = `${newHeight}px`;
}, { passive: false });

dom.sheet.addEventListener("touchend", (e) => {
    if (!dragging) return;
    dragging = false;
    
    dom.sheet.style.transition = "height 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)";

    const endY = e.changedTouches[0].clientY;
    const delta = dragStartY - endY;
    const h = dom.sheet.offsetHeight;

    const isSwipeUp = delta > 50;
    const isSwipeDown = delta < -50;

    const current = dom.sheet.classList.contains("sheet-min") ? "min"
                  : dom.sheet.classList.contains("sheet-mid") ? "mid"
                  : "max";

    if (isSwipeUp) {
        if (current === "min") setSheetState("sheet-mid");
        else setSheetState("sheet-max");
    } 
    else if (isSwipeDown) {
        if (current === "max") setSheetState("sheet-mid");
        else setSheetState("sheet-min");
    } 
    else {
        const minH = 60;
        const midH = window.innerHeight * 0.45;
        const maxH = window.innerHeight * 0.80;
        
        const dMin = Math.abs(h - minH);
        const dMid = Math.abs(h - midH);
        const dMax = Math.abs(h - maxH);
        const closest = Math.min(dMin, dMid, dMax);

        if (closest === dMin) setSheetState("sheet-min");
        else if (closest === dMid) setSheetState("sheet-mid");
        else setSheetState("sheet-max");
    }
    
    setTimeout(() => {
        if (!dragging) dom.sheet.style.height = "";
    }, 300);
});


/* =========================================
   CONTROLE DE LAYOUT DESKTOP
   ========================================= */
dom.btnToggleMap.addEventListener("click", () => {
    const isFullscreen = dom.layoutDesktop.classList.toggle("map-fullscreen");
    dom.btnToggleMap.textContent = isFullscreen ? "✕" : "⤢";

    setTimeout(() => {
        map.invalidateSize();
    }, 300);
});

/* =========================================
   BUSCA POR TÍTULO
   ========================================= */

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();

    [...dom.listMobile.children].forEach(item => {
        const title = item.querySelector(".product-title").textContent.toLowerCase();
        item.style.display = title.includes(term) ? "block" : "none";
    });

    [...dom.listDesktop.children].forEach(item => {
        const title = item.querySelector(".product-title").textContent.toLowerCase();
        item.style.display = title.includes(term) ? "block" : "none";
    });

    markersGroup.clearLayers();

    properties
        .filter(p => p.title.toLowerCase().includes(term))
        .forEach(p => {
            const customIcon = L.divIcon({
                className: "custom-marker",
                html: `
                    <div class="marker-content">
                        <img src="${p.image}" alt="marker">
                        <div class="marker-title">${p.title}</div>
                    </div>
                `,
                iconSize: [140, 60],
                iconAnchor: [70, 60]
            });

            const marker = L.marker([p.lat, p.lng], { icon: customIcon });
            marker.on("click", () => openCard(p));
            markersGroup.addLayer(marker);
        });
});

// Fix para iOS: ajusta o mapa após carregamento
setTimeout(() => {
    map.invalidateSize();
}, 500);