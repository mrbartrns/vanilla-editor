export type StoreObject = {
  [key: string | symbol]: any;
};

export type CurrentObserver = (...data: any) => any;
