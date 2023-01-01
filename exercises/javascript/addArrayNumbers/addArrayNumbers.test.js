const iskuDarTiradaArrayda = require("./addArrayNumbers");
test("soo saar natiijada [1,2,53,53,2,12]", () => {
  expect(iskuDarTiradaArrayda([1, 2, 53, 53, 2, 12])).toBe(123);
});
test("soo saar natiijada [3,2]", () => {
  expect(iskuDarTiradaArrayda([3, 2])).toBe(5);
});
test("soo saar natiijada [4,8, 90, 6, 7]", () => {
  expect(iskuDarTiradaArrayda([4, 8, 90, 6, 7])).toBe(115);
});
