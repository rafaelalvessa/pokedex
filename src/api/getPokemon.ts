import ResponseError from '../errors/responseError';
import IEndpoint from '../models/iEndpoint';
import IPokemonInformation from '../models/iPokemonInformation';
import PokeApiService from '../services/pokeApiService';

interface IParams {
  name: string;
}

export default class GetPokemon implements IEndpoint<IParams, IPokemonInformation> {
  pokeApiService: PokeApiService;

  constructor(pokeApiService: PokeApiService) {
    this.pokeApiService = pokeApiService;
  }

  async execute(params: IParams): Promise<IPokemonInformation> {
    try {
      const response = await this.pokeApiService.getPokemon(params.name);
      return response;
    } catch (error) {
      throw new ResponseError(
        error.response.statusCode,
        `Unable to get Pokemon: ${error.response.body}`,
      );
    }
  }
}
