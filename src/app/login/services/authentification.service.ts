import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private link = 'https://localhost:7100/api/User/login';

  constructor(private http : HttpClient) { }

  login(credentials: any) {
      return this.http.post(this.link, credentials);
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('headers');
  }

  isLogged(){
    return !! localStorage.getItem('token');
  }
}
