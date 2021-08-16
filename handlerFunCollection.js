'use strict';

require('dotenv').config();
const { default: axios } = require("axios");
const Amadeus = require("amadeus");
const superagent = require('superagent');
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY,
  clientSecret: process.env.AMADEUS_API_SECRET
});


const utilityFunCollection = require('./utilityFunCollection');

const collectionObj = {};
const movieDataInMemory = {};

// http://localhost:3001/Location?cityName=Paris
collectionObj.locatioIQHandler = (req, res) => {
    const {cityName} = req.query;
    console.log(cityName);
    axios
    .get(`${process.env.LOCATIONIQ_URL}`, {params : {q : cityName, format : 'json'}})
    .then( result => {
        //console.log(result.data)
        res.status(200).send(utilityFunCollection.creatLocationObj(result.data));
    })
    .catch(err => {
        // console.log(err);
        res.staus(500).send();
    });
};

// http://localhost:3001/Weather?lat=&lon
collectionObj.weatherForcastHandler = (req, res) => {
    const {lat, lon, city} = req.query;
    // console.log(lat, ' - ', lon, ' - ', city);
    axios
    .get(`${process.env.WATHER_API_URL}`, {params : {city : city, lat : lat, lon: lon}})
    .then(result => {
        //console.log(utilityFunCollection.createForcastObj(result.data));
        res.status(200).send(utilityFunCollection.createForcastObj(result.data));  
    })
    .catch(err => {
       //console.log(err);
       res.status(500).send(err);
    });
};

// http://localhost:3001/Movie?cityName=Paris
// collectionObj.moviesHandler = (req, res) => {
//     const {cityName} = req.query;

//     if(movieDataInMemory[cityName] !== undefined)
//         res.send(movieDataInMemory[cityName]);
//     axios
//     .get(`${process.env.MOVIE_API_URL}`, {params: {api_key : process.env.MOVIE_API_KEY, query : cityName}})
//     .then(result => {
//         //console.log(utilityFunCollection.createMoviesObj(result.data));
//         res.status(200).send(utilityFunCollection.createForcastObj(result.data));
//     })
//     .catch(err => {
//        //console.log(err);
//        res.status(500).send(err);
//     });

// };

// http://localhost:3001/Hotel?cityName=Paris
collectionObj.hotelsHandler = async (req, res) => {
    const {cityName} = req.query;
    const destinationId = await utilityFunCollection.getDestinationId(cityName);
    const data = await utilityFunCollection.getHotelsIdList(destinationId);
    const fullData = await utilityFunCollection.getFullHotelsData(data);
    res.send(fullData);
};

// http://localHost:3001/Covid?cityName=Paris
collectionObj.covidHandler = (req, res) =>{
    const {cityName} = req.query;
    const countryName = utilityFunCollection.getCountryName(cityName);
    const options = {
      method: 'GET',
      url: process.env.COVID_API_URL,
      params: {name: countryName},
      headers: {
        'x-rapidapi-key': process.env.COVID_API_KEY,
        'x-rapidapi-host': process.env.COVID_API_HOST
      }
    };
    
    axios.request(options).then(response => {
        res.send(utilityFunCollection.createCovidObj(response.data));
    }).catch(error => console.error(error));
};

// http://localhost:3001/Resturant?cityName=Paris
collectionObj.resturantHandler = (req, res) =>{
    const {cityName} = req.query;

    const apiKey = process.env.YELP_RESTURANTS_KEY;
    superagent.get(`${process.env.YELP_RESTURANTS_URL}?location=${cityName}`)
    .set('Authorization', `Bearer ${apiKey}`)
    .then(result =>  res.send(utilityFunCollection.createRestaurantObj(result.body.businesses)))
    .catch(err => console.log(err));
};

// http://localhost:3001/Activity?lat=&lon=
collectionObj.activitiesHandler = (req, res) => {
    const {lat, lon} = req.query;
    amadeus.shopping.activities.get({
        latitude: Number(lat),
        longitude: Number(lon)
      }).then(result => res.send(utilityFunCollection.createAndActivityList(result.data)))
      .catch(err => console.log(err));
};

module.exports = collectionObj;