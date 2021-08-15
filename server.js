"use strict";

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const server = express();
server.use(cors());
server.use(express.json());

const PORT = process.env.PORT;

mongoose.connect("mongodb://localhost:27017/postCards", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// creating a schema
const cardsSchema = new mongoose.Schema({
  placeName: String,
  userName: String,
  comment: String,
  img: String,
});

const userSchema = new mongoose.Schema({
  cityName: String,
  card: [cardsSchema],
  value: String,
});

const cardsModel = mongoose.model("firstSchema", cardsSchema);
const userModel = mongoose.model("user", userSchema);

// seeding

function seedCardsCollections() {
  const input1 = new cardsModel({
    placeName: "Amman",
    userName: "Ghadeer",
    comment: "I don't like this city",
    img: "https://adminassets.devops.arabiaweather.com/sites/default/files/field/image/amman-at-night.jpgs",
  });

  const input2 = new cardsModel({
    placeName: "Paris",
    userName: "Mohammad",
    comment: "I like the city",
    img: "https://q-xx.bstatic.com/xdata/images/hotel/840x460/210768979.jpg?k=8c5a446976bf74a068d77c5e1dcf37158b9625883dd99ff46175fa6d263836e2&o=",
  });

  input1.save();
  input2.save();
}
seedCardsCollections();

function seedUserCollections() {
  const Amman = new userModel({
    cityName: "Amman",
    card: [
      {
        placeName: "Amman",
        userName: "Mohammad",
        comment: "I think it is a great city",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk9rwD-ytjWXcOBGtdR8qt7r4VhPWT3tUSQ_YP94Bya3ub0hLZPNcEgmHFQG3g2nrVEaM&usqp=CAU",
      },
      {
        placeName: "Amman",
        userName: "Rahaf",
        comment: "I think it is a great city",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk9rwD-ytjWXcOBGtdR8qt7r4VhPWT3tUSQ_YP94Bya3ub0hLZPNcEgmHFQG3g2nrVEaM&usqp=CAU",
      },
    ],
    value: "yes",
  });
  // const post = new userModel({
  //   cityName: "All",
  //   card: [],
  //   value: "yes",
  // });

  const Damascus = new userModel({
    cityName: "Damascus",
    card: [
      {
        placeName: "Damascus",
        userName: "Ali",
        comment: "I like it",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk9rwD-ytjWXcOBGtdR8qt7r4VhPWT3tUSQ_YP94Bya3ub0hLZPNcEgmHFQG3g2nrVEaM&usqp=CAU",
      },
      {
        placeName: "Damascus",
        userName: "Ali",
        comment: "I like it",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk9rwD-ytjWXcOBGtdR8qt7r4VhPWT3tUSQ_YP94Bya3ub0hLZPNcEgmHFQG3g2nrVEaM&usqp=CAU",
      },
    ],
    value: "yes",
  });
  Amman.save();
  Damascus.save();
  // post.save();
}

seedUserCollections();

server.get("/cards", getCardsHandler);

// http://localhost:3041/cards?city=Amman

function getCardsHandler(req, res) {
  let { city } = req.query;

  userModel.find({ cityName: city }, function (err, results) {
    if (err || results.length == 0) {
      console.log("is not working");
    } else {
      // console.log(ownerData[0]);
      // console.log(results[0].);
      res.send(results[0].card);
    }
  });
}
server.post("/addCards", addCardsHandler);
// http://localhost:3001/addCards?city=Amman&&placeName=Amman&&userName=Ghadeer&&comment=No&&img=image

function addCardsHandler(req, res) {
  const { value, placeName, userName, comment, img } = req.body;

  userModel.find({ value: value }, function (error, results) {
    if (error || results.length == 0) {
      res.send("is not working");
    } else {
      results[0].card.push({
        placeName: placeName,
        userName: userName,
        comment: comment,
        img: img,
      });
      results[0].save();
      res.send(results[0].card);
    }
  });
}

// http://localhost:3001/deleteCards?city=Amman

// server.delete("/deleteCards/:index", deletecard);

// function deletecard(req, res) {
//   const { city } = req.query;
//   const index = req.params.index;

//   userModel.find({ cityName: city }, (error, results) => {
//     if (error || results.length == 0) {
//       console.log(`The error is ${error}`);
//       res.status(404).send("Kill me");
//     } else {
//       const newData = results[0].card.filter((item, idx) => {
//         if (idx != index) {
//           return item;
//         }
//       });
//       console.log(newData);
//       results[0].card = newData;
//       results[0].save();
//       res.status(200).send(results[0].card);
//     }
//   });
// }


server.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

server.get("/", homepage);
function homepage(req, res) {
  res.send("Hello ");
}
