import axios from "axios";

const baseURL = 'https://pokeapi.co/api/v2';

export const urls = {
  pokemons: 'pokemon',
  pokemonSpecies: 'pokemon-species',
  evolutionChain: 'evolution-chain',
}

export const callAPI = async (endpoint, method, headers, params, data) => {
  const options = {
    baseURL,
    url: endpoint,
    method,
    headers,
    params,
    data
  }

  const response = await axios(options);
  return response?.data;
}