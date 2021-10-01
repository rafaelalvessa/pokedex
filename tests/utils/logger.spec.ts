import Logger from '../../src/utils/logger';

describe('Logger', () => {
  let logger: Logger;

  beforeAll(() => {
    logger = new Logger();
    console.log = jest.fn().mockName('console.log');
  });

  describe('log', () => {
    it('delegates to console.log', () => {
      const message = 'message';
      logger.log(message);
      expect(console.log).toHaveBeenCalledWith(message);
    });
  });
});
