import { Component,NgZone,Input,Output,EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';

import { IPCService } from '../../common/service/ipc.service';

const dialog = nodeRequire('electron').remote.dialog;
const browserWindow = nodeRequire('electron').remote.getCurrentWindow();


@Component({
  selector: 'station-a',
  templateUrl:"./webApp/component/stationA/stationA.html"
})


export class StationA{

    private _ngZone: NgZone
    private title: String;
    private isShow:boolean=true;
  
    private ipcService:IPCService;
    private pointshow:boolean=true;
    private stationAshow:boolean=false;
    private stationBshow:boolean=true;
    private machinestatus:number;
    private showFlag:boolean[];
    private userrole:number;
    private clickclass:boolean[];
    @Output() configisShow = new EventEmitter<boolean>();
    @Output() configinfos = new EventEmitter<string[]>();

    private iscongigshow: boolean = true;
    private SAVE_PATH = "D:/ShopFlow/assemble.ini";
    private startclass: boolean = false;

    private config: {
        Ip: string,
        Station: string,
        StationID: string,
        StationNo: string,
        MAC_ADDR: string,
        line: string,
        version:string,
        planCT:string,
        stage:string,



    }
    private configs: {
        Ip: string,
        Station: string,
        StationID: string,
        StationNo: string,
        MAC_ADDR: string,
        line: string,
        version:string,
        planCT:string,
        stage:string,



    }


    @Output() ioisShow = new EventEmitter<boolean>();
    constructor(_ngZone: NgZone, ipcService: IPCService, ) {
        this._ngZone = _ngZone;
        this.title = 'IAStudio';
        this.showFlag = [true, false];
        this.config = {
            Ip: "mic139.wistron.com",
            Station: "UF1",
            StationID: "WIZS_TB1-1FT-02_01_UF1",
            StationNo: "UF1",
            MAC_ADDR: "00-1B-21-13-12-47",
            line: "TB1-1FT-01",
            version:"X1-FULLMUK PSA-2017/11/22",
            stage:"UF",
            planCT:"36",
        }
        this.configs = {
            Ip: "",
            Station: "",
            StationID: "",
            StationNo: "",
            MAC_ADDR: "",
            line: "",
            version:"",
            planCT:"",
            stage:"",
        }
        this.ipcService = ipcService;
        this.machinestatus = 0;
        this.clickclass=[false,false]

    }

    ngOnInit() {
        this.ipcService.on("getconfigResult", (data) => {//返回机器设置参数的结果
            this._ngZone.run(() => {
                if (data.data.code === 1) {
                    this.showMessageBox(browserWindow,{
                        type: "warning",
                        message: "保存成功",
                        defaultId: 0,
                        cancelId:-1,
                    });  
                } else {
                    this.showMessageBox(browserWindow,{
                        type: "warning",
                        message: "保存失败"
                    });
                }

            })
        })

    }
    getuserrole(role: number) {
        this.userrole = role;
    }

   
    showMessageBox(browswindow: object, options: object) {
        return new Promise(function (resolve, reject) {
          dialog.showMessageBox(browswindow, options, (btnIndex: number) => {
            resolve(btnIndex);
          });
        });
      }
  
    getstatus(data: number) {
        this.machinestatus = data;
    }
    saveConfig() {
        this.clickclass=[true,false];
        this.showMessageBox(browserWindow, {
            type: "warning",
            message: "是否保存",
            buttons: ["确定", "取消"],
            defaultId: 0,
            cancelId: -1,
          }).then((btnIndex: number) => {
            if (btnIndex === 0) {
               
                this.ipcService.send("machineconfigOnly", this.config);
                this.configinfos.emit([this.config.StationID, this.config.StationNo,this.config.version,this.config.planCT,this.config.line]);
              
            } else {
                this.cancel()
            }
          })
      
       
    }
    readmachineconfigs(data: any) {
        if(data!==undefined&&data!=="")
        {
            this.config = data;
            this.configs=data;
            if(this.config.Ip === "")
            {
                this.config.Ip = "mic139.wistron.com";
            }
            if(this.config.Station === "")
            {
                this.config.Station = "UF1";
            }
            if(this.config.StationID === "")
            {
                this.config.StationID = "WIZS_TB1-1FT-02_01_UF1";
            }
            if(this.config.StationNo === "")
            {
                this.config.StationNo = "UF1";
            }
            if(this.config.MAC_ADDR === "")
            {
                this.config.MAC_ADDR = "00-1B-21-13-12-47";
            }
            if(this.config.line === "")
            {
                this.config.line = "TB1-1FT-01";
            }
            if(this.config.version === "")
            {
                this.config.version = "X1-FULLMUK PSA-2017/11/22";
            }
            if(this.config.planCT === "")
            {
                this.config.planCT = "36";
            }
            if(this.config.stage===""){
                this.config.stage="UF";
            }
        }
    }
    cancel(){
        this.clickclass=[false,true];
        this.ipcService.send("pageready",{});
        setTimeout(()=>{
            this.ipcService.on("machineconfig",(data)=>{
                this._ngZone.run(() => {
                    this.configs=data.data.config;
                })
            })
        },1000);
        
        this.config=this.configs;

    }
  
}
