var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/galleries-demo');
var Galleries = db.get('galleries');
var Photos = db.get('photos');
var Helper = require('../lib/scripts.js');

  
router.get('/', function(req, res, next) {
  Helper.find().then(function (data) {
    res.render('gallery', {galleries: data});
  });
});


router.get('/:id/photos', function(req, res, next) {
  Galleries.findOne({_id: req.params.id}).then(function (gallery) {
    return gallery;
  }).then(function (gallery) {
    return Photos.find({_id: {$in: gallery.photoId} }).then(function (doc) {
      return doc;
    }).then(function (photos) {
      res.render('show', {photos: photos, gallery: gallery});
    });
  });
});

module.exports = router;
