//var zigbeeService = require('../services/zigbee-service');
var systemService = require('../services/system-service');
var judgeService = require('../services/judge-service');
var constants = require('../common/constants');
var reservService = require('../services/reserve-service');
var startupService = require('../services/startup-service');

module.exports = {
    filterAndExecute: (json) => {

        const OP_CODE = constants.OP_CODE;

        switch (json.code) {

            // 제어_시스템_ON
            case OP_CODE.C_S_001:
                judgeService.judgeCtrSysOn(json);
                systemService.turnSysState(json, true);
                break;

            // 제어_시스템_OFF
            case OP_CODE.C_S_002:
                judgeService.judgeCtrSysOff(json);
                systemService.turnSysState(json, false);
                break;

            // 제어_조명_ON
            case OP_CODE.C_L_001:
                judgeService.judgeCtrLedOn(json);
                startupService.send(json);
                break;

            // 제어_조명_OFF
            case OP_CODE.C_L_002:
                judgeService.judgeCtrLedOff(json);
                startupService.send(json);
                break;

            // 제어_단말기_자동
            case OP_CODE.C_T_003:
                judgeService.judgeCtrChAutoMod(json);
                systemService.turnCtrModState(json, true);
                break;

            // 제어_단말기_수동
            case OP_CODE.C_T_004:
                judgeService.judgeCtrChNotAutoMod(json);
                systemService.turnCtrModState(json, false);
                break;

            // 제어_관리기_배합 및 공급 (양액A + 양액B + 물)
            case OP_CODE.C_M_005:
                judgeService.judgeCtrCombinationAndNutrientSupply(json);
                startupService.send(json);
                break;

            // 추가
            // 제어_관리기_공급 off (양액A + 양액B + 물)
            case OP_CODE.C_M_006:
                judgeService.judgeCtrWaterSupply(json);
                startupService.send(json);
                break;

            // 추가
            // 제어_관리기_공급 off (물)
            case OP_CODE.C_M_007:
                judgeService.judgeCtrWaterSupply(json);
                startupService.send(json);
                break;

            // 제어_관리기_공급 (물)
            case OP_CODE.C_M_008:
                judgeService.judgeCtrWaterSupply(json);
                startupService.send(json);
                break;

            // 제어_관리기_산소 공급 ON
            case OP_CODE.C_M_009:
                judgeService.judgeCtrAirSupply(json);
                startupService.send(json);
                break;

            // 제어_관리기_산소 공급 OFF
            case OP_CODE.C_M_010:
                judgeService.judgeCtrStopAirSupply(json);
                startupService.send(json);
                break;

            // 예약_조명_ON
            case OP_CODE.R_L_001:
                //judgeService.judgeReservLenOn(json);
                reservService.addLedReservation(json);
                break;

            // 예약_관리기_산소 공급 ON
            case OP_CODE.R_M_009:
                //judgeService.judgeReservAirSupply(json);
                reservService.addOxygenReservation(json);
                break;

            // 예약_조명_특정 조명 예약 취소
            case OP_CODE.R_L_200:
                reservService.deleteLedReservations(json);
                //judgeService.judgeReservCancleLed(json);
                //startupService.send(json);
                break;

            // 예약_관리기_특정 산소 예약 취소
            case OP_CODE.R_M_100:
                reservService.deleteOxygenReservations(json);
                //judgeService.judgeReservCancleAir(json);
                //startupService.send(json);
                break;

            default:
                console.error(
                    'exist no implement case about opcode in filterAndExecute function on filter-service.js file');
                break;
        }
    }
}