export const debounce = (cb, delay) => {
  let timer = null;
  return (event) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(cb, delay, event);
  };
};
