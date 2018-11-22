export interface ReverseRestClassConfig {
  urls: string[];
}

export class ReverseRestClasses {
  // WeakMap ensures scoped classes to be cleared by GC
  classes: WeakMap<Function, ReverseRestClassConfig>;
}
