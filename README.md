# ngx-reverse-rest

The Angular REST library that thinks differently.

Leightweight, fully tested and as flexible as it could be (with DI in its heart).

[![Build Status](https://img.shields.io/travis/smnbbrv/ngx-reverse-rest/master.svg)](https://travis-ci.org/smnbbrv/ngx-reverse-rest)
[![Coverage Status](https://img.shields.io/coveralls/github/smnbbrv/ngx-reverse-rest/master.svg)](https://coveralls.io/github/smnbbrv/ngx-reverse-rest?branch=master)

## What it is about

Terms:

- REST Service - an Angular service that performs the communication with the REST endpoint
- DTO (Data Transfer Object) - a class that represents a data being sent (similar to gRPC message)

Most of the REST libraries in the wild look at the communication with REST endpoints from services prospective. Every endpoint gets a corresponding Angular service. Every service sends / receives the DTOs.

This library attempts to reverse this idea. Mostly, while developing, one does not care about the different REST services. One cares about the DTOs, so here the DTO holds all information that is required for getting / sending this DTO.

## Installation

```sh
npm i ngx-reverse-rest
```

## Usage

### 1. Add module to the app.module.ts

```ts
imports: [
  // ...
  ReverseRestModule,
  // ...
]
```

### 2. BackendService

Create a REST Service that will be (most likely) the only one you have:

```ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ReverseRestClass, ReverseRestRequest, ReverseRestUtils } from 'ngx-reverse-rest';

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
    return this.http.put(this.utils.resolveUrl(params), object, this.utils.getHttpOptions(params))
      .pipe(map(r => new (this.utils.resolveClass(object))(r)));
  }

  post<T>(object: T, params: ReverseRestRequest = {}) {
    return this.http.post(this.utils.resolveUrl(params), object, this.utils.getHttpOptions(params))
      .pipe(map(r => new (this.utils.resolveClass(object))(r)));
  }

  delete(params: ReverseRestRequest) {
    return this.http.delete<void>(this.utils.resolveUrl(params), { params: params.query, headers: params.headers });
  }

}
```

### 3. Describe your entities

For each of your DTOs add the endpoint describing where you get them from / send them to:

```ts
import { ReverseRestEntity } from 'ngx-reverse-rest';

@ReverseRestEntity({
  urls: [
    '/api/rest/v1/entities',
    '/api/rest/v1/entities/:id',
    '/api/rest/v1/entity-groups/:groupId/entities',
    '/api/rest/v1/entity-groups/:groupId/entities/:id'
  ],
})
class ExampleEntity {
  id: string;
  name: string;

  constructor(options: Partial<ExampleEntity> = {}) {
    this.id = options.id;
    this.name = options.name;
  }
}
```

Here the users could be received from different endpoints.

### 4. Send and receive

See app.component.ts in this project:

```ts
import { Component, OnInit } from '@angular/core';
import { BackendService } from './backend-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private backend: BackendService) {
  }

  ngOnInit() {
    // get by auxiliary path parameter
    this.backend.getArray(ExampleEntity, { path: { groupId: 'example-group' } }).subscribe(entities => {
      console.log(entities.map(entity => entity.name));
    });

    // create
    this.backend.post(new ExampleEntity()).subscribe(entity => {
      console.log(entity.name);

      entity.name = 'new name';

      // update
      this.backend.put(entity).subscribe(updatedEntity => {
        console.log(updatedEntity.name);

        // delete
        this.backend.delete({ path: { id: updatedEntity } });
      });
    });
  }

}
```

## License

MIT
