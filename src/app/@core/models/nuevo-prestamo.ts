import { CuotaExtra } from './cuota-extra';

export interface NuevoPrestamo {
  quien_aprueba_el_prestamo: string;
  fecha: Date;
  nombre_del_empleado: string;
  documento_de_identificacion: number;
  centro_de_costos: string;
  fecha_ingreso_nomina: Date;
  valor_del_prestamo: number;
  numero_de_cuotas: number;
  tipo_de_prestamo: string;
  cuotas_extra: CuotaExtra[];
  observaciones: string;
}
