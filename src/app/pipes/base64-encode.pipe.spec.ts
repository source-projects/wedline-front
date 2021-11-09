import { Base64EncodePipe } from './base64-encode.pipe';

describe('Base64EncodePipe', () => {
  it('create an instance', () => {
    const pipe = new Base64EncodePipe();
    expect(pipe).toBeTruthy();
  });
});
