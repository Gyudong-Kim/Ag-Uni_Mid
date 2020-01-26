var db = require('./../config/db');

module.exports = {
    selectAll: async() => {
        let conn;
        let pool = db.pool;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("select * from test");
            //const res = await conn.query("select * from test");
            //const rows = await conn.query("insert into test value (?)", [10]); 
            //console.info('rows -> ' + Buffer.from(JSON.stringify(rows)));
            return rows;
        } catch (error) {
            console.error(error);
            throw error;           
        } finally {
            if(conn) conn.release();
        }
    }
}