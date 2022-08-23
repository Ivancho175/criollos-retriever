import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';

/* import { NgxDropzoneModule } from 'ngx-dropzone'; */

import { NominaRoutingModule } from './nomina-routing.module';
import { NovedadesComponent } from './novedades/novedades.component';
import { PrestamosComponent } from './prestamos/prestamos.component';

@NgModule({
  declarations: [NovedadesComponent, PrestamosComponent],
  imports: [
    CommonModule,
    NominaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatButtonModule,
    /* NgxDropzoneModule, */
    MatRippleModule,
    MatExpansionModule,
    MatRadioModule,
  ],
  exports: [NovedadesComponent, PrestamosComponent],
})
export class NominaModule {}
