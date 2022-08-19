export interface Empleado {
  uuid: string;
  identificacion: number;
  tipo_id: string;
  empleado: string;
  sexo: string;
  estado_civil: string;
  fecha_ingreso: string;
  salario: number;
  bienestar: number;
  transporte: number;
  comunicacion: number;
  cargo: string;
  codigo_de_costo: number;
  centro_de_costo: string;
  celular: number;
  direccion: string;
  correo_corporativo: string;
  rol: number;
}

export interface Jefe extends Empleado {}
