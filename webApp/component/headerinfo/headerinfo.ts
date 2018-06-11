import { Component, NgZone, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { Headerinfo } from '../../common/bean/headerinfo';
import { IPCService } from '../../common/service/ipc.service';
import { LogPanel } from "../logPanel/logPanel";
const dialog = nodeRequire('electron').remote.dialog;
const browserWindow = nodeRequire('electron').remote.getCurrentWindow();






@Component({
  selector: 'headinfo',
  templateUrl: "./webApp/component/headerinfo/headerinfo.html"
})
export class HeaderinfoComponent {
  private _ngZone: NgZone
  private title: String;
  private status: string;
  private ipcService: IPCService;
  private isShow: boolean = false;
  private iscongigshow: boolean = false;
  private configshowtext = "配置面板";
  private ioisshowText: string = "IO面板";

  //机器时间
  private repairstartTime: number;
  private repairendTime: number;
  private repairtime: string;
  private protecttime: string;
  private repairtotaltime: number;
  private repairAlltime: number;
  private matainAlltime: number;
  private mataintotaltime: number;
  private matainstarttime: number;//保养开始时间
  private matainendtime: number;//保养结束时间
  private isrepaire: boolean = false;
  private ismatain: boolean = false;

  private isUseShow: boolean = false;
  private pointShow: boolean = false;
  private openlogclass: boolean = false;//日志面板样式
  private setconfigclass: boolean = false;//配置面板样式
  private styleclass: boolean[];
  private chosematerial: string;
  private chosewarehouse: string;
  // private opreatelist:number[];
  private issuspend: boolean;
  private fullScreenFlag = false;//全屏
  private opsStatus: number;
  private showloginout: boolean;
  private loginstatus: string;
  @Input()
  private headerinfo: Headerinfo;
  @Input()
  private planproductnum: number;
  @Input()
  private goodnumber: number;
  @Input()
  private CTendtime: number;
  @Input()
  private failnumber: number;
  @Input()
  private machineStatus: number;
  @Input()
  private configinfomation: {
    configname: "",
    configid: "",
    version: "",
    planCT: "",
    line:"",
  };
  @Input()
  private logs: { time: number, loginfo: string }[];
  @Input()
  private userinformation: { isLogin: boolean, role: string };
  @Output() ioisShow = new EventEmitter<boolean>();
  @Output() configisShow = new EventEmitter<boolean>();
  @Output() isUseShowfun = new EventEmitter<boolean>();
  @Output() ispointPanelShow = new EventEmitter<boolean>();
  @Output() isloginPanelShow = new EventEmitter<boolean>();
  @Output() ischangepwdPanelShow = new EventEmitter<boolean>();
  @Output() changepassword = new EventEmitter<boolean>();
  @Output() outlogin = new EventEmitter<boolean>();
  @Output() runmodel = new EventEmitter<boolean>();
  private productclass: boolean[];
  private testmodel: boolean;
  private productimodel: boolean;
  private runstyle: boolean;
  private machineTime: {
    "product": string,
    "cm": string,
    "cm_line": string,
    "machine_number": string,
    "manufacturer": string,
    "time_local": string,
    "total_time": string,
    "scheduled_time": string,
    "unscheduled_downtime": string,
    "scheduled_downtime": string,
    "engineering_time": string,
    "idle_time": string,
    "production_time": string,
    "unit_count": number,
    "pass_count": number,
    "pass_cycle_time": string,
    "fail_cycle_time": string,
    "planned_cycle_time": string,
    "Date": string,
    "Hour": string,
  }


  constructor(_ngZone: NgZone, ipcService: IPCService) {
    this._ngZone = _ngZone;
    this.title = 'IAStudio';
    this.ipcService = ipcService;
    this.styleclass = [false, false, false, false, false, false, false, false];
    this.chosematerial = "出料";
    this.status = "请复位";
    this.chosewarehouse = "清除料仓";
    // this.opreatelist=[];
    this.showloginout = true;
    this.loginstatus = "退出登录";
    this.machineStatus = 0;
    this.productclass = [false, true];
    this.productimodel = true;
    this.runstyle = false;
    this.issuspend = true;

    this.repairtime = "维修";
    this.protecttime = "保养";
    this.repairtotaltime = 0;
    this.mataintotaltime = 0;
    this.repairAlltime = 0;
    this.matainAlltime = 0;
    this.repairstartTime = 0;
    this.matainstarttime = 0;
    this.matainendtime = 0;

    this.machineTime = {
      "product": "",//xue
      "cm": "WISTRON",
      "cm_line": "",
      "machine_number": "",
      "manufacturer": "FP",
      "time_local": "",
      "total_time": "3600",
      "scheduled_time": "3600",
      "unscheduled_downtime": "",
      "scheduled_downtime": "",
      "engineering_time": "",
      "idle_time": "",
      "production_time": "",//生产时间 xue
      "unit_count": 0,
      "pass_count": 0,
      "pass_cycle_time": "",
      "fail_cycle_time": "",
      "planned_cycle_time": "",//计划ct
      "Date": "",
      "Hour": "",
    }
    this.ipcService.on("machineTime", (response) => {
      this._ngZone.run(() => {
        let now = new Date();
        if (this.isrepaire === true) {
          this.repairAlltime = this.repairtotaltime + (Date.now() - this.repairstartTime) / 1000;

        } else if (this.ismatain === true) {
          this.matainAlltime = this.mataintotaltime + (Date.now() - this.matainstarttime) / 1000;
        }
        // this.repairtotaltime= this.repairtotaltime+(Date.now()-this.repairstartTime)/1000;
        // this.mataintotaltime=this.mataintotaltime+(Date.now()-this.matainstarttime)/1000;
        this.machineTime = response.data;
        this.machineTime.cm = "Wistron";
        this.machineTime.manufacturer = "FP";
        this.machineTime.planned_cycle_time = this.configinfomation.planCT;
        this.machineTime.cm_line=this.configinfomation.line;
        this.machineTime.machine_number=this.configinfomation.configid;
        this.machineTime.scheduled_downtime = "" + this.repairAlltime.toFixed(1);
        this.machineTime.engineering_time = "" + this.matainAlltime.toFixed(1);
      //  this.machineTime.pass_cycle_time=response.data.pass_cycle_time.toFixed(1);
        this.machineTime.total_time = "3600";
        this.machineTime.scheduled_time = "3600";
        //this.machineTime.time_local = "" + now.getHours() + ":00:00";
        //this.machineTime.time_local=response.data.time_local;
        // if(now.getHours()===0){
        //   this.ipcService.send("newFile",{});
        // }
        this.machineTime.idle_time = ((3600 - this.repairAlltime - this.matainAlltime - response.data.production_time).toFixed(1)).toString()
       // this.machineTime.Date = "" + now.getFullYear()  + (now.getMonth() + 1)  + now.getDate();
        //this.machineTime.Hour = "" + now.getHours();
        //console.info("fdsadf"+this.repairtotaltime)
        this.ipcService.send("machineTimeconfig", this.machineTime);
        
        console.info(this.machineTime);
        this.saveProductdata();
      })
    })
  }
  textmodel() {//测试模式

    if (this.productimodel) {
      if (this.machineStatus === 6) {
        this.showMessageBox(browserWindow, {
          type: "warning",
          message: "确定启动空跑模式？？？",
          buttons: ["确定", "取消"],
          defaultId: 0,
          cancelId: -1,
        }).then((btnIndex: number) => {
          if (btnIndex === 0) {
            this.productclass = [true, false];
            this.ipcService.send("runModel", { code: 0 });
            this.runstyle = true;
          } else {
            this.productimodel = true;
          }
        })
      } else {
        this.showMessageBox(browserWindow, {
          type: "warning",
          message: "不是在就绪状态下，不可操作",
        })
        return;
      }
      this.productimodel = false;
    } else {

    }
  }
  productmodel() {

    if (this.runstyle) {
      this.showMessageBox(browserWindow, {
        type: "warning",
        message: "确定启动生产模式？？？",
        buttons: ["确定", "取消"],
        defaultId: 0,
        cancelId: -1,
      }).then((btnIndex: number) => {
        if (btnIndex === 0) {
          this.productclass = [false, true];
          this.ipcService.send("runModel", { code: 1 });
          this.productimodel = true;
        } else {
          this.runstyle = true;
        }
      });
      this.runstyle = false;
    }
  }
  startUp() {//启动
    if (this.planproductnum <= 0) {
      this.showMessageBox(browserWindow, {
        type: "warning",
        message: "计划生产个数不能为0",
      })
      return
    }
    this.ipcService.send("sendPlanProduct", { "planProduct": this.planproductnum });
    this.styleclass = [false, false, false, true, false, false, false, false];
    this.ipcService.send("operate", {
      "code": 1
    })
  }
  repair() {
    // if(this.opsStatus===8||this.opsStatus===4){
    //   return;
    // }
    if (this.protecttime === '保养中' || this.opsStatus === 8 || this.opsStatus === 4) {
      return;
    }
    this.isrepaire = true;
    this.ismatain = false;
    if (this.repairtime === "维修") {
      this.repairtime = "维修中";
      this.repairstartTime = Date.now();
    } else {
      this.repairtime = "维修";
      this.repairtotaltime = (Date.now() - this.repairstartTime) / 1000;
      this.repairAlltime += this.repairtotaltime;
    }
  }
  matain() {
    if (this.repairtime === "维修中" || this.opsStatus === 8 || this.opsStatus === 4) {
      return;
    }
    this.ismatain = true;
    this.isrepaire = false;
    if (this.protecttime === "保养") {
      this.protecttime = "保养中";
      this.matainstarttime = Date.now();
    } else {
      this.protecttime = "保养";
      this.mataintotaltime = (Date.now() - this.matainstarttime) / 1000;
      this.matainAlltime += this.mataintotaltime;
    }
  }
  emergencyStop() {//停止
    this.showMessageBox(browserWindow, {
      type: "warning",
      message: "确定停止吗？？？",
      buttons: ["确定", "取消"],
      defaultId: 0,
      cancelId: -1,
    }).then((btnIndex: number) => {
      if (btnIndex === 0) {
        this.styleclass = [false, false, false, false, false, false, true, false];
        if (this.opsStatus !== 8 || this.repairtime === "维修中" || this.protecttime === "保养中") {
          return;
        }
        this.ipcService.send("operate", {
          "code": 4
        })
      } else {

      }
    })

  }
  saveProductdata()//写入文档
  {
    this.repairstartTime = Date.now();
    this.matainstarttime = Date.now();
    this.matainAlltime = 0;
    this.repairAlltime = 0;
  }

  reset() {//复位
    if (this.repairtime === "维修中" || this.protecttime === "保养中") {
      return;
    }
    this.styleclass = [false, false, false, false, true, false, false, false];
    this.ipcService.send("operate", {
      "code": 3
    })
  }
  suspend() {//暂停{
    this.styleclass = [false, false, false, false, false, true, false, false];
    if (this.repairtime === "维修中" || this.protecttime === "保养中") {
      return;
    }
    this.issuspend = !this.issuspend
    if (this.issuspend) {
      if (this.opsStatus !== 7) {
        return;
      }
    } else {
      if (this.opsStatus !== 8) {
        return;
      }
    }
    this.ipcService.send("operate", {
      "code": 2
    })
  }

  // this.opreatelist.push(0);
  // if (this.opreatelist.length % 2 == 0) {
  //   if(this.opsStatus!==7){
  //    return;
  //   }    
  // } else {
  //   if(this.opsStatus!==8){
  //     return;
  //    }

  // }
  // this.ipcService.send("operate", {
  //   "code": 2
  // })

  // }
  getStatus(data: number) {
    this.opsStatus = data;
  }

  showIo() {
    if (this.userinformation.role == "操作员") {
      return;
    }
    this.ioisShow.emit(this.isShow);


  }
  showConfig() {
    this.styleclass = [false, false, true, false, false, false, false, false];
    // if(this.userinformation.role=="操作员"){
    //   return;
    // }

    this.configisShow.emit(this.iscongigshow);

  }
  openLogPanel() {
    this.styleclass = [false, true, false, false, false, false, false, false];
    this.isUseShow = true;
    this.isUseShowfun.emit(this.isUseShow);
  }
  loginoutin() {//登录
    this.styleclass = [false, false, false, false, false, false, false, true];
    if (this.showloginout === true) {
      this.showloginout = false;
    } else {
      this.showloginout = true;
    }
  }
  changpwd() {
    this.changepassword.emit(true)
  }
  loginin() {
    if (this.userinformation.isLogin === false) {
      this.loginstatus = "登录";
      this.outlogin.emit(false);
    } else {
      if (this.machineStatus === 8 || this.machineStatus === 4) {
        return;
      }
      this.loginstatus = "退出登录";
      this.ipcService.send("UserLogin", { "username": "", "psw": "", "code": 0 });//0代表退出
      this.isloginPanelShow.emit(false);
    }


  }
  logout() {
    this.isloginPanelShow.emit(false);
  }
  openpointPanel() {
    if (this.userinformation.role == "操作员") {
      return;
    }
    this.ispointPanelShow.emit(this.pointShow)
  }

  showMessageBox(browswindow: object, options: object) {
    return new Promise(function (resolve, reject) {
      dialog.showMessageBox(browswindow, options, (btnIndex: number) => {
        resolve(btnIndex);
      });
    });
  }

  changePwd() {
    this.ischangepwdPanelShow.emit(false);
  }

}