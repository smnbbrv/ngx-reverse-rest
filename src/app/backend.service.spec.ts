import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ReverseRestModule } from '../../projects/ngx-reverse-rest/src/public_api';
import { BackendService } from './backend.service';

describe('BackendService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: HttpClient, useValue: {} }
    ],
    imports: [
      ReverseRestModule,
    ],
  }));

  it('should be created', () => {
    const service: BackendService = TestBed.get(BackendService);
    expect(service).toBeTruthy();
  });
});
