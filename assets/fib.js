performance.mark(`script execution${document.currentScript?.dataset?.message || ''}`);

function fib(n) {
  if (n <= 1) return n;
  return fib(n- 1) + fib(n - 2);
}

var fibonacciNumber = Number(document.currentScript?.dataset?.fibonacciNumber) || 10;

performance.mark(`start fib(${fibonacciNumber})`);
fib(fibonacciNumber);
performance.mark(`end fib(${fibonacciNumber})`);
