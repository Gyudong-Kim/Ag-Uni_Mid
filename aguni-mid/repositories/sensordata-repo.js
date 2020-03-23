var db = require('../config/db');

module.exports = {

    insertMultiTableSensorDataSet: async (sensorDataSet) => {
        let conn;
        let pool = db.pool;
        //console.info('insertMultiTableSensorDataSet -> ' + JSON.stringify(sensorDataSet.time));
        try {
            conn = await pool.getConnection();

            const rows = await conn.query("SELECT * from system");

            await conn.beginTransaction();

            await conn.query(
                "INSERT INTO sensor_data (time, mac) values (?, ?)",
                [
                    sensorDataSet.time, 
                    rows[0].mac
                ]
            );

   
            await conn.query(
                "INSERT INTO ex_sensor_data (time, co2, insol, temp, humi) values (?, ?, ?, ?, ?)",
                [
                    sensorDataSet.time, 
                    sensorDataSet.exSensorDataSet.co2, 
                    sensorDataSet.exSensorDataSet.insol, 
                    sensorDataSet.exSensorDataSet.temp, 
                    sensorDataSet.exSensorDataSet.humi
                ]
            );

            let farmSensorDataSetList = sensorDataSet.farmSensorDataSetList;
            farmSensorDataSetList.forEach( async (obj) => {
                await conn.query(
                    "INSERT INTO farm_sensor_data (time, farm_id, farm_layer, ec, ph, temp, humi, co2) values (?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        sensorDataSet.time, 
                        obj.farmId, 
                        obj.farmLayer,
                        obj.ec,
                        obj.ph,
                        obj.temp,
                        obj.humi,
                        obj.co2
                    ]    
                );
            });
            
            await conn.commit();

        } catch (error) {
            conn.rollback();
            console.error('Rollback : ' + error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    },
    
    
}