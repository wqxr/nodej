const BaseHandler = require("./baseHandler.js");
const MongodbService = require("../service/mongodbService.js");
const WebSocketUtil = require("../service/WebSocketUtil.js");
const collectionName = require("../common/collectionName.js");
const MSG_TYPE = require('../common/systemVar.js').msgType;
const fs = require('fs');
let  startTime=0;
let endTime=0;
let bgetpress=false;
let valueList=[];
let dataList=[];
let pressSN="";

class TensionHandler extends BaseHandler {
    /**
     * 执行数据处理前的准备工作
     */
    befor() {
        startTime = Date.now();
        console.log("start handle imageHandler");
    }
    /**
     * 处理完成后的一些处理
     */
    after() {
        endTime = Date.now();
        let cost = (endTime - startTime) / 1000;
        console.log("finish handle imageHandler,cost time " + cost + "s");
    }
    sendOK() {
    }
    onError(error) {
        endTime = Date.now();
        let cost = (endTime - startTime) / 1000;
        console.log("error on handle imageHandler,cost time " + cost + "s");
    }
    /**
     * 处理数据
     */
    async handle(data) {
        let configCollection = await this.mongodbService.getCollection( collectionName.pressdata);
       
        this.webSocketUtil.sendToPage("TensionInfo",data);
        if(data.operate == "stop")
        {
          
          bgetpress = false;
          dataList=valueList;
          let oldConfig = await configCollection.insertOne({"pressSN":pressSN,"data":dataList});
          
        }
        else
        {
          pressSN=data.operate;  
          if(!bgetpress)
          { 
            bgetpress = true;
            valueList = [];
            valueList.push(data.data);
          }
          else 
          {
            valueList.push(data.data);
          }             
        }
      }     
    
}
module.exports = TensionHandler;