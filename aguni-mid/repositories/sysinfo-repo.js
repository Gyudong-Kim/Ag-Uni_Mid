var db = require('./../config/db');
var moment = require('moment');

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

    
    insert: async (json) => {
        let conn;
        let pool = db.pool;

        try {
            conn = await pool.getConnection();

            console.info('interlock try => ' + JSON.stringify(json));

            const params = [
                json.mac,
                json.farmerId,
                json.houseId,
                true            // interlock status
            ];

            await conn.query(
                "INSERT INTO system (mac, farmer_id, house_id, interlock_status) values (?, ?, ?, ?)", params);
                
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    },


    updateCultivation: async (json) => {
        let conn;
        let pool = db.pool;

        try {
            conn = await pool.getConnection();

            console.info('system table update for cultivation starting...');
            
            const params = [
                json.cultivationId,
                moment().tz('Asia/Seoul').format('YYYY-MM-DDTHH:mm:ss'),
                true
            ];

            await conn.query(
                `UPDATE system SET cultivation_id = ?, cultivation_start_date = ?, sys_status = ? WHERE farmer_id = ${json.farmerId}`, params);

        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }
}