import UsmPlayer from './AudioPlayer';

describe('UsmPlayer', () => {
  describe('UsmPlayer constructor', () => {
    it('returns an instance of UsmPlayer', () => {
      const usmPlayer = new UsmPlayer();
      expect(usmPlayer).toBeInstanceOf(UsmPlayer);
    });
  });
});
