// Db asychronously loaded in methods

/**
 * Service for property (imóveis) data management
 */
const ImoveisService = {
    table: 'imoveis',

    async getDb() {
        const { default: Db } = await import('./crud.js?v=' + Date.now());
        return Db;
    },

    async getAll() {
        const Db = await this.getDb();
        return await Db.list(this.table);
    },

    async getFilter(filters) {
        console.log('ImoveisService.getFilter chamando com:', filters);
        const Db = await this.getDb();
        return await Db.list(this.table, { filters });
    },

    async add(imovelData) {
        const Db = await this.getDb();
        return await Db.insert(this.table, imovelData);
    },

    async update(id, imovelData) {
        const Db = await this.getDb();
        return await Db.update(this.table, id, imovelData);
    },

    async delete(id) {
        const Db = await this.getDb();
        return await Db.delete(this.table, id);
    }
};

export default ImoveisService;
