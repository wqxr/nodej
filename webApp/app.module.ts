import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './component/root/root';
import { HeaderinfoComponent } from './component/headerinfo/headerinfo';
import { FormsModule } from '@angular/forms';

import { LeftInfoComponent } from './component/centerInfo/centerInfo';
import { AsideComponent } from './component/aside/aside';
import { LogPanel } from './component/logPanel/logPanel';
import { PointPanel } from './component/pointPanel/pointPanel';
import { LoginlPanel } from './component/loginPanel/login.panel';

import { StationB } from './component/stationB/stationB';
import { StationA } from './component/stationA/stationA';
import { SavePointComponent } from './component/savepoint/savepoint';


import { IOpanelComponemt } from './component/IOpanel/ioPanel';



import { footerInfoComponent } from './component/footerInfo/footerInfo';
import { IPCService } from './common/service/ipc.service';

//import { AssemblingService } from './service/assemblingService';






@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
  ],
  declarations: [
    AppComponent,
    HeaderinfoComponent,
    LeftInfoComponent,
    footerInfoComponent,
    AsideComponent,
    LogPanel,
    PointPanel,
    StationB,
    StationA,
    LoginlPanel,
    IOpanelComponemt,
    SavePointComponent
    

  ],
  providers: [
    IPCService,
   
    //AssemblingService,
    

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }