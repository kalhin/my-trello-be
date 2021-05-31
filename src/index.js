import express from "express";

import connection from "./sql.config";
import bodyParser from "body-parser";
import cors from "cors";
import { toDos } from "./data";
import uniqid from "uniqid";

import { SELECT_ALL_FROM_BOARD, INSERT_VALUES_INTO_BOARD } from "../src/routes/query";

const app = express();
const port = 5000;
const jsonParser = bodyParser.json();

app.use(cors());

app.get("/get-boards", (req, res) => {
  
  connection.query(SELECT_ALL_FROM_BOARD, (error, result, field) => {
    if (error) throw error;
    res.end(JSON.stringify(result))
  });
});

app.post("/add-new-board", jsonParser, (req, res) => {

  const {name, description} = req.body;
  const values = [[name, description]];
  
  connection.query(INSERT_VALUES_INTO_BOARD, [values], (error, result, field) => {
    if (error) throw error;
    res.end(JSON.stringify(result.insertId))
  });
});

app.get("/get-lists", (req, res) => {  
  let qweryString = "SELECT * FROM lists";
  
  connection.query(qweryString, (error, result, field) => {
    res.end(JSON.stringify(result))
  });
});

app.post("/add-new-list", jsonParser, (req, res) => {
  const data = req.body;
  console.log(data)
  const newTodo = {
    id: uniqid(),
    title: data.title,
    label: "",
    description: "",
  };
  toDos.push(newTodo);

  res.json(toDos);
});

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
};

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(400).send({ error: 'Something failed!' });
  } else {
    next(err);
  };
};

function errorHandler(err, req, res, next) {
  res.status(400);
  res.render('error', { error: err });
};

app.listen(port);
