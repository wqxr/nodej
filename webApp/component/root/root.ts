import { Component, NgZone, ViewChild, AfterViewInit } from '@angular/core';
import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { IPCService } from '../../common/service/ipc.service';
import { AssemblingService } from '../../service/assemblingService';
import { Headerinfo } from '../../common/bean/headerinfo';
import { MSG_TYPE } from '../../common/bean/msgType';
import { Assembling } from '../../common/bean/Assembling';
import { footerInfoComponent } from "../footerInfo/footerInfo";
import { HeaderinfoComponent } from "../headerinfo/headerinfo";
import { AsideComponent } from "../aside/aside";
import { LeftInfoComponent } from "../centerInfo/centerInfo";
import { LogPanel } from "../logPanel/logPanel";
import { LoginlPanel } from "../loginPanel/login.panel";
const dialog = nodeRequire('electron').remote.dialog;
const browserWindow = nodeRequire('electron').remote.getCurrentWindow();





@Component({
  selector: 'root',
  templateUrl: "./webApp/component/root/root.html"
})
export class AppComponent {
  private _ngZone: NgZone
  private title: String
  private ipcService: IPCService;
  
  private AstartTime: number;//上料开始时间
  private AendTime: number;//出料结束时间
  private BstartTime: number;//上料开始时间
  private BendTime: number;//出料结束时间
  
  private headerinfo: Headerinfo;
 // private assemblingService: AssemblingService;
  private assembling: Assembling;
 
  private isShow: boolean = true;
  private configShow: boolean = true;
  private isUseShow: boolean = false;
  private logshow: boolean = true;
  private pointshow: boolean = true;
  private goodtotal: number;
  private failtotal: number;
  private pressdata: number;
  private machineStatus: number;
  private press:number[];
 // private logs: { time: number, loginfo: string }[];
  private ctstarttime: number;//ct计数开始时间
  private ctendtime: number;//ct结束时间
  private maskshow: boolean = true;
  private loginStatus: { isLogin: boolean, role: string }
  private SNResult: string;
  private protimenumber: number;
  private successinfo: string;
  private fullScreenFlag = false;
  private closemsg:boolean;
  private closewindow:boolean;
  private maxcheckinfo:number;
  private pressSn:string;
  private planproductnum:number;
  private ctboolean:boolean;

  // @ViewChild(AssembleinfoComponent) 
  // private assembleing:AssembleinfoComponent;

  @ViewChild(LeftInfoComponent)
  private keycapsComponent: LeftInfoComponent;
  @ViewChild(footerInfoComponent)
  private keycapsDetail: footerInfoComponent;
  @ViewChild(HeaderinfoComponent)
  private headerinfomation: HeaderinfoComponent;
  @ViewChild(LoginlPanel)
  private loginpanel: LoginlPanel;
  @ViewChild(LogPanel)
  private logpanel: LogPanel;
  @ViewChild(AsideComponent)
  private asidecomponent: AsideComponent;

  private configinfo = {
    configname: "",
    configid: "",
    version:"",
    planCT:"",
    line:"",
    stationId:"",
  }


