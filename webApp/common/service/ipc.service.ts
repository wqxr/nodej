/// <reference path="../../../webTypes/index.d.ts"/>
import { Injectable } from '@angular/core';
import { MessageRequest } from '../bean/message';
import { MessageResponse } from '../bean/message';
import { ipcCallback } from '../interface/ipc.callback';
import { MSG_TYPE } from '../bean/msgType';

const ipcRenderer = nodeRequire('electron').ipcRenderer;

@Injectable()
export class IPCService {
    callBackArray:listenerList[]
    constructor(){
        this.callBackArray = [];
        let listener = (event:any,params:any) => {
            let data = params;
            //console.log(data);
            let list = this.callBackArray.filter( (item)=>{
                return item.msgType === data.msgType;
            });
            list.forEach( (callbackItem)=>{
                callbackItem.callBack(data);
            });
        };
        ipcRenderer.on(MSG_TYPE.SEND_TO_PAGE,listener);
        // let msg = {
        //     "msgType": "getAllHWOType",
        //     "version": "v1.0.0",
        //     "timestamp": "2017-08-11 09:24:54 257",
        //     "data": {value:"hahahha"},
        //     "msgId": "F20803CD-9FF6-4ABD-9CBB-CE531AD652F2"
        // };
        // setInterval(function(){
        //     ipcRenderer.send("MID_MSG","哈哈哈哈哈");
        // },3000);
    }
    send(msgType:string,data:object){
       ipcRenderer.send(MSG_TYPE.SEND_TO_MID,{
           msgType:msgType,
           data:data
       });

        // let listener=function(event:any,params:any){
        //         msg.data=params.data;
        //         msg.msgId=params.msgId;
        //         msg.msgType=params.msgType;
        //         msg.timestamp=params.timestamp;
        //         msg.version=params.version;
        //       return new Promise(function(resolve,reject){
        //         if(params!==""){
        //             resolve(msg);
        //         }else{
        //             reject("没有数据");
        //         }
        // });         
        // }
        //    ipcRenderer.on("test",listener);
    }
    on(msgType: string, callback: ipcCallback):void {
         this.callBackArray.push({
             msgType:msgType,
             callBack:callback
         });
            
    };
    off(msgType: string, callback?: ipcCallback):void {
        let list = this.callBackArray.filter( (item)=>{
                return item.msgType!=msgType;
        });
        this.callBackArray=list;
         
    }
}

class listenerList{
    msgType:string;
    callBack:ipcCallback
}
//let t = new IPCService();
//let callbackA = function(){};
//let callbackB = function(){};
//t.on("AAA",callbackA);
// t.on("AAA",callbackB);
// t.off("AAA");
// t.off("AAA",callbackA);

// page node c++
// require('electron').ipcRenderer.on('ping', function(event, message){
//                     console.log(message);
