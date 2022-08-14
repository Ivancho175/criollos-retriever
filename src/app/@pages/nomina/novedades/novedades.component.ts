import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { DataService } from 'src/app/@core/services/data.service';
import { Empleado, Asistente, Jefe } from 'src/app/@core/models/empleados';
import { Novedad } from 'src/app/@core/models/novedad';

@Component({
  selector: 'app-novedades',
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.scss'],
})
export class NovedadesComponent implements OnInit {
  empleados: Empleado[] = [];
  actualEmpleado: Empleado | undefined = {
    id: 0,
    imageUrl: '',
    firstName: '',
    lastName: '',
    email: '',
    identification: '',
    age: 0,
    dob: Date(),
    salary: 0,
    address: '',
    rol: 0,
  };
  asistentes: Asistente[] = [];
  jefes: Jefe[] = [];
  novedades: Novedad[] = [];
  soportes: File[] = [];
  date: Date = new Date();
  filteredEmpleadosNames!: Observable<string[]>;
  filteredAsistentesNames!: Observable<string[]>;
  filteredJefesNames!: Observable<string[]>;

  public novedadesForm: FormGroup;

  public aprueba = new FormControl('', [
    Validators.minLength(4),
    Validators.required,
  ]);

  public fecha = new FormControl('');

  public empleado = new FormControl('', [
    Validators.required,
    Validators.minLength(4),
  ]);

  public identificacion = new FormControl('', [
    Validators.minLength(6),
    Validators.maxLength(10),
  ]);

  public fechaIngreso = new FormControl();

  public tipoNovedad = new FormControl('', [Validators.required]);

  public diasFacturar = new FormControl('', [Validators.required]);

  public diasLaborados = new FormControl('', [Validators.required]);

  public inicioNovedad = new FormControl('', [Validators.required]);

  public finNovedad = new FormControl('', [Validators.required]);

  public observaciones = new FormControl();

  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder
  ) {
    this.novedadesForm = this.formBuilder.group({
      aprueba: this.aprueba,
      fecha: this.fecha,
      empleado: this.empleado,
      identificacion: this.identificacion,
      fechaIngreso: this.fechaIngreso,
      tipoNovedad: this.tipoNovedad,
      diasFacturar: this.diasFacturar,
      diasLaborados: this.diasLaborados,
      inicioNovedad: this.inicioNovedad,
      finNovedad: this.finNovedad,
      observaciones: this.observaciones,
    });
  }

  async ngOnInit() {
    const response: any = await this.dataService.getEmployees();
    this.empleados = response.filter((e: Empleado) => {
      return e.rol === 0;
    });
    this.asistentes = response.filter((e: Asistente) => {
      return e.rol === 1;
    });
    this.jefes = response.filter((e: Jefe) => {
      return e.rol === 2;
    });
    const novRes: any = await this.dataService.getNews();
    this.novedades = novRes;
    this.filteredJefesNames = this.aprueba.valueChanges.pipe(
      startWith(''),
      map((value) => this._jefesFilter(value))
    );
    this.filteredEmpleadosNames = this.empleado.valueChanges.pipe(
      startWith(''),
      map((value) => this._empleadosFilter(value))
    );
    this.novedadesForm.get('fecha')?.patchValue(this.formatDate(new Date()));
    this.novedadesForm.get('fecha')?.disabled;
  }

  private formatDate(date: Date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  private _jefesFilter(value: string | null): string[] {
    const filterValue = value!.toLowerCase();
    const jefesNames = this.jefes.map((jefe: Jefe) => {
      return jefe.firstName + ' ' + jefe.lastName;
    });
    return jefesNames.filter((jefe: string) => {
      return jefe.toLowerCase().includes(filterValue);
    });
  }

  private _empleadosFilter(value: string | null): string[] {
    const filterValue = value!.toLowerCase();
    const empleadosNames = this.empleados.map((empleado: Empleado) => {
      return empleado.firstName + ' ' + empleado.lastName;
    });
    return empleadosNames.filter((empleado: string) => {
      return empleado.toLowerCase().includes(filterValue);
    });
  }

  displayFn(subject: any) {
    return subject ? subject : undefined;
  }

  sendForm(form: FormGroup) {
    console.log(form.value);
  }

  findUserByName(name: string | null) {
    if (name) {
      this.actualEmpleado = this.empleados.find((e: any) => {
        return e.firstName + ' ' + e.lastName === name;
      });
      this.novedadesForm
        .get('identificacion')
        ?.patchValue(this.actualEmpleado?.identification);
      const str = this.actualEmpleado?.dob;
      const [month, day, year] = str!.split('/');
      const date = new Date(+year, +month - 1, +day);
      this.novedadesForm.get('fechaIngreso')?.patchValue(this.formatDate(date));
    }
    return null;
  }

  onSelect(event: any) {
    console.log(event);
    this.soportes.push(...event.addedFiles);
  }

  onRemove(event: any) {
    console.log(event);
    this.soportes.splice(this.soportes.indexOf(event), 1);
  }
}
