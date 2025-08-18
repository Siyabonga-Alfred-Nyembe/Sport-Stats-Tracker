const sum = (a, b) => a + b;

test("adds -1 + 2 to equal 1", () => {
  expect(sum(-1, 2)).toBe(1);
});
