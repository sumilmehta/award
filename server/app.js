"use strict";

let express = require("express");
let app = express();

let mongoUtil = require('./mongoUtil');
mongoUtil.connect();

app.use( express.static(__dirname + "/../client") );

let bodyParser = require("body-parser");
let jsonParser = bodyParser.json();

app.get("/awards", (request, response) => {
  let awards = mongoUtil.awards();
  awards.find().toArray((err,docs) => {
    if(err) {
      response.sendStatus(400);
    }
    console.log(JSON.stringify(docs));
    let awardNames = docs.map((award) => award.name);
    response.json( awardNames );
  });
});

app.get("/awards/:name", (request, response) => {
  let awardName = request.params.name;

  let awards = mongoUtil.awards();
  awards.find({name: awardName}).limit(1).next((err,doc) => {
    if(err) {
      response.sendStatus(400);
    }
    console.log( "Award doc: ", doc );
    response.json(doc);
  });

});


app.post("/awards/:name/trophy", jsonParser, (request, response) => {
  let awardName = request.params.name;
  let newTrophy = request.body.trophy || {};

  if(!newTrophy.category || !newTrophy.year || !newTrophy.name){
    response.sendStatus(400);
  }

  let awards = mongoUtil.awards();
  let query = {name: awardName};
  let update = {$push: {Trophy: newTrophy}};

  awards.findOneAndUpdate(query, update, (err, res) => {
    if(err){
      response.sendStatus(400);
    }
    response.sendStatus(201);
  });
});


app.listen(8181, () => console.log( "Listening on 8181" ));
