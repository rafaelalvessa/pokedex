import got from 'got';
import nock from 'nock';

import {POKEAPI_LANGUAGE, POKEAPI_URL} from '../../src/config/properties';
import PokeApiService from '../../src/services/pokeApiService';

describe('PokeApiService', () => {
  let pokeApiService: PokeApiService;

  beforeAll(() => {
    jest.spyOn(got, 'extend');
    pokeApiService = new PokeApiService();
  });

  it('creates a got instance with the given prefixUrl', () => {
    expect(got.extend).toHaveBeenCalledWith({prefixUrl: POKEAPI_URL});
  });

  describe('getPokemon', () => {
    const name = 'name';

    it('calls the correct endpoint with the given Pokemon name', async () => {
      const body = {
        flavor_text_entries: [
          {
            flavor_text: 'flavor_text',
            language: {
              name: POKEAPI_LANGUAGE,
            },
          }
        ],
        habitat: {
          name: 'habitat',
        },
        is_legendary: false,
        name: 'name',
      };
      nock(POKEAPI_URL).get(`/pokemon-species/${name}`).reply(200, body);
      const result = await pokeApiService.getPokemon(name);
      expect(result).toStrictEqual({
        description: 'flavor_text',
        habitat: 'habitat',
        isLegendary: false,
        name: 'name',
      });
    });

    it('returns a null habitat if it is not included', async () => {
      const body = {
        flavor_text_entries: [
          {
            flavor_text: 'flavor_text',
            language: {
              name: POKEAPI_LANGUAGE,
            },
          }
        ],
        habitat: null,
        is_legendary: false,
        name: 'name',
      };
      nock(POKEAPI_URL).get(`/pokemon-species/${name}`).reply(200, body);
      const result = await pokeApiService.getPokemon(name);
      expect(result).toStrictEqual({
        description: 'flavor_text',
        habitat: null,
        isLegendary: false,
        name: 'name',
      });
    });

    it('returns a null description if one cannot be found in the language ' +
       'POKEAPI_LANGUAGE', async () => {
      const body = {
        flavor_text_entries: [
          {
            flavor_text: 'flavor_text',
            language: {
              name: 'anotherLanguage',
            },
          }
        ],
        habitat: {
          name: 'habitat',
        },
        is_legendary: false,
        name: 'name',
      };
      nock(POKEAPI_URL).get(`/pokemon-species/${name}`).reply(200, body);
      const result = await pokeApiService.getPokemon(name);
      expect(result).toStrictEqual({
        description: null,
        habitat: 'habitat',
        isLegendary: false,
        name: 'name',
      });
    });

    it(
      'returns a null description if flavor_text_entries is an empty array',
      async () => {
        const body = {
          flavor_text_entries: [],
          habitat: {
            name: 'habitat',
          },
          is_legendary: false,
          name: 'name',
        };
        nock(POKEAPI_URL).get(`/pokemon-species/${name}`).reply(200, body);
        const result = await pokeApiService.getPokemon(name);
        expect(result).toStrictEqual({
          description: null,
          habitat: 'habitat',
          isLegendary: false,
          name: 'name',
        });
      }
    );
  });
});
