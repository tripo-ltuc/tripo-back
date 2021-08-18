
'use strict';
const mongoose = require("mongoose");
const express = require('express');
const cors = require('cors');
const server = express();
const handlerFunCollection = require('./handlerFunCollection');
require('dotenv').config();

server.use(cors());
server.use(express.json());
const PORT = process.env.PORT || 3001;


  // server.get('/Movies', handlerFunCollection.moviesHandler);
  server.get('/Location', handlerFunCollection.locatioIQHandler);
  server.get('/Weather', handlerFunCollection.weatherForcastHandler);
  server.get('/Hotel', handlerFunCollection.hotelsHandler);
  server.get('/Covid', handlerFunCollection.covidHandler);
  server.get('/Resturant', handlerFunCollection.resturantHandler);
  server.get('/Activity', handlerFunCollection.activitiesHandler);
  // http://localhost:3001/getCards?cityName=
  server.get("/getCityCards", handlerFunCollection.getCityCardsHandler);
  // http://localhost:3001/getCards?userEmail=
  server.get("/getUserCards", handlerFunCollection.getUserCardsHandler);
  // http://localhost:3001/getCards
  server.get("/getAllCards", handlerFunCollection.getAllCardsHandler);
  // http://localhost:3001/addCard?cityName=
  server.post("/addCard", handlerFunCollection.addCardsHandler);
  // http://localhost:3001/addCardComment/
  server.post('/addCardComment', handlerFunCollection.addCardComment);
  // http://localhost:3001/deleteCard/1
  server.delete("/deleteCard/:id", handlerFunCollection.deleteCard);
  // http://localhost:3001/deleteCardComment/1
  server.delete("/deleteCardComment/:id", handlerFunCollection.deleteCardComment);
  // http://localhost:3001/updateCard/
  server.put('/updateCard/:id', handlerFunCollection.updateCard);
  // http://localhost:3001/updateCardComment/
  server.put('/updateCardComment/:id', handlerFunCollection.updateCardComment);

  
  server.listen(PORT, () => {
      console.log(`Listening on PORT ${PORT}`);
  });
