import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Spline } from '../../models/spline/spline.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SplineService {
  private readonly baseURL: string;


  constructor(private httpClient: HttpClient) {
    this.baseURL = 'https://localhost:44330/api/';
  }


  getSpline(id?: string) {
    return this.httpClient.get(this.baseURL + 'Spline/' + id).pipe(map((splines: Spline) => {
      return splines;
    }));
  }

  async editSpline(id: string, spline: Spline) {
    console.log(spline);
    return this.httpClient.put<Spline>(this.baseURL + 'Spline/' + id, spline);
  }

}
