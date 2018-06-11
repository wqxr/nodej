const WebSocketUtil = require("./service/WebSocketUtil");
const excellogUtil = require("./service/excellogUtil");

const msgType = require("./common/systemVar.js").msgType;
const SYSTEM_VAR = require("./common/systemVar.js");

const { ipcMain } = require('electron');
const wsURL = require("./common/systemVar.js").wsURL;
const mongodbURL = require("./common/systemVar.js").mongodbURL;

const logger = require("./service/logger");
const uiHandler = require("./handle/uiHandler");
const MongodbService = require("./service/mongodbService");
const ProductionDetailHandler=require("./handle/ProductionDetail.js")
const ConfigHandler=require("./handle/configHandler.js")
const ReadConfigHandler=require("./handle/readConfig.js")
const PcbtotalHandler=require("./handle/pcbTotal.js")
const MachineconfigHandler=require("./handle/readmachineconfig.js")
const GetmachineConfigHandler=require("./handle/getmachineconfig.js")
const ReadproductDetail=require("./handle/readProductdetail.js")
const setPressInfoHandler =require("./handle/setpressInfo.js")
const excelLogUtil = require("./service/excellogUtil.js");
const Tensiondata=require("./handle/TensionHandler.js");
const Handlerimage=require("./handle/handlerimage.js");
const readTotalProduct=require("./handle/readTotal.js");
const clearProductdata=require("./handle/clearproductdata.js")



//const ProductionDetail=require("./handle/ProductionDetail.js")






let handler={
  productionDetailHandler:new ProductionDetailHandler(),
  configHandler:new ConfigHandler(),
  readconfig:new ReadConfigHandler(),
  pcbTotalHandler:new PcbtotalHandler(),
  machineconfigHandler:new MachineconfigHandler(),
  getmachineconfigHandler:new GetmachineConfigHandler(),
  readproductdetail:new ReadproductDetail(),
  setPressInfoHandler:new setPressInfoHandler(),
  tensiondata:new Tensiondata(),
  handlerimage:new Handlerimage(),
  totalproduct:new readTotalProduct(),
  clearproductdata:new clearProductdata(),
  
};


class GascoigneApp {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    ipcMain.on(msgType.SEND_TO_MID,(event,arg)=>{
     
      
      try{
        switch (arg.msgType) {
          case "operate":
            this.socket.send(arg.msgType, arg.data);
            break;
          case "workModel":
            this.socket.send(arg.msgType, arg.data);
            handler.configHandler.init(this.mongodbService, this.socket);
            handler.configHandler.run(arg.data);
            break;
          case "pageready":
            handler.readconfig.init(this.mongodbService, this.socket);
            handler.readconfig.run();
            handler.getmachineconfigHandler.init(this.mongodbService, this.socket);
            handler.getmachineconfigHandler.run();
            handler.readproductdetail.init(this.mongodbService, this.socket);
            handler.readproductdetail.run();
            handler.totalproduct.init(this.mongodbService, this.socket);
            handler.totalproduct.run();
            break;
          case "machineconfigOnly":
            handler.machineconfigHandler.init(this.mongodbService, this.socket);
            handler.machineconfigHandler.run(arg.data);
            break;
          case "checkcorrect":
            this.socket.send(arg.msgType, arg.data);
            break;
          case "UserLogin":
            this.socket.send(arg.msgType, arg.data);
            break;
          case "changepwd":
            this.socket.send(arg.msgType, arg.data);
            break;
          case "setParagram":
            handler.setPressInfoHandler.init(this.mongodbService, this.socket);
            handler.setPressInfoHandler.run(arg.data);
            break;
         case "machineTimeconfig":
            this.socket.send(arg.msgType,arg.data);
            handler.productionDetailHandler.init(this.mongodbService,this.socket);
            handler.productionDetailHandler.run(arg.data);
           // excelLogUtil.addMachineTime(arg.data);
         break;
          case "operateIo":
            this.socket.send(arg.msgType, arg.data);
            break;
          case "setPoint":
            this.socket.send(arg.msgType, arg.data);
            excelLogUtil.addpointRecord(arg.data);
            break;
          case "CheckSN":
            this.socket.send(arg.msgType, arg.data);
            break;
          case "workway":
            this.socket.send(arg.msgType, arg.data);
            break;
          case "runModel":
            this.socket.send(arg.msgType,arg.data);
            break;
          case "clearproduct":
            handler.clearproductdata.init(this.mongodbService, this.socket);
            handler.clearproductdata.run();
            break;
          case "windowclose":
            this.mainWindowClosed(this.mainWindow);
            break;
          default:
              this.socket.send(arg.msgType,arg.data);
            break;
        }
      }catch(error){
        console.log(error);
      }
    })
  }
async init() {
      logger.debug("init websocket");
      var self = this;
      this.callExe(SYSTEM_VAR.midExePath,SYSTEM_VAR.midExeDir);   
     
      this.mongodbService=new MongodbService(mongodbURL);
      this.socket = new WebSocketUtil(wsURL,self.mainWindow,handler);
      handler.productionDetailHandler.init(this.mongodbService,this.socket);
      handler.pcbTotalHandler.init(this.mongodbService,this.socket);
      handler.tensiondata.init(this.mongodbService,this.socket);
      handler.handlerimage.init(this.mongodbService,this.socket);
      this.socket.addEventListener(()=>{
          self.socket.send('ssssss',  'hello, ray', false);
      });
      
      //this.mainWindow.on('closed', this.mainWindowClosed);
      uiHandler.setMainWin(this.mainWindow);
      // ipcMain.on(msgType.SEND_TO_MID, (event, arg) => {
      //   this.socket.send(arg.msgType, arg.data, arg.isNeedResponse, arg.timeout);
      // });
      excellogUtil.init();     
      await this.mongodbService.init();
     
      await this.socket.init();
  }

  mainWindowClosed(mainwindow) {
    //this.mainWindow.hide();
     mainwindow.destroy();
  }
/**
 * 调起一个exe程序
 * @param {string} path 
 */
callExe(path,dir) {
    const { execFile } = require('child_process');
    let options = {
      cwd:dir,
    };
    if( SYSTEM_VAR.isDebug ){
      return Promise.resolve();
    }else{
      return new Promise(function (resolve, reject) {
        const child = execFile(path, [],options, (error, stdout, stderr) => {
          if (error) {
            reject(error);
          }
        });
        setTimeout(function() {
          resolve();
        }, 500);
      });
    }
  }
}

//let app0 = new GascoigneApp(ipcMain);
//app0.init();
module.exports = GascoigneApp;
