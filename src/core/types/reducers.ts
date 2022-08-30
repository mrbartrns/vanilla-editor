import { Action, AnyAction } from './actions.js';
import { StoreObject } from './stores.js';

export type Reducer<S extends StoreObject, A extends Action = AnyAction> = (
  state: S,
  action: A,
) => S;
