import { Component,NgZone,Input,Output,EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';

import { IPCService } from '../../common/service/ipc.service';
import { timeout } from 'rxjs/operator/timeout';

const dialog = nodeRequire('electron').remote.dialog;

const fs = nodeRequire('fs');
const browserWindow = nodeRequire('electron').remote.getCurrentWindow();

@Component({
  selector: 'savepoint',
  templateUrl:"./webApp/component/savepoint/savepoint.html"
})


export class SavePointComponent{

    private _ngZone: NgZone
    private title: String;
    private isShow:boolean=true;
    private ipcService:IPCService;
    private  getpointInfo:getPointdata[][];
    private matchPoint:getPointdata[][];
    private machinestatus:number;
    private userrole:number;
 
      
  
    
  
    constructor(_ngZone: NgZone,ipcService:IPCService) {
        this._ngZone = _ngZone;
        this.title = 'IAStudio';
        this.getpointInfo=[];
        this.matchPoint=[];
        this.ipcService = ipcService;
        this.machinestatus=0;
        for (let j = 0; j < 7; j++) {
            this.getpointInfo[j] = [];
            this.matchPoint[j]=[];
            for (let i = 0; i < 13; i++) {
              this.getpointInfo[j][i] = new getPointdata();
              this.matchPoint[j][i]=new getPointdata();
            }
          }
          this.ipcService.on("setPointResult",(data)=>{
              this._ngZone.run(()=>{
                  if(data.data.code===1){
                        this.showMessageBox(browserWindow,{
                            type: "warning",
                            message: "保存成功"
                        })
                  }else{
                    this.showMessageBox(browserWindow,{
                        type: "warning",
                        message: "保存失败"
                    })
                  }
              })
          })
          
    }
   
     ngOnInit() {
        this.ipcService.on("getPoint",(data)=>{//获取点位
              this._ngZone.run(()=>{
                this.getPointfun(data.data.station,data.data.xPoint,data.data.yPoint,data.data.zPoint,data.data.index,data.data.uPoint);
               
            })
         })
     }
     showMessageBox(browswindow:object,options: object) {
        return new Promise(function (resolve, reject) {
          dialog.showMessageBox(browswindow,options, (btnIndex: number) => {
            resolve(btnIndex);
          });
        });
      }
     getPointfun(station:number,xPoint:number,yPoint:number,zPoint:number,index:number,uPoint:number){
          
             this.getpointInfo[station][index].Xpoint=parseFloat(xPoint.toFixed(3));
             this.getpointInfo[station][index].Ypoint=parseFloat(yPoint.toFixed(3));
             this.getpointInfo[station][index].Zpoint=parseFloat(zPoint.toFixed(3));
             this.getpointInfo[station][index].Upoint=parseFloat(uPoint.toFixed(3));
             this.matchPoint[station][index].Xpoint=parseFloat(xPoint.toFixed(3));
             this.matchPoint[station][index].Ypoint=parseFloat(yPoint.toFixed(3));
             this.matchPoint[station][index].Zpoint=parseFloat(zPoint.toFixed(3));
             this.matchPoint[station][index].Upoint=parseFloat(uPoint.toFixed(3));
     }
    getstatus(data:number){
        this.machinestatus=data;
     }
     getuserrole(role:number){
        this.userrole=role;
       }
      
    savepoint() {
        this.showMessageBox(browserWindow, {
            type: "warning",
            message: "是否保存",
            buttons: ["确定", "取消"],
            defaultId: 0,
            cancelId: -1,
          }).then((btnIndex: number) => {
            if (btnIndex === 0) {
                for (let i = 0; i < this.getpointInfo.length; i++) {
                    for (let j = 0; j < this.getpointInfo[i].length; j++) {
                        if(this.getpointInfo[i][j].Xpoint!==this.matchPoint[i][j].Xpoint){
                            setTimeout(()=>{this.ipcService.send("setPoint", {"station":i,"index":j,"xPoint":this.getpointInfo[i][j].Xpoint,"yPoint":this.getpointInfo[i][j].Ypoint,"zPoint":this.getpointInfo[i][j].Zpoint,"uPoint":this.getpointInfo[i][j].Upoint,"prexpoint":this.matchPoint[i][j].Xpoint,"change":"x"});
                            this.matchPoint[i][j].Xpoint=this.getpointInfo[i][j].Xpoint; 
                        },100);
                        } 
                        if(this.getpointInfo[i][j].Ypoint!==this.matchPoint[i][j].Ypoint){
                            setTimeout(()=>{this.ipcService.send("setPoint", {"station":i,"index":j,"xPoint":this.getpointInfo[i][j].Xpoint,"yPoint":this.getpointInfo[i][j].Ypoint,"zPoint":this.getpointInfo[i][j].Zpoint,"uPoint":this.getpointInfo[i][j].Upoint,"preypoint":this.matchPoint[i][j].Ypoint,"change":"y"});
                            this.matchPoint[i][j].Ypoint=this.getpointInfo[i][j].Ypoint; 
                        },100);
                          
                        } 
                        if(this.getpointInfo[i][j].Zpoint!==this.matchPoint[i][j].Zpoint){
                            setTimeout(()=>{this.ipcService.send("setPoint", {"station":i,"index":j,"xPoint":this.getpointInfo[i][j].Xpoint,"yPoint":this.getpointInfo[i][j].Ypoint,"zPoint":this.getpointInfo[i][j].Zpoint,"uPoint":this.getpointInfo[i][j].Upoint,"prezpoint":this.matchPoint[i][j].Zpoint,"change":"z"});
                            this.matchPoint[i][j].Zpoint=this.getpointInfo[i][j].Zpoint;
                        },100);
                            
                        }
                        if(this.getpointInfo[i][j].Upoint!==this.matchPoint[i][j].Upoint){
                            setTimeout(()=>{this.ipcService.send("setPoint", {"station":i,"index":j,"xPoint":this.getpointInfo[i][j].Xpoint,"yPoint":this.getpointInfo[i][j].Ypoint,"zPoint":this.getpointInfo[i][j].Zpoint,"uPoint":this.getpointInfo[i][j].Upoint,"preupoint":this.matchPoint[i][j].Upoint,"change":"u"});
                            this.matchPoint[i][j].Upoint=this.getpointInfo[i][j].Upoint;
                        },100);
                           
                        }
                     
                    }
        
                }
             
            } else {
                this.getpointInfo=this.matchPoint;
            }
          })
  
    }
    
}
class getPointdata{
    station:number=0;
    index:number=0;
    Xpoint:number=0;
    Ypoint:number=0;
    Zpoint:number=0;
    Upoint:number=0;
    total:number=0;
}