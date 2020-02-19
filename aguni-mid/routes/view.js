var express = require('express');
var router = express.Router();
var viewdataRepo = require('../repositories/viewdata-repo');


router.get('/main', function(req, res, next) {
    console.info('main call');
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


module.exports = router;
                                               