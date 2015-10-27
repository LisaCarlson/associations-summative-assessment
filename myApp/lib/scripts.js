var db = require('monk')('localhost/galleries-demo');
var Galleries = db.get('galleries');
var Photos = db.get('photos');
var Users = db.get('users');
var bcrypt = require('bcrypt');


var Helper = {
  signin : function(email, password) {
    var errors = [];
    return Users.findOne({email: email}).then(function (data) {
      if (data) {
        if (bcrypt.compareSync(password, data.passwordDigest)) {
          return Galleries.find({ _id: { $in: data.galleries } }).then(function (docs) {
            return docs;
          });
        }
        else {
          errors.push("Invalid email / password");
          res.render('login', {errors: errors});
        }
      } else {
        errors.push('Invalid email / password');
        res.render('login', {errors: errors});
      }
    }); 
  },

  addUser : function(email, password) {
    var hash = bcrypt.hashSync(password, 12);
    var errors = [];
    return Users.findOne({email: email.toLowerCase()}).then(function (data) {
      if (data) {
        errors.push('Email already exists. Try signing in!');
        res.render('register', {errors: errors})
      }
      else {
        return Users.insert({email: email, passwordDigest: hash, galleries: [] }).then(function (user) {
          return user;
        });
      }
    });
  },

  findGalleries : function() {
    return Galleries.find({}).then(function (data) {
      return data;
    });
  },

  addGallery : function(title, description, url) {
    //find user using req.session, insert gallery id into their galleries
    return Galleries.insert({img: url, title: title, description: description, photoId: []});
  },

  removeGallery : function(id) {
    return Galleries.remove({_id: id});
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






