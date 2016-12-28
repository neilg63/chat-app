var expect = require('expect');

var {generateMessage,generateLocationMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var from = 'Jen';
    var text = 'Some message';
    var message = generateMessage(from, text);

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({from, text});
  });
});

describe('generateLocationMessage', () => {
  it('should generate a correct location', () => {
    var from = 'Admin';
    var latitude = 56.0588924;
    var longitude = -3.5312509;
    var url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    var message = generateLocationMessage(from,latitude,longitude);
    expect(message.createdAt).toBeA('number');
    expect(message.url).toEqual(url);
  });
});