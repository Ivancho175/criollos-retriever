import { Empleado, Jefe } from './empleados';

export interface CentroCosto {
  uuid: string;
  codigo: number;
  centro_de_costo: string;
  empleados: Empleado[] | Jefe[];
}
