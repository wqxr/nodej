import { Component,NgZone,Input,Output,EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';
const browserWindow = nodeRequire('electron').remote.getCurrentWindow();
const dialog = nodeRequire('electron').remote.dialog;


@Component({
  selector: 'point-panel',
  templateUrl:"./webApp/component/pointPanel/pointPanel.html"
})


export class PointPanel{

    private _ngZone: NgZone
    private title: String;
    private pointshow:boolean=true;
    private stationAshow:boolean=false;
    private stationBshow:boolean=true;
    private showFlag:boolean[];
    
    @Output() ispointPanelShow = new EventEmitter<boolean>();
    private iscongigshow:boolean=true;
    constructor(_ngZone: NgZone) {
        this._ngZone = _ngZone;
        this.title = 'IAStudio';
        this.showFlag = [true,false];
        



    }
    showMessageBox(browswindow:object,options: object) {
        return new Promise(function (resolve, reject) {
          dialog.showMessageBox(browswindow,options, (btnIndex: number) => {
            resolve(btnIndex);
          });
        });
      }
    ngOnInit() {
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
                this.ispointPanelShow.emit(this.pointshow);
            } else {
            }
          })
       
    
      }
      openStationA(){
          this.stationAshow=false;
          this.stationBshow=true;
          this.showFlag=[true,false];

      }
      openstationB(){
          this.stationBshow=false;
          this.stationAshow=true;
          this.showFlag=[false,true];
      }
}