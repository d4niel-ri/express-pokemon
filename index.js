import express from "express";
import pokemonsRoutes from "./routes/index.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  res.send("Hello, express-pokemon's client!");
});

app.use("/pokemons", pokemonsRoutes);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`)
});