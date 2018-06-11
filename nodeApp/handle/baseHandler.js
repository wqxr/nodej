const ErrorUtil = require("../service/errorUtil.js");
const getTypeName = require("../common/systemVar.js").getTypeName;
const WebSocketUtil = require("../service/WebSocketUtil.js");
const MongodbService = require("../service/mongodbService.js");


let handlerMap = new Map();
let mainWindow;

class BaseHandler {
     
    constructor(msg) {
        handlerMap.set(msg);
    }
    /**
     * 执行数据处理前的准备工作
     */
    async befor() {

    }
    /**
     * 处理数据
     */
    async handle() {

    }
    /**
     * 处理完成后的一些处理
     */
    async after() {

    }
     /**
     * @param {MongodbService} mongodbService 
     * @param {WebSocketUtil} webSocketUtil 
     */
    init(mongodbService,webSocketUtil) {
        this.mongodbService = mongodbService;
        this.webSocketUtil = webSocketUtil;
    }

    /**
     * 发送处理成功的消息
     */
    sendOK(){

    }

    /**
     * 发送处理失败的消息
     */
    sendFail(){

    }

    async run(data){
        let result = null;
        try {
            await this.befor();
            result = await this.handle(data);
            await this.after();
            return result;
        } catch (error) {
            this.onError(error);
            throw error;
        }
    }

    /**
     * 异常处理
     * @param {*} error 
     */
    onError(error) {
        
    }
}

BaseHandler.getHandler = function(msg){
     return handlerMap.get(msg);
}
module.exports = BaseHandler;