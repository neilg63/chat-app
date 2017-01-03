const expect = require('expect');

const {isRealString} = require('./validation');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    var res = isRealString(89.98);
    expect(res).toBe(false);
  });
  it('should reject a string with only spaces', () => {
    var res = isRealString('  ');
    expect(res).toBe(false);
  });
  it('should allow a string with non-space characters', () => {
    var res = isRealString('John Smith');
    expect(res).toBe(true);
  });
});