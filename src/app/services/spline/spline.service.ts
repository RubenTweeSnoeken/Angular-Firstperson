import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Spline} from '../../models/spline/spline.model';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SplineService {
  private readonly baseURL: string;


  constructor(private httpClient: HttpClient) {
    this.baseURL = 'https://localhost:44330/api/';
  }


  getSplines() {
    console.log('getPeople ' + this.baseURL + 'Spline');
    return this.httpClient.get(this.baseURL + 'Spline').pipe(
      map((splines: any) => {
        return splines.map((spline) => ({
          uid: spline.payload.doc.id,
          ...spline.payload.doc.data(),
        }));
      })
    );
  }
}
