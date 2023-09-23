import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {HomeComponent} from "./home/home.component";
import {FileConfigComponent} from "./file-config/file-config.component";
import {AppLayoutComponent} from "./app-layout/app-layout.component";


const APP_ROUTING : Routes = [
  { path: '',
  component: AppLayoutComponent,
  children: [
  { path: 'home', component: HomeComponent },
  {path: 'FileConfig', component: FileConfigComponent}]},
  {path: 'login', component: LoginComponent},
];

export const ROUTING = RouterModule.forRoot(APP_ROUTING);
