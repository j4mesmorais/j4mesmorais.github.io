import time
import random
import urllib.parse

from playwright.sync_api import sync_playwright

numeros = [

"556281892119"
]
mensagem = "Boa tarde empreendedor!"
#mensagem = '''Peguei seu contato no grupo de network.

#Neste sábado vamos ter uma feijoada com pagode em um condomínio fechado na Grande Goiânia. A ideia é conhecer o lugar, apresentar o projeto e trocar ideias sobre investimento.

#Se tiver interesse em participar, te envio os detalhes.'''
mensagem = urllib.parse.quote(mensagem)

with sync_playwright() as p:

    browser = p.chromium.launch_persistent_context(
        "perfil_whatsapp",
        headless=False
    )

    page = browser.new_page()
    page.goto("https://web.whatsapp.com")

    print("Faça login se necessário")
    page.wait_for_selector("div[contenteditable='true']", timeout=0)

    for numero in numeros:

        print(f"Testando número {numero}")

        url = f"https://web.whatsapp.com/send?phone={numero}&text={mensagem}"
        page.goto(url)

        time.sleep(random.randint(6,10))

        # verifica se apareceu alerta de número inválido
        erro = page.locator("text=Número de telefone compartilhado através de URL é inválido")

        if erro.count() > 0:
            print(f"Número inválido: {numero}")

            # fechar modal
            page.keyboard.press("Enter")

            continue

        # enviar mensagem
        page.keyboard.press("Enter")

        print(f"Mensagem enviada para {numero}")

        time.sleep(random.randint(20,45))

    browser.close()