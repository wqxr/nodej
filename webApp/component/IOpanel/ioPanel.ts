import { Component, NgZone, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { IOList,IOData } from '../../common/bean/IOData';
import { IPCService } from '../../common/service/ipc.service';


@Component({
    selector: 'io-panel',
    templateUrl: "./webApp/component/IOpanel/ioPanel.html"
})


export class IOpanelComponemt {
    private ipcService:IPCService;
    private _ngZone: NgZone
    private isShow: boolean = true;
    private iOList = IOList;
    
    private ioCards:CardIO[][];
  private aa:string;
    @Output() ioisShow = new EventEmitter<boolean>();
    private iscongigshow: boolean = true;
    constructor(_ngZone: NgZone,ipcService:IPCService) {
        this._ngZone = _ngZone;
        this.ipcService=ipcService;
        this.iOList[0].hidden = false;
        this.ioCards=[];
      
        for (let j = 0; j < 4; j++) {
            this.ioCards[j] = [];
            for (let i = 0; i <18; i++) {
              this.ioCards[j][i] = new CardIO();
            }
          }
       
    }
    ngOnInit() {
        this.ipcService.on("IoStatus", (message) => {
            this._ngZone.run(() => {
             
                let ioValue = message.data.data.toString(2);
                let cardId = message.data.cardID;
               
                    while( ioValue.length <16 ){
                        ioValue = "0"+ioValue;
                    };
                
              
                for(let i=0;i<ioValue.length;i++){
                    this.ioCards[cardId-1][i].input=ioValue.charAt(ioValue.length-i-1);
                }
               // console.info(this.ioCards);
                //this.ioCards[cardId-1][ioValue].input = ioValue;
            });
          })
    }
    onclose() {
        this.ioisShow.emit(this.isShow);
    }

    
 
    operateIo(io:IOData){
        // let val = io.value;
         io.value = io.value === 0 ? 1:0;
        // let value=val;
         let name=io.name;
         this.ipcService.send("operateIo",{
             'cardId':io.cardId,'index':io.index,'value':io.value,'name':name
         });
         // if(io.value===1){
         //     io.value=0;
         // }else{
         //     io.value=1;
         // }
         
     }
    switchIoOff(type:number,name:string){
        this.ipcService.send("operateIo",{
            cardId:type,
            Ioname:name,
            value:0
        })

    }
    switchTab(tabIndex:number){
        
        this.iOList.forEach ((item)=>{
            item.hidden = true;
        });
        this.iOList[tabIndex].hidden = false;
    }
   
}

class CardIO {
    input:string;
    output:string;
}