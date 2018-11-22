import { TestBed } from '@angular/core/testing';
import { ReverseRestClasses } from '../reverse-rest-classes';
import { DecoratorReverseRestClasses, ReverseRestClass } from './reverse-rest-class.decorator';

describe('ReverseRestClass', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ReverseRestClasses, useValue: DecoratorReverseRestClasses },
      ],
    });
  });

  it('should be a class decorator', () => {
    @ReverseRestClass({ urls: [''] })
    class TestClass { }

    expect(TestClass).toBeTruthy();
  });

  it('should register the class in the global config', () => {
    @ReverseRestClass({ urls: ['testUrl'] })
    class TestClass { }

    const config: ReverseRestClasses = TestBed.get(ReverseRestClasses);

    expect(config.classes.get(TestClass)).toBeTruthy();
    expect(config.classes.get(TestClass).urls).toEqual(['testUrl']);
  });

  it('should be forgotten for the scoped classes and collected by GC', () => {
    const config: ReverseRestClasses = TestBed.get(ReverseRestClasses);

    @ReverseRestClass({ urls: ['testUrl'] }) class TestClass { }

    expect(config.classes instanceof WeakMap).toBeTruthy();
  });
});
