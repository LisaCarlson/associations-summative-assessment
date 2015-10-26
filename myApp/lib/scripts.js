var db = require('monk')('localhost/galleries-demo');
var Galleries = db.get('galleries');
var Photos = db.get('photos');


var Helper = {
  findGalleries : function() {
    return Galleries.find({}).then(function (data) {
      return data;
    });
  },

  addGallery : function(title, description, url) {
    return Galleries.insert({img: url, title: title, description: description, photoId: []});
  },

  showPhotos : function(id) {
    return Galleries.findOne({_id: id}).then(function (gallery) {
      return gallery;
    }).then(function (gallery) {
      return Photos.find({_id: {$in: gallery.photoId} }).then(function (photos) {
        var result = {};
        result['gallery'] = gallery;
        result['photos'] = photos;
        return result;
      });
    });
  },

  renderNew : function(id) {
    return Galleries.findOne({_id: id}).then(function (gallery) {     
      return gallery;
    });
  },

  addPhoto : function(id, url, name) {
    return Photos.insert({name: name, img: url}).then(function (photo) {
      return photo;
    }).then(function (photo) {   
      return Galleries.findOne({_id: id}).then(function (gallery) {    
        gallery.photoId.push(photo._id);
        return gallery;
      }).then(function (gallery) {
        return Galleries.updateById(id, {$set: {photoId: gallery.photoId}});
      });
    });
  },

  editPhoto : function(galleryId, photoId) {
    return Galleries.findOne({_id: galleryId}).then(function (gallery) {
      return gallery;
    }).then(function (gallery) {
      return Photos.findOne({_id: photoId}).then(function (photo) {
        return [gallery, photo];
      });
    });    
  },

  updatePhoto : function(photoId, name, url) {
    return Photos.updateById(photoId, {name: name, img: url});
  },

  removePhoto : function(photoId) {
    return Photos.remove({_id: photoId});
  }
}

module.exports = Helper;






