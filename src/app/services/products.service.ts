import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}

  public getAllProducts() {
    return this.http.get('https://api.escuelajs.co/api/v1/products');
  }
}
