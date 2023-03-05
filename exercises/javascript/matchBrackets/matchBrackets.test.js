const maSimanYihiin = require("./matchBrackets");

test("({[})]", () => {
  expect(maSimanYihiin("({[})]")).toBeTruthy;
});
test("{{{{{(((())))}}}}", () => {
  expect(maSimanYihiin("{]{{{{(((())))}}}}[[]")).toBeFalsy;
});
test("(}){[]{}", () => {
  expect(maSimanYihiin("(}){[]{}")).toBeTruthy;
});
test("]]]()))}}}}{{{[[[", () => {
  expect(maSimanYihiin("]]]()))}}}}{{{[[[")).toBeFalsy;
});
