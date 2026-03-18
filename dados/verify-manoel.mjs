import supabase from './supabase-client.js';

async function verifyManoelPrada() {
    const propertyId = 14;
    console.log(`--- Verificando dados para Manoel Prada (ID: ${propertyId}) ---`);

    const { data, error } = await supabase
        .from('implantacoes')
        .select('*')
        .eq('imovel_id', propertyId);

    if (error) {
        console.error('Erro:', error.message);
        return;
    }

    if (data && data.length > 0) {
        console.log(`Registros encontrados: ${data.length}`);
        data.forEach((reg, index) => {
            console.log(`--- Registro ${index + 1} (ID: ${reg.id}) ---`);
            console.log(`Total de lotes: ${reg.dados_json?.length || 0}`);
            if (reg.dados_json && reg.dados_json.length > 0) {
                console.log('Exemplo do primeiro lote:');
                console.log(JSON.stringify(reg.dados_json[0], null, 2));
            }
        });
    } else {
        console.log('Nenhum dado encontrado para este ID.');
    }
}

verifyManoelPrada();
