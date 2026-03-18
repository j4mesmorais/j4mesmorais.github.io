import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://uowelimfpijhjwjwqkyk.supabase.co';
const SUPABASE_KEY = 'sb_publishable_0bJhjtXlNL0-d5cT2c3J2A_7hbwC5Ox';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const testData = [
    {
        titulo: "QUINTAS DO CERRADO (Teste)",
        tipo: "Chacaras acima de 1000 m²",
        resumo: "Quatro lago de pesca",
        preco: "R$ a partir de 290.000,00",
        imagem: "img/QuintasCerrado.jpg"
    },
    {
        titulo: "ALTEZA DO LAGO (Teste)",
        tipo: "Terrenos de 500 m²",
        resumo: "GO 264 - Santo Antonio",
        preco: "R$ 270.000,00",
        imagem: "img/AltezaLago.png"
    }
];

async function seed() {
    console.log('Iniciando inclusão de dados de teste...');

    for (const item of testData) {
        const { data, error } = await supabase
            .from('imoveis')
            .insert([item])
            .select();

        if (error) {
            console.error(`Erro ao incluir "${item.titulo}":`, error.message);
        } else {
            console.log(`Sucesso: "${item.titulo}" incluído com ID: ${data[0].id}`);
        }
    }

    console.log('Processo concluído.');
}

seed();
