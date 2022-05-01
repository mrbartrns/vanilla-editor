export function debounce<P extends any[]>(
  fn: (...args: P) => any,
  delay: number = 0
): (...args: P) => void {
  let timer: null | number = null;
  return (...args: P) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
