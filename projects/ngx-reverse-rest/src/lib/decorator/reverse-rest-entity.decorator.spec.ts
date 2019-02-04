import { TestBed } from '@angular/core/testing';
import { ReverseRestEntities } from '../reverse-rest-entities';
import { DecoratorReverseRestEntities, ReverseRestEntity } from './reverse-rest-entity.decorator';

describe('ReverseRestEntity', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ReverseRestEntities, useValue: DecoratorReverseRestEntities },
      ],
    });
  });

  it('should be a class decorator', () => {
    @ReverseRestEntity({ urls: [''] })
    class TestClass { }

    expect(TestClass).toBeTruthy();
  });

  it('should register the class in the global config', () => {
    @ReverseRestEntity({ urls: ['testUrl'] })
    class TestClass { }

    const config: ReverseRestEntities = TestBed.get(ReverseRestEntities);

    expect(config.entities.get(TestClass)).toBeTruthy();
    expect(config.entities.get(TestClass).urls).toEqual(['testUrl']);
  });

  it('should be forgotten for the scoped classes and collected by GC', () => {
    const config: ReverseRestEntities = TestBed.get(ReverseRestEntities);

    @ReverseRestEntity({ urls: ['testUrl'] }) class TestClass { }

    expect(config.entities instanceof WeakMap).toBeTruthy();
  });
});
