import { Component, NgZone, Input, ElementRef, AfterViewInit,Output,EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';


import { IPCService } from '../../common/service/ipc.service';
import { MSG_TYPE } from "../../common/bean/msgType";
import { Headerinfo } from '../../common/bean/headerinfo';

import * as ECharts from "echarts";
import { dashCaseToCamelCase } from '@angular/compiler/src/util';
import { window } from 'rxjs/operator/window';
import { max } from 'rxjs/operator/max';

const dialog = nodeRequire('electron').remote.dialog;
const fs = nodeRequire('fs');
const browserWindow = nodeRequire('electron').remote.getCurrentWindow();
const {desktopCapturer} = nodeRequire('electron');
let path= nodeRequire('path');

@Component({
  selector: 'leftInfo',
  templateUrl: "./webApp/component/centerInfo/centerInfo.html"
})


export class LeftInfoComponent {
  private elementRef: ElementRef;
  private _ngZone: NgZone
  private title: String;
  private ipcService: IPCService;
  private chart: ECharts.ECharts;
  private ctChart: ECharts.ECharts;
  private presicionArrary: number[];
  private checkinfo: number[];
  private imodel:number;
  private presskg:number[];
  
 
  @Input()
  private successinfo: string;
  // @Input()
  // private logs: { time: number, loginfo: string }[];
  @Input()
  loginStatus: { isLogin: boolean, role: string }
  @Input()
  private protime: number;
  @Input()
  private pressdatainfo: number;
  @Input()
  private headerinfo: Headerinfo;
  @Input()
  private maxcheckinfo:number;
  //@Output() SNtotal = new EventEmitter<string[]>();
  @Output() getPresSN=new EventEmitter<string>();
  private imgstring:string;
  private ipresstime:number;
  private valueList: number[];
  private dateList: number[];
  private option: any;
  private options:any;
  private shopflowStaus:string;
  private top:number=0;
  private checkinfox:number[];//复检曲线x集合
  private checkinfoy:number[];//复检曲线y集合
  private checkinfoa:number[];//复检曲线角度集合
 
  private pressSN:string;
  private images: string[];
  private bgetpress:boolean;
  private ydatalist:number[];
  private checkydatalist:number[];
  private ydatachangelist:number[];
  private styleclass:boolean[];
  
  private getPressSN:string;
  private imginfo:string;
  private imglength:any[];
  private value:number;
  private readonly:boolean;
  
  private SNamount:string[];
  @Input()
  private machineStatus:number;

  constructor(_ngZone: NgZone, ipcService: IPCService, elementRef: ElementRef) {
    this._ngZone = _ngZone;
    this.title = 'IAStudio';
    this.ipcService = ipcService;
    this.elementRef = elementRef;
    this.valueList = [];
    this.dateList = [];
    this.presicionArrary = [0, 0, 0];
    this.checkinfo = [0, 0, 0];
    this.bgetpress = false;
    this.ipresstime = 0;
    this.ydatalist=[];
    this.checkydatalist=[];

    this.ydatachangelist=[];
    this.images=[];
    this.styleclass=[true,false,false];
    this.imgstring="";
    this.shopflowStaus="";
    this.SNamount=[];
    this.presskg=[];
    
    this.imginfo="";
    this.imglength=[];
   
    this.imodel = 0;
    this.value=2;
    this.readonly=false;
    this.checkinfox=[];
    this.checkinfoy=[];
    this.checkinfoa=[];
    
   
   
    
  
   // this.images = [];
    //this.initLanguageChart();
    //shopflow上传状态
    // this.ipcService.on("shopflowStatus", (data) => {//贴合精度
    //   this._ngZone.run(() => {
    //     if (data.data.code===1) {
    //       this.shopflowStaus="OK";         
    //     } else {
    //       this.shopflowStaus="NG";          
    //     }

    //   });
    // });
   
    this.ipcService.on("TensionInfo", (data) => {
      this._ngZone.run(() => {
        if(data.data.operate == "stop")
        {
          this.bgetpress = false;
          this.valueList.push(data.data.data);
          this.updateLine(0,this.valueList,1); 
          let dataurl=this.chart.getDataURL({type:"png",backgroundColor:"white"});
          let base64Data = dataurl.replace(/^data:image\/png;base64,/, "");
          let tempPath = path.join("D:/recheckData/pressPicture",this.getPressSN+".png");
          fs.writeFile(tempPath, base64Data, 'base64', function(err:string) {
            if(err){
              console.log(err);
            }else{

            }
           
          });            
        }
        else
        {
          
          this.option.title[0].text = data.data.operate;
          this.getPressSN= this.option.title[0].text;
          this.getPresSN.emit(this.getPressSN);

          if(!this.bgetpress)
          { 
            this.bgetpress = true;
            this.valueList = [];
            this.valueList.push(data.data.data);
          }
          else 
          {
            this.valueList.push(data.data.data);
            this.updateLine(0,this.valueList,1);          
          }           
        }
      })
    })
    this.ipcService.on("precisionResult", (data) => {//贴合精度
      this._ngZone.run(() => {
       // console.info(data);
        if (data.data.data.precisionXinfo) {
          
          this.presicionArrary[0] = data.data.data.precisionXinfo;
          this.presicionArrary[1] = data.data.data.precisionYinfo;
          this.presicionArrary[2] = data.data.data.precisionAngleinfo;
          // this.SNamount=data.data.SNtotal;
          // this.SNtotal.emit(data.data.SNtotal);
        } else {
          // this.logs.push({
          //   time: Date.now(), loginfo: "获取贴合精度失败",
          // });
         
          return;
        }

      });
    });
    this.ipcService.on("checkinfoResult", (data) => {//复检信息
      this._ngZone.run(() => {
        if (data.data.checkinfoXinfo !== "" && data.data.checkinfoXinfo != undefined) {
          if(this.checkinfoa.length>=10){
            this.checkinfox.shift();
            this.checkinfoy.shift();
            this.checkinfoa.shift();
          }
          this.checkinfox.push( data.data.checkinfoXinfo);
          this.checkinfoy.push(data.data.checkinfoYinfo);
          this.checkinfoa.push(data.data.checkinfoAngleinfo);
          this.updatacheckLine(this.checkinfox,this.checkinfoy,this.checkinfoa);
          this.checkinfo[0] = data.data.checkinfoXinfo;
          this.checkinfo[1] = data.data.checkinfoYinfo;
          this.checkinfo[2] = data.data.checkinfoAngleinfo;
          
        } else {
          // this.logs.push({
          //   time: Date.now(), loginfo: "获取复检信息失败",
          // });
          //return;
        }

      });
    });
    this.ipcService.on("errorimg", (data) => {
      this._ngZone.run(() => {
        if (data.data.code === 1) {
          for(let i=0;i<4;i++){
              this.imglength.push({'index':i});
          }
            this.imginfo="图片读取失败";
            this.images=[];
        }
      })
    })
  
    this.options = {
      
            //Make gradient line here
            visualMap: [{
              show: false,
              type: 'continuous',
              seriesIndex: 0,
            //min: 0,
             //max: 150
            }, {
              show: false,
              type: 'continuous',
              seriesIndex: 0,
              min: 0,
              max: 150,
            }],
            title: [{
              left: 'center',
              text: '',
            }, {
              //top: '55%',
              //left: 'center',
              //text: 'Gradient along the x axis'
            }],
            legend:{
              data:['复检x(mm)','复检y(mm)','复检a(deg)']
            },
            tooltip: {
              trigger: 'axis',
              axispointer:{type:'cross'}
            },
            toolbox:{
              feature:{
                saveAsImage:{type:'png',show:true},
              }
            },
            xAxis: [{
              data: [1,2,3,4,5,6,7,8,9,10],
              name:"个数(s)",
             
            }, {
              //data: this.dateList,
               //gridIndex: 1
            }],
            yAxis: [{
              type:'value',
             // nameGap:30,
             // nameTextStyle:{fontSize:"24px"},
              splitLine: { show: true },
              data:this.checkydatalist,
              name:"复检值",
              max:0.02,
              //splitNumber:8,
              //axisTick:{length:10},
             // interval:20,
             interval:0.005,
              min:-0.02,
      
            }, {
              
            }],
            grid: [
              {
                left:'10%',
                right:'12%',
                bottom: '12%',
              }],
            series: [{
              type: 'line',
              showSymbol: false,
              data:this.checkinfox,
              //color:'#00d800',
              smooth:true,
              label:{normal:{show:true,position:'top'}},
              name:"复检x(mm)",
            }, {
              smooth:true,
              type: 'line',
              showSymbol: false,
              data:this.checkinfoy,
              label:{normal:{show:true,position:'top'}},
              name:"复检y(mm)",
            },
            {
              smooth:true,
              type: 'line',
              showSymbol: false,
              data:this.checkinfoa,
              label:{normal:{show:true,position:'top'}},
              name:"复检a(deg)",
            },
          ],
      
          }
      
        
      
    this.option = {
      //Make gradient line here
      visualMap: [{
        show: false,
        type: 'continuous',
        seriesIndex: 0,
        min: 0,
        max: 150
      }, {
        show: false,
        type: 'continuous',
        seriesIndex: 0,
        min: 0,
        max: 150,
      }],


      title: [{
        left: 'center',
        text: '',
      }, {
      }],
      tooltip: {
        trigger: 'axis'
      },
      toolbox:{
        feature:{
          saveAsImage:{type:'png',show:true},
        }
      },
      xAxis: [{
        data: [],
        name:"时间(s)",
       
      }, {
      }],
      yAxis: [{
        type:'value',
        nameGap:30,
       // nameTextStyle:{fontSize:"24px"},
        splitLine: { show: true },
        data:[],
        name:"压力(kg)",
        max:140,
        //splitNumber:8,
        //axisTick:{length:10},
        interval:20,
        min:0,
      }, {
         //splitLine: {show: true},
         //gridIndex: 1
      }],
      grid: [
        {
          left:'10%',
          right:'12%',
          bottom: '12%',
        }],
      series: [{
        type: 'line',
        showSymbol: false,
        data: this.valueList,
        color:'#00d800',
        smooth:true,
      }, {
        type: 'line',
        showSymbol: false,
        data:[],
        smooth:true,
        //color:"red",
        // xAxisIndex: 1,
        // yAxisIndex: 1
      }],

    }

  }

  // ngAfterViewInit() { // 模板中的元素已创建完成

  //   this.initLanguageChart();
  // }

  showMessageBox(browswindow:object,options: object) {
    return new Promise(function (resolve, reject) {
      dialog.showMessageBox(browswindow,options, (btnIndex: number) => {
        resolve(btnIndex);
      });
    });
  }
  clearimg(){
    this.images=[];
  }
  // selectimg(value:number){
  //   console.info(value);
  // }
 
  
  initLanguageChart() {
    let div = this.elementRef.nativeElement.querySelector(".charts");
    this.chart = ECharts.init(div);
    this.chart.setOption(this.option);
    let div1=this.elementRef.nativeElement.querySelector(".presicioncharts");
    this.ctChart=ECharts.init(div1);
    this.ctChart.setOption(this.options);
  }
  updateLine(maxcheck:number,data:any,type:number){
    
    if (undefined === this.chart) {
      return;
     }
   
     if(type===1){
      this.option.series[0].data = data;
     }else{
      this.option.series[1].data=data;
      this.option.yAxis[0].max=parseInt(data[0])+20;
      for(let i=0;i<=(parseInt(data[0])+20)/10;i++){
        this.ydatachangelist.push(i*10);
      }
     this.ydatalist=[];
     this.option.yAxis[0].data=this.ydatachangelist;
     this.ydatachangelist=[];
     this.options.yAxis[0].max=maxcheck;
     this.options.yAxis[0].min=-maxcheck;
     this.options.yAxis[0].interval=maxcheck/4;
    
     } 
     this.ctChart.setOption(this.options);
     this.chart.setOption(this.option);
  }
 updatacheckLine(data1:number[],data2:number[],data3:number[]){
   if(undefined===this.ctChart){
     return;
   }
   this.options.series[0].data=data1;
   this.options.series[1].data=data2;
   this.options.series[2].data=data3
   this.ctChart.setOption(this.options);
}
 

ngAfterViewInit() { // 模板中的元素已创建完成
   setTimeout(() => {
    if (this.protime > 1000) {
      this.protime = this.protime / 1000;
      for (let i = 0; i < (this.protime+15); i++) {
        this.dateList.push(i);
        this.presskg.push(this.pressdatainfo);
      }  
    }
    this.pressdatainfo = this.pressdatainfo/1;
    for(let i=0;i<=(this.pressdatainfo+40)/10;i++){
        this.ydatalist.push(i*10);
    }
    // for(let i=0;i>-0.03;i-=0.005){
    //   this.checkydatalist.push(i);
    // }
    // this.checkydatalist=this.checkydatalist.reverse();
    // for(let i=0;i<this.maxcheckinfo;i+=0.005){
    //   if(i===0){
       
    //   }else{
    //     this.checkydatalist.push(i);
    //   }  
    // }   
    this.option.visualMap[0].max=this.pressdatainfo+15;
    this.option.xAxis[0].data=this.dateList;
    this.option.yAxis[0].data=this.ydatalist;
    this.option.series[1].data=this.presskg;
    this.options.yAxis[0].data=this.checkydatalist;
    this.options.yAxis[0].max=this.maxcheckinfo;
    this.options.yAxis[0].min=-this.maxcheckinfo;
    this.options.yAxis[0].interval=this.maxcheckinfo/4;
    this.initLanguageChart();
   },100)
   
  }   

  // switchtype(type: number) {
  //   if (this.machineStatus === 8 || this.loginStatus.role === "操作员") {
  //     return;

  //   } else {

  //     if (type === 0 && this.imodel!== type) {
  //       this.showMessageBox(browserWindow, {
  //         type: "warning",
  //         message: "是否切换到Ansi版本",
  //         buttons: ["确定", "取消"],
  //         defaultId: 0,
  //         cancelId: -1,
  //       }).then((btnIndex: number) => {
  //         if (btnIndex === 0) {
  //           this.imodel = 0;
  //           this.styleclass = [true, false, false];
  //           this.ipcService.send("typeStatus", { type: 0 })//ansi
  //         } else {
  //         }
  //       })

  //     } else if (type === 1&& this.imodel!== type) {
  //       this.showMessageBox(browserWindow, {
  //         type: "warning",
  //         message: "是否切换到ISO版本",
  //         buttons: ["确定", "取消"],
  //         defaultId: 0,
  //         cancelId: -1,
  //       }).then((btnIndex: number) => {
  //         if (btnIndex === 0) {
  //           this.ipcService.send("typeStatus", { type: 1 });//iso
  //           this.styleclass = [false, true, false];
  //           this.imodel = 1;
  //         } else {
  //         }
  //       })

  //     } else if (type === 2&& this.imodel!== type) {
  //       this.showMessageBox(browserWindow, {
  //         type: "warning",
  //         message: "是否切换到JIS版本",
  //         buttons: ["确定", "取消"],
  //         defaultId: 0,
  //         cancelId: -1,
  //       }).then((btnIndex: number) => {
  //         if (btnIndex === 0) {
  //           this.imodel = 2;
  //           this.ipcService.send("typeStatus", { type: 2 });//jis
  //           this.styleclass = [false, false, true];
  //         } else {
  //         }
  //       })

  //     }
  //   }

  // }
      
 
  
  setImages(images:string[]) {
    this.imginfo="";
    this.images=images;
  }


}
