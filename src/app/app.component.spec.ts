import { async, TestBed } from '@angular/core/testing';
import { ReverseRestModule } from '../../projects/ngx-reverse-rest/src/public_api';
import { AppComponent } from './app.component';
import { BackendService } from './backend.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: BackendService, useValue: {} }
      ],
      imports: [
        ReverseRestModule,
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
