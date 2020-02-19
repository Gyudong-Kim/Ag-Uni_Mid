var db = require('../config/db');

module.exports = {

    deleteReserv: async (reservId, tableName) => {
        let conn;
        let pool = db.pool;

        try {
            conn = await pool.getConnection();

            await conn.query(
                `DELETE FROM ${tableName} WHERE reserv_id = ?`, reservId);

        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    },


    insertLedReserv: async (json) => {
        let conn;
        let pool = db.pool;

        console.info('insertLedReserv -> ' + JSON.stringify(json));

        try {
            conn = await pool.getConnection();

            const rows = await conn.query("SELECT * from system");
            let mac = rows[0].mac;

            let params = [mac, json.paramsDetail.isRepeatable, json.paramsDetail.qunttyOfLight]
            let res = await conn.query(
                "INSERT INTO led_reserv (mac, is_repeat, quntty_of_light) values (?, ?, ?)", params);

            params = [res.insertId, json.paramsDetail.startDateTime, json.paramsDetail.endDateTime];
            await conn.query(
                "INSERT INTO led_normal_reserv (reserv_id, start_datetime, end_datetime) values (?, ?, ?)", params);
        
            let reservInfo = {
                reservId: res.insertId,
                qunttyOfLight: json.paramsDetail.qunttyOfLight,
                startDateTime: json.paramsDetail.startDateTime,
                endDateTime: json.paramsDetail.endDateTime
            };
            
            return reservInfo; // resolve 

        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    },


    insertOxygenReserv: async (json) => {
        let conn;
        let pool = db.pool;

        console.info('insertOxygenReserv -> ' + JSON.stringify(json));

        try {
            conn = await pool.getConnection();

            const rows = await conn.query("SELECT * from system");
            let mac = rows[0].mac;

            let params = [mac, json.paramsDetail.isRepeatable]
            let res = await conn.query(
                "INSERT INTO air_reserv (mac, is_repeat) values (?, ?)", params);

            params = [res.insertId, json.paramsDetail.startDateTime, json.paramsDetail.endDateTime];
            await conn.query(
                "INSERT INTO air_normal_reserv (reserv_id, start_datetime, end_datetime) values (?, ?, ?)", params);

            let reservInfo = {
                reservId: res.insertId,
                startDateTime: json.paramsDetail.startDateTime,
                endDateTime: json.paramsDetail.endDateTime
            };
            
            return reservInfo; // resolve         

        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    },


    insertPeriodLedReserv: async (json) => {
        let conn;
        let pool = db.pool;

        console.info('insertPeriodLedReserv -> ' + JSON.stringify(json));

        try {
            conn = await pool.getConnection();

            const rows = await conn.query("SELECT * from system");
            let mac = rows[0].mac;

            let params = [mac, json.paramsDetail.isRepeatable, json.paramsDetail.qunttyOfLight]
            let res = await conn.query(
                "INSERT INTO led_reserv (mac, is_repeat, quntty_of_light) values (?, ?, ?)", params);

            params = [res.insertId, json.paramsDetail.startDate, json.paramsDetail.endDate, json.paramsDetail.startTime, json.paramsDetail.endTime];
            await conn.query(
                "INSERT INTO led_repeat_reserv (reserv_id, start_date, end_date, start_time, end_time) values (?, ?, ?, ?, ?)", params);

            let reservInfo = {
                reservId: res.insertId,
                qunttyOfLight: json.paramsDetail.qunttyOfLight,
                startDate: json.paramsDetail.startDate,
                endDate: json.paramsDetail.endDate,
                startTime: json.paramsDetail.startTime,
                endTime: json.paramsDetail.endTime
            };
            
            return reservInfo; // resolve         

        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    },

    
    insertPeriodOxygenReserv: async (json) => {
        let conn;
        let pool = db.pool;

        console.info('insertPeriodOxygenReserv -> ' + JSON.stringify(json));

        try {
            conn = await pool.getConnection();

            const rows = await conn.query("SELECT * from system");
            let mac = rows[0].mac;

            let params = [mac, json.paramsDetail.isRepeatable]
            let res = await conn.query(
                "INSERT INTO air_reserv (mac, is_repeat) values (?, ?)", params);

            params = [res.insertId, json.paramsDetail.startDate, json.paramsDetail.endDate, json.paramsDetail.startTime, json.paramsDetail.endTime];
            await conn.query(
                "INSERT INTO air_repeat_reserv (reserv_id, start_date, end_date, start_time, end_time) values (?, ?, ?, ?, ?)", params);

            let reservInfo = {
                reservId: res.insertId,
                startDate: json.paramsDetail.startDate,
                endDate: json.paramsDetail.endDate,
                startTime: json.paramsDetail.startTime,
                endTime: json.paramsDetail.endTime
            };
            
            return reservInfo; // resolve         

        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    },
}