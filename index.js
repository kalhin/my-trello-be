import express from "express";
import cors from "cors";
import { toDos } from "./data";

const app = express();
const port = 5000;

app.use(cors());

app.get('/todos', (req, res) => {
  res.json(toDos)
});

app.listen(port);
