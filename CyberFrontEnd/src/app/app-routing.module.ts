import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PrincipalComponent } from './principal/principal.component';
import { NuevoComponent } from './nuevo/nuevo.component';
import { ModificarComponent } from './modificar/modificar.component';


const routes: Routes = [ { path: '', pathMatch: 'full', redirectTo: '/principal' },
{ path: 'principal', component: PrincipalComponent},
{ path: 'nuevopersona', component: NuevoComponent},
{ path: ':id', component: ModificarComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
