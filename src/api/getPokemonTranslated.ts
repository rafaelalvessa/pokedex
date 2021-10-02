import ResponseError from '../errors/responseError';
import IEndpoint from '../models/iEndpoint';
import IPokemonInformation from '../models/iPokemonInformation';
import FunTranslationsService from '../services/funTranslationsService';
import PokeApiService from '../services/pokeApiService';

const YODA_HABITAT = 'cave';

interface IParams {
  name: string;
}

export default class GetPokemonTranslated implements IEndpoint<IParams,
    IPokemonInformation> {
  funTranslationsService: FunTranslationsService;
  pokeApiService: PokeApiService;

  constructor(funTranslationsService: FunTranslationsService,
              pokeApiService: PokeApiService) {
    this.funTranslationsService = funTranslationsService;
    this.pokeApiService = pokeApiService;
  }

  async execute(params: IParams): Promise<IPokemonInformation> {
    const pokemon = await this.getPokemon(params.name);
    const {description, habitat, isLegendary} = pokemon;

    if (description !== null) {
      pokemon.description = await this.getTranslation(description, habitat,
                                                      isLegendary);
    }

    return pokemon;
  }

  private async getPokemon(name: string): Promise<IPokemonInformation> {
    try {
      const pokemon = await this.pokeApiService.getPokemon(name);
      return pokemon;
    } catch (error) {
      throw new ResponseError(
        error.response.statusCode,
        `Unable to get Pokemon: ${error.response.body}`,
      );
    }
  }

  private async getTranslation(description: string, habitat: null | string,
                               isLegendary: boolean): Promise<null | string> {
    try {
      if (habitat === YODA_HABITAT || isLegendary) {
        return await this.funTranslationsService.getYodaTranslation(description);
      }
      return await this.funTranslationsService.getShakespeareTranslation(description);
    } catch {
      return description;
    }
  }
}
