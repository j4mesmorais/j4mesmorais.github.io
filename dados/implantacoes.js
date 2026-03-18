import supabase from './supabase-client.js';
import Db from './crud.js';

/**
 * Service for lot implementation (implantações) data management
 */
const ImplantacoesService = {
    table: 'implantacoes',

    /**
     * Get implementation data for a specific property
     * @param {number|string} imovelId 
     */
    async getByImovelId(imovelId) {
        const { data, error } = await supabase
            .from(this.table)
            .select('dados_json')
            .eq('imovel_id', imovelId)
            .single();

        if (error) {
            console.error(`Error fetching implantacao for imovel ${imovelId}:`, error);
            return null;
        }

        return data.dados_json;
    }
};

export default ImplantacoesService;
