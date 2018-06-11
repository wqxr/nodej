import { MessageResponse } from '../bean/message';
export interface ipcCallback{
    (msg:MessageResponse):void;
}