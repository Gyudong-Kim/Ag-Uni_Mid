//var zigbeeService = require('./zigbee-service')
var reservRepo = require('./../repositories/reserve-repo');
var startupService = require('../services/startup-service');
const CronJob = require('cron').CronJob;

// for (output in reservList){
//     console.log("노드 값: "+JSON.stringify(output));
//     console.log('len : ' + reservList.length);
// }

const ledParentTableName = "led_reserv";
const airParentTableName = "air_reserv";

const reservList = [];


const reservDateTimeJob = (reservInfo, json, tableName) => {
    const newCronJob = new CronJob(new Date(reservInfo.startDateTime.replace('T', ' ')), function () {
        console.info('JOB START');

        const endDateTime = reservInfo.endDateTime.replace('T', ' ');
        const startDateTime = reservInfo.startDateTime.replace('T', ' ');

        json = {
            reservId: reservInfo.reservId,
            code: json.code,
            location: json.location,
            paramsDetail: json.paramsDetail,
            timeoutEvent: new Date(endDateTime).getTime() - new Date(startDateTime).getTime()
        };

        console.info('1. JOB Test -> (tableName) => ' + JSON.stringify(tableName));
        console.info('2. JOB Test -> (reservInfo) => ' + JSON.stringify(reservInfo));
        console.info('3. JOB Test -> (json) => ' + JSON.stringify(json));

        startupService.send(json);

        //reservRepo.deleteReserv(reservInfo.reservId, tableName);

	reservRepo.deleteOxygenReservs(reservInfo.reservId, tableName);	
	
        this.stop();
    }, function () {
        console.info('JOB STOP');
    }, true);

    reservList.push(newCronJob);
}

// '00 30 11 * * 1-5
const reservPeriodJob = (reservInfo, json, tableName) => {
    const startDateTime = new Date(reservInfo.startDate + ' ' + reservInfo.startTime);
    const endDateTime = new Date(reservInfo.endDate + ' ' + reservInfo.endTime);

    const month = (startDateTime.getMonth() === endDateTime.getMonth())
        ? startDateTime.getMonth() : `${startDateTime.getMonth()}-${endDateTime.getMonth()}`;
    const day = (startDateTime.getDate() === endDateTime.getDate())
        ? startDateTime.getDate() : `${startDateTime.getDate()}-${endDateTime.getDate()}`;

    console.info('statDay => ' + startDateTime.getDate());
    console.info('endDay  => ' + endDateTime.getDate());

    const cronStr
        = `${startDateTime.getSeconds()} ${startDateTime.getMinutes()} ${startDateTime.getHours()} ${day} ${month} *`;

    console.info("Cron String => " + cronStr);

    const newPeriodCronJob = new CronJob(cronStr, function () {
        console.info('JOB START');

        json = {
            reservId: reservInfo.reservId,
            code: json.code,
            location: json.location,
            paramsDetail: json.paramsDetail,
            timeoutEvent: startDateTime.getTime() - endDateTime.getTime()
        }

        startupService.send(json);

    }, function () {
        console.info('JOB STOP');
    }, true);

    reservList.push(newPeriodCronJob);
}


module.exports = {

    addOxygenReservation: (json) => {
        if (json.paramsDetail.isRepeatable) { // 기간 예약 로직
            // 기간 예약 로직
            reservRepo.insertPeriodOxygenReserv(json)
                .then((reservInfo) => {
                    reservPeriodJob(reservInfo, json, airParentTableName);
                })
                .catch((error) => {
                    console.info(error);
                })
        } else { // 1회 예약 로직
            reservRepo.insertOxygenReserv(json)
                .then((reservInfo) => {
                    reservDateTimeJob(reservInfo, json, airParentTableName); // create reservation job
                })
                .catch((error) => {
                    console.info(error);
                });
        }
    },


    addLedReservation: (json) => {
        if (json.paramsDetail.isRepeatable) { // 기간 예약 로직
            reservRepo.insertPeriodLedReserv(json)
                .then((reservInfo) => {
                    reservPeriodJob(reservInfo, json, ledParentTableName);
                })
                .catch((error) => {
                    console.info(error);
                })
        } else { // 1회 예약 로직
            reservRepo.insertLedReserv(json)
                .then((reservInfo) => {
                    reservDateTimeJob(reservInfo, json, ledParentTableName); // create reservation job
                })
                .catch((error) => {
                    console.info(error);
                })
        }
    },


    deleteOxygenReservations: (json) => {
        reservRepo.deleteOxygenReservs(json)
            .catch((error) => {
                console.error(error);
            })
    },


    deleteLedReservations: (json) => {
        reservRepo.deleteLedReservs(json)
            .catch((error) => {
                console.error(error);
            })
    },
}