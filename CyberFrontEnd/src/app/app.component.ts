import { Component, OnInit } from '@angular/core';
import { arraynumeros, numeros } from 'src/datos';
import { COURSES } from 'src/db-data';

import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{


  constructor (  private router: Router,public authService: AuthService){


  }

  ngOnInit(){

  }

  logout(){
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }




}
