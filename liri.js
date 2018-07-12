

// Setting up all of our packages before we begin so we don't forget
require("dotenv").config();
var keys = require("./keys");
var request = require("request");
var fs = require("fs");
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');

// creating a new spotify and twitter 
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// console.log(tweet);

var thingTodo = process.argv[2];
var withWhat = process.argv[3];



// Utilizing the twitter npm to retreive data
function tweets() {
    var params = { screen_name: 'Will60122602' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {

                console.log("----------------------------------\n");
                console.log(tweets[i].created_at);
                console.log(JSON.stringify(tweets[i].text));  // Raw response object. 

            }
        }
    });
}


function spotifyThisSong() {


    spotify.search({ type: 'track', query: withWhat, limit: 10 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var dataFixed = JSON.stringify(data, null, 2);
        console.log(dataFixed);
    });
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }

        var dataArr = data.split(",");
        thingTodo = dataArr[0];
        withWhat = dataArr[1];

        spotifyThisSong();
    })
}

function movieThis() {
    request("http://www.omdbapi.com/?t=" + withWhat + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

        // If there were no errors and the response code was 200 (i.e. the request was successful)...
        if (!error && response.statusCode === 200) {

            // Then we print out the imdbRating
            console.log(JSON.stringify(body, null, 2));
        }
    });
}


























// switch that will check the first argument passed in the command line and executed based on the case
switch (thingTodo) {

    case "my-tweets":
        tweets();
        break;

    case "movie-this":
        if (!withWhat) {
            withWhat = "Mr.Nobody";
            movieThis();
        } else {
            movieThis();
        }
        break;

    case "spotify-this-song":
        if (!withWhat) {
            withWhat = "The Sign by Ace of Base";
            spotifyThisSong();
        } else {
            spotifyThisSong();
        }
        break;

    case "do-what-it-says":
        doWhatItSays();
        break;

    default: console.log("Hey liri user what zup");

}