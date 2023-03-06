const fizzBuzz = require('./sum');
test('5 -> fizz', () => {
  expect(fizzBuzz(5)).toBe('buzz');
});
test('15 -> fizzBuzz', () => {
  expect(fizzBuzz(15)).toBe('fizzBuzz');
});
test('23 -> 23', () => {
  expect(fizzBuzz(23)).toBe(23);
});
test('21 -> buzz', () => {
  expect(fizzBuzz(21)).toBe('fizz');
});

