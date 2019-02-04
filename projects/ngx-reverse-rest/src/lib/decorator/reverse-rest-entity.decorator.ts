import { ReverseRestEntities, ReverseRestEntityConfig } from '../reverse-rest-entities';

export const DecoratorReverseRestEntities: ReverseRestEntities = {
  entities: new WeakMap(),
};

export function ReverseRestEntity(config: ReverseRestEntityConfig) {
  return (constructor: Function) => {
    DecoratorReverseRestEntities.entities.set(constructor, config);
  };
}
