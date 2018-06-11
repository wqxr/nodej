'use strict'
const webSocketServer = require('websocket').server;
const WebSocketClient = require('websocket').client;
const http= require('http');
const uuidv1 = require('uuid/v1');
const logger = require('../nodeApp/service/logger.js');
//let readData = require('./excleTest.js');
let connection = null;
function socketServer(){
    let server  =http.createServer( function(request , response){
        console.log( (new Date())+' Received request for '+request.url);
        response.writeHead(404);
        response.end();
    })
    server.listen(8003, function(){
        console.log( (new Date())+ ' server is listen on port 8000');
    });
    let wsServer = new webSocketServer({
        httpServer :server,
        autoAcceptConnections:false
    });
    function originIsAllowed(origin){
        return true;
    }
    wsServer.on('request',function(request){
        if(!originIsAllowed(request.origin)){
            request.reject();
            console.log((new Date())+' Connection from origin' +request.origin+' rejected. ');
            return ;
        }
        var connection = request.accept(null, request.origin);
        console.log((new Date()) + ' Connection accepted.');
        //mockDataCase1(connection);
        //mockDataCase2(connection);
        //mockDataCase3(connection);
        //mockDataCase4(connection);
        //mockDataCase5(connection);
        //mockDataCase6(connection)
        // reportTest(connection);
        // mockDataCase8(connection)
        mockDataCase9(connection);

        connection.on('close', function(reasonCode, description) {
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        }); 
        connection.on('message', async function (message) {
            if (message.type === 'utf8' || message.type === 'utf-8') {
                let receivedData = JSON.parse(message.utf8Data);
                //console.log(message.utf8Data);
                if (receivedData.data.resultCode && receivedData.data.resultCode === -1) {
                    //console.log("异常,"+receivedData.msgType);
                    process.exit(-1);
                    return;
                }
            }
        });
    });
}
module.exports={
    socketServer:socketServer
}
const msgTemplate = {
    "msgType": "",
    "version": "v1.0.0",
    "timestamp": null,
    "data": null,
    "msgId": null
}
function awaitTime(time){
    time = time > 0 ? time*1000 : 300;
    return new Promise(function(resolve,reject){
        setTimeout(function() {
            resolve();
        }, time );
    });
}
async function mockDataCase5(connection){
    await awaitTime(5);
    for(let i=0;i<8;i++){
       // outmaterial(connection);
    }   
}
async function mockDataCase6(connection){
    await awaitTime(7);
    for(let i=0;i<1;i++){
       workingDetail(connection);
    }   
}
async function mockDataCase7(connection){
    await awaitTime(8);
    for(let i=0;i<1;i++){
        assembling(connection);
    }
}
async function mockDataCase8(connection){
    await awaitTime(4);
    for(let i=0;i<1;i++){
        assemb(connection);
    }
    
}
async function mockDataCase9(connection) {
    await awaitTime(15);
    
    for(let i=0;i<1;i++){
        headerinfo(connection);
    }
   

}
async function sendlog(connection){
    let message=Object.assign({},msgTemplate);
    message.msgType="scanResult";
    message.msgId=uuidv1();
    message.timestamp=Date.now();
    message.data = {
       "PCBSN":"",
    }
    connection.sendUTF(JSON.stringify(message));
}
async function readimg(connection){
    let message=Object.assign({},msgTemplate);
    message.msgType="assembImage";
    message.msgId=uuidv1();
    message.timestamp=Date.now();
    message.data = {
        "SN":"FPW80352QFRJNK41G",
        "times":1,
    }
    connection.sendUTF(JSON.stringify(message));
   //y
    await awaitTime(5);
    message.msgType="assembImage";
    message.msgId=uuidv1();
    message.timestamp=Date.now();
    message.data = {
        "SN":"FPW80352QFRJNK41G",
        "times":2,
    }
    connection.sendUTF(JSON.stringify(message));
}
function workingDetail(connection){
    let message=Object.assign({},msgTemplate);
    message.msgType="workingDetail";
    message.msgId=uuidv1();
    message.timestamp=Date.now();
    message.data = 
        [{
            "contory": "Swiss",
            "model": "x86",
            "area": "asian1",
            "color":"White",
            "EEEE":"HWBC",
            "config":"ISO"
        }, {
            "contory": "German",
            "model": "x369a",
            "area": "asian2",
            "color":"Sparrow",
            "EEEE":"HWBC",
            "config":"ISO"

         }
    ]
    
    connection.sendUTF(JSON.stringify(message));

}
function userlogin(connection){
    let message=Object.assign({},msgTemplate);
    message.msgType="loginresult";
    message.msgId=uuidv1();
    message.timestamp=Date.now();
    message.data={
      "resultcode":1
    }
    connection.sendUTF(JSON.stringify(message));
}
async function headerinfo(connection){
    let message=Object.assign({},msgTemplate);
    message.msgType="finishResult";
    message.msgId=uuidv1();
    message.timestamp=Date.now();
    message.data={
        "code":1,
        "SN":"FPW81613PMPK0RF1G",
    }
    connection.sendUTF(JSON.stringify(message));
    await awaitTime(5);
    message.msgType="finishResult";
    message.msgId=uuidv1();
    message.timestamp=Date.now();
    message.data={
        "code":0,
        "SN":"FPW81613PK1K0RF1A",
    }
    connection.sendUTF(JSON.stringify(message));
    await awaitTime(5);
    message.msgType="finishResult";
    message.msgId=uuidv1();
    message.timestamp=Date.now();
    message.data={
        "code":1,
        "SN":"FPW81613PV9K0RF16",
    }
    connection.sendUTF(JSON.stringify(message));
    // await awaitTime(20);
    // message.msgType="machineTime";
    // message.msgId=uuidv1();
    // message.timestamp=Date.now();
    // message.data={
    //     "product":"dgdsfg",//xue
    //     "cm":"WISTRON",
    //     "cm_line":"dgd",
    //     "machine_number":"dgd",
    //     "manufacturer":"FP",
    //     "time_local":"",
    //     "total_time":"3600",
    //     "scheduled_time":"3600",
    //     "unscheduled_downtime":"",
    //     "scheduled_downtime":"",
    //     "engineering_time":"",
    //     "idle_time":"",
    //     "production_time":"30",//生产时间 xue
    //     "unit_count":0,
    //     "pass_count":0,
    //     "pass_cycle_time":"",
    //     "fail_cycle_time":"",
    //     "planned_cycle_time":"",//计划ct
    //     "Date":"",
    //     "Hour":"",
    // }
    // connection.sendUTF(JSON.stringify(message));
}
 async function outmaterial(connection){
    let message=Object.assign({},msgTemplate);
    message.msgType="outmaterial";
    message.msgId=uuidv1();
    message.timestamp=Date.now();
    message.data={
        "code":"A",
        "PCBSN":"453454",
    }
    connection.sendUTF(JSON.stringify(message));
}
async function checkin(connection){
    let message=Object.assign({},msgTemplate);
    message.msgType="checkinfoResult";
    message.msgId=uuidv1();
    message.timestamp=Date.now();
    message.data={
        "SN":"3245345", 
        "checkinfoXinfo":0.001,
        "checkinfoYinfo":0.001,
        "checkinfoAngleinfo":0.002,

    }
    connection.sendUTF(JSON.stringify(message));
    await awaitTime(3);
    message.msgType="checkinfoResult";
    message.msgId=uuidv1();
    message.timestamp=Date.now();
    message.data={
        "SN":"3245345", 
        "checkinfoXinfo":-0.001,
        "checkinfoYinfo":-0.005,
        "checkinfoAngleinfo":-0.002,

    }
    connection.sendUTF(JSON.stringify(message));
    await awaitTime(3);
    message.msgType="checkinfoResult";
    message.msgId=uuidv1();
    message.timestamp=Date.now();
    message.data={
        "SN":"3245345", 
        "checkinfoXinfo":-0.0025,
        "checkinfoYinfo":-0.01,
        "checkinfoAngleinfo":-0.002,

    }
    connection.sendUTF(JSON.stringify(message));
    await awaitTime(3);
    message.msgType="checkinfoResult";
    message.msgId=uuidv1();
    message.timestamp=Date.now();
    message.data={
        "SN":"3245345", 
        "checkinfoXinfo":0.002,
        "checkinfoYinfo":-0.035,
        "checkinfoAngleinfo":0.004,

    }
    connection.sendUTF(JSON.stringify(message));
    await awaitTime(3);
    message.msgType="checkinfoResult";
    message.msgId=uuidv1();
    message.timestamp=Date.now();
    message.data={
        "SN":"3245345", 
        "checkinfoXinfo":-0.001,
        "checkinfoYinfo":0.015,
        "checkinfoAngleinfo":-0.004,

    }
    connection.sendUTF(JSON.stringify(message));
    await awaitTime(3);
    message.msgType="checkinfoResult";
    message.msgId=uuidv1();
    message.timestamp=Date.now();
    message.data={
        "SN":"3245345", 
        "checkinfoXinfo":-0.001,
        "checkinfoYinfo":0.001,
        "checkinfoAngleinfo":-0.004,

    }
    connection.sendUTF(JSON.stringify(message));
    await awaitTime(3);
    message.msgType="checkinfoResult";
    message.msgId=uuidv1();
    message.timestamp=Date.now();
    message.data={
        "SN":"3245345", 
        "checkinfoXinfo":-0.001,
        "checkinfoYinfo":-0.002,
        "checkinfoAngleinfo":-0.004,

    }
    connection.sendUTF(JSON.stringify(message));
    await awaitTime(3);
    message.msgType="checkinfoResult";
    message.msgId=uuidv1();
    message.timestamp=Date.now();
    message.data={
        "SN":"3245345", 
        "checkinfoXinfo":-0.001,
        "checkinfoYinfo":-0.003,
        "checkinfoAngleinfo":-0.004,

    }
    connection.sendUTF(JSON.stringify(message));
    await awaitTime(3);
    message.msgType="checkinfoResult";
    message.msgId=uuidv1();
    message.timestamp=Date.now();
    message.data={
        "SN":"3245345", 
        "checkinfoXinfo":-0.001,
        "checkinfoYinfo":-0.0045,
        "checkinfoAngleinfo":-0.004,

    }
    connection.sendUTF(JSON.stringify(message));
    await awaitTime(3);
    message.msgType="checkinfoResult";
    message.msgId=uuidv1();
    message.timestamp=Date.now();
    message.data={
        "SN":"3245345", 
        "checkinfoXinfo":-0.001,
        "checkinfoYinfo":-0.001,
        "checkinfoAngleinfo":-0.004,

    }
    connection.sendUTF(JSON.stringify(message));
    await awaitTime(3);
    message.msgType="checkinfoResult";
    message.msgId=uuidv1();
    message.timestamp=Date.now();
    message.data={
        "SN":"3245345", 
        "checkinfoXinfo":-0.001,
        "checkinfoYinfo":-0.002,
        "checkinfoAngleinfo":-0.004,

    }
    connection.sendUTF(JSON.stringify(message));
    await awaitTime(3);
    message.msgType="checkinfoResult";
    message.msgId=uuidv1();
    message.timestamp=Date.now();
    message.data={
        "SN":"3245345", 
        "checkinfoXinfo":0.001,
        "checkinfoYinfo":0.02,
        "checkinfoAngleinfo":0.015,

    }
    connection.sendUTF(JSON.stringify(message));
}
function assembling(connection){
    let message=Object.assign({},msgTemplate);
    message.msgType="workingDetail";
    message.msgId=uuidv1();
    message.timestamp=Date.now();
    message.data={
       "keycaps": [{
            "contory": "Swiss",
            "model": "x86",
            "area": "asian1",
            "color":"White",
            "EEEE":"HWBC",
            "config":"ISO"
        }, {
            "contory": "German",
            "model": "x369a",
            "area": "asian2",
            "color":"Sparrow",
            "EEEE":"HWBC",
            "config":"ISO"

         }
    ]
}
    connection.sendUTF(JSON.stringify(message));

}
async function assemb(connection) {
    let message = Object.assign({}, msgTemplate);
    message.msgType = "assemblyStatus";
    message.msgId = uuidv1();
    message.timestamp = Date.now();
    message.data =
        [{
            "color": "white",
            "type": "ANSI",
            "language": "China",
            "status": 1,
            "target": "left",
            
        }]
    connection.sendUTF(JSON.stringify(message));
    await awaitTime(4);
    message.msgType = "assemblyStatus";
    message.msgId = uuidv1();
    message.timestamp = Date.now();
    message.data =
        [{
            "color": "white",
            "type": "ANSI",
            "language": "China",
            "status": 3,
            "target": "left",           
        }]
    connection.sendUTF(JSON.stringify(message));
    await awaitTime(4);

    message.msgType = "assemblyStatus";
    message.msgId = uuidv1();
    message.timestamp = Date.now();
    message.data =
        [{
            "color": "white",
            "type": "ANSI",
            "language":"China",
            "status":1,
            "target": "right",
            
        }]
    connection.sendUTF(JSON.stringify(message))
    await awaitTime(4);

    message.msgType = "assemblyStatus";
    message.msgId = uuidv1();
    message.timestamp = Date.now();
    message.data =
        [{
            "color": "white",
            "type": "ANSI",
            "language":"China",
            "status":3,
            "target": "right",
            
        }]
    connection.sendUTF(JSON.stringify(message))
    await awaitTime(4);

    message.msgType = "assemblyStatus";
    message.msgId = uuidv1();
    message.timestamp = Date.now();
    message.data =
        [{
            "color": "white",
            "type": "ANSI",
            "language":"China",
            "status":4,
            "target": "right",
            
        }]
    connection.sendUTF(JSON.stringify(message));

    await awaitTime(4);
    message.msgType = "assemblyStatus";
    message.msgId = uuidv1();
    message.timestamp = Date.now();
    message.data =
        [{
            "color": "white",
            "type": "ANSI",
            "language": "China",
            "status": 2,
            "target": "right",
            
        }]
    connection.sendUTF(JSON.stringify(message));

    await awaitTime(4);
    message.msgType = "assemblyStatus";
    message.msgId = uuidv1();
    message.timestamp = Date.now();
    message.data =
        [{
            "color": "white",
            "type": "ANSI",
            "language": "China",
            "status": 0,
            "target": "right",           
        }]
    connection.sendUTF(JSON.stringify(message));
    // await awaitTime(4);

    // message.msgType = "assemblyStatus";
    // message.msgId = uuidv1();
    // message.timestamp = Date.now();
    // message.data =
    //     [{
    //         "color": "white",
    //         "type": "ISO",
    //         "language":"China",
    //         "status":4,
    //         "target": "right",
            
    //     }]
    // connection.sendUTF(JSON.stringify(message))
    // await awaitTime(4);

    // message.msgType = "assemblyStatus";
    // message.msgId = uuidv1();
    // message.timestamp = Date.now();
    // message.data =
    //     [{
    //         "color": "white",
    //         "type": "ISO",
    //         "language":"China",
    //         "status":2,
    //         "target": "right",
            
    //     }]
    // connection.sendUTF(JSON.stringify(message))
    // await awaitTime(4);

    // message.msgType = "assemblyStatus";
    // message.msgId = uuidv1();
    // message.timestamp = Date.now();
    // message.data =
    //     [{
    //         "color": "white",
    //         "type": "ISO",
    //         "language":"China",
    //         "status":0,
    //         "target": "right",
            
    //     }]
    // connection.sendUTF(JSON.stringify(message))

}

