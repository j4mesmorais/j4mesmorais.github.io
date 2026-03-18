from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import json
import re

MAPA = "https://torreforte.cvcrm.com.br/corretor/comercial/mapadisponibilidade/4"

with sync_playwright() as p:

    print("Abrindo navegador...")

    browser = p.chromium.launch(headless=False)
    page = browser.new_page()

    page.goto("https://torreforte.cvcrm.com.br")

    input("1) Faça login\n2) Entre na página do mapa\n3) Pressione ENTER aqui...")

    print("Capturando HTML da página...")

    page.wait_for_timeout(3000)

    html = page.content()

    with open("mapa_debug.html","w",encoding="utf-8") as f:
        f.write(html)

    print("HTML salvo")

    print("Iniciando parsing...")

    soup = BeautifulSoup(html,"html.parser")

    resultado = []

    grupos = soup.select(".disponibilidade-grupo-base")

    print("Quadras encontradas:",len(grupos))

    for grupo in grupos:

        titulo = grupo.find_previous("h3",class_="titulo-cards")

        quadra = None
        etapa = None

        if titulo:

            texto = titulo.get_text(" ",strip=True)

            etapa_match = re.search(r"ETAPA\s*(\d+)",texto)
            quadra_match = re.search(r"Quadra\s*(\d+)",texto)

            if etapa_match:
                etapa = etapa_match.group(1)

            if quadra_match:
                quadra = quadra_match.group(1)

        print("Processando Quadra:",quadra,"Etapa:",etapa)

        lotes = grupo.select("#dados-unidade")

        print("Lotes encontrados:",len(lotes))

        for l in lotes:

            try:

                dados = json.loads(l.get_text(strip=True))
                mapa_situacao = {
                    1: "disponivel",
                    2: "vendido",
                    3: "reservado",
                    4: "negociando"
                }
                registro = {
                    "etapa": etapa,
                    "quadra": quadra,
                    "lote": dados["data-filtro-nome-unidade"],
                    "area": dados["data-filtro-areaprivativa"],
                    "situacao":  mapa_situacao.get(dados["data-filtro-situacao"], "desconhecido"),
                    "valor": dados["data-filtro-valor"],
                    "id": dados["data-filtro-idunidade"]
                }

                resultado.append(registro)

            except Exception as e:

                print("Erro lendo lote:",e)

    print("TOTAL LOTES EXTRAIDOS:",len(resultado))

    with open("lotes_extraidos.json","w",encoding="utf-8") as f:

        json.dump(resultado,f,indent=2,ensure_ascii=False)

    print("Arquivo lotes_extraidos.json criado")

    browser.close()