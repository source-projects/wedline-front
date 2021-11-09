import { CharacterLimiterPipe } from './character-limiter.pipe';

describe('CharacterLimiterPipe', () => {
  it('create an instance', () => {
    const pipe = new CharacterLimiterPipe();
    expect(pipe).toBeTruthy();
  });
});
