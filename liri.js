require("dotenv").config();
readline = require('readline');
var keys = require("./keys.js");
var axios = require('axios');
var fs = require("fs")
var Spotify = require('node-spotify-api');

var spotify = new Spotify({
  id: keys.spotify.id,
  secret: keys.spotify.secret
});

// FUNCTION DEFINITIONS ================================================================================
function makeAPIcall(whatUserWant) {
  switch (whatUserWant) {
    case "concert-this":
      if(process.argv[3]){
        lookForConcert(process.argv[3])
      }else{
        console.log("Please Provide the artist or the band name")
      }
      break;
    case "spotify-this-song":
      if(process.argv[3]){
        lookForSong(process.argv[3])
      }else{
        console.log("Please Provide the song's name")
      }
      break;
    case "movie-this":
      lookForMovie(process.argv[3])
      break;
    default:
      console.log("I don't know what you want")
      break;
  }
}

function lookForConcert(arg) {
  var artist = arg.split("/")[0]
  axios.get(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`)
    .then(function (response) {
      console.log("\n\n------------------ RESPONSE FROM API : -------------------")
      console.log("Name of the venue: ", response.data[0].venue.name);
      console.log("Venue location: ", response.data[0].venue.country + ", " + response.data[0].venue.city);
      console.log("Date of the Event: ", fixMytime(response.data[0].datetime));
      console.log("----------------------------------------------------------\n\n")
    })
    .catch(function (error) {
      console.log("API ERROR: ", error);
    })
}

function lookForSong(arg) {
  spotify.search({ type: 'track', query: arg }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    for (let i = 0; i < data.tracks.items.length; i++) {
      console.log("Artist(s): ", data.tracks.items[i].artists[0].name)
      console.log("The song's name: ", data.tracks.items[i].name)
      console.log("A preview link of the song from Spotify: ", data.tracks.items[i].href)
      console.log("The album that the song is from: ", data.tracks.items[i].album.name)
      console.log("\n ----------------------------------------------")
    }
  });
}

function lookForMovie(movie) {
  if (!movie) {
    movie = "Mr. Nobody"
  }
  axios.get(`http://www.omdbapi.com/?t=${movie}&apikey=203d1332`)
    .then(function (response) {
      console.log("\n\n------------------ RESPONSE FROM API : -------------------")
      // console.log(response.data)
      console.log("Title of the movie: ", response.data.Title);
      console.log("Year the movie came out: ", response.data.Year);
      console.log("IMDB Rating of the movie: ", response.data.imdbRating);
      console.log("Rotten Tomatoes Rating of the movie: ", response.data.Ratings.Source);
      console.log("Country where the movie was produced: ", response.data.Country);
      console.log("Language of the movie: ", response.data.Language);
      console.log("Plot of the movie: ", response.data.Plot);
      console.log("Actors in the movie: ", response.data.Actors);
      console.log("----------------------------------------------------------\n\n")
    })
    .catch(function (error) {
      console.log(error);
    })
}

function fixMytime(str) {
  var date = new Date(str);
  return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
}

async function readMyFile(fileName) {
  const fileStream = fs.createReadStream(fileName);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  for await (const line of rl) {
    var parseArr = line.split(',')
    var apiToCall = parseArr[0];
    console.log("\n\n\n\n\napiToCall: ", apiToCall)
    var whatToLookFor = parseArr[1]
    console.log("whatToLookFor: ", whatToLookFor)
    if (apiToCall === "spotify-this-song") {
      lookForSong(whatToLookFor)
    }
  }
}

function liri(){
  if(process.argv.length === 2){ // Means we read from the file if the user only entered: node liri.js 
    readMyFile("random.txt")
  }else{
    makeAPIcall(process.argv[2])
  }
}

// FUNCTION CALL================================================================================

liri()



