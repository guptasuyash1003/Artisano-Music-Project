var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var models = require('../models/allSchema');
//body-parser middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Show all albums

router.get("/", function(req, res){
        models.Album.find({}).
  populate('Artistid').
  exec(function (err, albums) {
    if (err) return handleError(err);
    res.render("albums", {albums: albums});
    // console.log(albums);
   });
});

// Create new album

router.post("/",function(req,res){
        models.Album.create({
            Name:req.sanitize(req.body.Name),
            ReleaseDate:req.sanitize(req.body.ReleaseDate)
        }, function(err, album){
                    if(err){
                      console.log(err);
                    } else{
                              models.Artist.findOne({Name: req.body.Artistid}, function(err, artist){
                                if(err){
                                    console.log(err);
                                }
                               else{ album.Artistid.push(artist);
                                album.save();
                                console.log(album);
                                res.redirect("/albums");
                                //console.log(job);
                            }
                            })
                    }
         });
  });

router.get("/new", function(req, res){ 
   models.Artist.find({}, function(err, artists){
       if(err){
           console.log("ERROR!");
       } else {
          res.render("newalbums", {artists: artists}); 
       }
   });
});

// SHOW ROUTE

router.get("/:id", function(req, res){
  models.Album.findOne({ _id: req.params.id }).
  populate('Artistid').
  exec(function (err, foundAlbum) {
    if (err) {
           res.redirect("/albums");
    } else {
       console.log(foundAlbum.Artistid[0].Name);
       models.Track.find({Albumid: req.params.id}, function(err, tracks){
                  if(err){
                    console.log(err);
                  } else {
                   res.render("showalbums", {id:req.params.id, tracks:tracks, artistname: foundAlbum.Artistid[0].Name, Name: foundAlbum.Name, ReleaseDate: foundAlbum.ReleaseDate});
                  }
              });
    }
  });
});

// EDIT

router.get("/:id/edit", function(req,res){
  models.Album.findById(req.params.id, function(err, foundAlbum){
       if(err){
           res.redirect("/albums");
       } else {
                  // console.log(foundAlbum.Artistid[0]);
                  models.Artist.findOne({_id:foundAlbum.Artistid[0]}, function(err, artist){
                 if(err){
                     console.log("ERROR!");
                 } else {
                  models.Artist.find({}, function(err, artists){
                    if(err){
                      console.log(err);
                    } else {
                      res.render("editalbums", {artistname: artist.Name, artists: artists, id:req.params.id, Name: foundAlbum.Name, ReleaseDate: foundAlbum.ReleaseDate, Artistid: foundAlbum.Artistid}); 
                  
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
    var rd=req.body.ReleaseDate;
    req.body.Artistid = req.sanitize(req.body.Artistid);
   
    models.Album.findById(req.params.id, function(err, foundAlbum){
      if(err){
        console.log(err);
      } else {
        if(rd!="") {
          rd = req.sanitize(req.body.ReleaseDate);
            console.log(req.body.ReleaseDate);
            console.log("for body");
            console.log(rd);
            var album= {
      Name: req.body.Name,
      ReleaseDate: rd,
      Artistid: req.body.Artistid
    }

   models.Album.findByIdAndUpdate(req.params.id, album, function(err, updatedAlbum){
      if(err){
          res.redirect("/albums/"+req.params.id+"/edit");
      }  else {
          // res.redirect("/albums"); 
           res.redirect("/albums/"+req.params.id);  
      }
   });
          
        } else {
            rd= foundAlbum.ReleaseDate;
          console.log(foundAlbum.ReleaseDate);
          console.log("for null date")
          console.log(rd);
          var album= {
      Name: req.body.Name,
      ReleaseDate: rd,
      Artistid: req.body.Artistid
    }

   models.Album.findByIdAndUpdate(req.params.id, album, function(err, updatedAlbum){
      if(err){
          res.redirect("/albums/"+req.params.id+"/edit");
      }  else {
          // res.redirect("/albums");  
          res.redirect("/albums/"+req.params.id); 
      }
   });
        }
      }
    });
});

// DELETE

router.delete("/:id", function(req, res){
   models.Album.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/albums");
      }  else {
          res.redirect("/albums");   
      }
   });
});

module.exports = router;