const CronJob = require('cron').CronJob;
var amqpService = require('./amqp-service');
var macaddress = require('macaddress');
var sysinfoRepo = require('./../repositories/sysinfo-repo');
var sensordataRepo = require('./../repositories/sensordata-repo');
var moment = require('moment');


module.exports = {
    start: () => {

        macaddress.one('eth0', (err, mac) => {
            if (err) {
                console.error('cannot search Eth0 MAC address');
                throw err;
            }

            sysinfoRepo.select()
                .then(res => {
                    if (res === null) {
                        console.log('store Eth0 MAC addr');
                        sysinfoRepo.insert(mac);
                    } else {
                        console.log('aleardy exist Eth0 MAC addr');
                    }
                });
        });

        const sensingJob = new CronJob('0 * * * * *', function () {

            // TODO : DELETE, 임의로 분 단위 데이터 셋 생성
            let sensorDataSet = {
                farmerId: 1,
                houseId: 5,
                cultivationId: 3,
                time: moment().tz('Asia/Seoul').format('YYYY-MM-DDTHH:mm:ss'),
                exSensorDataSet: {
                    insol: null,
                    temp: 20.2,
                    humi: 25.2,
                    co2: 30.2
                },
                farmSensorDataSetList: [
                    {
                        farmId: 1,
                        farmLayer: 1,
                        ec: null,
                        ph: 1.1,
                        temp: 1.1,
                        humi: 1.1,
                        co2: 1.1
                    },
                    {
                        farmId: 1,
                        farmLayer: 3,
                        ec: 3.1,
                        ph: 3.1,
                        temp: 3.1,
                        humi: 3.1,
                        co2: 3.1
                    },
                    {
                        farmId: 2,
                        farmLayer: 1,
                        ec: 1.2,
                        ph: 1.2,
                        temp: 1.2,
                        humi: 1.2,
                        co2: 1.2
                    },
                    {
                        farmId: 2,
                        farmLayer: 3,
                        ec: 3.2,
                        ph: 3.2,
                        temp: 3.2,
                        humi: 3.2,
                        co2: 3.2
                    }
                ]
            };

            sensordataRepo.insertMultiTableSensorDataSet(sensorDataSet);

            amqpService.sensorDataSetSender(sensorDataSet);
        })
        sensingJob.start();
    }
}