  constructor(_ngZone: NgZone,
    ipcService: IPCService,
   // assemblingService: AssemblingService,
  

  ) {
    this._ngZone = _ngZone;
    this.title = 'IAStudio';
    this.ipcService = ipcService;
   
  //  this.assemblingService = assemblingService;
   
    //this.logs = [];
  //  this.ctnumber = [];
    this.pressSn="";
  
    this.press=[];
    this.machineStatus =0;
    this.closemsg=true;
    this.closewindow=true;
    this.ctboolean=true;
    this.loginStatus = {
      isLogin: false,
      role: "登录",
    };
    this.goodtotal = 0;
    this.ctendtime = 0;
    this.failtotal = 0;
    this.planproductnum=0;
    this.successinfo = "";




  }
  ngOnInit() {
    this.headerinfo = new Headerinfo();
    
    
    this.assembling = new Assembling();
    
    this.headerinfo.Acycletime = 0;
    this.headerinfo.CT = 0;
    this.headerinfo.goodnumber = 0;
    this.headerinfo.badnumber = 0;
    this.headerinfo.goodprobability = 0;
    this.headerinfo.totalnumber = 0;

   
    this.ipcService.on("opsStatus", (data) => {
      this._ngZone.run(() => {
        this.machineStatus = data.data.status;
       // console.info(this.machineStatus);
        if(this.machineStatus===100){
          this.ipcService.send("windowclose",{});
        }
        this.asidecomponent.getmachineStatus(this.machineStatus);
        this.headerinfomation.getStatus(data.data.status);
        this.keycapsDetail.changestatus(data.data.status);
      })
    })
    

    // this.ipcService.on("page_readyResult", (data) => {//页面一加载
    //   this._ngZone.run(() => {
    //     //this.keycapsComponent.readconfig(data.data);   
    //     // this.asidecomponent.readmachineconfig(data.data);
    //     // console.info(data.data);
    //     this.assemblingService.onloadProduct(this.assembling, data.data);
    //   })
    // })
   
    // this.ipcService.on("onloadProduct", (data) => {//Tray盘计数
    //   this._ngZone.run(() => {

    //     //this.assemblingService.onloadProduct(this.assembling, data.data);

    //   })
    // })
    this.ipcService.on("totalproduct", (data) => {//页面一加载读取产量
      this._ngZone.run(() => {

       this.headerinfo.goodnumber=data.data.goodproduct;
       this.headerinfo.badnumber=data.data.failproduct;
       this.headerinfo.totalnumber=data.data.total;

      })
    })
    this.ipcService.on("scanResult", (data) => {//获取SN，即上料信息
      this._ngZone.run(() => {
        this.keycapsComponent.clearimg();
        if (data.data.PCBSN !== "" && data.data.PCBSN != undefined) {
          this.headerinfo.newSN = data.data.PCBSN;
          this.AstartTime = Date.now();
        } else {
          // this.logs.push({
          //   time: Date.now(), loginfo: "获取SN失败",
          // });
          // return;
        }
      });
    });

    this.ipcService.on("machineconfig", (data) => {//页面一加载发送设备信息
      this._ngZone.run(() => {
        
        if(data.data.config!==undefined&&data.data.config!==""){
          this.configinfo.configid = data.data.config.StationID;
          this.configinfo.configname = data.data.config.StationNo;
          this.configinfo.version=data.data.config.version;
          this.configinfo.planCT=data.data.config.planCT;
          this.configinfo.line=data.data.config.line;
          this.asidecomponent.readmachineconfig(data.data.config);
          
        }
        if(data.data.pressInfo!==null&&data.data.pressInfo!==""){
           this.asidecomponent.readPressInfo(data.data.pressInfo);
           this.maxcheckinfo=data.data.pressInfo.checkAoffset>data.data.pressInfo.checkXoffset?data.data.pressInfo.checkAoffset:data.data.pressInfo.checkXoffset;
           this.maxcheckinfo=this.maxcheckinfo>data.data.pressInfo.checkYoffset?this.maxcheckinfo:data.data.pressInfo.checkYoffset;
           this.protimenumber=data.data.pressInfo.proTime;
           this.pressdata=data.data.pressInfo.pressdata;     
        }
      })
    })
    // this.ipcService.on(MSG_TYPE.SEND_TO_MSG, (response) => {
    //   this._ngZone.run(() => {
    //     console.info(response.data);
    //     if (undefined !== response.data.operate) { //中间件发送来的日志
    //       //this.currenttime=Date.now();      
    //       this.logs.push({
    //         time: Date.now(), loginfo: response.data.operate
    //       });
    //       setTimeout(() => {
    //         document.getElementById('js_logDiv').scrollTop = document.getElementById('js_logDiv').scrollHeight;
    //       }, 0);
    //     }
    //     if (undefined !== response.data.error) {//中间件发送来的异常信息
    //       this.logs.push({
    //         time: Date.now(), loginfo: response.data.error
    //       });
    //       setTimeout(() => {
    //         document.getElementById('js_logDiv').scrollTop = document.getElementById('js_logDiv').scrollHeight;
    //       }, 0);
    //     }

    //   })
    // })
    window.onbeforeunload = (event) => {
      event.returnValue = false;
      //工作中或者复位中,不能关闭软件
      
      if (this.machineStatus === 8 || this.machineStatus === 4) {
       return;
      }
      // }else{
      //   this.ipcService.send("closewindow",{code:1});
      // }
      if(event.returnValue==="false" &&this.closewindow===true){
        //event.returnValue = false;
        this.showMessageBox(browserWindow, {
          type: "warning",
          message: "是否关闭软件",
          buttons: ["确定", "取消"],
          defaultId: 0,
          cancelId: -1,
        }).then((btnIndex: number) => {
          if (btnIndex === 0) {
           this.ipcService.send("operate",{"code":100});
           setTimeout(()=>{
              this.ipcService.send("windowclose",{});
           },5000)
          } else {
            this.closewindow=true;
            event.returnValue=false;
           
          }
        })
        this.closewindow=false;
      }
    }
    this.ipcService.on("finishResult", (data) => {//出料
      this._ngZone.run(() => {
        // if(this.SNarray.indexOf(data.data.SN)===-1){
        //     this.SNarray.push(data.data.SN);
          
        // }
       
        this.headerinfo.totalnumber++;
        if (data.data.code == 1) {
          this.headerinfo.goodnumber++;
        } else {
          this.headerinfo.badnumber++;
        }
        if(this.ctboolean){
          this.headerinfo.CT=(Date.now()-this.AstartTime)/1000;
          this.ctboolean=false;
          this.ctstarttime = Date.now();

        }else{
          this.headerinfo.CT = (Date.now()-this.ctstarttime )/ 1000;//CT计数  
          this.ctstarttime=Date.now();       
        }
        this.keycapsDetail.delplanProduct();
      })
    })
    this.ipcService.on("assembImage", (data) => {
      this._ngZone.run(() => {
      setTimeout(() => {
         this.keycapsComponent.setImages(data.data.showimage);
      }, 3000);

      })
    })
    this.ipcService.on("machineclose", (data) => {
      this._ngZone.run(() => {
        if (data.data.code === 0) {
          this.machineStatus = 1;
          this.keycapsDetail.changestatus(1);
          this.keycapsDetail.changenoconnect();
          if (this.closemsg) {
            this.showMessageBox(browserWindow, {
              type: "warning",
              message: "软件断开，请重启软件"
            })
          }
          this.closemsg = false;
        
        }

      })
    })
    this.ipcService.on("machineopen", (data) => {
      this._ngZone.run(() => {
        if (data.data.code === 1) {
          this.ipcService.send("pageready", {});        
        }

      })
    })

  }
  

