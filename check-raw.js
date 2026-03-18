import ImoveisService from './dados/imoveis.js';

async function listAllDirectly() {
    console.log('--- LISTAGEM BRUTA DE IMOVEIS ---');
    try {
        const all = await ImoveisService.getAll();
        console.log(`\nTotal no banco: ${all.length}`);

        all.forEach(p => {
            console.log(`ID: ${p.id} | Titulo: ${p.titulo.padEnd(20)} | Ativo: ${p.ativo} (${typeof p.ativo})`);
        });

    } catch (error) {
        console.error('ERRO:', error);
    }
}

listAllDirectly();
