var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var models = require('../models/allSchema');
//body-parser middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Show all tracks

router.get("/", function(req, res){
        models.Track.find({}).
  populate('Albumid').
  exec(function (err, tracks) {
    if (err) return handleError(err);
    res.render("tracks", {tracks: tracks});
    // console.log(Albumid);
   });
});

// Create new track

router.post("/",function(req,res){
        models.Track.create({
            Name:req.sanitize(req.body.Name),
            Playtime:req.sanitize(req.body.Playtime)
        }, function(err, track){
                    if(err){
                      console.log(err);
                    } else{
                              models.Album.findOne({Name: req.body.Albumid}, function(err, album){
                                if(err){
                                    console.log(err);
                                }
                               else{ track.Albumid.push(album);
                                track.save();
                                console.log(track);
                                res.redirect("/tracks");
                                //console.log(job);
                            }
                            })
                    }
         });
  });

router.get("/new", function(req, res){ 
   models.Album.find({}, function(err, albums){
       if(err){
           console.log("ERROR!");
       } else {
          res.render("newtracks", {albums: albums}); 
       }
   });
});

// // SHOW ROUTE
// router.get("/:id", function(req, res){
//    models.Album.findOne({ _id: req.params.id }).
//   populate('Artistid').
//   exec(function (err, album) {
//     if (err) return handleError(err);
//     console.log(album.Artistid[0].Name);
//   });
// });

router.get("/:id", function(req, res){
  models.Track.findOne({ _id: req.params.id }).
  populate('Albumid').
  exec(function (err, foundTrack) {
    if (err) {
           res.redirect("/tracks");
    } else {
       // console.log(foundTrack.Albumid[0].Artistid);
       models.Artist.findOne({_id: foundTrack.Albumid[0].Artistid}, function(err, artist){
                  if(err){
                    console.log(err);
                  } else {
                    console.log(foundTrack.Albumid[0].Name)
                   res.render("showtracks", {artistname: artist, albumname: foundTrack.Albumid[0].Name, Name: foundTrack.Name, Playtime: foundTrack.Playtime});
                  }
              });
    }
  });
});

// EDIT

router.get("/:id/edit", function(req,res){
  models.Track.findById(req.params.id, function(err, foundTrack){
       if(err){
           res.redirect("/tracks");
       } else {
                  // console.log(foundAlbum.Artistid[0]);
                  models.Album.findOne({_id:foundTrack.Albumid[0]}, function(err, album){
                 if(err){
                     console.log("ERROR!");
                 } else {
                  models.Album.find({}, function(err, albums){
                    if(err){
                      console.log(err);
                    } else {
                      res.render("edittracks", {albumname: album.Name, albums: albums, id:req.params.id, Name: foundTrack.Name, Playtime: foundTrack.Playtime, Albumid: foundTrack.Albumid}); 
                  
                    }
                  })
                    // console.log(artist.Name);
                 }
                 });
       }
   });
});

// UPDATE

router.put("/:id", function(req, res){
    req.body.Name = req.sanitize(req.body.Name);
    req.body.Playtime = req.sanitize(req.body.Playtime);
    req.body.Albumid = req.sanitize(req.body.Albumid);
    var track= {
      Name: req.body.Name,
      Playtime: req.body.Playtime,
      Albumid: req.body.Albumid
    }

   models.Track.findByIdAndUpdate(req.params.id, track, function(err, updatedTrack){
      if(err){
          res.redirect("/tracks/"+req.params.id+"/edit");
      }  else {
          // res.redirect("/tracks"); 
          res.redirect("/tracks/"+req.params.id);  
      }
   });
});

// DELETE

router.delete("/:id", function(req, res){
   models.Track.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/tracks");
      }  else {
          res.redirect("/tracks");   
      }
   });
});

module.exports = router;