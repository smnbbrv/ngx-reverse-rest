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

### BackendService

First, create a REST Service that will be (most likely) the only one you have:

```ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ReverseRestRequest, ReverseRestUrlService } from 'ngx-reverse-rest';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

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
```

### Describe your classes

For each of your DTOs add the endpoint describing where you get them from / send them to:

```ts
import { ReverseRestClass } from 'ngx-reverse-rest';

@ReverseRestClass({
  urls: [
    '/api/rest/v1/users',
    '/api/rest/v1/users/:id',
    '/api/rest/v1/system/:systemId/users',
    '/api/rest/v1/system/:systemId/users/:id'
  ],
})
class User {

  id?: string;
  systemIds?: string[];
  firstname?: string;
  lastname?: string;

  constructor(dto: User = {}) {
    this.id = dto.id;
    this.systemIds = dto.systemIds || [];
    this.firstname = dto.firstname;
    this.lastname = dto.lastname;
  }

}
```

Here the users could be received from different endpoints.

### Provide decorators

Provide `ReverseRestClasses` configuration object in your `AppModule`. As long as decorator `ReverseRestClass` is used, the `DecoratorReverseRestClasses` is going to be used as provided value:

```ts
import { DecoratorReverseRestClasses, ReverseRestClasses } from 'ngx-reverse-rest';

@NgModule({
  // ...
  providers: [
    { provide: ReverseRestClasses, useValue: DecoratorReverseRestClasses },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

You can provide your custom configuration object instead and omit using the decorator.

### Send and receive

```ts
import { Component, OnInit } from '@angular/core';
import { BackendService } from './backend-service';

@Component({
  // ...
})
class UserDetailComponent implements OnInit {

  constructor(private backend: BackendService) {
  }

  ngOnInit() {
    // get all users
    this.backend.getArray<User>({ class: User }).subscribe(users => /*...*/);

    // get the users based on system
    this.backend.getArray<User>({ class: User, { systemId: 'auth' } }).subscribe(users => /*...*/);

    // get a particular user
    this.backend.get<User>({ class: User, path: { id: 'boss' } }).subscribe(user => /*...*/);

    // create a user
    this.backend.post<User>({ object: new User({ firstname: 'Firstname' }) }).subscribe(createdUser => {
      createdUser.lastname = 'Lastname';

      // then update this user
      this.backend.put<User>({ object: createdUser, path: { id: createdUser.id } }).subscribe(updatedUser => {
        // and finally delete the user
        this.backend.delete<User>({ path: { id: updatedUser.id } }).subscribe(updatedUser => /*...*/);
      });
    });
  }

}
```

## License

MIT
