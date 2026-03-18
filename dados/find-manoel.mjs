import supabase from './supabase-client.js';

async function findManoelPrada() {
    console.log('--- Buscando Manoel Prada na tabela imoveis ---');
    const { data, error } = await supabase
        .from('imoveis')
        .select('id, titulo')
        .ilike('titulo', '%Manoel Prada%');

    if (error) {
        console.error('Erro:', error.message);
        return;
    }

    if (data && data.length > 0) {
        data.forEach(d => {
            console.log(`ID: ${d.id} | Titulo: ${d.titulo}`);
        });
    } else {
        console.log('Nenhum imóvel encontrado com o nome Manoel Prada.');
        // Listar todos para conferir o que o usuário quer
        const { data: all } = await supabase.from('imoveis').select('id, titulo');
        console.table(all);
    }
}

findManoelPrada();
