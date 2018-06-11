const BaseHandler = require("./baseHandler.js");
const MongodbService = require("../service/mongodbService.js");
const WebSocketUtil = require("../service/WebSocketUtil.js");
const collectionName = require("../common/collectionName.js");
const MSG_TYPE = require('../common/systemVar.js').msgType;
const fsEx = require('fs-extra');
const excelLogUtil = require("../service/excellogUtil.js");

let  startTime=0;
let endTime=0;


class setPressInfoHandler extends BaseHandler {
    /**
     * 执行数据处理前的准备工作
     */
    befor() {
        startTime = Date.now();
        console.log("start handle configHandler");
    }
    /**
     * 处理完成后的一些处理
     */
    after() {
        endTime = Date.now();
        let cost = (endTime - startTime) / 1000;
        console.log("finish handle configHandler,cost time " + cost + "s");
    }
    sendOK() {
      this.webSocketUtil.sendToPage(MSG_TYPE.SAVE_CONFIG_RESULT,{
        resultCode:0,msg:"",
      });
    }
    onError(error) {
        endTime = Date.now();
        let cost = (endTime - startTime) / 1000;
        console.log("error on handle configHandler,cost time " + cost + "s");
    }
    /**
     * 处理数据
     */
    async handle(data) {
       excelLogUtil.addMachineconfig(data);
       
        let configCollection = await this.mongodbService.getCollection( collectionName.setpressInfo);
        let oldConfig = await configCollection.findOne({
          type:"setPressInfo"
        });
        data.type = "setPressInfo";
        if( oldConfig ){
          await configCollection.updateOne({type:"setPressInfo"},data);
        }else{
          await configCollection.insertOne(data);
        }
       
        
        this.webSocketUtil.send("setParagram",data);
    }
 
   
}
module.exports = setPressInfoHandler;