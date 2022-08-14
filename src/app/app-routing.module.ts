import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'nomina',
    pathMatch: 'full',
  },
  {
    path: 'nomina',
    loadChildren: () =>
      import('./@pages/nomina/nomina.module').then((m) => m.NominaModule),
  },
  {
    path: '**',
    redirectTo: 'nomina',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
