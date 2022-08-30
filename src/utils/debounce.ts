export default function debounce<P extends any[]>(
  fn: (...args: P) => unknown,
  delay = 0,
): (...args: P) => void {
  let timer: null | ReturnType<typeof setTimeout> = null;
  return (...args: P) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
