import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ReverseRestUrlService } from '../url-service/reverse-rest-url.service';
import { ReverseRestService } from './reverse-rest.service';

describe('ReverseRestService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: HttpClient, useValue: {} },
      { provide: ReverseRestUrlService, useValue: {} },
    ],
  }));

  it('should be created', () => {
    const service: ReverseRestService = TestBed.get(ReverseRestService);
    expect(service).toBeTruthy();
  });
});
