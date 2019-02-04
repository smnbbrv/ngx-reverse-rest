import { TestBed } from '@angular/core/testing';
import { DecoratorReverseRestEntities, ReverseRestEntity } from '../decorator/reverse-rest-entity.decorator';
import { ReverseRestEntities } from '../reverse-rest-entities';
import { NO_CLASS_CONFIG_PROVIDED, NO_URL_ERROR, ReverseRestUtils, TOO_MANY_URLS_ERROR } from './reverse-rest-utils.service';

describe('ReverseRestUtils', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: ReverseRestEntities, useValue: DecoratorReverseRestEntities }
    ]
  }));

  it('should be created', () => {
    const service: ReverseRestUtils = TestBed.get(ReverseRestUtils);
    expect(service).toBeTruthy();
  });

  describe('parseUrl', () => {
    it('should parse the relative URL', () => {
      const service: ReverseRestUtils = TestBed.get(ReverseRestUtils);

      expect(service.parseUrl(':var1/path1')).toEqual([
        { type: 'variable', segmentValue: 'var1' },
        { type: 'path', segmentValue: 'path1' },
      ]);

      expect(service.parseUrl('path1/:var1/:var2/path2/:var3')).toEqual([
        { type: 'path', segmentValue: 'path1' },
        { type: 'variable', segmentValue: 'var1' },
        { type: 'variable', segmentValue: 'var2' },
        { type: 'path', segmentValue: 'path2' },
        { type: 'variable', segmentValue: 'var3' },
      ]);
    });

    it('should parse the absolute URL', () => {
      const service: ReverseRestUtils = TestBed.get(ReverseRestUtils);

      expect(service.parseUrl('/:var1/path1')).toEqual([
        { type: 'host', segmentValue: '' },
        { type: 'variable', segmentValue: 'var1' },
        { type: 'path', segmentValue: 'path1' },
      ]);

      expect(service.parseUrl('/path1/:var1/:var2/path2/:var3')).toEqual([
        { type: 'host', segmentValue: '' },
        { type: 'path', segmentValue: 'path1' },
        { type: 'variable', segmentValue: 'var1' },
        { type: 'variable', segmentValue: 'var2' },
        { type: 'path', segmentValue: 'path2' },
        { type: 'variable', segmentValue: 'var3' },
      ]);
    });

    it('should parse the full URL (with host etc)', () => {
      const service: ReverseRestUtils = TestBed.get(ReverseRestUtils);

      expect(service.parseUrl('https://domain.com:8888/:var1/path1')).toEqual([
        { type: 'host', segmentValue: 'https://domain.com:8888' },
        { type: 'variable', segmentValue: 'var1' },
        { type: 'path', segmentValue: 'path1' },
      ]);

      expect(service.parseUrl('://domain.com/:var1/path1')).toEqual([
        { type: 'host', segmentValue: '://domain.com' },
        { type: 'variable', segmentValue: 'var1' },
        { type: 'path', segmentValue: 'path1' },
      ]);

      expect(service.parseUrl('http://domain.com/path1/:var1/:var2/path2/:var3')).toEqual([
        { type: 'host', segmentValue: 'http://domain.com' },
        { type: 'path', segmentValue: 'path1' },
        { type: 'variable', segmentValue: 'var1' },
        { type: 'variable', segmentValue: 'var2' },
        { type: 'path', segmentValue: 'path2' },
        { type: 'variable', segmentValue: 'var3' },
      ]);
    });
  });

  describe('resolveUrl', () => {
    @ReverseRestEntity({
      urls: [
        '/api/rest/v1/path1',
        '/api/rest/v1/path1/:id'
      ],
    })
    class Test1 { }

    @ReverseRestEntity({
      urls: [
        '/api/rest/v1/path1',
        '/api/rest/v1/path1/:id',
        '/api/rest/v1/path2/:path2id/path1',
        '/api/rest/v1/path2/:path2id/path1/:id'
      ],
    })
    class Test2 { }

    @ReverseRestEntity({
      urls: [
        '/api/rest/v1/path1',
        '/api/rest/v1/path1/path2',
        '/api/rest/v1/path1/:id',
        '/api/rest/v1/path1/path2/:id',
      ],
    })
    class WrongClass { }

    class NoDecorator { }

    it('should not throw when no path is given', () => {
      const service: ReverseRestUtils = TestBed.get(ReverseRestUtils);
      expect(() => service.resolveUrl(Test1, {})).not.toThrow();
    });

    it('should resolve simple url w/ & w/o variable', () => {
      const service: ReverseRestUtils = TestBed.get(ReverseRestUtils);
      const resolvedUrl1 = service.resolveUrl(Test1, {});
      const resolvedUrl2 = service.resolveUrl(Test1, { id: '123' });

      expect(resolvedUrl1).toBe('/api/rest/v1/path1');
      expect(resolvedUrl2).toBe('/api/rest/v1/path1/123');
    });

    it('should get the class from the object, if provided', () => {
      const service: ReverseRestUtils = TestBed.get(ReverseRestUtils);
      const resolvedUrl1 = service.resolveUrl(new Test1(), {});
      const resolvedUrl2 = service.resolveUrl(new Test1(), { id: '123' });

      expect(resolvedUrl1).toBe('/api/rest/v1/path1');
      expect(resolvedUrl2).toBe('/api/rest/v1/path1/123');
    });

    it('should resolve complex url w/ & w/o multiple variables', () => {
      const service: ReverseRestUtils = TestBed.get(ReverseRestUtils);
      const resolvedUrl1 = service.resolveUrl(Test2, {});
      const resolvedUrl2 = service.resolveUrl(Test2, { id: '123' });
      const resolvedUrl3 = service.resolveUrl(Test2, { path2id: '321' });
      const resolvedUrl4 = service.resolveUrl(Test2, { path2id: '321', id: '123' });

      expect(resolvedUrl1).toBe('/api/rest/v1/path1');
      expect(resolvedUrl2).toBe('/api/rest/v1/path1/123');
      expect(resolvedUrl3).toBe('/api/rest/v1/path2/321/path1');
      expect(resolvedUrl4).toBe('/api/rest/v1/path2/321/path1/123');
    });

    it('should throw when no class config is found', () => {
      const service: ReverseRestUtils = TestBed.get(ReverseRestUtils);
      expect(() => service.resolveUrl({}, {})).toThrow(NO_CLASS_CONFIG_PROVIDED);
      expect(() => service.resolveUrl(NoDecorator, {})).toThrow(NO_CLASS_CONFIG_PROVIDED);
      expect(() => service.resolveUrl(new NoDecorator(), {})).toThrow(NO_CLASS_CONFIG_PROVIDED);
    });

    it('should throw when no URL can be found in the configuration', () => {
      const service: ReverseRestUtils = TestBed.get(ReverseRestUtils);
      expect(() => service.resolveUrl(WrongClass, { notExistingParam: 123 })).toThrow(NO_URL_ERROR);
    });

    it('should throw when multiple URLs can be found in the configuration', () => {
      const service: ReverseRestUtils = TestBed.get(ReverseRestUtils);
      expect(() => service.resolveUrl(WrongClass, {})).toThrow(TOO_MANY_URLS_ERROR);
    });
  });
});