  ngAfterViewInit() {
    this.ipcService.send("pageready", {});
    this.maskshow = false;
   
  }

  showIo(isioshow: boolean) {
    this.isShow = isioshow;

  }
  getplannum(plannum:number){
        this.planproductnum=plannum;
  }

  showMessageBox(browswindow: object, options: object) {
    return new Promise(function (resolve, reject) {
      dialog.showMessageBox(browswindow, options, (btnIndex: number) => {
        resolve(btnIndex);
      });
    });
  }
  getPressSN(SN:string){
    this.pressSn=SN;
  }
  showconfig(configshow: boolean) {
    this.configShow = configshow;
    this.maskshow = configshow;
  }
  showfunlog(showlogfunction: boolean) {
    this.isUseShow = showlogfunction;
    this.maskshow = false;
    if (this.isUseShow == true) {
      this.logpanel.show()
        .then((result: boolean) => {
          this.logshow = result;
        });
    }
  }

  showlogpanel(logpanelshow: boolean) {
    this.logshow = logpanelshow;
    this.maskshow = true;
  }
  showpointpanel(Pointshow: boolean) {
    this.pointshow = Pointshow;
    this.maskshow = Pointshow;
  }
  showconfiginfo(stationname: any[]) {
    this.configinfo.configname = stationname[1];
    this.configinfo.configid = stationname[0];
    this.configinfo.version=stationname[2];
    this.configinfo.planCT=stationname[3];
    this.configinfo.line=stationname[4];
  }
  loginshow(logineeshow: boolean) {
    this.loginpanel.showLoginPanel();
    this.maskshow = false;
  }
  outlogin(result: boolean) {
    this.loginStatus.role = "";
    this.loginStatus.isLogin = false;
    this.loginshow(false);
  }
  getgoodnumber(goodnumber: number[]) {
    this.goodtotal = goodnumber[0];
    this.ctendtime = goodnumber[1];
  }
  getfailnumber(failnumber: number) {
    this.failtotal = failnumber;

  }
  getuserinfo(result: { isLogin: boolean, role: string }) {
    this.asidecomponent.getuserRole(result.role);
    if (result.role == "admin") {
      this.loginStatus.role = "管理员";
    } else {
      this.loginStatus.role = "操作员";
    }
    this.loginStatus.isLogin = result.isLogin;
    this.maskshow = true;
  }

  showProTime(protime: number[]) {
    
    this.protimenumber = protime[0];
    this.pressdata = protime[1];
    this.maxcheckinfo=protime[2];
    for(let i=0;i<50;i++){  
      this.press.push( this.pressdata);
      }
    this.keycapsComponent.updateLine(this.maxcheckinfo,this.press,2);
    this.press=[];
      
  }

  changingpwd(result: boolean) {
    this.loginpanel.showLoginPanel();
    this.loginpanel.changpwd();
    this.maskshow = false;
  }
  // getSNtotal(sntotal:string[]){
  //   this.SNarray=sntotal;
  // }
  closechangepwd(result: boolean) {
    this.maskshow = result;
  }
}
