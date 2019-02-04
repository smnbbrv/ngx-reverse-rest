export interface ReverseRestEntityConfig {
  urls: string[];
}

export class ReverseRestEntities {
  // WeakMap ensures scoped classes to be cleared by GC
  entities: WeakMap<Function, ReverseRestEntityConfig>;
}
