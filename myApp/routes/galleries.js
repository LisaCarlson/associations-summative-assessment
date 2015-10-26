var express = require('express');
var router = express.Router();
var Helper = require('../lib/scripts.js');

  
router.get('/', function(req, res, next) {
  Helper.findGalleries().then(function (data) {
    res.render('gallery', {galleries: data});
  });
});

router.get('/:id/photos', function(req, res, next) {
  Helper.showPhotos(req.params.id).then(function (data) {
    res.render('show', {gallery: data.gallery, photos: data.photos});
  });      
});

router.get('/:id/photos/new', function(req, res, next) {
  Helper.renderNew(req.params.id).then(function (data) {
    res.render('new', {gallery: data});
  });  
});

router.post('/:id/photos', function(req, res, next) {
  var id = req.params.id;
  Helper.addPhoto(id, req.body.url, req.body.name).then(function (data) {
    res.redirect('/galleries/'+ id +'/photos');
  })  
});

router.get('/:id/photos/:photoId/edit', function(req, res, next) {
  Helper.editPhoto(req.params.id, req.params.photoId).then(function (data) {
    res.render('edit', {photo: data[1], gallery: data[0]});
  });
});

router.post('/:id/photos/:photoId', function(req, res, next) {
  console.log(req.body.name)
  Helper.updatePhoto(req.params.id, req.params.photoId, req.body.name, req.body.url).then(function (data) {
    res.redirect('/galleries/'+ req.params.id +'/photos');
  });
});


module.exports = router;
