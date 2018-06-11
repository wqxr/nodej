import { Component,NgZone,Input,EventEmitter,Output } from '@angular/core';
import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { Assembling } from '../../common/bean/assembling';
import { IPCService } from '../../common/service/ipc.service';
import { Headerinfo } from '../../common/bean/headerinfo';

const dialog = nodeRequire('electron').remote.dialog;
const browserWindow = nodeRequire('electron').remote.getCurrentWindow();


@Component({
  selector: 'footerinfo',
  templateUrl:"./webApp/component/footerInfo/footerInfo.html"
})
export class footerInfoComponent {
  private _ngZone: NgZone
  private title:String;
  private status:string;
  private letpressclass:boolean[];
  private machineStatus:number;
  private SFCmessage:string;
  private searchSN:string;
  private planProductNum:number;
  private SNsearch:boolean[];
  @Input()
  private assembling: Assembling;
  @Input()
  private configinfos:{};
  @Input()
  private pressSn:string;
  @Input()
  private headerinfo: Headerinfo;
  @Output() getplanProduct=new EventEmitter<number>();
  private ipcService:IPCService;
  private communciateStatus:{
    emengencyclass:boolean,
    safedoorclass:boolean,
    gunclass:boolean,
    pressclass:boolean,
    ccdclass:boolean,
    sfcclass:boolean,
  }
  private workmodel:{
    scanSN:boolean,
    passStation:boolean,
    IsPress:boolean;
    putSMT:boolean;
  }

  private workmodels:{
    scanSN:number,
    passStation:number,
    IsPress:number,
    putSMT:number,
  }
  constructor( _ngZone: NgZone,ipcService:IPCService){
    this._ngZone = _ngZone;
    this.title = 'IAStudio';
    this.status="未初始化";
    this.ipcService=ipcService;
    this.machineStatus=7;
    this.letpressclass=[false,false];
    this.planProductNum=100;
    this.SFCmessage="";
    this.searchSN="";
    this.SNsearch=[false,false,false];
    this.workmodels={
      scanSN:1,
      passStation:1,
      IsPress:1,
      putSMT:1,
    }
    
    this.workmodel={
      passStation:false,
      scanSN:false,
      IsPress:false,
      putSMT:false,
    }
    this.communciateStatus={
      emengencyclass:false,
      safedoorclass:false,
      gunclass:false,
      pressclass:false,
      ccdclass:false,
      sfcclass:false,
    }
 
    this.ipcService.on("SFCmessage",(data)=>{
      this._ngZone.run(()=>{
        this.SFCmessage=data.data.message;
      })
    })
    this.ipcService.on("communicateStatus",(data)=>{
      this._ngZone.run(()=>{
        if(data.data.code===0){
          this.communciateStatus.emengencyclass=true;
        }else if(data.data.code===1){
          if(data.data.data===1){
          this.communciateStatus.safedoorclass=true;
          }else{
            this.communciateStatus.safedoorclass=false;
          }
                    
        }else if(data.data.code===2){
          if(data.data.data===1&&this.communciateStatus.gunclass===false){
            this.communciateStatus.gunclass=true;
           
            }else if(data.data.data===0&&this.communciateStatus.gunclass===true){
              this.communciateStatus.gunclass=false;
           
            }         
          
        }else if(data.data.code===3){
          if(data.data.data===1){
            this.communciateStatus.pressclass=true;
            }else{
              this.communciateStatus.pressclass=false;
            }
        }else if(data.data.code===4){
          if(data.data.data===1){
            this.communciateStatus.ccdclass=true;
            }else{
              this.communciateStatus.ccdclass=false;
            }
        }else if(data.data.code===5){
          if(data.data.data===1){
            this.communciateStatus.sfcclass=true;
          }else{
            this.communciateStatus.sfcclass=false;
          }
        }
      })
    })
  }
changenoconnect(){
  
  this.communciateStatus={
    emengencyclass:false,
    safedoorclass:false,
    gunclass:false,
    pressclass:false,
    ccdclass:false,
    sfcclass:false,
  }
}
   searchSNinfo(){
    this.SNsearch=[true,false,false];
    if(this.searchSN.length===undefined){
      return;
    }
    if(this.searchSN.length<10){
      this.showMessageBox(browserWindow,{
        type: "warning",
        message: "条码读取错误，请重新输入",
      });
      return;
    }else{
      this.ipcService.send("CheckSN",{"type":0,"SN":this.searchSN,})//查询SFC
      this.SFCmessage="";
    }
  } 

