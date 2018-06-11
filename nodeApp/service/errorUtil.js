/**
 * 自定义error信息
 */
class keyError{
    constructor(type,msg){
        this.type = type;
        this.msg = msg;
    }
    toString(){
        return "msgType:"+this.type+",\n,msg:"+this.msg;
    }
}
const ERROR_TYPE = {
    "UNKNOW_NORMAL_KEYBOARD"    :"UNKNOW_NORMAL_KEYBOARD",  //未知的普通按键类型
    "BE_USED_DEPOT_LAYER"       :"BE_USED_DEPOT_LAYER",     //已经被使用过的仓库位置
    "UNKNOW_KEYBOARD_SUBTYPE"   :"UNKNOW_KEYBOARD_SUBTYPE", //未知的入库字段subType
    "KEY_INDEX_ERROR"           :"KEY_INDEX_ERROR",         //确实按键在键盘中的index时出现异常
    "NOT_FIND_KEY"              :"UPDATE_DEPORTdETAIL_ERROR",//更新从中间键传过来的updateKeyData时找不到键盘
};

function makeError(errorType,options){
    let msg = "";
    switch (errorType){
        case ERROR_TYPE.UNKNOW_NORMAL_KEYBOARD:
            msg = "type:"+options.type +",language:"+options.language;
            return new keyError( ERROR_TYPE.UNKNOW_NORMAL_KEYBOARD, msg );
        break;
        case ERROR_TYPE.BE_USED_DEPOT_LAYER:
            msg = "depot:"+options.depot +",layer:"+options.layer;
            return new keyError( ERROR_TYPE.BE_USED_DEPOT_LAYER, msg );
        break;
        case ERROR_TYPE.UNKNOW_KEYBOARD_SUBTYPE:
            msg = "subType:"+options.subType;
            return new keyError( ERROR_TYPE.BE_USED_DEPOT_LAYER, msg );
        break;
        case ERROR_TYPE.KEY_INDEX_ERROR:
            msg = "keyboard ID"+options.id +",keyName:"+options.keyName;
        return new keyError( ERROR_TYPE.KEY_INDEX_ERROR, msg );
        break;
        case ERROR_TYPE.NOT_FIND_KEY:
            msg = "subType"+options.subType +",layer:"+options.layer+",depot:"+options.depot;
        return new keyError( ERROR_TYPE.NOT_FIND_KEY, msg );
        break;
        default:
        return new keyError("unknow","未知错误,"+JSON.stringify(options) );
    }
}
module.exports = {
    makeError:makeError,
    ERROR_TYPE:ERROR_TYPE,
    KeyError:keyError
};

