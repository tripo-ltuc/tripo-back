'use strict';

require('dotenv').config();
const { default: axios } = require("axios");
const Amadeus = require("amadeus");
const superagent = require('superagent');
const postModel = require('./postModel');
const mongoose = require("mongoose");
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY,
  clientSecret: process.env.AMADEUS_API_SECRET
});

mongoose.connect("mongodb://localhost:27017/postCards", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
  

const utilityFunCollection = require('./utilityFunCollection');

const collectionObj = {};

// http://localhost:3001/Location?cityName=Paris
collectionObj.locatioIQHandler = (req, res) => {
    const {cityName} = req.query;
    console.log(cityName);
    axios
    .get(`${process.env.LOCATIONIQ_URL}`, {params : {q : cityName, format : 'json'}})
    .then( result => {
        //console.log(result.data)
        res.status(200).send(utilityFunCollection.creatLocationObj(result.data[0]));
    })
    .catch(err => {
        // console.log(err);
        res.status(500).send(err);
    });
};

// http://localhost:3001/Weather?lat=&lon
collectionObj.weatherForcastHandler = (req, res) => {
    const {lat, lon, city} = req.query;
    // console.log(lat, ' - ', lon, ' - ', city);
    axios
    .get(`${process.env.WATHER_API_URL}`, {params : {city : city, lat : lat, lon: lon, key: process.env.WEATHER_API_KEY}})
    .then(result => {
        //console.log(utilityFunCollection.createForcastObj(result.data));
        res.status(200).send(utilityFunCollection.createForcastObj(result.data));  
    })
    .catch(err => {
       //console.log(err);
       res.status(500).send(err);
    });
};

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


collectionObj.getCityCardsHandler = (req, res) => {
    const { cityName } = req.query;
    const lowerCaseCityName = cityName.toLocaleLowerCase();
    postModel.find({cityName: lowerCaseCityName}, (err, results) => {
      if(err)
        console.log(err);
      else
        res.send(results);
    });
};

collectionObj.getUserCardsHandler = (req, res) => {
    const { userEmail } = req.query;
    postModel.find({userEmail: userEmail}, (err, results) => {
      if(err)
        console.log(err);
      else
        res.send(results);
    });
};

collectionObj.getAllCardsHandler = (req, res) => {
    postModel.find({}, (err, results) => {
      if(err)
        console.log(err);
      else
        res.send(results);
    });
};

collectionObj.addCardsHandler = (req, res) => {
    const { userName, userEmail, content, userImg, cityImg, cityName} = req.body;
  
    const newPost = new postModel({
      userEmail: userEmail,
      userName: userName,
      userImg: userImg,
      content: content,
      cityImg: cityImg,
      cityName: cityName,
      likes: "0",
      comments: []
    });

    newPost.save().then( () => {
      postModel.find({}, (err, results) => {
        if(err)
          console.log(err);
         else
          res.send(results);
      });
    });
};

collectionObj.deleteCard = (req, res) => {
    const {id} = req.params;
    console.log("in delete handler!");
    postModel.deleteOne({_id : id}, (err, results) => {
      if(err)
        console.log(err);
      else{
        postModel.find({}, (err, results) => {
          if(err)
            console.log(err);
          else
            res.send(results);
        });
      }
    });
};

collectionObj.updateCard = (req, res) => {
    const {content, cityImg, cityName} = req.body;
    const {id} = req.params;

    console.log("in update handler and the body and params are:", req.body, "  ", req.params);
    postModel.findOne({_id: id}, (err, results) =>{
      if(err)
        console.log(err);
      else{
  
        results.content = content;
        results.cityImg = cityImg;
        results.cityName = cityName;
        results.save().then(() => {
          postModel.find({}, (err, results) => {
              if(err)
                consle.log(err);
              else
                res.send(results);
          });
        }); 
      }
    });
  };

collectionObj.addCardComment = (req, res) => {
    const{id, comment} = req.body;
    console.log('in addCardComment and id:', id,' of type: ', typeof id);
    console.log('id:', id);
    console.log('comment:', comment);
    postModel.findOne({_id: id}, (err, result) => {
        if(err)
            console.log(err);
        else{
            result.comments.unshift(comment);
            result.save().then( () =>{
              postModel.find({}, (err, results) => {
                    if(err)
                        console.log(err);
                    else
                        res.send(results);
                })}
            );
        }
    });
}

collectionObj.deleteCardComment = (req, res) => {
    const {id} = req.params;
    const {commentIdx} = req.body;
    postModel.findOne({_id: id}, (err, result) => {
        if(err)
            console.log(err);
        else{
            result.comments.splice(commentIdx, 1);
            result.save().then(() => {
              postModel.find({}, (err, results) => {
                if(err)
                    consloe.log(err);
                else
                    res.send(results);
              });
            });
        }
    });
};

collectionObj.updateCardComment = (req, res) => {
    const {id} = req.params;
    const {commentIdx, newComment} = req.body;

    console.log("in server handler!");
    postModel.findOne({_id: id}, (err, result) => {
        if(err)
            console.log(err);
        else{
            result.comments[commentIdx]= newComment;
            result.save().then( () =>{
                postModel.find({}, (err, results) => {
                    if(err)
                        console.log(err);
                    else
                        res.send(results);
                })
            });
        }
    });
};

module.exports = collectionObj;