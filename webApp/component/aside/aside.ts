import { Component,NgZone,Input,Output,EventEmitter,ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { IPCService } from '../../common/service/ipc.service';
import { MSG_TYPE } from "../../common/bean/msgType";
import { StationA } from "../stationA/stationA";
import { StationB } from "../stationB/stationB";
import { SavePointComponent } from "../savepoint/savepoint";


const browserWindow = nodeRequire('electron').remote.getCurrentWindow();
const dialog = nodeRequire('electron').remote.dialog;


@Component({
  selector: 'config-panel',
  templateUrl:"./webApp/component/aside/aside.html"
})


export class AsideComponent {

  private _ngZone: NgZone;
  private title:String;
  private ipcService:IPCService;
  private pointshow:boolean=true;
  private stationAshow:boolean=false;
  private stationBshow:boolean=true;
  private openIOshow:boolean=true;
  private showFlag:boolean[];
  private configShow:boolean=true;  
  private openteacherPoint:boolean=true;
  private userrole:number;
  private configinfo = {
    configname: "",
    configid: "",
    version:"",
    planCT:"",
    line:"",
  }
  
  @Output() configisShow = new EventEmitter<boolean>();
  @Output() configinfos = new EventEmitter<string[]>();
  @Output()  sendProtime=new EventEmitter<number[]>();
  private iscongigshow:boolean=true;
  private SAVE_PATH = "D:/ShopFlow/assemble.ini";
  private startclass:boolean=false;
  private protimenumber:number;
 
  @ViewChild(StationA)
  private stationA:StationA;
  @ViewChild(SavePointComponent)
  private savepoint:SavePointComponent;
  @ViewChild(StationB)
  private stationB:StationB;
  private config:{
       Ip:string;
       Station:string;
       StationID:string;
       StationNo:string;
       MAC_ADDR:string;
       line:string;
       version:string;
       planCT:string;
    }

  constructor( _ngZone: NgZone,ipcService:IPCService,){
    this._ngZone = _ngZone;
    this.title = 'IAStudio';
    this.showFlag = [true,false,false,false];
  //  console.log(_.isString(this.title));
  this.config = {
    Ip: "mic139.wistron.com",
    Station: "UF1",
    StationID: "WIZS_TB1-1FT-02_01_UF1",
    StationNo: "UF1",
    MAC_ADDR: "00-1B-21-13-12-47",
    line: "TB1-1FT-01",
    version:"X1-FULLMUK PSA-2017/11/22",
    planCT:"36",
}
    this.ipcService = ipcService;

  }



  showconfiginfo(stationname: string[]){

    this.configinfo.configname = stationname[1];
    this.configinfo.configid = stationname[0];
    this.configinfo.version=stationname[2];
    this.configinfo.planCT=stationname[3];
    this.configinfo.line=stationname[4];
    //this.configShow=true;
    this.configinfos.emit(stationname);
    
  }
  maskhidden(mask:true){
    this.configisShow.emit(this.iscongigshow);
  }


showProTime(protime:number[]){
  this.protimenumber=protime[0];
  
  this.sendProtime.emit(protime);
}
showMessageBox(browswindow:object,options: object) {
  return new Promise(function (resolve, reject) {
    dialog.showMessageBox(browswindow,options, (btnIndex: number) => {
      resolve(btnIndex);
    });
  });
}

onclose(){
  this.showMessageBox(browserWindow, {
    type: "warning",
    message: "是否关闭窗口",
    buttons: ["确定", "取消"],
    defaultId: 0,
    cancelId: -1,
  }).then((btnIndex: number) => {
    if (btnIndex === 0) {
      this.configisShow.emit(true);
      this.ipcService.send("openIOPanel",{"code":0});
      //this.iscongigshow=!this.iscongigshow;
    } else {
    }
  })
  


}
openStationA(){
  this.stationAshow=false;
  this.stationBshow=true;
  this.showFlag=[true,false,false,false];
  this.openIOshow=true;
  this.openteacherPoint=true;
  this.ipcService.send("openIOPanel",{"code":0});
  
}
openstationB(){
  this.stationBshow=false;
  this.stationAshow=true;
  this.openIOshow=true;
  this.showFlag=[false,true,false,false];
  this.openteacherPoint=true;
  this.ipcService.send("openIOPanel",{"code":0});
}
openIOpanel(){
  this.stationAshow=true;
  this.stationBshow=true;
  this.openIOshow=false;
  this.openteacherPoint=true;
  this.showFlag=[false,false,true,false];
  this.ipcService.send("openIOPanel",{"code":1});
}
openTeacher(){
  this.stationAshow=true;
  this.stationBshow=true;
  this.openIOshow=true;
  this.openteacherPoint=false;
  this.showFlag=[false,false,false,true];
  this.ipcService.send("openIOPanel",{"code":0});
}
readmachineconfig(data:any){
  if(data===""){
    this.stationA.readmachineconfigs( this.config);
  }else if(data!==undefined&&data!==""){
    this.config=data;
    this.stationA.readmachineconfigs( this.config);
  }
}
readPressInfo(data:any){
 // window.setTimeout(()=>{
  if(data!==undefined&&data!==""){
    this.stationB.readconfigs(data);
  }
 //},1000)
  //this.stationB.readconfigs(data);
}
getmachineStatus(data:number){
  this.stationA.getstatus(data);
  this.stationB.getstatus(data);
  this.savepoint.getstatus(data);
   }
getuserRole(role:string){
  if(role==="admin"){
    this.userrole=1;
  }else{
    this.userrole=2;
  }
this.stationA.getuserrole(this.userrole);
this.stationB.getuserrole(this.userrole);
this.savepoint.getuserrole(this.userrole);

}
}
