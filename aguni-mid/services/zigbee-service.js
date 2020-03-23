
module.exports = {
    send: (json) => {
        //const jstr = JSON.stringify(json);
        //const jstrlen = jstr.length;//(전체 길이)

        /*
        const packetlen = 63;//(최대 길이=63)
        const indexlen = 1;//인덱스 길이 값
        const datalen = 3;//전체 데이터 길이 값
        const separatorlen = 2;//구분자 데이터 길이 값
        const packetdatalen = packetlen-indexlen-datalen-separatorlen;//실제 데이터 길이

        const c = packetdatalen;//분할 길이
        const m = jstrlen%c;//나머지
        const v = (jstrlen-m)/c;//몫(인덱스)
        */

        //console.log("데이터 : "+jstr);
        //console.log("길이 : "+jstrlen);
        //port.write(jstr);

        /*for(var i=0; i<v; i++){
            var jsub = jstr.substr(i*c,c);
            port.write(jsub);
            console.log(i+" : "+jsub);
            if(i==v-1&&m>0){
                jsub = jstr.substr((i+1)*c,(i+1)*c-1+m);
                port.write(jsub);
                console.log((i+1)+" : "+jsub);
            }
        }*/
        // pcb 로 json 데이터 전송
        // pcb 에서도 code를 필터해서 적절한 동작을 하는 코드를 작성해야함
    }
} 