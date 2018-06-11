import { Component, NgZone, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';

import { IPCService } from '../../common/service/ipc.service';
const dialog = nodeRequire('electron').remote.dialog;
const browserWindow = nodeRequire('electron').remote.getCurrentWindow();


@Component({
    selector: 'station-b',
    templateUrl: "./webApp/component/stationB/stationB.html"
})


export class StationB {
    // public configinfos:configinfo;
    private _ngZone: NgZone
    private title: String;
    private isShow: boolean = true;
    private ipcService: IPCService;
    private machinestatus: number;
    private userrole: number;
    private configs: {
        precisionXinfo: number;
        precisionYinfo: number;
        precisionAngleinfo: number;
        offsetXinfo: number;//补偿
        offsetYinfo: number;
        offsetAngleinfo: number;
        proTime: number;
        pressdata: number;
        checkXoffset: number;
        checkYoffset: number;
        checkAoffset: number;
    }
    private clickclass:boolean[];
    @Output() sendProTime = new EventEmitter<number[]>();
    @Output() ioisShow = new EventEmitter<boolean>();
    private iscongigshow: boolean = true;
    constructor(_ngZone: NgZone, ipcService: IPCService, ) {
        this._ngZone = _ngZone;
        this.ipcService = ipcService;
        this.title = 'IAStudio';
        this.configs = {
            precisionXinfo: 0,
            precisionYinfo: 0,
            precisionAngleinfo: 0,
            offsetXinfo: 0,//补偿
            offsetYinfo: 0,
            offsetAngleinfo: 0,
            proTime: 15000,
            pressdata: 100,
            checkXoffset: 0,
            checkYoffset: 0.02,
            checkAoffset: 0.02,
        }
        this.machinestatus = 0;
        this.clickclass=[false,false];
    }
    ngOnInit() {
       // this.sendProTime.emit([this.configs.proTime,this.configs.pressdata,]);
        this.ipcService.on("getParagramResult", (data) => {//返回机器设置参数的结果
            this._ngZone.run(() => {
                if (data.data.code === 1) {
                    this.showMessageBox(browserWindow,{
                        type: "warning",
                        message: "保存成功"
                    });
                    this.ioisShow.emit(false);
                    return;
                   
                } else {
                    this.showMessageBox(browserWindow,{
                        type: "warning",
                        message: "保存失败"
                    });
                    return;
                }

            })
        })
    }
    getstatus(data: number) {
        this.machinestatus = data;
    }
  
    showMessageBox(browswindow: object, options: object) {
        return new Promise(function (resolve, reject) {
          dialog.showMessageBox(browswindow, options, (btnIndex: number) => {
            resolve(btnIndex);
          });
        });
      }
    changeconfig() {
        this.clickclass=[true,false];
        this.showMessageBox(browserWindow, {
            type: "warning",
            message: "是否保存",
            buttons: ["确定", "取消"],
            defaultId: 0,
            cancelId: -1,
          }).then((btnIndex: number) => {
            if (btnIndex === 0) {
               let maxcheckinfo=this.configs.checkAoffset>this.configs.checkXoffset?this.configs.checkAoffset:this.configs.checkXoffset;
               let maxcorrectcheckinfo=maxcheckinfo>this.configs.checkYoffset?maxcheckinfo:this.configs.checkYoffset;
               this.sendProTime.emit([this.configs.proTime, this.configs.pressdata,maxcorrectcheckinfo]);
                this.ipcService.send("setParagram", this.configs);
              
            } else {
                this.cancel()
            }
          })
      
      
    }
    readconfigs(data: any) {
        if(data!==undefined&&data!==""){
        this.configs = data;
        let maxcheckinfo=this.configs.checkAoffset>this.configs.checkXoffset?this.configs.checkAoffset:this.configs.checkXoffset;
        let maxcorrectcheckinfo=maxcheckinfo>this.configs.checkYoffset?maxcheckinfo:this.configs.checkYoffset;
       // this.sendProTime.emit([this.configs.proTime, this.configs.pressdata,maxcorrectcheckinfo]);
        }
    }
    getuserrole(role: number) {
        this.userrole = role;
    }
    cancel(){
        this.clickclass=[false,true];
        this.ipcService.send("pageready",{});
        setTimeout(()=>{
            this.ipcService.on("machineconfig",(data)=>{
                this._ngZone.run(() => {
                    this.configs=data.data.pressInfo;
                })
            })
        },1000);
        
      


    }

}

