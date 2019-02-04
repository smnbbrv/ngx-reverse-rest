import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ReverseRestClass, ReverseRestRequest, ReverseRestUtils } from '../../projects/ngx-reverse-rest/src/public_api';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(
    private http: HttpClient,
    private utils: ReverseRestUtils,
  ) { }

  getArray<T>(clss: ReverseRestClass<T>, params: ReverseRestRequest = {}) {
    return this.http.get<T[]>(this.utils.resolveUrl(params), this.utils.getHttpOptions(params))
      .pipe(map(r => r.map(i => new clss(i))));
  }

  get<T>(clss: ReverseRestClass<T>, params: ReverseRestRequest = {}) {
    return this.http.get<T>(this.utils.resolveUrl(clss, params.path), this.utils.getHttpOptions(params))
      .pipe(map(r => new clss(r)));
  }

  put<T>(object: T, params: ReverseRestRequest = {}) {
    return this.http.put<T>(this.utils.resolveUrl(params), object, this.utils.getHttpOptions(params))
      .pipe(map(r => new (this.utils.resolveClass(object))(r)));
  }

  post<T>(object: T, params: ReverseRestRequest = {}) {
    return this.http.post<T>(this.utils.resolveUrl(params), object, this.utils.getHttpOptions(params))
      .pipe(map(r => new (this.utils.resolveClass(object))(r)));
  }

  delete(params: ReverseRestRequest) {
    return this.http.delete<void>(this.utils.resolveUrl(params), { params: params.query, headers: params.headers });
  }

}
