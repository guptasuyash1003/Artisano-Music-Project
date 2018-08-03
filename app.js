var express = require("express"),
    app     = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    expressSanitizer = require("express-sanitizer"),
    methodOverride = require('method-override'),
    path = require("path"),
    models = require("./models/allSchema");
    artists = require('./routes/artists'),
    albums = require('./routes/albums'),
    tracks = require('./routes/tracks');
    
// mongoose.connect("mongodb://localhost/z2p");
mongoose.connect("mongodb://suyash:suyash123@ds113122.mlab.com:13122/artisano");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,'public')));
// app.use(express.static("public"));
app.use(methodOverride('_method'));



// var artistSchema = new mongoose.Schema({
//     Name: String,
//     Description: String,
//     YearsActive: Number
// });

// var Artist = mongoose.model("Artist", artistSchema);



// // RESTFUL ROUTES

app.get("/", function(req, res){
   res.render("homepage"); 
});

// // INDEX ROUTE
// app.get("/artist", function(req, res){
//    Artist.find({}, function(err, artists){
//        if(err){
//            console.log("ERROR!");
//        } else {
//           res.render("index", {artists: artists}); 
//        }
//    });
// });

// // NEW ROUTE
// app.get("/artist/new", function(req, res){
//    res.render("new"); 
// });

// app.get("/album/new", function(req, res){
//    res.render("new"); 
// });

// app.get("/track/new", function(req, res){
//    res.render("new"); 
// });

// // CREATE ROUTE
// app.post("/music", function(req, res){
//     // create blog
//     console.log(req.body);
//     console.log("===========")
//     console.log(req.body);
//     Blog.create(req.body.blog, function(err, newBlog){
//         if(err){
//             res.render("new");
//         } else {
//             //then, redirect to the index
//             res.redirect("/music");
//         }
//     });
// });

// // SHOW ROUTE
// app.get("/music/:id", function(req, res){
//    Blog.findById(req.params.id, function(err, foundBlog){
//        if(err){
//            res.redirect("music");
//        } else {
//            res.render("show", {blog: foundBlog});
//        }
//    })
// });

// // EDIT ROUTE
// app.get("/music/:id/edit", function(req, res){
//     Blog.findById(req.params.id, function(err, foundBlog){
//         if(err){
//             res.redirect("/music");
//         } else {
//             res.render("edit", {blog: foundBlog});
//         }
//     });
// })


// // UPDATE ROUTE
// app.put("/music/:id", function(req, res){
//     req.body.blog.body = req.sanitize(req.body.blog.body)
//    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
//       if(err){
//           res.redirect("/music");
//       }  else {
//           res.redirect("/music/" + req.params.id);
//       }
//    });
// });

// // DELETE ROUTE
// app.delete("/music/:id", function(req, res){
//    //destroy blog
//    Blog.findByIdAndRemove(req.params.id, function(err){
//        if(err){
//            res.redirect("/music");
//        } else {
//            res.redirect("/music");
//        }
//    })
//    //redirect somewhere
// });

// app.use('/', routes);

app.use(function(req, res, next) {
    req.resources = req.resources || {};
   // res.locals.app = config.app;
    res.locals.currentUser = req.user;
    res.locals._t = function (value) { return value; };
    res.locals._s = function (obj) { return JSON.stringify(obj); };
    next();
})

app.use('/artists', artists);
app.use('/albums', albums);
app.use('/tracks', tracks);

app.get("*", function(req, res){
   res.render("homepage"); 
});

// app.listen(3000,function(){
//     console.log("Server is listening at port 3000");
// })

// var port_number = server.listen(process.env.PORT || 3000);
let port_number = process.env.PORT || 3000;
app.listen(port_number);