import { Injectable } from '@angular/core';
import { ReverseRestClass } from '../reverse-rest-class';
import { ReverseRestEntities } from '../reverse-rest-entities';
import { ReverseRestRequest } from '../reverse-rest-request';
import { ReverseRestUrlSegment } from '../reverse-rest-url-segment';

export const NO_CLASS_CONFIG_PROVIDED = new Error('The configuration for provided class cannot be found');
export const NO_URL_ERROR = new Error('There is no URL found for the provided parameters');
export const TOO_MANY_URLS_ERROR = new Error('There are too many URLs found for the provided parameters');

@Injectable({
  providedIn: 'root'
})
export class ReverseRestUtils {

  private cache: { [prop: string]: ReverseRestUrlSegment[] } = {};

  constructor(
    private rrc: ReverseRestEntities,
  ) { }

  resolveClass<T>(entity: T | ReverseRestClass<T>) {
    return (typeof entity === 'function' ? entity : entity.constructor) as ReverseRestClass<T>;
  }

  resolveConfig<T>(entity: T | ReverseRestClass<T>) {
    return this.rrc.entities.get(this.resolveClass(entity));
  }

  resolveUrl<T>(entity: T | ReverseRestClass<T>, params: { [prop: string]: any; } = {}) {
    const keys = Object.keys(params);
    const clzzConfig = this.resolveConfig(entity);

    if (!clzzConfig) {
      throw NO_CLASS_CONFIG_PROVIDED;
    }

    const urls = clzzConfig.urls;

    const matchingUrls = urls.filter(url => {
      const variables = this.parseUrl(url).filter(segment => segment.type === 'variable').map(segment => segment.segmentValue);

      return variables.length === keys.length && keys.every(param => variables.includes(param));
    });

    if (!matchingUrls.length) {
      throw NO_URL_ERROR;
    }

    if (matchingUrls.length > 1) {
      throw TOO_MANY_URLS_ERROR;
    }

    return this.parseUrl(matchingUrls[0])
      .map(segment => segment.type === 'variable' ? String(params[segment.segmentValue]) : segment.segmentValue)
      .join('/');
  }

  parseUrl(url: string): ReverseRestUrlSegment[] {
    const parse = () => {
      const hostPattern = /^(http(s?))?:\/\/[^/]+/;
      let host = Array.from(url.match(hostPattern) || []).slice(0, 1);

      if (host.length) {
        url = url.replace(hostPattern, '').substr(1);
      } else if (url.startsWith('/')) {
        url = url.substr(1);
        host = [''];
      }

      return <ReverseRestUrlSegment[]>[
        ...host.map(segment => ({
          type: 'host',
          segmentValue: segment,
        })),
        ...url.split('/').map(segment => {
          if (segment.startsWith(':')) {
            return {
              type: 'variable',
              segmentValue: segment.substr(1),
            };
          }

          return {
            type: 'path',
            segmentValue: segment,
          };
        })
      ];
    };

    return this.cache[url] || (this.cache[url] = parse());
  }

  getHttpOptions(params: ReverseRestRequest) {
    return { params: params.query, headers: params.headers };
  }

}
