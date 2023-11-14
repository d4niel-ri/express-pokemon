import joi from "joi";

import { callAPI, urls } from "../domain/api.js";
import { loadData, storeData } from "../utils/database.js";
import { handleServerError, handleClientError } from "../utils/handleError.js";
import { canCatchPokemon, canReleasePokemon, extractIDFromURL, extractNextEvolutionFromObject, getFibonacciSequence, orderData } from "../utils/utils.js";

export const getAllPokemons = async (req, res) => {
  try {
    const countResponse = await callAPI(urls.pokemons, "GET");
    const response = await callAPI(urls.pokemons, "GET", {}, {limit: countResponse.count, offset: 0});
    return res.status(200).json({ data: response.results, status: 'Success' });
    
  } catch (error) {
    console.error(error);
    return handleServerError(res);
  }
};

export const getPokemonDetail = async (req, res) => {
  try {
    const { param } = req.params;

    try {
      const response = await callAPI(`${urls.pokemons}/${param}`, "GET");
      return res.status(200).json({ data: response, status: 'Success' });

    } catch (error) {
      if (error.response && error.response.status === 404) {
        return handleClientError(res, 404, "Data Not Found");
      }
      throw error;
    }

  } catch (error) {
    console.error(error);
    return handleServerError(res);
  }
}

export const catchPokemon = async (req, res) => {
  try {
    const { param } = req.params;

    try {
      const response = await callAPI(`${urls.pokemons}/${param}`, "GET");
      const data = loadData();

      let newLastID;
      if (data.myPokemons.length === 0) {
        newLastID = 0;
      } else {
        newLastID = data.myPokemons[data.myPokemons.length - 1]["id"] + 1;
      }

      if (!canCatchPokemon()) {
        return res.status(200).json({ message: `Failed to catch ${response.name}`, status: 'Failed'});
      }

      const newCompleteData = {
        id: newLastID, id_pokemon: response.id, name: response.name, originalName: response.name, 
        rename: response.name, renameCount: 0,
      };

      data["myPokemons"].push(newCompleteData);
      storeData(data);
      return res.status(201).json({ data: newCompleteData, status: 'Success' });

    } catch (error) {
      if (error.response && error.response.status === 404) {
        return handleClientError(res, 404, "Data Not Found");
      }
      throw error;
    }

  } catch (error) {
    console.error(error);
    return handleServerError(res);
  }
}

export const getAllMyPokemons = async (req, res) => {
  try {
    const data = loadData();
    return res.status(200).json({ data, status: 'Success' });

  } catch (error) {
    console.error(error);
    return handleServerError(res);
  }
}

export const releasePokemon = async (req, res) => {
  const { id } = req.params;
  
  try {
    const data = loadData();
    const parsedID = parseInt(id, 10);
    if (!data["myPokemons"].find((el) => el.id === parsedID)) {
      return handleClientError(res, 404, 'Data Not Found');
    }

    const randomNumber = Math.floor(Math.random() * 100);
    if (!canReleasePokemon(randomNumber)) {
      return res.status(200).json({ message: `Failed to release`, generatedNumber: randomNumber, status: 'Failed'});
    }

    const filteredData = data["myPokemons"].filter((el) => el.id !== parsedID);
    data["myPokemons"] = filteredData;
    storeData(data);
    return res.status(200).json({ data: data["myPokemons"], generatedNumber: randomNumber, status: 'Success' });

  } catch (error) {
    console.error(error);
    return handleServerError(res);
  }
}

export const renamePokemon = async (req, res) => {
  const { id } = req.params;

  try {
    const data = loadData();
    const parsedID = parseInt(id, 10);
    const dataToBeChanged = data["myPokemons"].find((el) => el.id === parsedID);
    if (!dataToBeChanged) {
      return handleClientError(res, 404, "Data Not Found");
    }

    const dataReq = req.body;

    const scheme = joi.object({
      name: joi.string().allow('', null),
    });

    const { error } = scheme.validate(dataReq);
    if (error) {
      return res.status(400).json({ status: 'Validation Failed', message: error.details[0].message })
    }

    const sequence = getFibonacciSequence(dataToBeChanged.renameCount);
    
    let changedData;
    if (dataReq.name) {
      changedData = {
        ...dataToBeChanged,
        rename: dataReq.name,
        name: `${dataReq.name}-${sequence}`
      };
    } else {
      changedData = {...dataToBeChanged, name: `${dataToBeChanged.rename}-${sequence}`};
    }

    changedData = {
      ...changedData, 
      renameCount: changedData.renameCount + 1
    };

    const filteredData = data["myPokemons"].filter((el) => el.id !== parsedID);
    filteredData.push(changedData);
    const newOrderedData = orderData(filteredData);
    data["myPokemons"] = newOrderedData;
    storeData(data);
    return res.status(200).json({ data: changedData, status: 'Success' });

  } catch (error) {
    console.error(error);
    return handleServerError(res);
  }
}

export const evolvePokemon = async (req, res) => {
  const { id } = req.params;

  try {
    const data = loadData();
    const parsedID = parseInt(id, 10);
    const dataToBeChanged = data["myPokemons"].find((el) => el.id === parsedID);
    if (!dataToBeChanged) {
      return handleClientError(res, 404, "Data Not Found");
    }

    const pokemonResponse = await callAPI(`${urls.pokemons}/${dataToBeChanged.id_pokemon}`, "GET");
    const speciesName = pokemonResponse.species.name;
    const speciesResponse = await callAPI(`${urls.pokemonSpecies}/${speciesName}`, "GET");
    const evolutionChainURL = speciesResponse.evolution_chain.url;
    const evolutionChainID = extractIDFromURL(evolutionChainURL);
    const evolutionChainResponse = await callAPI(`${urls.evolutionChain}/${evolutionChainID}`, "GET");
    const evolutionChainTemp = evolutionChainResponse.chain;
    const nextEvolveSpecies = extractNextEvolutionFromObject(evolutionChainTemp, speciesName);

    if (!nextEvolveSpecies) {
      return res.status(200).json({ message: `It can't evolve again`, status: 'Failed'});
    }

    const speciesResponse2 = await callAPI(`${urls.pokemonSpecies}/${nextEvolveSpecies}`, "GET");
    const varietyName = speciesResponse2.varieties[0].pokemon.name;
    console.log(varietyName, "<< VARIETY NAME");
    const response = await callAPI(`${urls.pokemons}/${varietyName}`, "GET");
    const changedData = {
      ...dataToBeChanged, id_pokemon: response.id, name: response.name, originalName: response.name, 
      rename: response.name, renameCount: 0, 
    }

    const filteredData = data["myPokemons"].filter((el) => el.id !== parsedID);
    filteredData.push(changedData);
    const newOrderedData = orderData(filteredData);
    data["myPokemons"] = newOrderedData;
    storeData(data);
    return res.status(200).json({ data: changedData, status: 'Success' });

  } catch (error) {
    console.error(error);
    return handleServerError(res);
  }
}