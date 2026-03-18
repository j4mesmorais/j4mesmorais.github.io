// Supabase client loaded asynchronously

/**
 * Generic CRUD object for Supabase operations
 */
const Db = {
    async getClient() {
        const { default: supabase } = await import('./supabase-client.js?v=' + Date.now());
        return supabase;
    },

    /**
     * List records from a table
     * @param {string} table 
     * @param {object} options { select: '*', order: { column: 'id', ascending: true } }
     */
    async list(table, options = {}) {
        const supabase = await this.getClient();
        const { select = '*', order = { column: 'id', ascending: true }, filters = {} } = options;
        let query = supabase
            .from(table)
            .select(select);

        // Apply filters
        Object.entries(filters).forEach(([column, value]) => {
            query = query.eq(column, value);
        });

        const { data, error } = await query
            .order(order.column, { ascending: order.ascending });

        if (error) {
            console.error(`Error listing ${table}:`, error);
            throw error;
        }
        return data;
    },

    /**
     * Insert a new record
     * @param {string} table 
     * @param {object} data 
     */
    async insert(table, data) {
        const supabase = await this.getClient();
        const { data: result, error } = await supabase
            .from(table)
            .insert([data])
            .select();

        if (error) {
            console.error(`Error inserting into ${table}:`, error);
            throw error;
        }
        return result[0];
    },

    /**
     * Update an existing record
     * @param {string} table 
     * @param {string|number} id 
     * @param {object} data 
     */
    async update(table, id, data) {
        const supabase = await this.getClient();
        const { data: result, error } = await supabase
            .from(table)
            .update(data)
            .eq('id', id)
            .select();

        if (error) {
            console.error(`Error updating ${table} (id: ${id}):`, error);
            throw error;
        }
        return result[0];
    },

    /**
     * Delete a record
     * @param {string} table 
     * @param {string|number} id 
     */
    async delete(table, id) {
        const supabase = await this.getClient();
        const { error } = await supabase
            .from(table)
            .delete()
            .eq('id', id);

        if (error) {
            console.error(`Error deleting from ${table} (id: ${id}):`, error);
            throw error;
        }
        return true;
    }
};

export default Db;
