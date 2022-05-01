export type Action<T = any> = {
  type: T;
};

export interface AnyAction extends Action {
  [extraProps: string]: any;
}
