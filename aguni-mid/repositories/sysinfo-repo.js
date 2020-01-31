var db = require('./../config/db');

module.exports = {
    
    select: async () => {
        let conn;
        let pool = db.pool;

        try {
            conn = await pool.getConnection();
            const rows = await conn.query("SELECT mac from system");
            console.info('rows -> ' + JSON.stringify(rows[0]));
            if(rows[0] === undefined) {
                return null; // resolve
            } else {
                return rows[0]; // resolve
            }
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    },

    insert: async (mac) => {
        let conn;
        let pool = db.pool;

        try {
            conn = await pool.getConnection();
            const params = [mac];
            await conn.query("INSERT INTO system (mac) values (?)", params);
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    },
}