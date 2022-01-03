import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public signIn(userData: User){
    return this.http.post(environment.apiURL + '/rsa/signIn', userData);
    //localStorage.setItem('ACCESS_TOKEN', 'access_token');
  }
  public isLoggedIn(){
    return localStorage.getItem('ACCESS_TOKEN') !== null;
  }
  public logout(){
    localStorage.removeItem('ACCESS_TOKEN');
  }
  public getToken(){
    return localStorage.getItem('ACCESS_TOKEN');
  }
}
