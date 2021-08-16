'use strict';

const express = require('express');
const cors = require('cors');
const server = express();
const handlerFunCollection = require('./handlerFunCollection');
require('dotenv').config();

server.use(cors());
server.use(express.json());
const PORT = process.env.PORT || 3001;

server.get('/Location', handlerFunCollection.locatioIQHandler);
server.get('/Weather', handlerFunCollection.weatherForcastHandler);
server.get('/Movies', handlerFunCollection.moviesHandler);
server.get('/Hotel', handlerFunCollection.hotelsHandler);
server.get('/Covid', handlerFunCollection.covidHandler);
server.get('/Resturant', handlerFunCollection.resturantHandler);
server.get('/Activity', handlerFunCollection.activitiesHandler);


server.listen(PORT, () => {console.log(`I'm listing to port ${PORT}`)});