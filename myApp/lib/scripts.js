var db = require('monk')('localhost/galleries-demo');
var Galleries = db.get('galleries');
var Photos = db.get('photos');


var Helper = {
  find : function() {
    return Galleries.find({}).then(function (data) {
      return data;
    });
  }
}

module.exports = Helper;