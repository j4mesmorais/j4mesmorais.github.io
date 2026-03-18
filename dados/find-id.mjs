import Db from './crud.js';

async function findQuintas() {
    try {
        const imoveis = await Db.list('imoveis');
        const quintas = imoveis.find(i => i.titulo.toUpperCase().includes('QUINTAS DO CERRADO'));
        if (quintas) {
            console.log(`ID do Quintas do Cerrado: ${quintas.id}`);
        } else {
            console.log('Quintas do Cerrado não encontrado.');
            console.table(imoveis.map(i => ({ id: i.id, titulo: i.titulo })));
        }
    } catch (err) {
        console.error(err.message);
    }
}

findQuintas();
