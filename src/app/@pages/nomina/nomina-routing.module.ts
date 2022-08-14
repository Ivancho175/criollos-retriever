import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NovedadesComponent } from './novedades/novedades.component';
import { PrestamosComponent } from './prestamos/prestamos.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'novedades',
    pathMatch: 'full',
  },
  {
    path: 'novedades',
    component: NovedadesComponent,
  },
  {
    path: 'prestamos',
    component: PrestamosComponent,
  },
  {
    path: '**',
    redirectTo: 'novedades',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NominaRoutingModule {}
