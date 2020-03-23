var amqp = require('amqplib/callback_api')
var moment = require('moment');


const AMQP_URL = `amqp://temp:temp@192.168.0.4:5672` // home and lab
//const AMQP_URL = `amqp://temp:temp@203.250.32.29:5672` // lab

const CLOG_ROUTE = 'clog.route'
const CLOG_TOPIC = 'clog'

const SENSING_ROUTE = 'sensing.route'
const SENSING_TOPIC = 'sensing'


module.exports = {

    // 명령 수행 결과 메시지 Push
    codeExecutionResultSender: (json) => {
      
        json["excutResDetail"] = {
                time: moment().tz('Asia/Seoul').format('YYYY-MM-DDTHH:mm:ss'),              // 수행 시간 (milliseconds 단위 타임스탬프)
                mod: '0',                                // 수동 모드
                res: true                                // 수행 성공
        }
        
        console.log('execute - codeExecutionResultSender Function');
        console.log('json data -> ' + JSON.stringify(json));

        amqp.connect(AMQP_URL, (err, conn) => {
            if(err) {
                loggerFactory.error('AMQP connection is failed');
                return;            
            }
            conn.createChannel((err, ch) => {
                if(err){
                    loggerFactory.error('AMQP channel creation is failed');
                    return;
                }
                ch.publish(
                    CLOG_TOPIC, 
                    CLOG_ROUTE, 
                    Buffer.from(JSON.stringify(json)), 
                    {contentType: 'application/json'}
                )
            });
        })
    },
    
    // 센싱 데이터 Push
    sensorDataSetSender: (sensorDataSet) => {
        //console.info('sensorDataSetSender -> ' + JSON.stringify(sensorDataSet));

        amqp.connect(AMQP_URL, (err, conn) => {
            if(err) {
                loggerFactory.error('AMQP connection is failed');
                return;            
            }
            conn.createChannel((err, ch) => {
                if(err){
                    loggerFactory.error('AMQP channel creation is failed');
                    return;
                }
                ch.publish(
                    SENSING_TOPIC, 
                    SENSING_ROUTE, 
                    Buffer.from(JSON.stringify(sensorDataSet)), 
                    {contentType: 'application/json'}
                )
            });
        })        
    }
}