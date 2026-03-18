import supabase from './supabase-client.js';

async function testConnection() {
    console.log('Testando conexão com Supabase...');
    try {
        const { data, error } = await supabase.from('imoveis').select('count', { count: 'exact', head: true });

        if (error) {
            if (error.code === '42P01') {
                console.error('ERRO: A tabela "imoveis" não existe. Use o arquivo setup.sql no dashboard.');
            } else {
                console.error('Erro na conexão:', error.message);
            }
            return;
        }

        console.log('Conexão estabelecida com sucesso!');
        console.log(`A tabela "imoveis" existe e contém dados.`);
    } catch (err) {
        console.error('Erro inesperado:', err.message);
    }
}

testConnection();
