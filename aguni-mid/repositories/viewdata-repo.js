var db = require('./../config/db');
var moment = require('moment');

module.exports = {

    selectHouseModuleDataSet: async () => {
        let conn;
        let pool = db.pool;

        let houseModuleDataSet = {
            farmerId: null,
            houseId: null,
            cultivationId: null,
            status: { isSysOn: null, isAutoOn: null },
            exSensorData: { temp: null, humi: null, co2: null, insol: null },
            farmList: [],
        };

        try {
            conn = await pool.getConnection();

            const sysRows = await conn.query("SELECT sys_status, cmod_status, farmer_id, house_id, cultivation_id FROM system");
            houseModuleDataSet.farmerId = sysRows[0].farmer_id;
            houseModuleDataSet.houseId = sysRows[0].house_id;
            houseModuleDataSet.cultivationId = sysRows[0].cultivation_id;
            houseModuleDataSet.status.isSysOn = sysRows[0].sys_status;
            houseModuleDataSet.status.isAutoOn = sysRows[0].cmod_status;


            if (sysRows[0].cultivation_id !== null) {

                const exSensorDataRows = await conn.query("SELECT co2, insol, temp, humi FROM ex_sensor_data ORDER BY time DESC LIMIT 1");
                houseModuleDataSet.exSensorData.temp = exSensorDataRows[0].temp;
                houseModuleDataSet.exSensorData.humi = exSensorDataRows[0].humi;
                houseModuleDataSet.exSensorData.co2 = exSensorDataRows[0].co2;
                houseModuleDataSet.exSensorData.insol = exSensorDataRows[0].insol;


                const farmsRows = await conn.query("SELECT * FROM farm");
                if (farmsRows !== null) {
                    farmsRows.forEach(element => houseModuleDataSet.farmList.push({
                        farmId: element.farm_id,
                        farmIdx: element.farm_idx,
                        farmName: element.farm_name
                    }));
                }
            }

            return houseModuleDataSet;

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
            reserv: { ledReserv: { onceExecution: [], periodExecution: [] }, oxygenReserv: { onceExecution: [], periodExecution: [] } },
            //            exSensorData: {temp: {value: 32.7,status: true},humi: {value: 32.7,status: true},co2: {value: 32.7,status: true},insol: {value: 32.7,status: true}},
            exSensorData: { temp: null, humi: null, co2: null, insol: null },
            farmBoxInfoList: []
        };

        try {
            conn = await pool.getConnection();

            const sysRows = await conn.query("SELECT cultivation_id, sys_status, cmod_status FROM system");
            houseViewDataSet.cultivationId = sysRows[0].cultivation_id;
            houseViewDataSet.isSysOn = sysRows[0].sys_status;
            houseViewDataSet.isAutoOn = sysRows[0].cmod_status;

            const exSensorData = await conn.query("SELECT temp, humi, co2, insol FROM ex_sensor_data WHERE time >= DATE_ADD(now(), INTERVAL -1 MINUTE)")
            houseViewDataSet.exSensorData = exSensorData[0];

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
                houseViewDataSet.reserv.oxygenReserv.periodExecution.push({
                    reservId: element.reserv_id,
                    startDate: moment(element.start_date).tz('Asia/Seoul').format('YYYY-MM-DD'),
                    endDate: moment(element.end_date).tz('Asia/Seoul').format('YYYY-MM-DD'),
                    startTime: element.start_time,
                    endTime: element.end_time,
                });
            });

            const farmBoxInfo = await conn.query(
                "SELECT farm.farm_id, farm.farm_idx, farm.farm_name, AVG(temp) AS temp, AVG(humi) AS humi, AVG(co2) AS co2, AVG(ec) AS ec, AVG(ph) AS ph FROM farm INNER JOIN farm_sensor_data ON farm.farm_id = farm_sensor_data.farm_id WHERE farm_sensor_data.time >= DATE_ADD(now(), INTERVAL -1 MINUTE) GROUP BY farm_id")
            //"SELECT * FROM farm INNER JOIN farm_sensor_data ON farm.farm_id = farm_sensor_data.farm_id WHERE  farm_sensor_data.time >= DATE_ADD(now(), INTERVAL -1 MINUTE)");
            farmBoxInfo.forEach(element => {
                houseViewDataSet.farmBoxInfoList.push({
                    farmId: element.farm_id,
                    farmIdx: element.farm_idx,
                    farmName: element.farm_name,
                    inSensorData: {
                        temp: element.temp,
                        humi: element.humi,
                        co2: element.co2,
                        ec: element.ec,
                        ph: element.ph
                    }
                })
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