import express from "express";
import fs from "fs";
import joi from "joi";

const app = express();
const PORT = 3000;
const database = './database/db.json';
const data = JSON.parse(fs.readFileSync(database));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const handleServerError = (res) => {
  return res.status(500).json({ message: 'Internal server error' })
};

const handleClientError = (res, status, message) => {
  return res.status(status).json({ message });
}

app.get("/", (req, res) => {
  res.send("Hello, express-pokemon's client!");
});



app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`)
});