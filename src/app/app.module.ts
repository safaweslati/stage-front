import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {ROUTING} from "./app.routing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LoginInterceptorProvider} from "./login/Interceptors/login.interceptor";
import {LoginGuard} from "./login/guards/login.guard";
import {HttpClientModule} from "@angular/common/http";
import { HomeComponent } from './home/home.component';
import { FileConfigComponent } from './file-config/file-config.component';
import { HeaderComponent } from './header/header.component';
import { UploadedFilesComponent } from './uploaded-files/uploaded-files.component';
import {DatePipe} from "@angular/common";
import {LogoutGuard} from "./login/guards/logout.guard";
import { DisplayDataComponent } from './display-data/display-data.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    FileConfigComponent,
    UploadedFilesComponent,
    HeaderComponent,
    DisplayDataComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ROUTING,
    FormsModule,
    HttpClientModule,
  ],
  providers: [LoginInterceptorProvider,LoginGuard,DatePipe,LogoutGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
