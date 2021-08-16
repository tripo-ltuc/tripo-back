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
// const cardsSchema = new mongoose.Schema({
//   cityName: String,
//   userName: String,
//   content: String,
//   userEmail: String,
//   cityImg: String,
//   likes: String,
//   userImg: String,
//   comments: Array,
// });

const commentSchema = new mongoose.Schema({
  userImg: String,
  userName: String,
  userComment: String,
});

const postSchema = new mongoose.Schema({
  placeName: String,
  content: String,
  userName: String,
  cityImg: String,
  likes: String,
  userImg: String,
  comments: [commentSchema],
});

const ownerSchema = new mongoose.Schema({
  userEmail: String,
  postArr: [postSchema],
  cityName: String,
});

const ownerModel = mongoose.model("owner", ownerSchema);

function seedOwnerCollection() {
  const firstCommenter = new ownerModel({
    userEmail: "ghadeerkhasawneh91@gmail.com",
    cityName: "Paris",
    postArr: [
      {
        placeName: "Paris",
        content: "I like Paris.",
        userName: "Ghadeer",
        cityImg: "Img",
        likes: "1",
        userImg: "userImg",
        comments: [
          { userImg: "img", userName: "Ahmad", userComment: "You are right!" },
        ],
      },
    ],
  });

  const secondCommenter = new ownerModel({
    userEmail: "",
    cityName: "London",
    postArr: [
      {
        placeName: "London",
        content: "I like London.",
        userName: "Mohammad",
        cityImg: "Img",
        likes: "1",
        userImg: "userImg",
        comments: [
          { userImg: "img", userName: "Ahmad", userComment: "You are right!" },
        ],
      },
    ],
  });

  firstCommenter.save();
  secondCommenter.save();
}

// seedOwnerCollection();

server.get("/cards", getCardsHandler);
// http://localhost:3020/cards?city=Amman

function getCardsHandler(req, res) {
  let { city } = req.query;

  ownerModel.find({ cityName: city }, function (err, results) {
    if (err || results.length == 0) {
      console.log("is not working");
    } else {
      // console.log(results[0], "results sub0");
      // console.log(results);
      res.send(results);
    }
  });
}

server.post("/addCards", addCardsHandler);
// http://localhost:3020/addCards?cityName=Amman

function addCardsHandler(req, res) {
  let { userName, userEmail, content, userImg, comments } = req.body;
  let { cityName, cityImg, likes } = req.query;

  const newPost = {
    placeName: cityName,
    content: content,
    userName: userName,
    cityImg: cityImg,
    likes: likes,
    userImg: userImg,
    comments: comments.length || [],
  };
  const userObject = {
    userEmail: userEmail,
    cityName: cityName,
    postArr: newPost,
  };

  ownerModel.find({ cityName: city }, function (err, results) {
    if (err || results.length == 0) {
      console.log("is not working");
    } else {
      // console.log(results[0], "results sub0");
      // console.log(results);
      res.send(results);
    }
  });
}

//   cardsModel.find({ cityName: cityName }, function (error, results) {
//     if (error || results.length == 0) {
//       res.send("is not working");
//     } else {
//       console.log("before", results);
//       results.push(allObj);
//       console.log("after", results);
//       results.save();

//       // res.send(allObj);
//     }
//   });
// }

// //localhost:3001/deleteCards?city=Amman

// server.delete("/deleteCards/:index", deletecard);
// function deletecard(req, res) {
//   const { value } = req.query;
//   const index = req.params.index;
//   cardsModel.find({ cityName: city }, (err, results) => {
//     if (error || results.length == 0) {
//       console.log(`The error is ${error}`);
//       res.status(404).send("Kill me");
//     } else {
//       // const newData = results[0].card.filter((item, idx) => {
//       //   if (idx != index) {
//       //     return item;
//       //   }
//       // });
//       const newData = results[0].card.splice(-1);
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
