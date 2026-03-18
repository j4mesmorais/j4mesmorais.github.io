import supabase from './supabase-client.js';

async function listAllImplantacoes() {
    console.log('--- Listando TODOS os registros de Implantação ---');

    // Tentar buscar com o join para ver os títulos dos imóveis
    const { data, error } = await supabase
        .from('implantacoes')
        .select('id, imovel_id, updated_at, imoveis(titulo)');

    if (error) {
        console.error('Erro:', error.message);
        return;
    }

    if (data && data.length > 0) {
        data.forEach(d => {
            console.log(`ID: ${d.id} | ImovelID: ${d.imovel_id} | Titulo: ${d.imoveis?.titulo || 'N/A'} | Updated: ${d.updated_at}`);
        });
    } else {
        console.log('Nenhum registro encontrado na tabela implantacoes.');
    }
}

listAllImplantacoes();
