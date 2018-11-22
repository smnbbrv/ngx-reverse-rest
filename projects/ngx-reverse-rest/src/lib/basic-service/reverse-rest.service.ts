import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ReverseRestRequest } from '../reverse-rest-request';
import { ReverseRestUrlService } from '../url-service/reverse-rest-url.service';

@Injectable({
  providedIn: 'root'
})
export class ReverseRestService {

  constructor(
    private http: HttpClient,
    private rrUrlService: ReverseRestUrlService,
  ) { }

  getArray<T>(params: ReverseRestRequest<T>) {
    return this.http.get<T[]>(
      this.rrUrlService.resolveUrl(params),
      { params: params.query, headers: params.headers }
    ).pipe(map(r => r.map(i => new params.class(i))));
  }

  get<T>(params: ReverseRestRequest<T>) {
    return this.http.get(
      this.rrUrlService.resolveUrl(params),
      { params: params.query, headers: params.headers }
    ).pipe(map(r => new params.class(r)));
  }

  put<T>(params: ReverseRestRequest<T>) {
    return this.http.put(
      this.rrUrlService.resolveUrl(params),
      params.object,
      { params: params.query, headers: params.headers }
    ).pipe(map(r => new params.class(r)));
  }

  post<T>(params: ReverseRestRequest<T>) {
    return this.http.post(
      this.rrUrlService.resolveUrl(params),
      params.object,
      { params: params.query, headers: params.headers }
    ).pipe(map(r => new params.class(r)));
  }

  delete<T>(params: ReverseRestRequest<T>) {
    return this.http.delete<void>(
      this.rrUrlService.resolveUrl(params),
      { params: params.query, headers: params.headers }
    );
  }

}
