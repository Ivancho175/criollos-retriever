import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { NuevaNovedad } from '../models/nueva-novedad';
import { NuevoPrestamo } from '../models/nuevo-prestamo';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  async getEmployees() {
    return this.http.get(environment.url + 'employee').toPromise();
  }

  async getNews() {
    return this.http.get(environment.url + 'novelty_type').toPromise();
  }

  async getLends() {
    return this.http.get(environment.url + 'loan_type').toPromise();
  }

  async getCostCenter() {
    return this.http.get(environment.url + 'cost_center').toPromise();
  }

  newNovelty(data: NuevaNovedad) {
    return this.http.post(environment.url + 'novelty', data).toPromise();
  }

  newLoan(data: NuevoPrestamo) {
    return this.http.post(environment.url + 'loan', data).toPromise();
  }
}
