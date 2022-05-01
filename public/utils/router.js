const ROUTE_CHANGE = 'ROUTE_CHANGE';
export const init = (onRouteChange) => {
    window.addEventListener(ROUTE_CHANGE, () => {
        onRouteChange(); // render Router
    });
};
export const onRouteChange = (url) => {
    history.pushState(null, '', url);
    window.dispatchEvent(new CustomEvent(ROUTE_CHANGE));
};
