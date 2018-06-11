import { Component, NgZone, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { IPCService } from '../../common/service/ipc.service';
import { MSG_TYPE } from "../../common/bean/msgType";



@Component({
  selector: 'login-panel',
  templateUrl: "./webApp/component/loginPanel/loginPanel.html",
})
export class LoginlPanel implements OnInit {
  private display: string;
  private username: string;
  private password: string;
  private role:any;
  private changepwd:boolean=false;
  private errorMsg: string;
  private resolveFunc: Function;
  private rejectFunc: Function;
  private ipcService: IPCService;
  private newpassword:string;
  private oldpassword:string;
  private changeresult:boolean;
  

  @Input()
  private loginStatus: { isLogin: boolean, role: string };
  @Input()
  private onlogin:number;
  @Output()
  private loginResult = new EventEmitter<{ isLogin: boolean, role: string }>();
  @Output()
  private closeResult=new EventEmitter<boolean>();
  constructor(ipcService: IPCService) {
    this.display= "block";
    this.username = "";
    this.password = "";
    this.newpassword="";
    this.ipcService = ipcService;
    this.changeresult=false;
   
    this.role = "";
  }
  ngOnInit() {
   this.ipcService.on("loginresult", (response) => {
    
      if (response.data.resultCode !==1) {
        this.errorMsg="您输入的密码错误";
        this.password="";
        return;
      }
      if (response.data.resultCode === 1) {
        this.loginResult.emit({
          isLogin: true, role: this.username,
        });
      
        this.hiddenLoginPanel();
        this.password="";
       
        
      }
    });
    this.ipcService.on("modifypwdresult",(response)=>{
      if(response.data.resultCode===0){

      }else{
        this.changepwd=false;
        this.changeresult=true;
        this.errorMsg="修改密码成功，请重新登录";
        this.password="";
      }
    })
  }
  close(){
    this.closeResult.emit(true);
    this.hiddenLoginPanel();
  }
  userlogin() {
    this.changepwd=false;
    if( false === this.check() ){
      return;
    }
    if(!isNaN(this.role)){
        this.username="op";
    }else{
        this.username ="admin";
    }
    // if( this.role === "admin"){
    //   this.username = "admin";
    // }else{
    //   this.username = "1";
    // }
    this.ipcService.send("UserLogin",{"username":this.role,"psw":this.password,"code":1});//1代表登录
  //  this.display="none";
  //   this.loginResult.emit({
  //     isLogin: true, role: this.role,
  //   });
    
    
  }
  loginin(event:any){
    if(event.keyCode===13){
      this.userlogin();
    }
    

  }
  changpwd(){
    this.changepwd=true;
    this.newpassword="";
    this.oldpassword="";


  }
 
  hiddenLoginPanel() {   
      this.display="none";
  }
  showLoginPanel(){
    this.changepwd=false;
    this.display="block";
    this.password="";
  }
  check(){
    this.errorMsg = "";
    if(!this.password||!this.role){
      this.errorMsg = "请输入用户名或者密码";
      return false;
    }
    return true;
  }
  updatepwd(){
    if(this.oldpassword!==this.newpassword){
      this.errorMsg = "密码不相同，请确认";
      return;
    }else{
      this.ipcService.send("changepwd",{"role":this.role,"newpassword":this.newpassword,"oldpassword":this.password})
    }
  }
}