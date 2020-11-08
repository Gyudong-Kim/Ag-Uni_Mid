var amqp = require('amqplib/callback_api')
var moment = require('moment');

const AMQP_URL = "amqp://aguni:aguni@192.168.1.9:5672" // lab
//const AMQP_URL = "amqp://aguni:aguni@203.250.32.29:5672" // home

const CLOG_ROUTE = 'clog.route'
const CLOG_TOPIC = 'clog'

const SENSING_ROUTE = 'sensing.route'
const SENSING_TOPIC = 'sensing'

const HOUSE_MODULE_ROUTE = `house.route`
const HOUSE_MODULE_TOPIC = 'house'

module.exports = {

    // 명령 수행 결과 메시지 Push
    codeExecutionResultSender: (json) => {

        json["excutResDetail"] = {
            // time: moment().tz('Asia/Seoul').format('YYYY-MM-DDTHH:mm:ss'),              // 수행 시간 (milliseconds 단위 타임스탬프)
            // time: json.tId,              // 수행 시간 (milliseconds 단위 타임스탬프)
            time: "2020-06-16T13:32:32",              // 수행 시간 (milliseconds 단위 타임스탬프)
            mod: '0',                                // 수동 모드
            res: true                                // 수행 성공
        }

        console.log('execute - codeExecutionResultSender Function');
        console.log('json data -> ' + JSON.stringify(json));

        amqp.connect(AMQP_URL, (err, conn) => {
            if (err) {
                loggerFactory.error('AMQP connection is failed');
                return;
            }
            conn.createChannel((err, ch) => {
                if (err) {
                    loggerFactory.error('AMQP channel creation is failed');
                    return;
                }
                ch.publish(
                    CLOG_TOPIC,
                    CLOG_ROUTE,
                    Buffer.from(JSON.stringify(json)),
                    { contentType: 'application/json' }
                )
            });
        })
    },

    // 센싱 데이터 Push
    sensorDataSetSender: (sensorDataSet) => {
        //console.info('sensorDataSetSender -> ' + JSON.stringify(sensorDataSet));

        amqp.connect(AMQP_URL, (err, conn) => {
            if (err) {
                loggerFactory.error('AMQP connection is failed');
                return;
            }
            conn.createChannel((err, ch) => {
                if (err) {
                    loggerFactory.error('AMQP channel creation is failed');
                    return;
                }
                ch.publish(
                    SENSING_TOPIC,
                    SENSING_ROUTE,
                    Buffer.from(JSON.stringify(sensorDataSet)),
                    { contentType: 'application/json' }
                )
            });
        })
    },

    // 메인 뷰에 필요한 하우스 데이터 셋 Push
    houseModuleDataSetSenser: (houseModuleDataSet) => {
        amqp.connect(AMQP_URL, (err, conn) => {
            if (err) {
                loggerFactory.error('AMQP connection is failed');
                return;
            }
            conn.createChannel((err, ch) => {
                if (err) {
                    loggerFactory.error('AMQP channel creation is failed');
                    return;
                }
                console.info(JSON.stringify(houseModuleDataSet))
                ch.publish(
                    HOUSE_MODULE_TOPIC,
                    HOUSE_MODULE_ROUTE,
                    Buffer.from(JSON.stringify(houseModuleDataSet)),
                    { contentType: 'application/json' }
                )
            });
        })
    }
}