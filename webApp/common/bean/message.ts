/**
 * 定义请求消息格式
 */
export class MessageRequest{
    msgType:string;
    version:string;
    timestamp:string;
    data:Object;
    msgId:string;   
}

/**
 * 定义相应消息格式
 */
export class MessageResponse{
    msgType:string;
    version:string;
    timestamp:string;
    data:any;
    msgId:string;
    errCode:number;
    errMsg:string;
}