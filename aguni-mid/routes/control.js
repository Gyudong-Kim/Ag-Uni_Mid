var express = require('express');
var router = express.Router();
var filterService = require('../services/filter-service');
var amqpService = require('../services/amqp-service');

router.post('/code', function(req, res, next) {

    console.info('서버에서 받은 JSON 데이터 : ' + JSON.stringify(req.body));

    try {
        filterService.filterAndExecute(req.body);

        // TODO : delete
        // A temporary alternative code to execute after receiving the opcode execution result from pcb using zigbee
        // this is async execution code after response message is sent to server app that requested to this app
        //res.on('finish', setTimeout(() => {
        //    amqpService.codeExecutionResultSender(req.body)
        //}, 10000));
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

module.exports = router;
                                               