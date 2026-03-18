import supabase from './supabase-client.js';
import fs from 'fs';
import path from 'path';

async function migrateImplantacao() {
    const propertyId = 3; // Quintas do Cerrado
    const jsonPath = path.resolve('d:/Users/j4mes/Documents/2025/Imobiliaria/catalogo/html/implantacao/json.json');

    console.log(`--- Migrando Implantação para o Imóvel ID: ${propertyId} ---`);

    try {
        // 1. Ler o arquivo JSON
        const rawContent = fs.readFileSync(jsonPath, 'utf8');
        const jsonData = JSON.parse(rawContent);

        console.log(`JSON lido com sucesso. Total de lotes: ${jsonData.length}`);

        // 2. Verificar se já existe registro para este imóvel
        const { data: existing } = await supabase
            .from('implantacoes')
            .select('id')
            .eq('imovel_id', propertyId)
            .single();

        if (existing) {
            console.log(`Atualizando registro existente (ID: ${existing.id})...`);
            const { error: updateError } = await supabase
                .from('implantacoes')
                .update({
                    dados_json: jsonData,
                    updated_at: new Date().toISOString()
                })
                .eq('id', existing.id);

            if (updateError) throw updateError;
            console.log('Atualização concluída!');
        } else {
            console.log('Inserindo novo registro...');
            const { error: insertError } = await supabase
                .from('implantacoes')
                .insert([{
                    imovel_id: propertyId,
                    dados_json: jsonData
                }]);

            if (insertError) throw insertError;
            console.log('Inserção concluída!');
        }

    } catch (err) {
        console.error('Erro na migração:', err.message);
    }

    console.log('--- Processo Finalizado ---');
}

migrateImplantacao();
