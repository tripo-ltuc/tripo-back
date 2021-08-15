"use strict";

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const server = express();
server.use(cors());
server.use(express.json());

const PORT = process.env.PORT;

mongoose.connect("mongodb://localhost:27017/card", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const cardSchema = new mongoose.Schema({
    placeName: String,
    userName: String,
    comment: String,
    img: String,
  });
  
  const ownerSchema = new mongoose.Schema({
    ownerPlace: String,
    card: [cardSchema],
  });

  const cardModel = mongoose.model("book", cardSchema);
const ownerModel = mongoose.model("owner", ownerSchema);


function seedCard() {
    const place1 = new cardModel({
        placeName: 'amman',
        userName: 'mohammad',
        comment: 'amazing place',
        img: 'https://cache.marriott.com/marriottassets/marriott/AMMWI/ammwi-exterior-2067-hor-wide.jpg?interpolation=progressive-bilinear&downsize=1440px:*',
    });
    const place2 = new cardModel({
        placeName: 'paris',
        userName: 'ghadeer',
        comment: 'wonderful city ',
        img: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/07/03/1c/9c.jpg',
    });
  
    place1.save();
    place2.save();
  }
//   seedCard();
  
  function seedOwnerCollection() {
    const amman = new ownerModel({
        ownerPlace: "amman",
        card: [
       
        {
            placeName: 'amman',
            userName: 'mohammad',
            comment: 'amazing place',
            img: 'https://cache.marriott.com/marriottassets/marriott/AMMWI/ammwi-exterior-2067-hor-wide.jpg?interpolation=progressive-bilinear&downsize=1440px:*',
        },
      ],
    });
  
    const paris = new ownerModel({
        ownerPlace: "paris",
      card: [
      
        {
            placeName: 'paris',
            userName: 'ghadeer',
            comment: 'wonderful city ',
            img: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/07/03/1c/9c.jpg',
        },
      ],
    });
  
    amman.save();
    paris.save();
  }
  
//   seedOwnerCollection();


  server.get("/cards", getCardHandler);
// server.post("/addbooks", addBooksFun);

//http://localhost:3001/cards?city=amman

function getCardHandler(req, res) {
  let { city } = req.query;
  // let {name} = req.query
  ownerModel.find({ ownerPlace: city }, function (err, ownerData) {
    if (err || ownerData.length == 0) {
      console.log("is not working");
    } else {
      // console.log(ownerData[0]);
      console.log(ownerData[0].card);
      res.send(ownerData[0].card);
    }
  });
}



  server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
  });