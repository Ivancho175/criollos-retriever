export interface Empleado {
  id: number;
  imageUrl: string;
  firstName: string;
  lastName: string;
  email: string;
  identification: string;
  age: number;
  dob: string;
  salary: number;
  address: string;
  rol: number;
}

export interface Asistente extends Empleado {}

export interface Jefe extends Empleado {}
