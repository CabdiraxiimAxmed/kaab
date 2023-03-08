const isPrime = require('./isPrime');
test('5 waa prime', () => {
  expect(isPrime(5)).toBeTruthy;
});
test('19 waa prime', () => {
  expect(isPrime(19)).toBeTruthy;
});
test('100 mahan prime', () => {
  expect(isPrime(100)).toBeFalsy;
});
test('213 mahan prime', () => {
  expect(isPrime(213)).toBeFalsy;
});

