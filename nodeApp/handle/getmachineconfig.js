const BaseHandler = require("./baseHandler.js");
const MongodbService = require("../service/mongodbService.js");
const collectionName = require("../common/collectionName.js");
const WebSocketUtil = require("../service/WebSocketUtil.js");
const excelLogUtil = require("../service/excellogUtil.js");
const MSG_TYPE = require('../common/systemVar.js').msgType;
const fsEx = require('fs-extra');
let  startTime=0;
let endTime=0;


class getMachineconfigHandler extends BaseHandler {
    /**
     * 执行数据处理前的准备工作
     */
    befor() {
        startTime = Date.now();
        console.log("start handle getMachineconfigHandler");
    }
    /**
     * 处理完成后的一些处理
     */
    after() {
        endTime = Date.now();
        let cost = (endTime - startTime) / 1000;
        console.log("finish handle getMachineconfigHandler,cost time " + cost + "s");
    }
    // sendOK() {
    //   this.webSocketUtil.sendToPage(MSG_TYPE.SAVE_CONFIG_RESULT,{
    //     resultCode:0,msg:"",
    //   });
    // }
    onError(error) {
        endTime = Date.now();
        let cost = (endTime - startTime) / 1000;
        console.log("error on handle getMachineconfigHandler,cost time " + cost + "s");
    }
    /**
     * 处理数据
     */
    async handle() {
        let configCollection = await this.mongodbService.getCollection( collectionName.machineConfig);
        let configCollection1 = await this.mongodbService.getCollection( collectionName.setpressInfo);
        let oldConfig = await configCollection.findOne({
          type:"machineConfig"
        });
        let oldConfig1 = await configCollection1.findOne({
            type:"setPressInfo"
          });
        if( oldConfig||oldConfig1 ){
            this.webSocketUtil.send("machineconfig",{"config":oldConfig,"pressInfo":oldConfig1});  
            this.webSocketUtil.sendToPage("machineconfig",{"config":oldConfig,"pressInfo":oldConfig1});
            excelLogUtil.getLineNo(oldConfig.StationID);
        }else{
        }
      
    }
 
    // }
}
module.exports = getMachineconfigHandler;