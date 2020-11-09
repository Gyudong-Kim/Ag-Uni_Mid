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
const port = new SerialPort('/dev/serial0', { baudRate: 9600 });

var temp = '';
var sensingData= '';
port.on('open', function () {
    console.log('start');
});

port.on('readable', function () {
    port.read();
})

port.on('data', function (data) {
    //temp += data;
    //console.log(temp.length);

    temp=data.toString(); // 패킷 저장
    console.log('packet ->' + temp);
    if(temp.lastIndexOf("#")!=-1){ // 마지막 패킷인지 판별
        sensingData+=temp.substring(0,temp.lastIndexOf("#")); // 마지막 패킷에서 끝 문자 # 제거 후 저장
	console.log('sensingData -> ' + sensingData);
        console.log('received!');
    }
    else{
        sensingData+=temp;//패킷을 누적시켜 원래 데이터 형태로 저장
    }
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
	    { port.write('#'); }
	    
	    setTimeout(function() {
		let sensorDataSet = {
		farmerId : 10,
		houseId : 17,
		cultivationId : 1,
		time : moment().tz('Asia/Seoul').format('YYYY-MM-DDTHH:mm:ss'),
		exSensorDataSet: {
                    insol: 10,
                    temp: 20,
                    humi: 10,
                    co2: 25
                },
                farmSensorDataSetList: [
                    {
                        farmId: 1,
                        farmLayer: 1,
                        ec: 10,
                        ph: 8,
                        temp: 22,
                        humi: 13,
                        co2: 30
                    }
	    ]};
	    
            sensordataRepo.insertMultiTableSensorDataSet(sensorDataSet);
            amqpService.sensorDataSetSender(sensorDataSet);
	    sensingData='';
            temp='';
	    }, 5000);
	});
        sensingJob.start();
    },

    send: (json) => {
        const jstr = JSON.stringify(json);
        const jstrlen = jstr.length;//(전체 길이)

        const packetlen = 63;//(최대 길이=63)
        const indexlen = 1;//인덱스 길이 값
        const datalen = 3;//전체 데이터 길이 값
        const separatorlen = 2;//구분자 데이터 길이 값
        const packetdatalen = packetlen-indexlen-datalen-separatorlen;//실제 데이터 길이

        const c = packetdatalen;//분할 길이
        const m = jstrlen%c;//나머지
        const v = (jstrlen-m)/c;//몫(인덱스)
	
	console.log("데이터 : "+jstr);
        console.log("길이 : "+jstrlen);
	
	switch (json.code) {
	    case 'C_M_005':
		var code = json.code;
		var aNutri = json.paramsDetail.aNutrientRatio;
		var bNutri = json.paramsDetail.bNutrientRatio;
		var water = json.paramsDetail.waterRatio;
		var total = json.paramsDetail.totalAmount;
		var aNutri_sec = (aNutri/(aNutri+bNutri+water)*total);
		var bNutri_sec = (bNutri/(aNutri+bNutri+water)*total);
		var water_sec = (water/(aNutri+bNutri+water)*total);
		var send = {"CODE" : code, "aNutri_sec" : aNutri_sec, "bNutri_sec" : bNutri_sec, "water_sec" : water_sec};
		port.write(JSON.stringify(send));
		console.log("Success");
		break;
	    case 'C_M_006' :
		var code = json.code;
		var send = {"CODE" : code}
		port.write(JSON.stringify(send));
		console.log("Success");
		break;
	    case 'C_M_007' :
		var code = json.code;
		var send = {"CODE" : code}
		port.write(JSON.stringify(send));
		console.log("Success");
		break;
	    case 'C_M_008':
		var code = json.code;
		var seconds = json.paramsDetail.waterSupplySeconds;
		var send = {"CODE" : code, "waterSupplySeconds" : seconds};
		port.write(JSON.stringify(send));
		console.log("Success");
		break;
	}

        /*for(var i=0; i<v; i++){
            var jsub = jstr.substr(i*c,c);
            port.write(jsub);
            console.log(i+" : "+jsub);
            if(i==v-1&&m>0){
                jsub = jstr.substr((i+1)*c,(i+1)*c-1+m);
                port.write(jsub);
                console.log((i+1)+" : "+jsub);
            }
        }*/
        // pcb 로 json 데이터 전송
        // pcb 에서도 code를 필터해서 적절한 동작을 하는 코드를 작성해야함
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
