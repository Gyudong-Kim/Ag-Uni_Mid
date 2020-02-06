var express = require('express');
var router = express.Router();
var macaddress = require('macaddress');
var sysinfoRepo = require('./../repositories/sysinfo-repo')

router.get('/valid/:mac', function(req, res, next) {
    
    macaddress.one('eth0', (err, mac) => {
        if(err) {
            console.error('cannot search Eth0 MAC address');
            throw err;
        }

        if(req.params.mac === mac) { // validation
            res.json(true);
        } else {
            res.json(false);
        }
    });
});


router.post('/try/:mac', function(req, res, next) {

    macaddress.one('eth0', (err, mac) => {
        if(err) {
            console.error('cannot search Eth0 MAC address');
            throw err;
        }

        if(req.params.mac === mac) { // validation
            req.body.mac = mac;
            sysinfoRepo.insert(req.body);
            res.json(true);
        } else {
            throw res.json(false);
        }
    });
});


module.exports = router;