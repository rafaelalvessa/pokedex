import GetPokemonTranslated from '../../src/api/getPokemonTranslated';
import ResponseError from '../../src/errors/responseError';
import FunTranslationsService from '../../src/services/funTranslationsService';
import PokeApiService from '../../src/services/pokeApiService';

describe('GetPokemonTranslated', () => {
  let funTranslationsService: FunTranslationsService;
  let pokeApiService: PokeApiService;
  let getPokemonTranslated: GetPokemonTranslated;

  beforeAll(() => {
    funTranslationsService = new FunTranslationsService();
    pokeApiService = new PokeApiService();
    getPokemonTranslated = new GetPokemonTranslated(
      funTranslationsService,
      pokeApiService,
    );
  });

  describe('execute', () => {
    const params = {
      name: 'name'
    };

    it(
      'calls getPokemon on pokeApiService and getShakespeareTranslation on ' +
        'funTranslationsService if the habitat is not cave and isLegendary is ' +
        'false',
      async () => {
        const getPokemonResponse = {
          description: 'description',
          habitat: 'habitat',
          isLegendary: false,
          name: 'name',
        };
        pokeApiService.getPokemon = jest.fn()
            .mockName('pokeApiService.getPokemon')
            .mockResolvedValue(getPokemonResponse);
        funTranslationsService.getShakespeareTranslation = jest.fn()
            .mockName('funTranslationsService.getShakespeareTranslation')
            .mockResolvedValue('shakespeareTranslation');
        funTranslationsService.getYodaTranslation = jest.fn()
            .mockName('funTranslationsService.getYodaTranslation');
        const response = await getPokemonTranslated.execute(params);
        expect(pokeApiService.getPokemon).toHaveBeenCalledWith(params.name);
        expect(funTranslationsService.getShakespeareTranslation)
            .toHaveBeenCalledWith('description');
        expect(funTranslationsService.getYodaTranslation)
            .not
            .toHaveBeenCalled();
        expect(response).toStrictEqual({
          ...getPokemonResponse,
          description: 'shakespeareTranslation',
        });
      }
    );

    it(
      'calls getYodaTranslation on funTranslationsService if the habitat is ' +
        'cave',
      async () => {
        const getPokemonResponse = {
          description: 'description',
          habitat: 'cave',
          isLegendary: false,
          name: 'name',
        };
        pokeApiService.getPokemon = jest.fn()
            .mockName('pokeApiService.getPokemon')
            .mockResolvedValue(getPokemonResponse);
        funTranslationsService.getShakespeareTranslation = jest.fn()
            .mockName('funTranslationsService.getYodaTranslation');
        funTranslationsService.getYodaTranslation = jest.fn()
            .mockName('funTranslationsService.getYodaTranslation')
            .mockResolvedValue('yodaTranslation');
        const response = await getPokemonTranslated.execute(params);
        expect(pokeApiService.getPokemon).toHaveBeenCalledWith(params.name);
        expect(funTranslationsService.getYodaTranslation)
            .toHaveBeenCalledWith('description');
        expect(funTranslationsService.getShakespeareTranslation)
            .not
            .toHaveBeenCalled();
        expect(response).toStrictEqual({
          ...getPokemonResponse,
          description: 'yodaTranslation',
        });
      }
    );

    it(
      'calls getYodaTranslation on funTranslationsService if isLegendary is ' +
        'true',
      async () => {
        const getPokemonResponse = {
          description: 'description',
          habitat: 'habitat',
          isLegendary: true,
          name: 'name',
        };
        pokeApiService.getPokemon = jest.fn()
            .mockName('pokeApiService.getPokemon')
            .mockResolvedValue(getPokemonResponse);
        funTranslationsService.getShakespeareTranslation = jest.fn()
            .mockName('funTranslationsService.getYodaTranslation');
        funTranslationsService.getYodaTranslation = jest.fn()
            .mockName('funTranslationsService.getYodaTranslation')
            .mockResolvedValue('yodaTranslation');
        const response = await getPokemonTranslated.execute(params);
        expect(pokeApiService.getPokemon).toHaveBeenCalledWith(params.name);
        expect(funTranslationsService.getYodaTranslation)
            .toHaveBeenCalledWith('description');
        expect(funTranslationsService.getShakespeareTranslation)
            .not
            .toHaveBeenCalled();
        expect(response).toStrictEqual({
          ...getPokemonResponse,
          description: 'yodaTranslation',
        });
      }
    );

    it('throws a ResponseError when an error occurs in ' +
       'pokeApiService.getPokemon', () => {
      const body = 'body';
      const statusCode = 404;
      pokeApiService.getPokemon = jest.fn(() => {
        const error = {
          response: {body, statusCode}
        };
        throw error;
      }).mockName('pokeApiService.getPokemon');
      funTranslationsService.getShakespeareTranslation = jest.fn()
          .mockName('funTranslationsService.getShakespeareTranslation');
      funTranslationsService.getYodaTranslation = jest.fn()
          .mockName('funTranslationsService.getYodaTranslation');
      expect(async () => {
        await getPokemonTranslated.execute(params);
      }).rejects.toThrow(new ResponseError(
        statusCode,
        `Unable to get Pokemon: ${body}`,
      ));
      expect(pokeApiService.getPokemon).toHaveBeenCalledWith(params.name);
      expect(funTranslationsService.getShakespeareTranslation)
          .not
          .toHaveBeenCalled();
      expect(funTranslationsService.getYodaTranslation)
          .not
          .toHaveBeenCalled();
    });

    it('does not get a translation if description is null', async () => {
        const getPokemonResponse = {
          description: null,
          habitat: 'habitat',
          isLegendary: false,
          name: 'name',
        };
        pokeApiService.getPokemon = jest.fn()
            .mockName('pokeApiService.getPokemon')
            .mockResolvedValue(getPokemonResponse);
        funTranslationsService.getShakespeareTranslation = jest.fn()
            .mockName('funTranslationsService.getShakespeareTranslation');
        funTranslationsService.getYodaTranslation = jest.fn()
            .mockName('funTranslationsService.getYodaTranslation');
        const response = await getPokemonTranslated.execute(params);
        expect(pokeApiService.getPokemon).toHaveBeenCalledWith(params.name);
        expect(funTranslationsService.getShakespeareTranslation)
            .not
            .toHaveBeenCalled();
        expect(funTranslationsService.getYodaTranslation)
            .not
            .toHaveBeenCalled();
        expect(response).toStrictEqual(getPokemonResponse);
    });

    it(
      'uses the original description if ' +
        'funTranslationsService.getShakespeareTranslation throws an error',
      async () => {
        const body = 'body';
        const getPokemonResponse = {
          description: 'description',
          habitat: 'habitat',
          isLegendary: false,
          name: 'name',
        };
        const statusCode = 500;
        pokeApiService.getPokemon = jest.fn()
            .mockName('pokeApiService.getPokemon')
            .mockResolvedValue(getPokemonResponse);
        funTranslationsService.getShakespeareTranslation = jest.fn(() => {
          const error = {
            response: {body, statusCode}
          };
          throw error;
        }).mockName('funTranslationsService.getShakespeareTranslation');
        funTranslationsService.getYodaTranslation = jest.fn()
            .mockName('funTranslationsService.getYodaTranslation');
        const response = await getPokemonTranslated.execute(params);
        expect(pokeApiService.getPokemon).toHaveBeenCalledWith(params.name);
        expect(funTranslationsService.getShakespeareTranslation)
            .toHaveBeenCalledWith('description');
        expect(funTranslationsService.getYodaTranslation)
            .not
            .toHaveBeenCalled();
        expect(response).toStrictEqual(getPokemonResponse);
      }
    );

    it(
      'uses the original description if ' +
        'funTranslationsService.getYodaTranslation throws an error',
      async () => {
        const body = 'body';
        const getPokemonResponse = {
          description: 'description',
          habitat: 'cave',
          isLegendary: true,
          name: 'name',
        };
        const statusCode = 500;
        pokeApiService.getPokemon = jest.fn()
            .mockName('pokeApiService.getPokemon')
            .mockResolvedValue(getPokemonResponse);
        funTranslationsService.getShakespeareTranslation = jest.fn()
            .mockName('funTranslationsService.getShakespeareTranslation');
        funTranslationsService.getYodaTranslation = jest.fn(() => {
          const error = {
            response: {body, statusCode}
          };
          throw error;
        }).mockName('funTranslationsService.getYodaTranslation');
        const response = await getPokemonTranslated.execute(params);
        expect(pokeApiService.getPokemon).toHaveBeenCalledWith(params.name);
        expect(funTranslationsService.getYodaTranslation)
            .toHaveBeenCalledWith('description');
        expect(funTranslationsService.getShakespeareTranslation)
            .not
            .toHaveBeenCalled();
        expect(response).toStrictEqual(getPokemonResponse);
      }
    );
  });
});
