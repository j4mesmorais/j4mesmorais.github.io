import supabase from './supabase-client.js';

/**
 * Script para listar quadras e lotes de um imóvel específico do Supabase
 */
async function listLotes(imovelId) {
    console.log(`\n--- Buscando implantação para o Imóvel ID: ${imovelId} ---`);

    try {
        const { data, error } = await supabase
            .from('implantacoes')
            .select('dados_json, imoveis(titulo)')
            .eq('imovel_id', imovelId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                console.log('Nenhuma implantação encontrada para este imóvel.');
            } else {
                throw error;
            }
            return;
        }

        const titulo = data.imoveis?.titulo || 'Imóvel Desconhecido';
        const lotes = data.dados_json;

        console.log(`Imóvel: ${titulo}`);
        console.log(`Total de Lotes: ${lotes.length}`);

        // Agrupar por Quadra
        const quadras = {};
        lotes.forEach(lote => {
            const q = lote.quadra;
            if (!quadras[q]) quadras[q] = [];
            quadras[q].push(lote);
        });

        // Mostrar resumo por quadra
        console.log('\n--- Resumo por Quadra ---');
        Object.keys(quadras).sort((a, b) => Number(a) - Number(b)).forEach(q => {
            const lista = quadras[q];
            const disp = lista.filter(l => l.status === 'disponivel').length;
            const res = lista.filter(l => l.status === 'reservado').length;
            const vend = lista.filter(l => l.status === 'vendido').length;

            console.log(`Quadra ${q.padStart(2, '0')}: ${lista.length.toString().padStart(2, ' ')} lotes [ ${disp} Livres, ${res} Reserv., ${vend} Vendidos ]`);
        });

        console.log('\nPara ver os detalhes de uma quadra específica, você pode editar este script ou abrir o site.');

    } catch (err) {
        console.error('Erro ao buscar dados:', err.message);
    }
}

// Execução
const imovelId = process.argv[2] || 3; // Padrão Quintas do Cerrado
listLotes(imovelId);
