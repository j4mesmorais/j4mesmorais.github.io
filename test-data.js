import ImoveisService from './dados/imoveis.js';

async function testFilters() {
    console.log('--- TESTE DE FILTROS ---');

    try {
        console.log('\n1. Testando getAll()...');
        const all = await ImoveisService.getAll();
        console.log(`Total de imóveis encontrados: ${all.length}`);

        console.log('\n2. Testando getFilter({ ativo: true })...');
        const active = await ImoveisService.getFilter({ ativo: true });
        console.log(`Imóveis ativos encontrados: ${active.length}`);

        const countInactive = active.filter(p => p.ativo === false).length;
        if (countInactive > 0) {
            console.error('❌ ERRO: Encontrados imóveis inativos no filtro de ativos!');
        } else {
            console.log('✅ SUCESSO: Apenas imóveis ativos retornados.');
        }

        console.log('\n3. Amostra dos dados ativos:');
        active.slice(0, 2).forEach(p => {
            console.log(`- ID: ${p.id}, Titulo: ${p.titulo}, Ativo: ${p.ativo}`);
        });

    } catch (error) {
        console.error('❌ ERRO DURANTE O TESTE:', error);
    }
}

testFilters();
