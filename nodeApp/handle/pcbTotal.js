const BaseHandler = require("./baseHandler.js");
const MongodbService = require("../service/mongodbService.js");
const WebSocketUtil = require("../service/WebSocketUtil.js");
const collectionName = require("../common/collectionName.js");
const MSG_TYPE = require('../common/systemVar.js').msgType;
const fsEx = require('fs-extra');
let  startTime=0;
let endTime=0;
let pcbcount=[];
let SNamount=[];


class PcbtotalHandler extends BaseHandler {
    /**
     * 执行数据处理前的准备工作
     */
    befor() {
        startTime = Date.now();
        console.log("start handle PcbtotalHandler");
    }
    /**
     * 处理完成后的一些处理
     */
    after() {
        endTime = Date.now();
        let cost = (endTime - startTime) / 1000;
        console.log("finish handle PcbtotalHandler,cost time " + cost + "s");
    }
    sendOK() {
      this.webSocketUtil.sendToPage(MSG_TYPE.SAVE_CONFIG_RESULT,{
        resultCode:0,msg:"",
      });
    }
    onError(error) {
        endTime = Date.now();
        let cost = (endTime - startTime) / 1000;
        console.log("error on handle PcbtotalHandler,cost time " + cost + "s");
    }
    /**
     * 处理数据
     */
    async handle(data) { 
      let presicioninfo = await this.mongodbService.getCollection(collectionName.precision);//精度
      let checkinfoCollection = await this.mongodbService.getCollection(collectionName.checkinfodetail)//复检 
      let readSN=await presicioninfo.findOne({SN:data.SN});
      let checkSN=await checkinfoCollection.findOne({SN:data.SN});
      let SNtotal=await presicioninfo.find().toArray();
      // SNtotal.forEach((item) => {
      //     SNamount.push(item.SN);
        
      // });
     
      if(data.precisionXinfo!=undefined){
        if (readSN) {
          await presicioninfo.updateOne({
            SN: data.SN
          },
            {
              $set: { precisionXinfo: data.precisionXinfo, precisionYinfo: data.precisionYinfo, precisionAngleinfo: data.precisionAngleinfo }
            });
        } else {
          await presicioninfo.insertOne(data);
        }
      
        this.webSocketUtil.sendToPage("precisionResult", {'data':data});
       
      }else if(data.checkinfoXinfo!=undefined){        
        if(checkSN){
            await checkinfoCollection.updateOne({
            SN: data.SN
          },
            {
              $set: { checkinfoXinfo: data.checkinfoXinfo, checkinfoYinfo: data.checkinfoYinfo, checkinfoAngleinfo: data.checkinfoAngleinfo, jobNumber:data.jobNumber,matchtimes:data.matchtimes,pressdata:data.pressdata,presstime:data.presstime}
            });
        }else{
     
           await checkinfoCollection.insertOne(data);
        }
        this.webSocketUtil.sendToPage("checkinfoResult", data);
          
      }
    }

}
module.exports = PcbtotalHandler;