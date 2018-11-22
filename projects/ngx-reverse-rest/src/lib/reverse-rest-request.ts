export interface ReverseRestRequest<T> {
  class?: any;
  object?: T;
  path?: { [prop: string]: any; };
  query?: { [prop: string]: any; };
  headers?: { [prop: string]: any; };
}
