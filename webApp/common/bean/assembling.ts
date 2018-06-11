export class Assembling{
     public type:string;
     public language:string;
     public lackKeyCount:number;
     public assemblyKey:string;
     public timeConsume:number;
     public downclasses:string;
     public upclasses:string;
     public assembclass:string;
     public keycaps:keycaps[]=[];
     public detailproduct:productdetail[];//生产记录
     public sdetailproduct:productdetail[];
     public productdetail:productdetail;
     public keycapsDetail:keycapsDetail[]=[];
     constructor(){
        for(let i=0;i<=1;i++){
            this.keycaps.push({
                language:"",
                machineType:"",
                type:"",
                color:"",
                station:"", 
                SN:""       
            });
        }
      this.productdetail=new productdetail();
      this.detailproduct=[];
     }
    
}
class keycaps{
     public language: string;
     public machineType: string;
     public type: string;
     public color: string;
     public station:string;
     public SN:string;

}
class keycapsDetail{
    public name:string;
    public status:string;
    public starttime:string;
    public staytime:string;
    public type:string;
    public Completed:number;
}
class productdetail{//生产记录
    public SN :string;
    public precision:string;
    public checkinfo:string;
    public machineid:string;
    public time:string;
    public pressdata:number;
    public result:string;
    public presstime:number;
    public jobNumber:string;
    public matchtimes:number;


}
