import supabase from './supabase-client.js';

async function checkDuplicates() {
    console.log('--- Verificando registros de implantação ---');
    const { data, error } = await supabase
        .from('implantacoes')
        .select('id, imovel_id, updated_at');

    if (error) {
        console.error('Erro:', error.message);
        return;
    }

    console.table(data);
}

checkDuplicates();
