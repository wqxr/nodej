let BaseHandler = require('./baseHandler');
let MSG_TYPE = require('../common/systemVar').msgType;
const logger = require('../service/logger');
var W3CWebSocket = require('websocket').w3cwebsocket;
const WebSocketUtil = require("../service/WebSocketUtil.js");

let mainWindow;
let countInfo=null;
class UIHandler extends BaseHandler{

    constructor(){
        super(MSG_TYPE.UI_HANDLER);
    }
    //把数据往UI端转发，也可以在这里做数据处理。
    async handle(data){
        if (this.mainWindow)
            this.mainWindow.webContents.send(MSG_TYPE.SEND_TO_PAGE,data);
        else
            logger.message('there is no main window: '+data);
    }
    setMainWin(mainWindow0){
        if (!mainWindow)
            this.mainWindow = mainWindow0;
    }
    
}

module.exports = new UIHandler();