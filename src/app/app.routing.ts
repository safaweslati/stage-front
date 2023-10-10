import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {HomeComponent} from "./home/home.component";
import {FileConfigComponent} from "./file-config/file-config.component";
import {HeaderComponent} from "./header/header.component";
import {LogoutGuard} from "./login/guards/logout.guard";
import {LoginGuard} from "./login/guards/login.guard";
import {DisplayDataComponent} from "./display-data/display-data.component";



const APP_ROUTING : Routes = [
  {path: '', component: LoginComponent,canActivate: [LogoutGuard]},
  {path: '', component: HeaderComponent, canActivate: [LoginGuard],
  children: [
  {path: 'home', component: HomeComponent,canActivate: [LoginGuard] },
  {path: 'FileConfig', component: FileConfigComponent,canActivate: [LoginGuard] },
    {path: 'DisplayData', component: DisplayDataComponent,canActivate: [LoginGuard]},
  ],},
  {path: 'login', component: LoginComponent,  canActivate: [LogoutGuard]},

  ];

export const ROUTING = RouterModule.forRoot(APP_ROUTING);
