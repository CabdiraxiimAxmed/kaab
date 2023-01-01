const helEreygaUguDheer = require("./findLongestWord");
test("Magaceygu waa Maxamed", () => {
  expect(helEreygaUguDheer("Magaceygu waa Maxamed")).toBe("Magaceygu");
});
test("Waxaan ku noolahay Soomaaliya", () => {
  expect(helEreygaUguDheer("Waxaan ku noolahay Soomaaliya")).toBe("Soomaaliya");
});
test("Maalmuhu waa 7ba", () => {
  expect(helEreygaUguDheer("Maalmuhu waa 7ba")).toBe("Maalmuhu");
});
