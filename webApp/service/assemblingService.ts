import { Injectable } from '@angular/core';
import {Assembling} from "../common/bean/assembling"



@Injectable()
export class AssemblingService{
  

  updateassemblingInfo(data:Assembling,datainfo:any){
    data.assemblyKey = datainfo.assemblyKey;
    data.lackKeyCount = datainfo.lackKeyCount;
    data.language = datainfo.language;
    data.timeConsume = datainfo.timeConsume;
    data.type = datainfo.type;
    
    
  }
 updateheadInfo(data: Assembling, datainfo: any, type: number) {
        if (type == 1) {
            data.keycaps[0].language = datainfo[0].language;
            data.keycaps[0].color = datainfo[0].color;
            data.keycaps[0].machineType = datainfo[0].machineType;
            data.keycaps[0].SN = datainfo[0].SN;
            data.keycaps[0].station = datainfo[0].station;
            data.keycaps[0].type = datainfo[0].type;
        } else {
            data.keycaps[1].language = datainfo[1].language;
            data.keycaps[1].color = datainfo[1].color;
            data.keycaps[1].machineType = datainfo[1].machineType;
            data.keycaps[1].SN = datainfo[1].SN;
            data.keycaps[1].station = datainfo[1].station;
            data.keycaps[1].type = datainfo[1].type;
        }
    } 
    // assemblinginfo(data:productDetail,datainfo:any){ 
    //    data.checkinfo=datainfo.checkinfo;
    //    data.SN=datainfo.SN;
    //    data.precision=datainfo.precision;
       
       
    // } 
    productdetailinfo(data:Assembling,datainfo:any){
        datainfo.presstime=datainfo.presstime/1000;
        data.productdetail.jobNumber=datainfo.jobNumber;
        data.productdetail.pressdata=datainfo.pressdata;
        data.productdetail.time=datainfo.time;
        data.productdetail.presstime=datainfo.presstime;
        data.productdetail.checkinfo=datainfo.checkinfo;
        data.productdetail.precision=datainfo.precision;
        data.productdetail.SN=datainfo.SN;
        data.productdetail.result=datainfo.result;
        data.productdetail.matchtimes=datainfo.matchtimes;
        data.detailproduct.reverse();
        data.detailproduct.push(datainfo);
        //data.sdetailproduct = data.detailproduct;
        if(data.detailproduct.length>5){
            data.detailproduct.shift();    
        }
       // data.detailproduct = data.sdetailproduct;
        data.detailproduct.reverse();
        //data.detailproduct = data.sdetailproduct;
    }
    onloadProduct(data:Assembling,datainfo:any){
        data.detailproduct=datainfo;
        
        while(data.detailproduct.length>5)
        {
            data.detailproduct.shift(); 
        }
        if(data.detailproduct.length===0){
            return;
        }else{
            for(let i = 0;i<data.detailproduct.length;i++){   
                data.detailproduct[i].presstime = data.detailproduct[i].presstime/1000;
            }  
        }
       
        data.detailproduct.reverse();
    }

}