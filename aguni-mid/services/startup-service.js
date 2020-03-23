const CronJob = require('cron').CronJob;
var amqpService = require('./amqp-service');
var macaddress = require('macaddress');
var sysinfoRepo = require('./../repositories/sysinfo-repo');
var sensordataRepo = require('./../repositories/sensordata-repo');
var moment = require('moment');
var publicIp = require('public-ip');
var natUpnp = require('nat-upnp');
var requestService = require('./request-service');

const SerialPort = require('serialport');
const port = new SerialPort('/dev/ttyS0',{baudRate:9600});

var temp='';
port.on('open', function(){
	console.log('start');
});

port.on('readable', function () {
    console.log('Data1:', port.read());
})

port.on('data', function(data){
    temp+=data;
    console.log(temp.length);
});

module.exports = {
    start: async () => {
        
        macaddress.one('eth0', (err, mac) => {
            if (err) {
                console.error('cannot search Eth0 MAC address');
                throw err;
            }

            sysinfoRepo.selectMac()
                .then(res => {
                    if (res === null) {
                        console.log('no exist Eth0 MAC addr');
                        publicIp.v4().then(externalIp => {
                            requestService.waitInterLock({
                                externalIp: externalIp,
                                mac: mac
                            });
                        })
                    } 
                    else {
                        console.log('aleardy exist Eth0 MAC addr');
                    }
                });
        });

        const sensingJob = new CronJob('0 * * * * *', function () {

            // TODO : DELETE, 임의로 분 단위 데이터 셋 생성
            let sensorDataSet = {
                farmerId: 1,
                houseId: 52,
                cultivationId: 1,
                time: moment().tz('Asia/Seoul').format('YYYY-MM-DDTHH:mm:ss'),
                exSensorDataSet: {
                    insol: Math.floor(Math.random() * 70),
                    temp: Math.floor(Math.random() * 201) -100,
                    humi: Math.floor(Math.random() * 201) -100,
                    co2: Math.floor(Math.random() * 201) -100
                },
                farmSensorDataSetList: [
                    {
                        farmId: 1,
                        farmLayer: 1,
                        ec: Math.floor(Math.random() * 30) -10,
                        ph: Math.floor(Math.random() * 30) -10,
                        temp: Math.floor(Math.random() * 30) -10,
                        humi: Math.floor(Math.random() * 30) -10,
                        co2: Math.floor(Math.random() * 30) -10
                    },
                    {
                        farmId: 1,
                        farmLayer: 3,
                        ec: Math.floor(Math.random() * 30) -10,
                        ph: Math.floor(Math.random() * 30) -10,
                        temp: Math.floor(Math.random() * 30) -10,
                        humi: Math.floor(Math.random() * 30) -10,
                        co2: Math.floor(Math.random() * 30) -10
                    },
                    {
                        farmId: 2,
                        farmLayer: 1,
                        ec: Math.floor(Math.random() * 30) -10,
                        ph: Math.floor(Math.random() * 30) -10,
                        temp: Math.floor(Math.random() * 30) -10,
                        humi: Math.floor(Math.random() * 30) -10,
                        co2: Math.floor(Math.random() * 30) -10
                    },
                    {
                        farmId: 2,
                        farmLayer: 3,
                        ec: Math.floor(Math.random() * 30) -10,
                        ph: Math.floor(Math.random() * 30) -10,
                        temp: Math.floor(Math.random() * 30) -10,
                        humi: Math.floor(Math.random() * 30) -10,
                        co2: Math.floor(Math.random() * 30) -10
                    },
                    {
                        farmId: 3,
                        farmLayer: 1,
                        ec: Math.floor(Math.random() * 30) -10,
                        ph: Math.floor(Math.random() * 30) -10,
                        temp: Math.floor(Math.random() * 30) -10,
                        humi: Math.floor(Math.random() * 30) -10,
                        co2: Math.floor(Math.random() * 30) -10
                    },
                    {
                        farmId: 3,
                        farmLayer: 3,
                        ec: Math.floor(Math.random() * 30) -10,
                        ph: Math.floor(Math.random() * 30) -10,
                        temp: Math.floor(Math.random() * 30) -10,
                        humi: Math.floor(Math.random() * 30) -10,
                        co2: Math.floor(Math.random() * 30) -10
                    },
                    {
                        farmId: 4,
                        farmLayer: 1,
                        ec: Math.floor(Math.random() * 30) -10,
                        ph: Math.floor(Math.random() * 30) -10,
                        temp: Math.floor(Math.random() * 30) -10,
                        humi: Math.floor(Math.random() * 30) -10,
                        co2: Math.floor(Math.random() * 30) -10
                    },
                    {
                        farmId: 4,
                        farmLayer: 3,
                        ec: Math.floor(Math.random() * 30) -10,
                        ph: Math.floor(Math.random() * 30) -10,
                        temp: Math.floor(Math.random() * 30) -10,
                        humi: Math.floor(Math.random() * 30) -10,
                        co2: Math.floor(Math.random() * 30) -10
                    },
                    {
                        farmId: 5,
                        farmLayer: 1,
                        ec: Math.floor(Math.random() * 30) -10,
                        ph: Math.floor(Math.random() * 30) -10,
                        temp: Math.floor(Math.random() * 30) -10,
                        humi: Math.floor(Math.random() * 30) -10,
                        co2: Math.floor(Math.random() * 30) -10
                    },
                    {
                        farmId: 5,
                        farmLayer: 3,
                        ec: Math.floor(Math.random() * 30) -10,
                        ph: Math.floor(Math.random() * 30) -10,
                        temp: Math.floor(Math.random() * 30) -10,
                        humi: Math.floor(Math.random() * 30) -10,
                        co2: Math.floor(Math.random() * 30) -10
                    },
                    {
                        farmId: 6,
                        farmLayer: 1,
                        ec: Math.floor(Math.random() * 30) -10,
                        ph: Math.floor(Math.random() * 30) -10,
                        temp: Math.floor(Math.random() * 30) -10,
                        humi: Math.floor(Math.random() * 30) -10,
                        co2: Math.floor(Math.random() * 30) -10
                    },
                    {
                        farmId: 6,
                        farmLayer: 3,
                        ec: Math.floor(Math.random() * 30) -10,
                        ph: Math.floor(Math.random() * 30) -10,
                        temp: Math.floor(Math.random() * 30) -10,
                        humi: Math.floor(Math.random() * 30) -10,
                        co2: Math.floor(Math.random() * 30) -10
                    },
                    {
                        farmId: 7,
                        farmLayer: 1,
                        ec: Math.floor(Math.random() * 30) -10,
                        ph: Math.floor(Math.random() * 30) -10,
                        temp: Math.floor(Math.random() * 30) -10,
                        humi: Math.floor(Math.random() * 30) -10,
                        co2: Math.floor(Math.random() * 30) -10
                    },
                    {
                        farmId: 7,
                        farmLayer: 3,
                        ec: Math.floor(Math.random() * 30) -10,
                        ph: Math.floor(Math.random() * 30) -10,
                        temp: Math.floor(Math.random() * 30) -10,
                        humi: Math.floor(Math.random() * 30) -10,
                        co2: Math.floor(Math.random() * 30) -10
                    },
                    {
                        farmId: 8,
                        farmLayer: 1,
                        ec: Math.floor(Math.random() * 30) -10,
                        ph: Math.floor(Math.random() * 30) -10,
                        temp: Math.floor(Math.random() * 30) -10,
                        humi: Math.floor(Math.random() * 30) -10,
                        co2: Math.floor(Math.random() * 30) -10
                    },
                    {
                        farmId: 8,
                        farmLayer: 3,
                        ec: Math.floor(Math.random() * 30) -10,
                        ph: Math.floor(Math.random() * 30) -10,
                        temp: Math.floor(Math.random() * 30) -10,
                        humi: Math.floor(Math.random() * 30) -10,
                        co2: Math.floor(Math.random() * 30) -10
                    },
                    {
                        farmId: 9,
                        farmLayer: 1,
                        ec: Math.floor(Math.random() * 30) -10,
                        ph: Math.floor(Math.random() * 30) -10,
                        temp: Math.floor(Math.random() * 30) -10,
                        humi: Math.floor(Math.random() * 30) -10,
                        co2: Math.floor(Math.random() * 30) -10
                    },
                    {
                        farmId: 9,
                        farmLayer: 3,
                        ec: Math.floor(Math.random() * 30) -10,
                        ph: Math.floor(Math.random() * 30) -10,
                        temp: Math.floor(Math.random() * 30) -10,
                        humi: Math.floor(Math.random() * 30) -10,
                        co2: Math.floor(Math.random() * 30) -10
                    },
                    {
                        farmId: 10,
                        farmLayer: 1,
                        ec: Math.floor(Math.random() * 30) -10,
                        ph: Math.floor(Math.random() * 30) -10,
                        temp: Math.floor(Math.random() * 30) -10,
                        humi: Math.floor(Math.random() * 30) -10,
                        co2: Math.floor(Math.random() * 30) -10
                    },
                    {
                        farmId: 10,
                        farmLayer: 3,
                        ec: Math.floor(Math.random() * 30) -10,
                        ph: Math.floor(Math.random() * 30) -10,
                        temp: Math.floor(Math.random() * 30) -10,
                        humi: Math.floor(Math.random() * 30) -10,
                        co2: Math.floor(Math.random() * 30) -10
                    }
                ]
            };

            sensordataRepo.insertMultiTableSensorDataSet(sensorDataSet);

            amqpService.sensorDataSetSender(sensorDataSet);
        })
        sensingJob.start();
    }
}

// const externalIp = await publicIp.v4();
        // console.info(externalIp);
        
        // var client = natUpnp.createClient();


        //   client.portUnmapping({
        //       public: 54444
        //   });

        // client.portMapping({
        //     public: 54444,
        //     private: 3000,
        //     ttl: 0
        // }, function(err) {
        //     console.log(err)
        //     if (!err) console.info('upnp port mapping successed');
        //     else      console.info('upnp port mapping failed');
        // })
        
        // client.getMappings({ local: true }, function(err, results) {
        //     console.info(JSON.stringify(results));
        // });