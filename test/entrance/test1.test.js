const sum = require('../../entrance/test1')

test('测试test1 是否正常', () => {
    expect(sum(1, 2)).toBe(3);
    expect(sum(1, 5)).toBe(6);
    expect(sum(1, 6)).toBe(7);
    expect(sum(1, 10)).toBe(11);
});
  