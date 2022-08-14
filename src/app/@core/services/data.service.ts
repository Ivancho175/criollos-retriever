import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  async getEmployees() {
    return this.http.get(environment.url + '/getEmpleados').toPromise();
  }

  async getNews() {
    return this.http.get(environment.url + '/getNovedades').toPromise();
  }

  async getLends() {
    return this.http.get(environment.url + '/getPrestamos').toPromise();
  }
}
