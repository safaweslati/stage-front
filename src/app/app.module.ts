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
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { UploadedFilesComponent } from './uploaded-files/uploaded-files.component';
import {DatePipe} from "@angular/common";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    FileConfigComponent,
    AppLayoutComponent,
    UploadedFilesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ROUTING,
    FormsModule,
    HttpClientModule,
  ],
  providers: [LoginGuard,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
