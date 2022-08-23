import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { DataService } from 'src/app/@core/services/data.service';
import { Empleado, Jefe } from 'src/app/@core/models/empleados';
import { Prestamo } from 'src/app/@core/models/prestamo';
import { CentroCosto } from 'src/app/@core/models/centro-costo';

@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.scss'],
})
export class PrestamosComponent implements OnInit {
  date: Date = new Date();
  centrosDeCostos: CentroCosto[] = [];
  empleados: Empleado[] | undefined = [];
  actualCentroDeCostos: CentroCosto | undefined = {
    uuid: '',
    codigo: 0,
    centro_de_costo: '',
    empleados: [
      {
        uuid: '',
        identificacion: 0,
        tipo_id: 'CC',
        empleado: '',
        sexo: '',
        estado_civil: '',
        fecha_ingreso: `${this.date}`,
        salario: 0,
        bienestar: 0,
        transporte: 0,
        comunicacion: 0,
        cargo: '',
        codigo_de_costo: 0,
        centro_de_costo: '',
        celular: 0,
        direccion: '',
        correo_corporativo: '',
        rol: 1,
      },
    ],
  };
  actualEmpleado?: Empleado;
  jefes: Jefe[] | undefined = [];
  prestamos: Prestamo[] = [];
  filteredEmpleadosNames!: Observable<string[]>;
  filteredJefesNames!: Observable<string[]>;
  filteredCostCenterNames!: Observable<string[]>;
  codigo: string = 'F-TH-07';
  version: number = 1;
  fecha_version: string = '12-Ago-2022';

  public prestamosForm: FormGroup;

  public centro_costos = new FormControl('', [
    Validators.minLength(4),
    Validators.required,
  ]);

  public codigo_centro = new FormControl('');

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

  public observaciones = new FormControl();

  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder
  ) {
    this.prestamosForm = this.formBuilder.group({
      centro_costos: this.centro_costos,
      codigo_centro: this.codigo_centro,
      aprueba: this.aprueba,
      fecha: this.fecha,
      empleado: this.empleado,
      identificacion: this.identificacion,
      fechaIngreso: this.fechaIngreso,
      valorPrestamo: this.valorPrestamo,
      numeroCuotas: this.numeroCuotas,
      tipoPrestamo: this.tipoPrestamo,
      cuotasExtra: this.formBuilder.array([]),
      observaciones: this.observaciones,
    });
  }

  async ngOnInit() {
    const costCenter: any = await this.dataService.getCostCenter();
    this.centrosDeCostos = costCenter.data;
    /* const response: any = await this.dataService.getEmployees();
    this.empleados = response.filter((e: Empleado) => {
      return e.rol === 0;
    });
    this.jefes = response.filter((e: Jefe) => {
      return e.rol === 2;
    }); */
    const presRes: any = await this.dataService.getLends();
    this.prestamos = presRes.data;
    this.filteredCostCenterNames = this.centro_costos.valueChanges.pipe(
      startWith(''),
      map((value) => this._costCenterFilter(value))
    );
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

  private _costCenterFilter(value: string | null): string[] {
    const filterValue = value!.toLowerCase();
    const costCenterNames = this.centrosDeCostos.map((centro: CentroCosto) => {
      return centro.centro_de_costo;
    });
    return costCenterNames.filter((ccenter: string) => {
      return ccenter.toLowerCase().includes(filterValue);
    });
  }

  private _jefesFilter(value: string | null): string[] {
    const filterValue = value!.toLowerCase();
    const jefesNames = this.jefes!.map((jefe: Jefe) => {
      return jefe.empleado;
    });
    return jefesNames.filter((jefe: string) => {
      return jefe.toLowerCase().includes(filterValue);
    });
  }

  private _empleadosFilter(value: string | null): string[] {
    const filterValue = value!.toLowerCase();
    const empleadosNames = this.empleados!.map((empleado: Empleado) => {
      return empleado.empleado;
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
      this.actualEmpleado = this.empleados!.find((e: any) => {
        return e.empleado === name;
      });
      this.prestamosForm
        .get('identificacion')
        ?.patchValue(this.actualEmpleado?.identificacion);
      const str = this.actualEmpleado?.fecha_ingreso;
      const [month, day, year] = str!.split('-');
      const date = new Date(+year, +month - 1, +day);
      this.prestamosForm.get('fechaIngreso')?.patchValue(this.formatDate(date));
    }
    return null;
  }

  get cuotasExtra(): FormArray {
    return this.prestamosForm.get('cuotasExtra') as FormArray;
  }

  addCuotaExtra() {
    const cuotaExtra = this.formBuilder.group({
      cantidad_cuotas: new FormControl('', [
        Validators.min(1),
        Validators.max(10),
        Validators.required,
      ]),
      valor_cuota: new FormControl('', [
        Validators.min(10000),
        Validators.required,
      ]),
    });
    this.cuotasExtra.push(cuotaExtra);
  }

  removeCuotaExtra(index: number) {
    this.cuotasExtra.removeAt(index);
  }

  findCostCenterByName(name: string | null) {
    if (name) {
      this.actualCentroDeCostos = this.centrosDeCostos.find((e: any) => {
        return e.centro_de_costo === name;
      });
      this.prestamosForm
        .get('codigo_centro')
        ?.patchValue(this.actualCentroDeCostos?.codigo);
      this.empleados = this.actualCentroDeCostos?.empleados.filter(
        (e: Empleado) => {
          return e.rol === 2;
        }
      );
      this.jefes = this.actualCentroDeCostos?.empleados.filter((e: Jefe) => {
        return e.rol === 1;
      });
      console.log(this.empleados);
      console.log(this.jefes);
    }
  }
}
