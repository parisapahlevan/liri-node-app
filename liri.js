require("dotenv").config();
var keys = require("./keys.js");
var axios = require('axios');
//var spotify = new Spotify(keys.spotify);


// FUNCTION DEFINITIONS ================================================================================
function makeAPIcall(whatUserWant){
    switch (whatUserWant) {
        case "concert-this":
            lookForConcert(process.argv[3])
            break;
        case "spotify-this-song":
            lookForSong()
            break;
        case "movie-this":
            lookForMovie()
            break;
        default:
            console.log("I don't know what you want")
            break;
    }
}


function lookForConcert(arg){
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
      });

}

function lookForSong(){
    console.log("get song")

}

function lookForMovie(){
    console.log("Get movie")

}

function fixMytime(str){
    var date = new Date(str);
    return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
}

// FUNCTION CALL================================================================================

makeAPIcall(process.argv[2])
