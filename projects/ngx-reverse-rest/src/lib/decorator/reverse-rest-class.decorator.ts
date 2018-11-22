import { ReverseRestClassConfig, ReverseRestClasses } from '../reverse-rest-classes';

export function ReverseRestClass(config: ReverseRestClassConfig) {
  return (constructor: Function) => {
    DecoratorReverseRestClasses.classes.set(constructor, config);
  };
}

export const DecoratorReverseRestClasses: ReverseRestClasses = {
  classes: new WeakMap(),
};
