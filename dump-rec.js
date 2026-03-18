import ImoveisService from './dados/imoveis.js';

async function dumpFirstRecord() {
    console.log('--- DUMP DO PRIMEIRO REGISTRO ATIVO ---');
    try {
        const active = await ImoveisService.getFilter({ ativo: true });
        console.log(`\nAtivos retornados: ${active.length}`);

        if (active.length > 0) {
            console.log('\nEstrutura do primeiro registro:');
            console.log(JSON.stringify(active[0], null, 2));
        } else {
            console.log('Nenhum registro ativo encontrado com o filtro { ativo: true }');

            console.log('\nTentando listar TODOS para ver o que existe:');
            const all = await ImoveisService.getAll();
            if (all.length > 0) {
                console.log('Estrutura de um registro qualquer:');
                console.log(JSON.stringify(all[0], null, 2));
            }
        }

    } catch (error) {
        console.error('ERRO:', error);
    }
}

dumpFirstRecord();
