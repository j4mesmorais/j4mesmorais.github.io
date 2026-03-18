from playwright.sync_api import sync_playwright
import datetime

def log(msg):
    print(f"[{datetime.datetime.now().strftime('%H:%M:%S')}] {msg}")

with sync_playwright() as p:

    log("Iniciando navegador")
    browser = p.chromium.launch(headless=False)

    context = browser.new_context()
    page = context.new_page()

    # logs do navegador
    page.on("console", lambda msg: log(f"BROWSER LOG: {msg.text}"))
    page.on("pageerror", lambda exc: log(f"BROWSER ERROR: {exc}"))

    # logs de rede
    page.on("request", lambda req: log(f"REQ -> {req.method} {req.url}"))
    page.on("response", lambda res: log(f"RES <- {res.status} {res.url}"))

    log("Abrindo página inicial")
    page.goto("https://torreforte.cvcrm.com.br")

    log("Aguardando login manual")
    input("1) Faça login\n2) Entre no mapa\n3) Pressione ENTER...")

    try:
        log("Esperando página estabilizar")
        page.wait_for_load_state("networkidle", timeout=15000)
        log("Load state OK")
    except Exception as e:
        log(f"Erro no wait_for_load_state: {e}")

    try:
        log("Capturando URL atual")
        log(page.url)
    except Exception as e:
        log(f"Erro lendo URL: {e}")

    try:
        log("Capturando HTML")
        html = page.content()

        with open("mapa_debug.html", "w", encoding="utf-8") as f:
            f.write(html)

        log("HTML salvo em mapa_debug.html")

    except Exception as e:
        log(f"Erro ao capturar HTML: {e}")

    log("Finalizando")
    browser.close()