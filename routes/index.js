import express from "express";
import { catchPokemon, evolvePokemon, getAllMyPokemons, getAllPokemons, getPokemonDetail, releasePokemon, renamePokemon } from "../controllers/index.js";

const router = express.Router();

router.get("/", getAllPokemons);
router.get("/my-pokemons", getAllMyPokemons);
router.get("/:param", getPokemonDetail);
router.post("/catch/:param", catchPokemon);
router.delete("/release/:id", releasePokemon);
router.put("/rename/:id", renamePokemon);
router.put("/evolve/:id", evolvePokemon);

export default router;