var express = require('express');
var router = express.Router();
var viewdataRepo = require('../repositories/viewdata-repo');
var resersvRepo = require('../repositories/reserve-repo');
var amqpService = require('../services/amqp-service');

router.get('/main', function (req, res, next) {
    viewdataRepo.selectHouseModuleDataSet()
        .then((houseModuleDataSet) => {

            setTimeout(() => {
                amqpService.houseModuleDataSetSenser(houseModuleDataSet);
                console.info('test => ' + JSON.stringify(houseModuleDataSet));
                console.info('main close');
            }, 8000);
            console.info('response')
            res.json(true);
        })
        .catch((err) => {
            console.error(err);
            res.json(false);
        })
});


router.get('/house', function (req, res, next) {
    viewdataRepo.selectHouseViewDataSet()
        .then((houseViewDataSet) => {
            console.info('test => ' + JSON.stringify(houseViewDataSet));
            res.json(houseViewDataSet);
        })
});

router.get('/reservs/:reservType', function (req, res, next) {
    if (req.params.reservType === `OXYGEN`) {
        resersvRepo.selectOxygenReservs()
            .then((reservs) => {
                console.info(`oxygen reservs => ${JSON.stringify(reservs)}`)
                res.json(reservs);
            })
    } else if (req.params.reservType === `LED`) {
        resersvRepo.selectLedReservs()
            .then((reservs) => {
                console.info(`led reservs => ${JSON.stringify(reservs)}`)
                res.json(reservs);
            })
    }
})

module.exports = router;
