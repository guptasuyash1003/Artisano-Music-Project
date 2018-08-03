var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var models = require('../models/allSchema');
//body-parser middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Show all artists

router.get("/", function(req, res){
   models.Artist.find({}, function(err, artists){
       if(err){
           console.log("ERROR!");
       } else {
          res.render("artists", {artists: artists}); 
       }
   });
});

// Create new artist

router.post("/",function(req,res){
        models.Artist.create({
            Name:req.sanitize(req.body.Name),
            Description:req.sanitize(req.body.Description),
            YearsActive:req.sanitize(req.body.YearsActive),
        }, function(err, artist){
                    if(err){
                      console.log(err);
                    } else{
                      console.log(artist);
                      res.redirect("/artists");
                    }
         });
  });

router.get("/new", function(req, res){
   res.render("newartists"); 
});

// SHOW ROUTE
router.get("/:id", function(req, res){
   models.Artist.findById(req.params.id, function(err, foundArtist){
       if(err){
           res.redirect("/artists");
       } else {
              models.Album.find({Artistid: req.params.id}, function(err, albums){
                  if(err){
                    console.log(err);
                  } else {
                            res.render("showartists", {id:req.params.id, albums:albums, Name: foundArtist.Name, Description: foundArtist.Description, YearsActive: foundArtist.YearsActive});
                  }
              });
       }
   })
});

// EDIT

router.get("/:id/edit", function(req,res){
  models.Artist.findById(req.params.id, function(err, foundArtist){
       if(err){
           res.redirect("/artists");
       } else {
          res.render("editartists", {id:req.params.id, Name: foundArtist.Name, Description: foundArtist.Description, YearsActive: foundArtist.YearsActive}); 
       }
   });
});

// UPDATE

router.put("/:id", function(req, res){
    req.body.Name = req.sanitize(req.body.Name);
    req.body.Description = req.sanitize(req.body.Description);
    req.body.YearsActive = req.sanitize(req.body.YearsActive);
    var artist= {
      Name: req.body.Name,
      Description: req.body.Description,
      YearsActive: req.body.YearsActive
    }
   models.Artist.findByIdAndUpdate(req.params.id, artist, function(err, updatedArtist){
      if(err){
          res.redirect("/artists/"+req.params.id+"/edit");
      }  else {
        // res.redirect("/artists");
          res.redirect("/artists/"+req.params.id); 
          // res.render("showartists", {id:req.params.id, albums:albums, Name: foundArtist.Name, Description: foundArtist.Description, YearsActive: foundArtist.YearsActive})  
      }
   });
});

// DELETE

router.delete("/:id", function(req, res){
   models.Artist.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/artists");
      }  else {
          res.redirect("/artists");   
      }
   });
});

module.exports = router;