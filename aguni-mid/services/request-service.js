const request = require('request');

const MAIN_SERVER_URL = 'http://1.251.103.64:8084';
const API_SERVER_URL = 'http://1.251.103.64:8083';


module.exports = {

    waitInterLock: (json) => {
        let options = {
            uri: API_SERVER_URL + '/api/mid/interlock/wait',
            method: 'POST',
            body: {
                externalIp: json.externalIp,
                mac: json.mac
            },
            json: true
        }

        request.post(options, (err, httpResponse, body) => {
            console.error(JSON.stringify(httpResponse))
            if (httpResponse.statusCode !== 201) {
                console.error("Hello Errors")
            } else {
                console.info('change waitable status');
            }
        })
    },


    startCultivation: (json) => {
        let options = {
            uri: MAIN_SERVER_URL + '/main/cultivation/start',
            method: 'POST',
            body: {
                farmerId: json.farmerId,
                houseId: json.houseId,
                cultivationId: json.cultivationId,
                cropId: json.cropId
            },
            json: true
        }

        return new Promise((resolve, reject) => {
            request.post(options, (err, httpResponse, body) => {
                if (httpResponse.statusCode !== 201) {
                    console.error(err);
                    reject(false);
                } else {
                    console.info('start cultivation');
                    console.info(JSON.stringify(body));
                    resolve(true);
                }
            })
        });
    }
}