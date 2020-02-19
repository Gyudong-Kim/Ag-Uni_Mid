var db = require('./../config/db');
var moment = require('moment');

module.exports = {
    
    selectMainViewDataSet: async () => {
        let conn;
        let pool = db.pool;

        let mainViewDataSet = {
            status: { isSysOn: null, isAutoOn: null },
            exSensorData: { temp: null, humi: null, co2: null, insol: null },
            farmList: [],
        };

        try {
            conn = await pool.getConnection();

            const sysRows = await conn.query("SELECT sys_status, cmod_status, cultivation_id FROM system");
            mainViewDataSet.status.isSysOn = sysRows[0].sys_status;
            mainViewDataSet.status.isAutoOn = sysRows[0].cmod_status;
            console.info('1. ' + JSON.stringify(sysRows[0]));

            // TODO : DELETE
            if(sysRows[0].cultivation_id !== null) {
                console.info("nullnullnullnullnullnull");
                mainViewDataSet.exSensorData.temp = 30.7;
                mainViewDataSet.exSensorData.humi = 30.7;
                mainViewDataSet.exSensorData.co2 = 30.7;
                mainViewDataSet.exSensorData.insol = 30.7;
                // mainViewDataSet.farmList.push({ 
                //     farmId: 1,
                //     farmIdx: 1,
                //     farmName: "1번"
                // });
                // mainViewDataSet.farmList.push({ 
                //     farmId: 2,
                //     farmIdx: 2,
                //     farmName: "2번"
                // });
            }

            return mainViewDataSet;

        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    },


    selectHouseViewDataSet: async () => {
        let conn;
        let pool = db.pool;

        let houseViewDataSet = {
            cultivationId: null,
            isSysOn: null,
            isAutoOn: null,
            reserv: {ledReserv: {onceExecution: [],periodExecution: [] },oxygenReserv: {onceExecution: [],periodExecution: []}},
            exSensorData: {temp: {value: 32.7,status: true},humi: {value: 32.7,status: true},co2: {value: 32.7,status: true},insol: {value: 32.7,status: true}}
        };

        try {
            conn = await pool.getConnection();

            const sysRows = await conn.query("SELECT cultivation_id, sys_status, cmod_status FROM system");
            houseViewDataSet.cultivationId = sysRows[0].cultivation_id;
            houseViewDataSet.isSysOn = sysRows[0].sys_status;
            houseViewDataSet.isAutoOn = sysRows[0].cmod_status;

            const ledOnce = await conn.query(
                "SELECT led_reserv.reserv_id, quntty_of_light, start_datetime, end_datetime FROM led_reserv INNER JOIN led_normal_reserv ON led_reserv.reserv_id = led_normal_reserv.reserv_id");
            ledOnce.forEach(element => {
                houseViewDataSet.reserv.ledReserv.onceExecution.push({
                    reservId: element.reserv_id,
                    qunttyOfLight: element.quntty_of_light,
                    startDateTime: moment(element.start_datetime).tz('Asia/Seoul').format('YYYY-MM-DDTHH:mm:ss'),
                    endDateTime: moment(element.end_datetime).tz('Asia/Seoul').format('YYYY-MM-DDTHH:mm:ss')
                });  
            });
            
            const ledPeriod = await conn.query(
                "SELECT led_reserv.reserv_id, quntty_of_light, start_date, end_date, start_time, end_time FROM led_reserv INNER JOIN led_repeat_reserv ON led_reserv.reserv_id = led_repeat_reserv.reserv_id");
            ledPeriod.forEach(element => {
                houseViewDataSet.reserv.ledReserv.periodExecution.push({
                    reservId: element.reserv_id,
                    qunttyOfLight: element.quntty_of_light,
                    startDate: moment(element.start_date).tz('Asia/Seoul').format('YYYY-MM-DD'),
                    endDate: moment(element.end_date).tz('Asia/Seoul').format('YYYY-MM-DD'),
                    startTime: element.start_time,
                    endTime: element.end_time,
                });
            });

            const oxygenOnce = await conn.query(
                "SELECT air_reserv.reserv_id, start_datetime, end_datetime FROM air_reserv INNER JOIN air_normal_reserv ON air_reserv.reserv_id = air_normal_reserv.reserv_id");
            oxygenOnce.forEach(element => {
                houseViewDataSet.reserv.oxygenReserv.onceExecution.push({
                    reservId: element.reserv_id,
                    startDateTime: moment(element.start_datetime).tz('Asia/Seoul').format('YYYY-MM-DDTHH:mm:ss'),
                    endDateTime: moment(element.end_datetime).tz('Asia/Seoul').format('YYYY-MM-DDTHH:mm:ss')
                });  
            });

            const oxygenPeriod = await conn.query(
                "SELECT air_reserv.reserv_id, start_date, end_date, start_time, end_time FROM air_reserv INNER JOIN air_repeat_reserv ON air_reserv.reserv_id = air_repeat_reserv.reserv_id");
            oxygenPeriod.forEach(element => {
                houseViewDataSet.reserv.oxygenReservp.periodExecution.push({
                    reservId: element.reserv_id,
                    startDate: moment(element.start_date).tz('Asia/Seoul').format('YYYY-MM-DD'),
                    endDate: moment(element.end_date).tz('Asia/Seoul').format('YYYY-MM-DD'),
                    startTime: element.start_time,
                    endTime: element.end_time,
                });
            });

            return houseViewDataSet;

        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }
}