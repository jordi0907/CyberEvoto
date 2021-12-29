import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


import {persona} from '../model/persona'

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  constructor( private http: HttpClient) {}

  getPersonas(): Observable<persona[]>{
    return this.http.get<persona[]>(environment.apiURL + "/persona");
  }

  getPersona(id: String): Observable<persona>{
    return this.http.get<persona>(environment.apiURL + "/persona/" + id);
  }

  modificarPersona(resultadomodificado: persona, id: String): Observable<any>{
    return this.http.put(environment.apiURL + "/persona/" + id, resultadomodificado);
  }

  addPersona(nuevoresultado: persona): Observable<any>{
    return this.http.post(environment.apiURL + '/persona', nuevoresultado);
  }




}
