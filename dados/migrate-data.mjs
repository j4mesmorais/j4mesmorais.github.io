import supabase from './supabase-client.js';

// ---- DADOS ORIGINAIS EXTRATIFICADOS DOS ARQUIVOS .BAK ----

const imoveisData = [
    { id: 1, titulo: "QUINTAS DO CERRADO", tipo: "Chacaras acima de 1000 m²", resumo: "Quatro lago de pesca", preco: "R$ a partir de 290.000,00", imagem: "img/QuintasCerrado.jpg", htmlDetalhes: "..." },
    { id: 2, titulo: "ALTEZA DO LADO", tipo: "Terrenos de  500 m²", resumo: "GO 264 - Santo Antonio", preco: "R$ 270.000,00", imagem: "img/AltezaLago.png", htmlDetalhes: "..." }
];

const mapaData = [
    { id: 1, title: "Quintas do Cerrado", desc: "Chacaras acima de 1000m²", price: "R$ 450.000", lat: -16.6769904, lng: -49.6232455, image: "img/QuintasCerrado.jpg", link: "#", whatsapp: "5511999999999" },
    { id: 2, title: "Alteza do Lago", price: "R$ 680.000", desc: "Chacaras acima de 500m²", lat: -16.484454583441202, lng: -49.27731769999999, image: "img/AltezaLago.png", link: "#", whatsapp: "5511988888888" },
    { id: 3, title: "Terra Vermelha", desc: "Chacaras acima de 500m²", price: "R$ 680.000", lat: -16.452681918938527, lng: -49.310343449999976, image: "img/IconeTerraVermelha.png", link: "#", whatsapp: "5511988888888" },
    { id: 4, title: "Aldeia Santo Antônio", desc: "Chacaras acima de 600m²", price: "R$ 680.000", lat: -16.490462995652656, lng: -49.27481865000001, image: "img/AldeiaSantoAntonio.jpg", link: "#", whatsapp: "5511988888888" },
    { id: 5, title: "Quintas das Araras", desc: "Não sei²", price: "R$ 680.000", lat: -16.928731327030864, lng: -49.25213065000001, image: "img/QuintasAraras.png", link: "#", whatsapp: "5511988888888" },
    { id: 6, title: "Portal do Lago", desc: "Não sei²", price: "R$ 680.000", lat: -16.577470810425336, lng: -49.6907737262778, image: "img/PortalLago.jpg", link: "#", whatsapp: "5511988888888" },
    { id: 7, title: "Quintas do Lago", desc: "Não sei²", price: "R$ 680.000", lat: -16.9172876191205, lng: -49.41646745, image: "img/QuintasLago.jpg", link: "#", whatsapp: "5511988888888" },
    { id: 8, title: "Casa Uva", desc: "Não sei²", price: "R$ 680.000", lat: -16.78720975242785, lng: -49.10521040000001, image: "img/CasaUva.png", link: "#", whatsapp: "5511988888888" }
];

const marketingData = [
    { nome: "Quintas do Cerrado", descricao: "Artes para anúncios e outros", imagem: "./img/QuintasCerrado.jpg", botoes: [{ texto: "Ver agora 01", link: "..." }, { texto: "Ver agora 02", link: "..." }] },
    { nome: "Terra Vermelha", descricao: "Artes para anúncios e outros", imagem: "./img/IconeTerraVermelha.png", botoes: [{ texto: "Ver agora", link: "..." }] },
    { nome: "Portal do Lago", descricao: "Artes para anúncios e outros", imagem: "./img/PortalLago.jpg", botoes: [{ texto: "Ver agora", link: "..." }] },
    { nome: "Casa Uva", descricao: "Artes para anúncios e outros", imagem: "./img/CasaUva.png", botoes: [{ texto: "Ver agora", link: "..." }] },
    { nome: "Aldeia Santo Antônio", descricao: "Artes para anúncios e outros", imagem: "./img/AldeiaSantoAntonio.jpg", botoes: [{ texto: "Ver agora", link: "..." }] },
    { nome: "Quintas das Araras", descricao: "Artes para anúncios e outros", imagem: "./img/QuintasAraras.png", botoes: [{ texto: "Ver agora", link: "..." }] },
    { nome: "Alteza do Lago", descricao: "Artes para anúncios e outros", imagem: "./img/AltezaLago.png", botoes: [{ texto: "Ver agora", link: "..." }] },
    { nome: "Quintas do Lago", descricao: "Artes para anúncios e outros", imagem: "./img/QuintasLago.jpg", botoes: [{ texto: "Ver agora", link: "..." }] }
];

// ---- LÓGICA DE MIGRAÇÃO ----

async function migrate() {
    console.log('--- Iniciando Migração para Super Tabela ---');

    // Mapa para consolidar dados por título (case insensitive)
    const masterMap = new Map();

    const normalize = (t) => t.trim().toUpperCase();

    // 1. Processar Catálogo (Base)
    imoveisData.forEach(item => {
        const key = normalize(item.titulo);
        masterMap.set(key, {
            titulo: item.titulo,
            subtitulo: item.tipo,
            preco: item.preco,
            imagem_url: item.imagem,
            html_detalhes: item.htmlDetalhes,
            links: []
        });
    });

    // 2. Processar Mapa (GPS e Contatos)
    mapaData.forEach(item => {
        const key = normalize(item.title);
        let entry = masterMap.get(key);
        if (!entry) {
            entry = { titulo: item.title, links: [] };
            masterMap.set(key, entry);
        }
        entry.latitude = item.lat;
        entry.longitude = item.lng;
        if (!entry.preco) entry.preco = item.price;
        if (!entry.subtitulo) entry.subtitulo = item.desc;
        if (!entry.imagem_url) entry.imagem_url = item.image;

        if (item.whatsapp) entry.links.push({ texto: 'WhatsApp', url: `https://wa.me/${item.whatsapp}` });
        if (item.link && item.link !== '#') entry.links.push({ texto: 'Site', url: item.link });
    });

    // 3. Processar Marketing (Botões extras)
    marketingData.forEach(item => {
        const key = normalize(item.nome);
        let entry = masterMap.get(key);
        if (!entry) {
            entry = { titulo: item.nome, links: [] };
            masterMap.set(key, entry);
        }
        if (item.botoes) {
            item.botoes.forEach(btn => {
                entry.links.push({ texto: btn.texto, url: btn.link });
            });
        }
    });

    // 4. Upload para Supabase
    const finalData = Array.from(masterMap.values());
    console.log(`Total de imóveis únicos encontrados: ${finalData.length}`);

    // Limpar tabela atual antes de migrar (opcional, mas bom para teste)
    // const { error: deleteError } = await supabase.from('imoveis').delete().neq('id', 0);

    for (const row of finalData) {
        // Verificar se já existe (upsert por título)
        const { data: existing } = await supabase.from('imoveis').select('id').eq('titulo', row.titulo).single();

        if (existing) {
            const { error: updateError } = await supabase.from('imoveis').update(row).eq('id', existing.id);
            if (updateError) console.error(`Erro ao atualizar ${row.titulo}:`, updateError.message);
            else console.log(`Atualizado: ${row.titulo}`);
        } else {
            const { error: insertError } = await supabase.from('imoveis').insert([row]);
            if (insertError) console.error(`Erro ao inserir ${row.titulo}:`, insertError.message);
            else console.log(`Inserido: ${row.titulo}`);
        }
    }

    console.log('--- Migração Concluída ---');
}

migrate();
