import { NgModule } from '@angular/core';
import { DecoratorReverseRestEntities } from './decorator/reverse-rest-entity.decorator';
import { ReverseRestEntities } from './reverse-rest-entities';

@NgModule({
  providers: [
    {
      provide: ReverseRestEntities,
      useValue: DecoratorReverseRestEntities,
    }
  ],
})
export class ReverseRestModule { }
