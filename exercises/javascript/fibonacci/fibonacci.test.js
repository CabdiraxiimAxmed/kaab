const fib = require('./fibonacci');
test('fib(2) == 2', () => {
  expect(fib(2)).toBe(2);
});
test('13 == 377', () => {
  expect(fib(13)).toBe(377);
});
test('33 == 5702887', () => {
  expect(fib(33)).toBe(5702887);
});
test('39 == 102334155', () => {
  expect(fib(39)).toBe(102334155);
});