  putSMT(){
    this.SNsearch=[false,true,false];
    if(this.searchSN===undefined){
      return;
    }
    if(this.searchSN.length<10){
      this.showMessageBox(browserWindow,{
        type: "warning",
        message: "条码读取错误，请重新输入",
      });
      return;
    }else{
      this.ipcService.send("CheckSN",{"type":1,"SN":this.searchSN,})//上传SMT
      this.SFCmessage="";
    }
  }
  putSFC(){
    this.SNsearch=[false,false,true];
    if(this.searchSN.length===undefined){
      return;
    }
    if(this.searchSN.length<10){
      this.showMessageBox(browserWindow,{
        type: "warning",
        message: "条码读取错误，请重新输入",
      });
      return;
    }else{
      this.ipcService.send("CheckSN",{"type":2,"SN":this.searchSN})//上传sfc
      this.SFCmessage="";
    }
  }
  showMessageBox(browswindow:object,options: object) {
    return new Promise(function (resolve, reject) {
      dialog.showMessageBox(browswindow,options, (btnIndex: number) => {
        resolve(btnIndex);
      });
    });
  }
  cleardata(){
    this.headerinfo.goodnumber=0;
    this.headerinfo.badnumber=0;
    this.headerinfo.totalnumber=0;
    this.ipcService.send("clearproduct",{})
  }
 
ngOnInit() {
    this.getplanProduct.emit(this.planProductNum);
  }
getPlanNum(num:number){
  if(this.planProductNum<0){
    this.planProductNum=0;
    return;
 }
  this.getplanProduct.emit(this.planProductNum);
  
  }
  delplanProduct(){
      this.planProductNum--;
      if(this.planProductNum<0){
        this.planProductNum=0;
        return;
     }
     this.ipcService.send("sendPlanProduct",{"planProduct":this.planProductNum});
     this.getplanProduct.emit(this.planProductNum);
    }
  changestatus(data:number){
    this.machineStatus=data;
    switch(data){
      case 0:
      this.status="未初始化";//red
      break;
      case 1:
      this.status="未连接";//red
      break;
      case 2:
      this.status="急停";//red
      break;
      case 3:
      this.status="请复位";//red
      break;
      case 4:
      this.status="复位中";//green
      break;
      case 5:
      this.status="停止中";//red
      break;
      case 6:
      this.status="就绪";//blue
      break;
      case 7:
      this.status="暂停";//yellow
      break;
      case 8:
      this.status="工作中";//green
      break;
    }

}
changedata(type: number) {
  
        if (this.workmodel.scanSN === true) {
          this.workmodels.scanSN = 0;
        } else {
          this.workmodels.scanSN = 1;
        }
        if (this.workmodel.passStation === true) {
          this.workmodels.passStation = 0;
        } else {
          this.workmodels.passStation = 1;
        }
        if (this.workmodel.IsPress === true) {
          this.workmodels.IsPress = 0;
        } else {
          this.workmodels.IsPress = 1;
        }
        if (this.workmodel.putSMT === true) {
          this.workmodels.putSMT = 0;
        } else {
          this.workmodels.putSMT = 1;
        }
        this.ipcService.send("workway", this.workmodels);
      
    }
letspress(type:number){
  if(type===5){
    this.letpressclass=[true,false];
  }else if(type===6){
    this.letpressclass=[false,true];
  }
  if(this.machineStatus===6){
    this.ipcService.send("operate", {
      "code": type
    });
  }else{
    this.showMessageBox(browserWindow, {
      type: "warning",
      message: "不是在就绪状态下，不可操作",
    });
    return;
  }
 
}
  
}