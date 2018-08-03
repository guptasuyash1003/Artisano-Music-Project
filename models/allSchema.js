var mongoose = require('mongoose');

var artistSchema = new mongoose.Schema({
    Name: String,
    Description: String,
    YearsActive: Number
});

var Artist = mongoose.model("Artist", artistSchema);

var albumSchema = new mongoose.Schema({
    Artistid: [{
      ref: "Artist",
      type: mongoose.Schema.Types.ObjectId
    }],
    Name: String,
    ReleaseDate: {type: Date, default: Date.now}
});

var Album = mongoose.model("Album", albumSchema);

var trackSchema = new mongoose.Schema({
    Albumid: [{
      ref: "Album",
      type: mongoose.Schema.Types.ObjectId
    }],
    Name: String,
    Playtime: Number
});

var Track = mongoose.model("Track", trackSchema);

module.exports = {
  Artist:Artist,
  Album: Album,
  Track: Track
}