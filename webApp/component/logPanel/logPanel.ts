import { Component, NgZone, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { IPCService } from '../../common/service/ipc.service';
import { MSG_TYPE } from "../../common/bean/msgType";


const dialog = nodeRequire('electron').remote.dialog;
const path = nodeRequire('path');
const fs = nodeRequire('fs');
const iconv = nodeRequire('iconv-lite');
const browserWindow = nodeRequire('electron').remote.getCurrentWindow();


@Component({
  selector: 'log-panel',
  templateUrl: "./webApp/component/logPanel/logPanel.html",
})
export class LogPanel implements OnInit {
  private display: string;
  /**最近一次选择的目录 */
  private lastDir:string;
  private content:string;
  private _ngZone: NgZone
  
  private rowArray:string[][];
  private islogUseShow:boolean=true;
  @Output() logpanelisShow = new EventEmitter<boolean>();
  
  constructor(_ngZone: NgZone) {
    this.display = "none";
    this.lastDir = null;
    this.rowArray = [];
    this._ngZone = _ngZone;
    
  }
  ngOnInit() {
  
  }
  showMessageBox(browswindow:object,options: object) {
    return new Promise(function (resolve, reject) {
      dialog.showMessageBox(browswindow,options, (btnIndex: number) => {
        resolve(btnIndex);
      });
    });
  }
  show() {
    return new Promise((resolve, reject)=> {
      this.rowArray = [];
     
      let dir = "";
      if (this.lastDir !== null) {
        dir = this.lastDir;
      } else {
        dir = path.join("D:/recheckData/logs/日志记录");
      }
      let options = {
        title: "选择日志文件",
        defaultPath: dir,
        properties: ["openFile"],
      };
      dialog.showOpenDialog(options, (filePaths: string[]) => {
        if (!filePaths) {
          this.logpanelisShow.emit(this.islogUseShow);
         // reject();
          return;
        } else {
          fs.readFile(filePaths[0], (err: any, data: string) => {
            if (err) {
              reject(err);
              return;
            }
            this._ngZone.run(() => {
              data = iconv.decode(data, "GBK");
              this.content = data;
              let rowList = this.content.split("\r\n");
              rowList.forEach((rowItem: string) => {
                this.rowArray.push(rowItem.split(","));
              });
              this.lastDir = path.join(filePaths[0], "..");
            })
            resolve(!this.islogUseShow);
          })
        }
      })
    })    
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
        this.logpanelisShow.emit(this.islogUseShow)
      } else {
      }
    })
    

  }
  hidden() {
    this.display = "none";
  }
}