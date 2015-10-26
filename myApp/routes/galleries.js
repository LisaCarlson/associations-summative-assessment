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
    res.render('new', {gallery: data, errors: req.session.errorList});
  });
});

router.post('/:id/photos', function(req, res, next) {
  var errors = [];
  if (!req.body.name) {
    errors.push('Name is required');
  }
  if (!req.body.url) {
    errors.push('URL is required');
  }
  if (errors.length) {
    req.session.errorList = errors;
    res.redirect('/galleries/' + req.params.id + '/photos/new');
  }
  else {
    Helper.addPhoto(req.params.id, req.body.url, req.body.name).then(function (data) {
      req.session.errorList = null;
      res.redirect('/galleries/'+ req.params.id +'/photos');
    });
  }  
});

router.get('/:id/photos/:photoId/edit', function(req, res, next) {
  Helper.editPhoto(req.params.id, req.params.photoId).then(function (data) {
    res.render('edit', {photo: data[1], gallery: data[0], errors: req.session.errorList});
  });
});

router.post('/:id/photos/:photoId', function(req, res, next) {
  Helper.updatePhoto(req.params.photoId, req.body.name, req.body.url).then(function (data) {
    res.redirect('/galleries/'+ req.params.id +'/photos');
  });
});

router.post('/:id/photos/:photoId/delete', function(req, res, next) {
  Helper.removePhoto(req.params.photoId).then(function (data) {
    res.redirect('/galleries/'+ req.params.id +'/photos');
  });
});


module.exports = router;
