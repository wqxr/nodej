var state = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED','UN_INIT'];
var RESP_MSG_ID_PREFIX = 'RESPTO_';
var W3CWebSocket = require('websocket').w3cwebsocket;
const uuidv1 = require('uuid/v1');
const MSG_TYPE = require('../common/systemVar.js').msgType;
const BaseHandler = require('../handle/baseHandler.js');
const logger = require('./logger');
const excelLogUtil = require("./excellogUtil.js");
const ProductionDetailHandler=require("../handle/ProductionDetail.js")
const PcbtotalHandler=require("../handle/pcbTotal.js")
const tensionHandler=require("../handle/TensionHandler.js")
const handlerimage=require("../handle/handlerimage.js")
let closemsg=true;

class WebSocketUtil {
    /**
     * 
     * @param {*} websocketUrl 
     * @param {*} mainWindow 
     * @param {} handler 
     */
  
    
    constructor(websocketUrl,mainWindow,handler) {
        this.websocketUrl = websocketUrl;
        this.mainWindow = mainWindow;
        this.receiver = null;
        this.statusListener = null;
        this.currState = state[4];
        this.msgQueue = new Map();
        this.timeout = 5000;
        this.callbackArray = [];
        this.handler = handler;
        this.reConnectTimer = -1;
        this.lastReconnectTime = -1;
    }
    /**
     * 初始化连接
    */
    init() {
       
        if( this.currState === state[1] || this.currState === state[0] ){
            return;
        }
        this.currState = state[0];
        var self = this;
        return new Promise((resolve,reject) => {
            this.websocket = new W3CWebSocket(this.websocketUrl);
            this.websocket.addEventListener('open', function (event) {
                console.log("opening...");
                self.currState = state[1];
                closemsg = true;
                self.callbackArray.forEach( (item)=>{
                    item(self.currState);
                });
                self.sendToPage("machineopen",{"code":1});
                resolve();

            });
            this.websocket.addEventListener('close', function (event) {
                console.log("close...");
                self.currState = state[3];
                self.callbackArray.forEach( (item)=>{
                    item(self.currState);
                });
               
                if(closemsg){
                   self.sendToPage("machineclose",{"code":0});
                    closemsg=false;
                }
                self.reConnect();
               // self.sendToPage("machineclose",{"code":0});
                

            }); 
             
            this.websocket.addEventListener('message', async function (event) {
                try {
                    logger.message(event.data);
                    self.writeLog( event.data );
                    let message = JSON.parse( event.data );
                    self.receiveMessage(message);
                    await self.handleMessageType(message);
                } catch (error) {
                    console.error(error);
                }
            });
            this.websocket.addEventListener('error', function (event) {
                console.log("error...");
                self.currState = state[3];
                self.callbackArray.forEach( (item)=>{
                    item(self.currState);
                });
                self.reConnect();
                
                reject();
            });
        })
    };
    /**
     * 查询连接状态
     */
    isConnected() {
        return new Promise( function(resolve,reject){
            if (this.currState === state[1]) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        });    
    };
    /**
     * 添加连接状态变化监听回调
     */
    addEventListener(callback,status) {
        //this.statusListener = callback;
        this.callbackArray.push(callback);   
    };
    /**
     * 发送数据
     */
    send(msgType,data,isNeedResponse,timeout) {
        return new Promise( (resolve,reject)=>{
            var message = {  
                data:data,
                msgId: uuidv1(),
                msgType: msgType,
                timestamp: Date.now(),
                version:"v1.0.0"
            };
            let messageJson = JSON.stringify(message);
            logger.message(messageJson);
            this.websocket.send(messageJson);
            let timer =null;
            let self = this;
            if( this.timeout > 0 && isNeedResponse === true){
                timer = setTimeout( function(){
                    self.msgQueue.delete(message.mgsId);
                    reject("连接超时");
                },this.timeout)
            }
            this.msgQueue.set(message.mgsId,{
                msgId:message.mgsId,
                timer :timer
            })
        });      
    };
    /**
     * 接收指定的推送消息
     */
    receive(callback){
        this.receiver = callback;
        //callback();
    };
    //对接收的消息进行处理
    receiveMessage(message){
        let id = 0 ;
        let msgRecordLog = null;
        //判断消息是否由对方主动发起,如果由对方发起，则直接将消息转发给渲染进程
        if( message && message.msgId && (message.msgId.indexOf(RESP_MSG_ID_PREFIX)<0)){
            return ;
        }
        //如果不是由对方主动发起,则从队列中找出消息记录
        id = message.msgId.replace(RESP_MSG_ID_PREFIX,"");

        if( this.msgQueue.has(id) ){
            msgRecordLog = this.msgQueue.get(id);
            this.msgQueue.delete(id);
        }
        if( msgRecordLog !== null){
            window.clearTimeout(msgRecordLog.timer);
            if(message.errCode === 0 ){
                msgRecordLog.resolve(message.data);
            }else{
                msgRecordLog.reject(message.errMsg);
            }
        }
        //this.mainWindow.webContents.send(MSG_TYPE.SEND_TO_PAGE,data);
    }
    handleRequest(data){
        this.mainWindow.webContents.send(MSG_TYPE.SEND_TO_PAGE,data);
    }
    //根据不同的消息类型调用不同的service进行处理
    async handleMessageType(message){
        let resultData = null;
        let msgType = message.msgType;
        //console.info(message);
        /**
         * @type {BaseHandler}
         */
        let todoHandler = null;
      
        if(msgType=="precisionResult"){
            todoHandler= await this.handler.pcbTotalHandler.run(message.data);  
        }else if(msgType=="checkinfoResult"){
            todoHandler= await this.handler.pcbTotalHandler.run(message.data);  
        }else if(msgType=="finishResult"){
            todoHandler=await this.handler.productionDetailHandler.run(message.data);
         }else if( msgType=="TensionInfo" ){
             todoHandler = await this.handler.tensiondata.run(message.data);
        }else if(msgType==="assembImage"){
            todoHandler=await this.handler.handlerimage.run(message.data);
        
           // todoHandler=await this.handler.productionDetailHandler.run(message.data);
        
        }else{
            this.mainWindow.webContents.send(MSG_TYPE.SEND_TO_PAGE,message);
        }
    }
    sendToPage(msgType,data){
        let message = {  
            data:data,
            msgId: uuidv1(),
            msgType: msgType,
            timestamp: Date.now(),
            version:"v1.0.0"
        };
        this.mainWindow.webContents.send(MSG_TYPE.SEND_TO_PAGE,message);
    }
    /**
     * 断线重连
     */
    reConnect(){
        if( this.lastReconnectTime === -1){
            //首次触发断线重连
            this.lastReconnectTime = Date.now();
            this.init();
        }
        // else if( Date.now() < this.lastReconnectTime ){
        //     return;
        // }
        else{
            this.lastReconnectTime = this.lastReconnectTime + 2*1000;
            global.setTimeout( ()=>{
                this.init();
            },this.lastReconnectTime - Date.now() );
        }
    }
    writeLog(data){
        try {
            let message = JSON.parse( data );
            if( message.msgType === "sendMsg" && undefined !== message.data["operate"] ){
                excelLogUtil.addOperateLogRecord(message.data.operate);
                //logger.errorLog( message.data );
            }else if(message.msgType==="sendMsg" && undefined !==message.data["error"]){
                excelLogUtil.addErrorLogRecord(message.data.ID,message.data)

            }else if(message.msgType==="finishResult") {

               // excelLogUtil.addProductDetail(message.data.code,message.SN);
                
            }else{
                logger.message( data );
            }
        } catch (error) {
            
        }finally{

        }
    }
};
module.exports = WebSocketUtil;