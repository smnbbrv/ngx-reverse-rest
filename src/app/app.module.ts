import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReverseRestModule } from '../../projects/ngx-reverse-rest/src/public_api';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReverseRestModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
