const helEreygaUguDheer = require("./findLongestWord");
test("Magaceygu waa Maxamed", () => {
  expect(helEreygaUguDheer("Magaceygu waa Maxamed")).toBe("Maxamed waa Magaceygu");
});
test("Waxaan ku noolahay Soomaaliya", () => {
  expect(helEreygaUguDheer("Waxaan ku noolahay Soomaaliya")).toBe("Soomaaliya noolahay ku Waxaan");
});
test("Maalmuhu waa 7ba", () => {
  expect(helEreygaUguDheer("Maalmuhu waa 7ba")).toBe("7ba waa Maalmuhu");
});