function reportTest(connection){
    connection.on('message',function(message){
        for (var key in message) {
            if (message.hasOwnProperty(key)) {
                var element = message[key];
                console.log('message:  '+ element);
            }
        }
        
    });
}
function imagesUpLoad(connection) {
    let message = Object.assign({}, msgTemplate);
    message.msgType = "assembImage";
    message.msgId = uuidv1();
    message.timestamp = Date.now();
    message.data = {
        //image: "C://Users//Public//Pictures//Sample Pictures",
        //image: "C://Users//Public//Pictures//Sample Pictures",
        image: "D:\\key_web\\picture",
    }
    connection.sendUTF(JSON.stringify(message));
}
async function pressure(connection){//压力曲线图
    let message=Object.assign({},msgTemplate);
    message.msgType="TensionInfo";
    message.msgId=uuidv1();
    message.timestamp=Date.now();
    message.data = 
        {
           "operate":"343453453",
           "data":22,
        }
    
    connection.sendUTF(JSON.stringify(message));
    await awaitTime(1);
    message.msgType="TensionInfo";
    message.msgId=uuidv1();
    message.timestamp=Date.now();
    message.data = 
        {
           "operate":"343453453",
           "data":32,
        }
    
    connection.sendUTF(JSON.stringify(message));
    await awaitTime(1);
    message.msgType="TensionInfo";
    message.msgId=uuidv1();
    message.timestamp=Date.now();
    message.data = 
        {
           "operate":"343453453",
           "data":11,
        }
    
    connection.sendUTF(JSON.stringify(message));
    await awaitTime(1);
    message.msgType="TensionInfo";
    message.msgId=uuidv1();
    message.timestamp=Date.now();
    message.data = 
        {
           "operate":"343453453",
           "data":34,
        }
    
    connection.sendUTF(JSON.stringify(message));
    await awaitTime(1);
    message.msgType="TensionInfo";
    message.msgId=uuidv1();
    message.timestamp=Date.now();
    message.data = 
        {
           "operate":"343453453",
           "data":21,
        }
    
    connection.sendUTF(JSON.stringify(message));
    await awaitTime(1);
    message.msgType="TensionInfo";
    message.msgId=uuidv1();
    message.timestamp=Date.now();
    message.data = 
        {
           "operate":"343453453",
           "data":15,
        }
    
    connection.sendUTF(JSON.stringify(message));
    await awaitTime(1);
    message.msgType="TensionInfo";
    message.msgId=uuidv1();
    message.timestamp=Date.now();
    message.data = 
        {
           "operate":"343453453",
           "data":4,
        }
    
    connection.sendUTF(JSON.stringify(message));
    await awaitTime(1);
    message.msgType="TensionInfo";
    message.msgId=uuidv1();
    message.timestamp=Date.now();
    message.data = 
        {
            "operate":"343453453",
           "data":4,
        }
    
    connection.sendUTF(JSON.stringify(message));
    await awaitTime(1);
    message.msgType="TensionInfo";
    message.msgId=uuidv1();
    message.timestamp=Date.now();
    message.data = 
        {
          "operate":"stop",
           "data":67,
        }
    
    connection.sendUTF(JSON.stringify(message));
    // await awaitTime(5);
    // message.msgType="TensionInfo";
    // message.msgId=uuidv1();
    // message.timestamp=Date.now();
    // message.data = 
    //     {
            
    //        "data":98,
    //     }
    
    // connection.sendUTF(JSON.stringify(message));
    // await awaitTime(5);
    // message.msgType="TensionInfo";
    // message.msgId=uuidv1();
    // message.timestamp=Date.now();
    // message.data = 
    //     {
           
    //        "data":102,
    //     }
    
    // connection.sendUTF(JSON.stringify(message));
    // await awaitTime(5);
    // message.msgType="TensionInfo";
    // message.msgId=uuidv1();
    // message.timestamp=Date.now();
    // message.data = 
    //     {
           
    //        "data":122,
    //     }
    
    // connection.sendUTF(JSON.stringify(message));
    // await awaitTime(5);
    // message.msgType="TensionInfo";
    // message.msgId=uuidv1();
    // message.timestamp=Date.now();
    // message.data = 
    //     {
           
    //        "data":122,
    //     }
    
    // connection.sendUTF(JSON.stringify(message));
    // await awaitTime(5);
    // message.msgType="TensionInfo";
    // message.msgId=uuidv1();
    // message.timestamp=Date.now();
    // message.data = 
    //     {
           
    //        "data":115,
    //     }
    
    // connection.sendUTF(JSON.stringify(message));
    // await awaitTime(5);
    // message.msgType="TensionInfo";
    // message.msgId=uuidv1();
    // message.timestamp=Date.now();
    // message.data = 
    //     {
            
    //        "data":135,
    //     }
    
    // connection.sendUTF(JSON.stringify(message));
    // await awaitTime(5);
    // message.msgType="TensionInfo";
    // message.msgId=uuidv1();
    // message.timestamp=Date.now();
    // message.data = 
    //     {
           
    //        "data":135,
    //     }
    
    // connection.sendUTF(JSON.stringify(message));
}