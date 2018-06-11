const BaseHandler = require("./baseHandler.js");
const MongodbService = require("../service/mongodbService.js");
const collectionName = require("../common/collectionName.js");
const WebSocketUtil = require("../service/WebSocketUtil.js");
const MSG_TYPE = require('../common/systemVar.js').msgType;
const fsEx = require('fs-extra');
let  startTime=0;
let endTime=0;
const fs = require('fs');
let m_image = [];
class HandlerImage extends BaseHandler {
    /**
     * 执行数据处理前的准备工作
     */
    befor() {
        startTime = Date.now();
        console.log("start handle HandlerImage");
    }
    /**
     * 处理完成后的一些处理
     */
    after() {
        endTime = Date.now();
        let cost = (endTime - startTime) / 1000;
        console.log("finish handle HandlerImage,cost time " + cost + "s");
    }
    // sendOK() {
    //   this.webSocketUtil.sendToPage(MSG_TYPE.SAVE_CONFIG_RESULT,{
    //     resultCode:0,msg:"",
    //   });
    // }
    onError(error) {
        endTime = Date.now();
        let cost = (endTime - startTime) / 1000;
        console.log("error on handle HandlerImage,cost time " + cost + "s");
    }
    /**
     * 处理数据
     */
    async handle(data) {
        let day="";
        let month="";
        
        if(new Date().getDate()<10){
           day="0"+new Date().getDate();
        }else{
           day=new Date().getDate().toString();
        }
        if((new Date().getMonth()+1)<10){
          month="0"+(new Date().getMonth()+1);
        }else{
          month=(new Date().getMonth()+1).toString();
        }
        let now=new Date().getFullYear()+month+day;
        // let imgstring = "D:/Images/Annotated/"+now+"/"+data.SN;
        let imgstring = "D:/Images/MergeImageForFarpull";
        await fsEx.pathExists(imgstring,(err,exists)=>{
            if(exists){
               //this.awaitTime(2);
               this.readImage(imgstring,data.times);
                
            }else{
                console.info(err);
            }
        })
      
    }
 awaitTime(time) {
        time = time > 0 ? time * 1000 : 300;
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve();
            }, time);
        });
    }
readImage(image,times){
    let images=[];
    m_image = [];
    fs.readdir(image, (err, files) => 
    {
        if (err) {
          console.info(err);
        } 
        else if(files.length >0){
          for (let i = 0; i < files.length; i++) {   
              images.push(image + "/" + files[i]+"?"+Date.now());
          }
          for (let i = 0; i < images.length; i++) {
            let repl = new RegExp("\\\\", "g");
            let path = encodeURI(images[i].replace(repl, '//'));
            images[i] = "url(" + path + ")";
          }
          m_image = images;
          this.webSocketUtil.sendToPage("assembImage",{"showimage":m_image})
        }else{
            this.webSocketUtil.sendToPage("errorimg",{"code":1});
        }
    })
}

  
}
module.exports = HandlerImage;