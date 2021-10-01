import got, {Got} from 'got';

import {POKEAPI_LANGUAGE, POKEAPI_URL} from '../config/properties';
import IPokemonInformation from '../models/iPokemonInformation';

const ESCAPE_SEQUENCES_REGEXP = /[\f\n]/g;

interface IFlavorText {
  flavor_text: string;
  language: {
    name: string;
  };
}

export default class PokeApiService {
  client: Got;

  constructor() {
    this.client = got.extend({prefixUrl: POKEAPI_URL});
  }

  private getDescription(flavorTextEntries: IFlavorText[]): null | string {
    const {flavor_text: flavorText} = flavorTextEntries.find(
      entry => entry.language?.name === POKEAPI_LANGUAGE
    ) ?? {};

    return flavorText?.replace(ESCAPE_SEQUENCES_REGEXP, ' ') ?? null;
  }

  async getPokemon(name: string): Promise<IPokemonInformation> {
    const {
      flavor_text_entries: flavorTextEntries,
      habitat,
      is_legendary: isLegendary,
      name: pokemonName,
    } = await this.client.get(`pokemon-species/${name}`).json();

    const description = this.getDescription(flavorTextEntries);

    return {
      description,
      habitat: habitat?.name ?? null,
      isLegendary,
      name: pokemonName,
    };
  }
}
