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
import { Prestamo } from 'src/app/@core/models/novedad';

@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.scss'],
})
export class PrestamosComponent implements OnInit {
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
  prestamos: Prestamo[] = [];
  date: Date = new Date();
  filteredEmpleadosNames!: Observable<string[]>;
  filteredAsistentesNames!: Observable<string[]>;
  filteredJefesNames!: Observable<string[]>;

  public prestamosForm: FormGroup;

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

  public valorPrestamo = new FormControl('', [
    Validators.required,
    Validators.min(10000),
  ]);

  public numeroCuotas = new FormControl('', [
    Validators.required,
    Validators.min(1),
    Validators.max(36),
  ]);

  public tipoPrestamo = new FormControl('', [Validators.required]);

  public cuotasExtra = new FormControl(0, [Validators.max(10)]);

  public valorCuotaExtra = new FormControl('', [Validators.min(10000)]);

  public observaciones = new FormControl();

  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder
  ) {
    this.prestamosForm = this.formBuilder.group({
      aprueba: this.aprueba,
      fecha: this.fecha,
      empleado: this.empleado,
      identificacion: this.identificacion,
      fechaIngreso: this.fechaIngreso,
      valorPrestamo: this.valorPrestamo,
      numeroCuotas: this.numeroCuotas,
      tipoPrestamo: this.tipoPrestamo,
      cuotasExtra: this.cuotasExtra,
      valorCuotaExtra: this.valorCuotaExtra,
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
    const presRes: any = await this.dataService.getLends();
    this.prestamos = presRes;
    this.filteredJefesNames = this.aprueba.valueChanges.pipe(
      startWith(''),
      map((value) => this._jefesFilter(value))
    );
    this.filteredEmpleadosNames = this.empleado.valueChanges.pipe(
      startWith(''),
      map((value) => this._empleadosFilter(value))
    );
    this.prestamosForm.get('fecha')?.patchValue(this.formatDate(new Date()));
    this.prestamosForm.get('fecha')?.disabled;
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
      this.prestamosForm
        .get('identificacion')
        ?.patchValue(this.actualEmpleado?.identification);
      const str = this.actualEmpleado?.dob;
      const [month, day, year] = str!.split('/');
      const date = new Date(+year, +month - 1, +day);
      this.prestamosForm.get('fechaIngreso')?.patchValue(this.formatDate(date));
    }
    return null;
  }
}
