const maSimanYihiin = require("./matchBrackets");

test("({[})]", () => {
  expect(maSimanYihiin("({[})]")).toBeTruthy;
});
test("{{{{{(((())))}}}}", () => {
  expect(maSimanYihiin("{]{{{{(((())))}}}}[[]")).toBeTruthy;
});
test("(}){[]{}", () => {
  expect(maSimanYihiin("(}){[]{}")).toBeTruthy;
});
test("]]]()))}}}}{{{[[[", () => {
  expect(maSimanYihiin("]]]()))}}}}{{{[[[")).toBeTruthy;
});
