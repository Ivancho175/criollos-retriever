export interface NuevaNovedad {
  quien_reporta_la_novedad: string;
  fecha: Date;
  nombre_del_empleado: string;
  documento_de_identificacion: number;
  fecha_ingreso_nomina: Date;
  centro_de_costos: string;
  codigo_centro_de_costos: number;
  tipo_de_novedad: string;
  dias_a_facturar: number;
  dias_laborados: number;
  fecha_inicial_novedad: Date;
  fecha_final_novedad: Date;
  observaciones: string;
}
