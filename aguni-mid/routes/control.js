var express = require('express');
var router = express.Router();
var filterService = require('../services/filter-service');
var amqpService = require('../services/amqp-service');
var requestService = require('../services/request-service');
var sysinfoRepo = require('../repositories/sysinfo-repo')

router.post('/code', function(req, res, next) {

    console.info('서버에서 받은 JSON 데이터 : ' + JSON.stringify(req.body));

    try {
        filterService.filterAndExecute(req.body);

        // TODO : delete
        // A temporary alternative code to execute after receiving the opcode execution result from pcb using zigbee
        // this is async execution code after response message is sent to server app that requested to this app
        // res.on('finish', setTimeout(() => {
        //    amqpService.codeExecutionResultSender(req.body)
        // }, 10000));
        // 예약 기능 테스트 중이라 위 기능은 잠시 disable
        
        res.json({
            tId: req.body.tId,
            res: true
        });
    } catch (err) {
        res.json({
            tId: req.body.tId,
            res: false
        });
    }
});


router.post('/cultivation/start', function(req, res, next) {
    requestService.startCultivation(req.body)
        .then(() => {
            // cultivationId 값이 DB에 존재한다면 작기 진행중이라고 인지, 작기가 종료되면 cultivationId 값을 날려야 함
            sysinfoRepo.updateCultivation(req.body);
            res.json(true);
        })
        .catch(() => {
            res.json(false);
        })
});


module.exports = router;
                                               