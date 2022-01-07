import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PrincipalComponent } from './principal/principal.component';
import { NuevoComponent } from './nuevo/nuevo.component';
import { ModificarComponent } from './modificar/modificar.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './guard/auth.guard';
import { RecuentoComponent } from './recuento/recuento.component';

const routes: Routes = [ { path: '', pathMatch: 'full', redirectTo: '/auth' },
{ path: 'auth', component: AuthComponent},
{ path: 'principal', component: PrincipalComponent, canActivate: [AuthGuard]},
{ path: 'recuento', component: RecuentoComponent,  canActivate: [AuthGuard]},
{ path: 'nuevopersona', component: NuevoComponent},
{ path: ':id', component: ModificarComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
