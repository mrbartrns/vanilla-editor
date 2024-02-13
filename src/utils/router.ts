const ROUTE_CHANGE = 'ROUTE_CHANGE' as const;

export const init = (onRouteChange: () => void) => {
  window.addEventListener(ROUTE_CHANGE, () => {
    onRouteChange(); // render Router
  });
};

export const onRouteChange = (url: string) => {
  history.pushState(null, '', url);
  window.dispatchEvent(new CustomEvent(ROUTE_CHANGE));
};
