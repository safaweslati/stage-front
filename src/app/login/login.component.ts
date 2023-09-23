import { Component } from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthentificationService} from "./services/authentification.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private authenticationService : AuthentificationService,
              private router : Router) {
  }
  login(loginForm: NgForm) {
    console.log(loginForm.value);
    this.authenticationService.login(loginForm.value).subscribe(
      (reponse: any) => {
        const token = reponse.token;
        const link = ['home'];
        localStorage['token'] = token;
        this.router.navigate(link);
      },
      (error) => console.log(error)
    )
  }
}
