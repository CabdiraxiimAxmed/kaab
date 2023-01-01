const sum = require('./sum');
test('4 + 6 waa iney la mid tahay 10', () => {
  expect(sum(4, 6)).toBe(10);
});
test('18 + 27 waa iney la mid tahay 45', () => {
  expect(sum(18, 27)).toBe(45);
});
test('456 + 345 waa iney la mid tahay 801', () => {
  expect(sum(456, 345)).toBe(801);
});
test('-1 + -2 waa iney la mid tahay -3', () => {
  expect(sum(-1, -2)).toBe(-3);
});
