

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


// Setting up our arguments
var thingTodo = process.argv[2];
var withWhat = process.argv;
var inputSearch = "";
for (var i = 3; i < withWhat.length; i++) {
    if (i > 3 && i < withWhat.length) {
        inputSearch = inputSearch + "+" + withWhat[i];
    } else {
        inputSearch += withWhat[i];
    }
}
// console.log(inputSearch);



// Utilizing the twitter npm to retreive data
function tweets() {
    var params = { screen_name: 'Will60122602' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                // Setting up the data in a variable so we can append it to te file later
                var dateCreated = tweets[i].created_at;
                var tweetText = JSON.stringify(tweets[i].text);
                var dataDisplayed = dateCreated + "\n" + tweetText + "\n" + brokenLine + "\n";
                console.log("\n" + dataDisplayed);

                // Appending the entry to the log.txt file
                fs.appendFile("log.txt", dataDisplayed, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }
    });
}

// this will be used to help use organize our display
var brokenLine = "----------------------------------------------------------------------------------------------------------------------";

// Utilizing the spotify npm to retrieve data 
function spotifyThisSong() {

    spotify.search({ type: 'track', query: inputSearch, limit: 10 }, function (err, data) {
        if (err) {
            return console.log(err);
        }

        // Setting up the data in a variable so we can append it to te file later
        var artistName = "Artist Name: " + data.tracks.items[0].artists[0].name;
        var songName = "Song Name: " + data.tracks.items[0].name;
        var albumName = "Album Name: " + data.tracks.items[0].album.name;
        var previewUrl = "Preview Url: " + data.tracks.items[0].preview_url;
        var dataDisplayed = artistName + "\n" + songName + "\n" + albumName + "\n" + previewUrl + "\n" + brokenLine + "\n";
        console.log("\n" + dataDisplayed);

        // Appending the entry to the log.txt file
        fs.appendFile("log.txt", dataDisplayed, function (err) {
            if (err) {
                console.log(err);
            }
        });

    });
}

// Creating a funtion that will read the random file then set up the arguments from the file and run the search
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }

        var dataArr = data.split(",");
        thingTodo = dataArr[0];
        inputSearch = JSON.parse(dataArr[1]);
        spotifyThisSong();
    });
}

// Utilizing the request npm to access the omdb API and retrieve the data needed
function movieThis() {

    request("http://www.omdbapi.com/?t=" + inputSearch + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

        // If there were no errors and the response code was 200 (i.e. the request was successful)...
        if (!error && response.statusCode === 200) {

            //  Setting up the data in a variable so we can append it to te file later
            var data = JSON.parse(body, null, 2);
            var movieTitle = "Title: " + data.Title;
            var releaseYear = "Release Year: " + data.Year;
            var imbdRating = "imbdRating: " + data.imdbRating;
            var rTomato = "Rotten Tomatoes Rating: " + data.Ratings[1].Value;
            var movieCountry = "Country where the movie was produced: " + data.Country;
            var movieLanguage = "Language of the movie: " + data.Language;
            var moviePot = "Plot: " + data.Plot;
            var movieActors = "Actors: " + data.Actors;
            var dataDisplayed = movieTitle + "\n" + releaseYear + "\n" + imbdRating + "\n" + rTomato + "\n" + movieLanguage + "\n" + movieCountry + "\n" + moviePot + "\n" + movieActors + "\n" + brokenLine + "\n";
            console.log("\n" + dataDisplayed);

            // Appending the entry to the log.txt file
            fs.appendFile("log.txt", dataDisplayed, function (err) {
                if (err) {
                    console.log(err);
                }
            });
        }
    });
}

// switch that will check the first argument passed in the command line and executed based on the case
switch (thingTodo) {

    case "my-tweets":
        tweets();
        break;

    case "movie-this":
        if (!inputSearch) {
            inputSearch = "Mr.Nobody";
            movieThis();
        } else {
            movieThis();
        }
        break;

    case "spotify-this-song":
        if (!inputSearch) {
            inputSearch = "The Sign by Ace of Base";
            spotifyThisSong();
        } else {
            spotifyThisSong();
        }
        break;

    case "do-what-it-says":
        doWhatItSays();
        break;

    default: console.log("Hey I'm Liri! What do you want me to do? Type in the thingToDo");
}