import got from 'got';
import nock from 'nock';

import {FUN_TRANSLATIONS_URL} from '../../src/config/properties';
import FunTranslationsService from '../../src/services/funTranslationsService';

describe('FunTranslationsService', () => {
  let funTranslationsService: FunTranslationsService;

  beforeAll(() => {
    jest.spyOn(got, 'extend');
    funTranslationsService = new FunTranslationsService();
  });

  it('creates a got instance with the given prefixUrl', () => {
    expect(got.extend).toHaveBeenCalledWith({prefixUrl: FUN_TRANSLATIONS_URL});
  });

  describe('getShakespeareTranslation', () => {
    const text = 'text';

    it('calls the correct endpoint with the given text', async () => {
      const body = {
        contents: {
          translated: 'translated'
        }
      };
      nock(FUN_TRANSLATIONS_URL)
          .post('/shakespeare.json', {text})
          .reply(200, body);
      const result = await funTranslationsService
          .getShakespeareTranslation(text);
      expect(result).toBe('translated');
    });

    it('returns null if the text could not be translated', async () => {
      nock(FUN_TRANSLATIONS_URL).post('/shakespeare.json', {text})
          .reply(200, {});
      const result = await funTranslationsService
          .getShakespeareTranslation(text);
      expect(result).toBeNull();
    });
  });

  describe('getYodaTranslation', () => {
    const text = 'text';

    it('calls the correct endpoint with the given text', async () => {
      const body = {
        contents: {
          translated: 'translated'
        }
      };
      nock(FUN_TRANSLATIONS_URL).post('/yoda.json', {text}).reply(200, body);
      const result = await funTranslationsService.getYodaTranslation(text);
      expect(result).toBe('translated');
    });

    it('returns null if the text could not be translated', async () => {
      nock(FUN_TRANSLATIONS_URL).post('/yoda.json', {text}).reply(200, {});
      const result = await funTranslationsService.getYodaTranslation(text);
      expect(result).toBeNull();
    });
  });
});
