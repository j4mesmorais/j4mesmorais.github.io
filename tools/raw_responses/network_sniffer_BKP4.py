from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import json
import re
import os

MAPA = "https://torreforte.cvcrm.com.br/corretor/comercial/mapadisponibilidade/4"
SESSION_FILE = "session.json"


with sync_playwright() as p:

    print("Abrindo navegador...")

    browser = p.chromium.launch(headless=False)

    # ---------------------------------
    # CARREGA SESSÃO SE EXISTIR
    # ---------------------------------

    if os.path.exists(SESSION_FILE):

        print("Sessão encontrada. Usando cookies salvos...")

        context = browser.new_context(storage_state=SESSION_FILE)

    else:

        print("Sessão não encontrada.")

        context = browser.new_context()

        page = context.new_page()

        page.goto("https://torreforte.cvcrm.com.br")

        input(
            "\nFaça login manualmente.\n"
            "Depois entre na página do mapa.\n"
            "Pressione ENTER aqui para salvar a sessão..."
        )

        context.storage_state(path=SESSION_FILE)

        print("Sessão salva em session.json")

    # ---------------------------------
    # ABRE PÁGINA DO MAPA
    # ---------------------------------

    page = context.new_page()

    print("Abrindo mapa...")

    page.goto(MAPA)

    page.wait_for_timeout(3000)

    print("Capturando HTML...")

    html = page.content()

    with open("mapa_debug.html", "w", encoding="utf-8") as f:
        f.write(html)

    print("HTML salvo em mapa_debug.html")

    # ---------------------------------
    # PARSE HTML
    # ---------------------------------

    soup = BeautifulSoup(html, "html.parser")

    resultado = []

    grupos = soup.select(".disponibilidade-grupo-base")

    print("Quadras encontradas:", len(grupos))

    for grupo in grupos:

        titulo = grupo.find_previous("h3", class_="titulo-cards")

        quadra = None
        etapa = None

        if titulo:

            texto = titulo.get_text(" ", strip=True)

            etapa_match = re.search(r"ETAPA\s*(\d+)", texto)
            quadra_match = re.search(r"Quadra\s*(\d+)", texto)

            if etapa_match:
                etapa = etapa_match.group(1)

            if quadra_match:
                quadra = quadra_match.group(1)

        print("Processando Quadra:", quadra, "Etapa:", etapa)

        lotes = grupo.select("#dados-unidade")

        print("Lotes encontrados:", len(lotes))

        for l in lotes:

            try:

                dados = json.loads(l.get_text(strip=True))

                mapa_situacao = {
                    1: "disponivel",
                    2: "reservado",
                    3: "vendido",
                    4: "negociando"
                }

                registro = {

                    "etapa": etapa,
                    "quadra": quadra,
                    "lote": dados["data-filtro-nome-unidade"],
                    "area": dados["data-filtro-areaprivativa"],
                    "situacao": mapa_situacao.get(
                        dados["data-filtro-situacao"],
                        "desconhecido"
                    ),
                    "valor": dados["data-filtro-valor"],
                    "id": dados["data-filtro-idunidade"]
                }

                resultado.append(registro)

            except Exception as e:

                print("Erro lendo lote:", e)

    print("TOTAL LOTES EXTRAIDOS:", len(resultado))

    # ---------------------------------
    # SALVA JSON
    # ---------------------------------

    with open("lotes_extraidos.json", "w", encoding="utf-8") as f:

        json.dump(resultado, f, indent=2, ensure_ascii=False)

    print("Arquivo lotes_extraidos.json criado")

    browser.close()