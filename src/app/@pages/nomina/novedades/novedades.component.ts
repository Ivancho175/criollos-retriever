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
import { Empleado, Jefe } from 'src/app/@core/models/empleados';
import { Novedad } from 'src/app/@core/models/novedad';
import { CentroCosto } from 'src/app/@core/models/centro-costo';
import { NuevaNovedad } from 'src/app/@core/models/nueva-novedad';

@Component({
  selector: 'app-novedades',
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.scss'],
})
export class NovedadesComponent implements OnInit {
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
  actualEmpleado: Empleado | undefined = {
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
    rol: 0,
  };
  jefe: Jefe | undefined = {
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
    rol: 0,
  };
  novedades: Novedad[] = [];
  soportes: File[] = [];
  filteredEmpleadosNames!: Observable<string[]>;
  /* filteredJefesNames!: Observable<string[]>; */
  filteredCostCenterNames!: Observable<string[]>;
  codigo: string = 'F-TH-08';
  version: number = 1;
  fecha_version: string = '12-Ago-2022';
  openModal: boolean = false;

  public novedadesForm: FormGroup;

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

  public tipoNovedad = new FormControl('', [Validators.required]);

  public diasFacturar = new FormControl('', [Validators.required]);

  public diasNovedad = new FormControl('', [Validators.min(1)]);

  public inicioNovedad = new FormControl('', [Validators.required]);

  public finNovedad = new FormControl('', [Validators.required]);

  public observaciones = new FormControl();

  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder
  ) {
    this.novedadesForm = this.formBuilder.group({
      centro_costos: this.centro_costos,
      codigo_centro: this.codigo_centro,
      aprueba: this.aprueba,
      fecha: this.fecha,
      empleado: this.empleado,
      identificacion: this.identificacion,
      fechaIngreso: this.fechaIngreso,
      tipoNovedad: this.tipoNovedad,
      diasFacturar: this.diasFacturar,
      diasNovedad: this.diasNovedad,
      inicioNovedad: this.inicioNovedad,
      finNovedad: this.finNovedad,
      observaciones: this.observaciones,
    });
  }

  async ngOnInit() {
    const costCenter: any = await this.dataService.getCostCenter();
    this.centrosDeCostos = costCenter.data;
    const response: any = await this.dataService.getEmployees();
    this.empleados = response.data.filter((e: Empleado) => {
      return e.rol === 2;
    });
    /* this.jefes = response.filter((e: Jefe) => {
      return e.rol === 2;
    }); */
    const novRes: any = await this.dataService.getNews();
    this.novedades = novRes.data;
    this.filteredCostCenterNames = this.centro_costos.valueChanges.pipe(
      startWith(''),
      map((value) => this._costCenterFilter(value))
    );
    /* this.filteredJefesNames = this.aprueba.valueChanges.pipe(
      startWith(''),
      map((value) => this._jefesFilter(value))
    ); */
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

  private _costCenterFilter(value: string | null): string[] {
    const filterValue = value!.toLowerCase();
    const costCenterNames = this.centrosDeCostos.map((centro: CentroCosto) => {
      return centro.centro_de_costo;
    });
    return costCenterNames.filter((ccenter: string) => {
      return ccenter.toLowerCase().includes(filterValue);
    });
  }

  /* private _jefesFilter(value: string | null): string[] {
    const filterValue = value!.toLowerCase();
    const jefesNames = this.jefe!.map((jefe: Jefe) => {
      return jefe.empleado;
    });
    return jefesNames.filter((jefe: string) => {
      return jefe.toLowerCase().includes(filterValue);
    });
  } */

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
    this.openModal = true;
    const data: NuevaNovedad = {
      quien_reporta_la_novedad: form.controls['aprueba'].value,
      fecha: this.date,
      nombre_del_empleado: form.controls['empleado'].value,
      documento_de_identificacion: form.controls['identificacion'].value,
      fecha_ingreso_nomina: form.controls['fechaIngreso'].value,
      centro_de_costos: form.controls['centro_costos'].value,
      codigo_centro_de_costos: form.controls['codigo_centro'].value,
      tipo_de_novedad: form.controls['tipoNovedad'].value,
      dias_a_facturar: form.controls['diasFacturar'].value,
      dias_laborados: form.controls['diasNovedad'].value,
      fecha_inicial_novedad: form.controls['inicioNovedad'].value,
      fecha_final_novedad: form.controls['finNovedad'].value,
      observaciones: form.controls['observaciones'].value,
    };

    this.dataService.newNovelty(data);
  }

  findCostCenterByName(name: string | null) {
    if (name) {
      this.actualCentroDeCostos = this.centrosDeCostos.find((e: any) => {
        return e.centro_de_costo === name;
      });
      this.novedadesForm
        .get('codigo_centro')
        ?.patchValue(this.actualCentroDeCostos?.codigo);
      /* this.empleados = this.actualCentroDeCostos?.empleados.filter(
        (e: Empleado) => {
          return e.rol === 2;
        }
      ); */
      const actualJefe = this.actualCentroDeCostos?.empleados.find(
        (e: Jefe) => {
          return e.rol === 1;
        }
      );
      this.novedadesForm.get('aprueba')?.patchValue(actualJefe!.empleado);
    }
    return null;
  }

  findUserByName(name: string | null) {
    if (name) {
      this.actualEmpleado = this.empleados!.find((e: any) => {
        return e.empleado === name;
      });
      this.novedadesForm
        .get('identificacion')
        ?.patchValue(this.actualEmpleado?.identificacion);
      const str = this.actualEmpleado?.fecha_ingreso;
      const [year, month, day] = str!.split('-');
      const date = new Date(+year, +month - 1, +day);
      this.novedadesForm.get('fechaIngreso')?.patchValue(this.formatDate(date));
    }
    return null;
  }

  /* onSelect(event: any) {
    console.log(event);
    this.soportes.push(...event.addedFiles);
  }

  onRemove(event: any) {
    console.log(event);
    this.soportes.splice(this.soportes.indexOf(event), 1);
  } */

  toggleOpen() {
    location.reload();
    this.openModal = !this.openModal;
  }

  fechaInicialNovedad: Date | undefined = undefined;

  onFechaInicialChange(event: any) {
    const fecha = new Date(event.target.value);
    this.fechaInicialNovedad = fecha;
  }

  onInputChange(event: any) {
    const fechaFinal = new Date(event.target.value);
    const diferencia =
      fechaFinal.getTime() - this.fechaInicialNovedad!.getTime();
    const days = diferencia / (1000 * 3600 * 24);
    if (days < 0) {
      this.finNovedad.reset();
      alert('La fecha final debe ser posterior a la inicial');
    } else {
      this.novedadesForm.get('diasNovedad')?.patchValue(days + 1);
    }
  }
}
