import Db from './crud.js';

async function showImoveis() {
    console.log('--- Listagem de Imóveis no Supabase ---');
    try {
        const imoveis = await Db.list('imoveis');

        if (imoveis.length === 0) {
            console.log('Nenhum imóvel encontrado na tabela.');
        } else {
            console.table(imoveis.map(i => ({
                ID: i.id,
                Título: i.titulo,
                Preço: i.preco,
                Tipo: i.tipo
            })));
        }
    } catch (err) {
        console.error('Erro ao buscar dados:', err.message);
    }
}

showImoveis();
