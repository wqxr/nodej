const log4js = require("log4js");
const KeyError = require("./errorUtil.js").KeyError;
log4js.configure({
    appenders: {
        keycap: { type: 'dateFile', filename: './logs/debug.log', maxLogSize: 10485760, backups: 3, compress: true },
        mock: { type: 'dateFile', filename: './logs/mock.log', maxLogSize: 10485760, backups: 3, compress: true },
        message: { type: 'dateFile', filename: './logs/receive.log', maxLogSize: 10485760, backups: 3, compress: true },
    },
    categories: {
        default: { appenders: ['keycap'], level: 'debug' },
        report: { appenders: ['mock'], level: 'debug' },
        message: { appenders: ['message'], level: 'debug' },
    }
});
const keycapLogger = log4js.getLogger("keycap");
const mockLogger = log4js.getLogger("report");
const messageLogger = log4js.getLogger("message");

let logger = {
    debug:function(debugInfo){
        let content = "";
        if( typeof debugInfo === 'string'){
            content = debugInfo;
        }else if( debugInfo instanceof KeyError ){
            content = debugInfo.toString();
        }else{
            content = JSON.stringify(debugInfo);
            if( !content ){
                content = debugInfo.toString();
            }
        }
        keycapLogger.debug(content);
    },
    mock:function(info){
        let content = "";
        if( typeof info === 'string'){
            content = info;
        }else if( info instanceof KeyError ){
            content = info.toString();
        }else{
            content = JSON.stringify(info);
            if( !content ){
                content = info.toString();
            }
        }
        mockLogger.debug(content);
    },
    message:function(info){
        let content = "";
        if( typeof info === 'string'){
            content = info;
        }else if( info instanceof KeyError ){
            content = info.toString();
        }else{
            content = JSON.stringify(info);
            if( !content ){
                content = info.toString();
            }
        }
        messageLogger.debug(content);
    }
};
module.exports = logger;