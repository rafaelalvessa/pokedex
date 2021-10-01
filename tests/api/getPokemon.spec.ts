import GetPokemon from '../../src/api/getPokemon';
import ResponseError from '../../src/errors/responseError';
import PokeApiService from '../../src/services/pokeApiService';

describe('GetPokemon', () => {
  let getPokemon: GetPokemon;
  let pokeApiService: PokeApiService;

  beforeAll(() => {
    pokeApiService = new PokeApiService();
    getPokemon = new GetPokemon(pokeApiService);
  });

  describe('execute', () => {
    const params = {
      name: 'name'
    };

    it('calls getPokemon on pokeApiService', async () => {
      const getPokemonResponse = {
        description: 'description',
        habitat: 'habitat',
        isLegendary: true,
        name: 'name',
      };
      pokeApiService.getPokemon = jest.fn()
          .mockName('pokeApiService.getPokemon')
          .mockResolvedValue(getPokemonResponse);
      const response = await getPokemon.execute(params);
      expect(pokeApiService.getPokemon).toHaveBeenCalledWith(params.name);
      expect(response).toStrictEqual(getPokemonResponse);
    });

    it('throws a ResponseError when an error occurs', () => {
      const body = 'body';
      const statusCode = 404;
      pokeApiService.getPokemon = jest.fn(() => {
        const error = {
          response: {body, statusCode}
        };
        throw error;
      }).mockName('pokeApiService.getPokemon');
      expect(async () => {
        await getPokemon.execute(params);
      }).rejects.toThrow(new ResponseError(
        statusCode,
        `Unable to get Pokemon: ${body}`,
      ));
      expect(pokeApiService.getPokemon).toHaveBeenCalledWith(params.name);
    });
  });
});
