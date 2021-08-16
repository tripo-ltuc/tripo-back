'use strict';
const Location = require('./location');
const Forcast = require('./weather');
const Movies = require('./movie');
const Hotel = require('./hotel');
const Covid = require('./covid');
const Activity = require('./activity');
const restaurant = require('./restaurant');
const { default: axios } = require("axios");
const countryDataList = require('./data/county_list.json');

const utilityFunObj = {};

utilityFunObj.creatLocationObj = locationObj => {
    return new Location(locationObj);
};

utilityFunObj.createForcastObj = weatherObjList =>{
    const forcastObjList = [];
    weatherObjList.data.forEach( objItem => {forcastObjList.push(new Forcast(objItem));});
    return forcastObjList;
};

utilityFunObj.createMovieObj = moviesObjList => {
    const newMoviesObjList = [];
    moviesObjList.results.forEach(movieObj => newMoviesObjList.push(new Movies(movieObj)));
    return newMoviesObjList;
};

utilityFunObj.createHotelObj =  hotelsObjList => {
    const newHotelsObjList = [];
    hotelsObjList.forEach(objItem => newHotelsObjList.push(new Hotel(objItem)));
    return newHotelsObjList;
};

utilityFunObj.getDestinationId = async cityName => {
    const options = {
        method: 'GET',
        url: process.env.HOTELS_DESTINATIONS,
        params: {locale: 'en_US', currency: 'USD', query: cityName},
        headers: {
          'x-rapidapi-key': process.env.HOTELS_KEY,
          'x-rapidapi-host': process.env.HOTELS_HOST
        }
      };

    const dataRes = await axios.request(options);
    const destinationId = dataRes.data.suggestions[0].entities[0].destinationId;
    return destinationId;
};

utilityFunObj.getHotelsIdList = async (destinationId) => {
    const options = {
        method: 'GET',
        url: process.env.HOTELS_HOTELS_LIST,
        params: {
            currency: 'USD',
            locale: 'en_US',
            adults_number: '1',
            sort_order: 'STAR_RATING_HIGHEST_FIRST',
            destination_id: destinationId,
            checkout_date: '2022-03-27',
            checkin_date: '2022-03-26'
        },
        headers: {
            'x-rapidapi-key': process.env.HOTELS_KEY,
            'x-rapidapi-host': process.env.HOTELS_HOST
          }
    }
    
    const resData = await axios.request(options);
    return utilityFunObj.createHotelObj(resData.data.searchResults.results);
};

utilityFunObj.getFullHotelsData = async hotelData => {
    const newHotelList = [];
    for(let i = 0; i < 2; i++){
        let hotelId = hotelData[i].id;
        hotelId = hotelId > 999999999 ? utilityFunObj.getRandomHotelId(0, 999999999) : hotelId;
        const options = {
            method: 'GET',
            url: process.env.HOTELS_PHOTOS,
            params: {hotel_id: hotelId},
            headers: {
                'x-rapidapi-key': process.env.HOTELS_KEY,
                'x-rapidapi-host': process.env.HOTELS_HOST
            }
        };
        const resData = await axios.request(options);
        hotelData[i].modalImgUrl = resData.data[0].mainUrl.concat('?impolicy=fcrop&w=750&h=450&q=high');
        hotelData[i].cardImgUrl = resData.data[0].mainUrl.replace('_z', '_d');
        newHotelList.push(hotelData[i]);
    }
    return newHotelList;
};

utilityFunObj.getRandomHotelId = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); 
};

utilityFunObj.createCovidObj = covidData => {
    const covidDataList = [];
    covidData.forEach(dataItem => covidDataList.push(new Covid(dataItem)));
    return covidDataList;
};

utilityFunObj.getCountryName = cityName => {
    const targetContryObj = countryDataList.find(countryItem => countryItem.capital.toLocaleLowerCase() === cityName.toLocaleLowerCase());
    return targetContryObj.name;
};

utilityFunObj.createAndActivityList = activitiesList => {
    const activitiesObjList = [];
    activitiesList.forEach(activity => activitiesObjList.push(new Activity(activity)));
    return activitiesObjList;
};

utilityFunObj.createRestaurantObj = restaurantItem => {
    const restaurantObjList = [];
    restaurantItem.forEach(objItem => restaurantObjList.push(new restaurant(objItem)));
    return restaurantObjList;
};
module.exports = utilityFunObj;