const BaseHandler = require("./baseHandler.js");
const MongodbService = require("../service/mongodbService.js");
const WebSocketUtil = require("../service/WebSocketUtil.js");
const collectionName = require("../common/collectionName.js");
const MSG_TYPE = require('../common/systemVar.js').msgType;
const hourProductdetail = require('../bean/hourProductdetail.js');
const fsEx = require('fs-extra');
let startTime = 0;
let endTime = 0;
let traynumber = [];
const excelLogUtil = require("../service/excellogUtil.js");
let Producttotal = {
    goodproduct: 0,
    failproduct: 0,
    total: 0,
    goodprecent: 0,
    type: "producttotal",
}
let hourProduct={
    goodproduct: 0,
    failproduct: 0,
    total: 0,
    goodprecent: 0,
    failCTtime:0,
    passCTtime:0,
    type: "eachhourProduct",
}


class ProductionDetailHandler extends BaseHandler {
    /**
     * 执行数据处理前的准备工作
     */
    befor() {
        startTime = Date.now();
        console.log("start handle SaveConfigHandler");
    }
    /**
     * 处理完成后的一些处理
     */
    after() {
        endTime = Date.now();
        let cost = (endTime - startTime) / 1000;
        console.log("finish handle SaveConfigHandler,cost time " + cost + "s");
    }
    sendOK() {
        this.webSocketUtil.sendToPage(MSG_TYPE.SAVE_CONFIG_RESULT, {
            resultCode: 0, msg: "",
        });
    }
    onError(error) {
        endTime = Date.now();
        let cost = (endTime - startTime) / 1000;
        console.log("error on handle SaveConfigHandler,cost time " + cost + "s");
    }
    /**
     * 处理数据
     */
    async handle(data) {
        console.info(data.product);
        
        let currenttime = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
        let sendpage = { "precision": "", "checkinfo": "", "SN": data.SN, "time": currenttime, "code": data.code, "matchtimes": "", "presstime": "", "jobNumber": "", "result": "", "pressdata": "" };
        let precisionCollection = await this.mongodbService.getCollection(collectionName.precision);
        let checkCollection = await this.mongodbService.getCollection(collectionName.checkinfodetail);
        let productdetail = await this.mongodbService.getCollection(collectionName.productdetail);//生产详细信息
        let producttotal = await this.mongodbService.getCollection(collectionName.producttotal);//生产统计
        let eachhourproduct=await this.mongodbService.getCollection(collectionName.eachhourproduct);//每个小时的生产统计
        let detail = await precisionCollection.find({ SN: data.SN }).toArray();
        let checkinfo = await checkCollection.find({ SN: data.SN }).toArray();
        let product = await productdetail.find({ SN: data.SN }).toArray();
        let oldConfig = await producttotal.findOne({
            type: "producttotal",
        });
       // let oldConfig1=await eachhourproduct.findOne({type:"eachhourProduct"});
        if(data.product!==undefined){
           
            let producthour = new hourProductdetail();
            producthour.total=hourProduct.total;
            producthour.goodproduct=hourProduct.goodproduct;
            producthour.failproduct=hourProduct.failproduct;
            if (hourProduct.failproduct === 0){
                producthour.failCTtime = 0;
            } else {
                producthour.failCTtime = data.production_time / hourProduct.failproduct;
            }
            if (hourProduct.goodproduct === 0) {
                producthour.passCTtime = 0;
            } else {
                producthour.passCTtime = data.production_time / hourProduct.goodproduct;
            }
           
            data.unit_count=producthour.total;
            data.pass_count=producthour.goodproduct;
            data.pass_cycle_time= producthour.passCTtime.toFixed(1);
            data.fail_cycle_time=producthour.failCTtime.toFixed(1);
            excelLogUtil.addMachineTime(data);
            hourProduct.total=0;
            hourProduct.goodproduct=0;
            hourProduct.failproduct=0;
            hourProduct.failCTtime=0;
            hourProduct.passCTtime=0;
        }else{
          if (!oldConfig) {
            Producttotal.total = 1;
            if (data.code === 1) {
                Producttotal.goodproduct = 1;
                hourProduct.goodproduct=1;
            } else {
                Producttotal.failproduct = 1;
                hourProduct.failproduct=1;
            }
            Producttotal.goodprecent = Producttotal.goodproduct / Producttotal.total;
           
            await producttotal.insertOne(Producttotal);
            //await eachhourproduct.insertOne(Producttotal);
            Producttotal.type = "producttotal";
            hourProduct.type="eachhourProduct";

        } else {
            Producttotal.total = oldConfig.total + 1;
            hourProduct.total++;
            if (detail.length > 0 && checkinfo.length > 0) {
                if (data.code === 1) {
                    sendpage.result = "OK";
                    Producttotal.goodproduct = oldConfig.goodproduct + 1;
                    Producttotal.failproduct=oldConfig.failproduct;
                    hourProduct.goodproduct++;
                } else if (data.code === 0) {
                    sendpage.result = "NG";
                    Producttotal.goodproduct=oldConfig.goodproduct;
                    Producttotal.failproduct = oldConfig.failproduct + 1;
                    hourProduct.failproduct++;
                }
                if (product.length > 0) {

                } else {
                    sendpage.precision = detail[0].precisionXinfo + "_" + detail[0].precisionYinfo + "_" + detail[0].precisionAngleinfo;
                    sendpage.checkinfo = checkinfo[0].checkinfoXinfo + "_" + checkinfo[0].checkinfoYinfo + "_" + checkinfo[0].checkinfoAngleinfo;
                    sendpage.matchtimes = checkinfo[0].matchtimes;
                    sendpage.presstime = checkinfo[0].presstime;
                    sendpage.jobNumber = checkinfo[0].jobNumber;
                    sendpage.pressdata = checkinfo[0].pressdata;
                    let productDetail = await productdetail.insertOne(sendpage);
                    excelLogUtil.addProductDetail(sendpage);
                }
                Producttotal.goodprecent = Producttotal.goodproduct / Producttotal.total;
                await producttotal.updateOne({ type: "producttotal" }, Producttotal);
                this.webSocketUtil.sendToPage("finishResult", sendpage);

            } else {

            }
          //  this.webSocketUtil.sendToPage("finishResult", sendpage);
        }
    }

    }
}
module.exports = ProductionDetailHandler;