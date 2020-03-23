var express = require('express');
var router = express.Router();
var viewdataRepo = require('../repositories/viewdata-repo');
var resersvRepo = require('../repositories/reserve-repo');


router.get('/main', function(req, res, next) {
    viewdataRepo.selectMainViewDataSet()
        .then((mainViewDataSet) => {
            console.info('test => ' + JSON.stringify(mainViewDataSet));
            console.info('main close');
            res.json(mainViewDataSet);
        })
});


router.get('/house', function(req, res, next) {
    viewdataRepo.selectHouseViewDataSet()
        .then((houseViewDataSet) => {
            console.info('test => ' + JSON.stringify(houseViewDataSet));
            res.json(houseViewDataSet);
        })
});

router.get('/reservs/:reservType', function(req, res, next) {
    if(req.params.reservType === `OXYGEN`) {
        resersvRepo.selectOxygenReservs()
            .then((reservs) => {
                console.info(`oxygen reservs => ${JSON.stringify(reservs)}`)
                res.json(reservs);
            })
    } else if(req.params.reservType === `LED`) {
        resersvRepo.selectLedReservs()
            .then((reservs) => {
                console.info(`led reservs => ${JSON.stringify(reservs)}`)
                res.json(reservs);
            })
    }
})

module.exports = router;
                                               