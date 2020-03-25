const path = require("path");
const router = require("express").Router();
const db = require("../model/index");
const request = require('supertest');
var schedule = require('node-schedule');

const axios = require("axios");

// this would really only need to be run once during deployment- that's why I made the conditional 
router.get("/seed", function (req, res) {
  db.USA.find({}).then((response) => {
    if (response.length > 0) {
      //do nothing
      console.log(`data is aleady here`);
    }
    else {
      axios.get("https://covid19-api.weedmark.systems/api/v1/stats?country=USA").then((response) => {
        console.log("axios fired");
        let data = response.data.data.covid19Stats

        // 3/24/2020:  API ADDED COUNTY TO US, BUT THEY NAME IT "CITY".  RENAMED MODEL ACCORDINGLY
        console.log(data.slice(0, 5));
        db.USA.create(data).then((response) => {
          res.json(response);
        })
      });
    }
  })
})

// update hourly, etc
router.get("/update", function (req, res) {
  axios.get("https://covid19-api.weedmark.systems/api/v1/stats?country=USA").then((response) => {

    let data = response.data.data.covid19Stats

    for (let i = 0; i < data.length; i++) {
      db.USA.findOne({ province: data[i].province }).then((response) => {
        if (response.lastUpdate[response.lastUpdate.length - 1] === data[i].lastUpdate) {
          // skip updating
          console.log(`No new data.  Skipping update for ${data[i].province}`);
        }
        else {
          //update with new data
          db.USA.findOneAndUpdate(
            { province: data[i].province },
            { $push: { lastUpdate: data[i].lastUpdate, confirmed: data[i].confirmed, deaths: data[i].deaths, recovered: data[i].recovered } }
          ).then((response) => {
            console.log(`New data found for ${data[i].province}`);
            console.log(response);
          })
        }
      });
    }
  });
})

let updater = () => {
  request(router)
    .get('/update')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) throw err;
      console.log(`test done`)
    });
}

// runs updater at the top of every hour
var j = schedule.scheduleJob('0 * * * *', function () {
  updater();
});

// If no API routes are hit, send the React app

router.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/public/index.html"));
});

module.exports = router;