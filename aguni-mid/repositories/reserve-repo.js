var db = require('../config/db');
var moment = require('moment');

module.exports = {

    deleteOxygenReservs: async (json) => {
        let conn;
        let pool = db.pool;

        console.info(`oxygen reservatin ids => ${JSON.stringify(json)}`);

        try {
            conn = await pool.getConnection();
            
            for (let id of json.paramsDetail.reservIds) { 
                console.info(id);
                await conn.query(
                    "DELETE FROM air_reserv WHERE reserv_id = (?)", id);    
            }

        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    },


    deleteLedReservs: async (json) => {
        let conn;
        let pool = db.pool;

        console.info(`led reservatin ids => ${JSON.stringify(json)}`);

        try {
            conn = await pool.getConnection();
            
            for (let id of json.paramsDetail.reservIds) { 
                console.info(id);
                await conn.query(
                    "DELETE FROM led_reserv WHERE reserv_id = (?)", id);    
            }

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

    selectOxygenReservs: async () => {
        let conn;
        let pool = db.pool;

        let oxygenReserv = {
            onceExecution: [],
            periodExecution: []
        }

        try {
            conn = await pool.getConnection();

            const oxygenOnce = await conn.query(
                "SELECT air_reserv.reserv_id, start_datetime, end_datetime FROM air_reserv INNER JOIN air_normal_reserv ON air_reserv.reserv_id = air_normal_reserv.reserv_id");
            oxygenOnce.forEach(element => {
                oxygenReserv.onceExecution.push({
                    reservId: element.reserv_id,
                    startDateTime: moment(element.start_datetime).tz('Asia/Seoul').format('YYYY-MM-DDTHH:mm:ss'),
                    endDateTime: moment(element.end_datetime).tz('Asia/Seoul').format('YYYY-MM-DDTHH:mm:ss')
                });  
            });

            const oxygenPeriod = await conn.query(
                "SELECT air_reserv.reserv_id, start_date, end_date, start_time, end_time FROM air_reserv INNER JOIN air_repeat_reserv ON air_reserv.reserv_id = air_repeat_reserv.reserv_id");
            oxygenPeriod.forEach(element => {
                oxygenReserv.periodExecution.push({
                    reservId: element.reserv_id,
                    startDate: moment(element.start_date).tz('Asia/Seoul').format('YYYY-MM-DD'),
                    endDate: moment(element.end_date).tz('Asia/Seoul').format('YYYY-MM-DD'),
                    startTime: element.start_time,
                    endTime: element.end_time,
                });
            });

            return oxygenReserv; // resolve         

        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    },

    selectLedReservs: async () => {
        let conn;
        let pool = db.pool;

        let ledReserv = {
            onceExecution: [],
            periodExecution: []
        }

        try {
            conn = await pool.getConnection();

            const ledOnce = await conn.query(
                "SELECT air_reserv.reserv_id, start_datetime, end_datetime FROM air_reserv INNER JOIN air_normal_reserv ON air_reserv.reserv_id = air_normal_reserv.reserv_id");
            ledOnce.forEach(element => {
                ledReserv.onceExecution.push({
                    reservId: element.reserv_id,
                    startDateTime: moment(element.start_datetime).tz('Asia/Seoul').format('YYYY-MM-DDTHH:mm:ss'),
                    endDateTime: moment(element.end_datetime).tz('Asia/Seoul').format('YYYY-MM-DDTHH:mm:ss')
                });  
            });

            const ledPeriod = await conn.query(
                "SELECT air_reserv.reserv_id, start_date, end_date, start_time, end_time FROM air_reserv INNER JOIN air_repeat_reserv ON air_reserv.reserv_id = air_repeat_reserv.reserv_id");
            ledPeriod.forEach(element => {
                ledReserv.periodExecution.push({
                    reservId: element.reserv_id,
                    startDate: moment(element.start_date).tz('Asia/Seoul').format('YYYY-MM-DD'),
                    endDate: moment(element.end_date).tz('Asia/Seoul').format('YYYY-MM-DD'),
                    startTime: element.start_time,
                    endTime: element.end_time,
                });
            });

            return ledReserv; // resolve         

        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    },
}