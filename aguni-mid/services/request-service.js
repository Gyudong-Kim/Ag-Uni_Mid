// const request = require('request');

// const MAIN_SERVER_URL = 'http://110.13.78.125:8083';
// const API_SERVER_URL = 'http://110.13.78.125:8084';

// const printError = (err) => {
//     if(err) {
//         console.error('error -> ' + err);
//     }
// }

// module.exports = {

//     postSensorDataSet: (dataSet) => {
//         // 2. 메인 서버로 전송
//         let options = {
//             uri: MAIN_SERVER_URL,
//             mothod: 'POST',
//             body: {
//                 dataSet
//             },
//             json: true
//         }
//         request.post(options, (err, httpResponse, body) => {
//             if(httpResponse.statusCode !== 201) {
//                 printError(err);
//                 reject(err);
//             } else {
//                 resolve(body);
//             }
//         });
//     }
// }