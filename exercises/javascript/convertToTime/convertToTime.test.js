const ubedelWaqti = require("./convertToTime");
test("359999 -> 99:59:59", () => {
  expect(ubedelWaqti(359999)).toBe('99:59:59');
});
test("1000 -> 00:16:40", () => {
  expect(ubedelWaqti(1000)).toBe("00:16:40");
});
test("3600 -> 01:00:00", () => {
  expect(ubedelWaqti(3600)).toBe("01:00:00");
});

