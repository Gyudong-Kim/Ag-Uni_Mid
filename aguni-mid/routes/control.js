var express = require('express');
var router = express.Router();
var filterService = require('../services/filter-service');
var amqpService = require('../services/amqp-service');
var requestService = require('../services/request-service');
var sysinfoRepo = require('../repositories/sysinfo-repo')
var constants = require('../common/constants');

router.post('/code', function (req, res, next) {

    console.info('서버에서 받은 JSON 데이터 : ' + JSON.stringify(req.body));

    try {
        filterService.filterAndExecute(req.body);

        let time = 10000;
        // let time = 100000; // for off test

        switch (req.body.code) {
            // 제어_관리기_공급 off (양액A + 양액B + 물)
            case constants.OP_CODE.C_M_006:
                console.log('양액');
                time = 30000;
                break;

            // 제어_관리기_공급 off (물)
            case constants.OP_CODE.C_M_007:
                console.log('물');
                time = 30000;
                break;

            case constants.OP_CODE.C_M_009:
                console.log('산소');
                time = 30000;
                break;
        }

        // TODO : delete
        // A temporary alternative code to execute after receiving the opcode execution result from pcb using zigbee
        // this is async execution code after response message is sent to server app that requested to this app
        res.on('finish', setTimeout(() => {
            amqpService.codeExecutionResultSender(req.body)
        }, time));
        // 예약 기능 테스트 중이라 위 기능은 잠시 disable

        res.json({
            res: true,
            tId: req.body.tId
        });

    } catch (err) {
        res.json({
            tId: req.body.tId,
            res: false
        });
    }
});


router.post('/cultivation/start', function (req, res, next) {
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
