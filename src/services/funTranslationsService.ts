import got, {Got} from 'got';

import {FUN_TRANSLATIONS_URL} from '../config/properties';

const SPACES_REGEXP = /\s{2,}/g;

enum TranslationType {
  shakespeare = 'shakespeare.json',
  yoda = 'yoda.json',
}

export default class FunTranslationsService {
  client: Got;

  constructor() {
    this.client = got.extend({prefixUrl: FUN_TRANSLATIONS_URL});
  }

  async getShakespeareTranslation(text: string): Promise<null | string> {
    const translation = await this.getTranslation(TranslationType.shakespeare, text);
    return translation;
  }

  private async getTranslation(type: TranslationType, text: string):
      Promise<null | string> {
    const {contents} = await this.client.post(type, {
      json: {text}
    }).json();
    const translation = contents?.translated?.replace(SPACES_REGEXP, ' ')
        ?? null;
    return translation;
  }

  async getYodaTranslation(text: string): Promise<null | string> {
    const translation = await this.getTranslation(TranslationType.yoda, text);
    return translation;
  }
}
