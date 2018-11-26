import { ReverseRestClassConfig, ReverseRestClasses } from '../reverse-rest-classes';

export const DecoratorReverseRestClasses: ReverseRestClasses = {
  classes: new WeakMap(),
};

export function ReverseRestClass(config: ReverseRestClassConfig) {
  return (constructor: Function) => {
    DecoratorReverseRestClasses.classes.set(constructor, config);
  };
}
