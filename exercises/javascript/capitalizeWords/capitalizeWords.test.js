const weyneyXarfkaUguHoreeya = require("./capitalizeWords");
test("magaceygu waa maxamed", () => {
  expect(weyneyXarfkaUguHoreeya("magaceygu waa maxamed")).toBe(
    "Magaceygu Waa Maxamed"
  );
});
test("waxaan ahay arday", () => {
  expect(weyneyXarfkaUguHoreeya("waxaan ahay arday")).toBe("Waxaan Ahay Arday");
});
test("waan jeclahay dalkeyga", () => {
  expect(weyneyXarfkaUguHoreeya("waan jeclahay dalkeyga")).toBe(
    "Waan Jeclahay Dalkeyga"
  );
});
