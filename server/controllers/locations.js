/***********************************************************

Sever-side controllers for Location.  

By default, Yote's server controllers are dynamic relative 
to their models -- i.e. if you add fields to the Location
model, the create and update controllers below will respect
the new schema.

NOTE: make sure to account for any model changes 
on the client

***********************************************************/
var secrets = require('../config')[process.env.NODE_ENV].secrets;

var Location = require('mongoose').model('Location')
  , fs = require('fs')
  , async = require('async')
  , CSV = require('csv-string')
  , request = require('request')
  ;

//default stuff, in case we want to use this for more stuff later

exports.list = function(req, res) {
  if(req.query.page) {
    console.log('list locations with pagination');
    var page = req.query.page || 1;
    var per = req.query.per || 20;
    Location.find({}).skip((page-1)*per).limit(per).exec(function(err, locations) {
      if(err || !locations) {
        res.send({success: false, message: err});
      } else {
        res.send({
          success: true
          , locations: locations
          , pagination: {
            per: per
            , page: page
          }
        });
      }
    });
  } else {
    console.log('list locations');
    Location.find({}).exec(function(err, locations) {
      if(err || !locations) {
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, locations: locations });
      }
    });
  }
}

exports.search = function(req, res) {
  //search by query parameters
  // up to front end to make sure the params exist on the model
  console.log("searching for locations with params.");
  var mongoQuery = {};
  var page, per;
  for(key in req.query) {
    if(req.query.hasOwnProperty(key)) {
      if(key == "page") {
        page = req.query.page;
      } else if(key == "per") {
        per = req.query.per;
      } else {
        console.log("found search query param: " + key);
        mongoQuery[key] = req.query[key];
      }
    }
  }
  if(page || per) {
    console.log("searching for locations with pagination");
    console.log(mongoQuery);
    page = page || 1;
    per = per || 20;
    Location.find(mongoQuery).skip((page-1)*per).limit(per).exec(function(err, locations) {
      if(err || !locations) {
        res.send({ success: false, message: err });
      } else {
        res.send({ 
          success: true
          , locations: locations
          , pagination: {
            per: per
            , page: page
          }
        });
      }
    });
  } else {
    console.log(mongoQuery);
    Location.find(mongoQuery).exec(function(err, locations) {
      if(err || !locations) {
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, locations: locations });
      }
    });
  }
}

exports.getById = function(req, res) {
  console.log('get location by id');
  Location.findById(req.params.id).exec(function(err, location) {
    if(err) {
      res.send({ success: false, message: err });
    } else if (!location) {
      res.send({ success: false, message: "no location found :(" });
    } else {
      res.send({ success: true, location: location });
    }
  });
}

exports.getAndPopulate = function(req, res) {
  console.log('get location by id');
  Location.findById(req.params.id).populate('author').exec(function(err, location) {
    if(err) {
      res.send({ success: false, message: err });
    } else if(!location) {
      res.send({ success: false, message: "no location found :(" });
    } else {
      res.send({ success: true, location: location });
    }
  });
}

exports.create = function(req, res) {
  console.log('creating new location');



  if(!req.files.file) {
    console.log("NO FILE");
    res.send({success: false, message: "No File Present."});
  } else {
    fs.readFile(req.files.file.ws.path, 'utf8', function(err, data) {
      if(err || !data) {
        console.log("ERROR PROCESSING CSV");
        console.log(err);
        res.send({success: false, message: "Error processing CSV", err: err});
      } else {
        var firstRow;
        // console.log(data);
        // var parsed = CSV.parse(data);
        // console.log(parsed);
        var errorCount = -1;
        var successCount = 0;
        //part of the CSV library i found. no callback?
        var lines = [];
        CSV.forEach(data, ',', function(row, index) {
          if(index == 0) {
            firstRow = row;
          } else {
            //parse each line
            lines.push(row);
          }
        });
        console.log(lines.length);
        var jsonLines = [];
        var gpsErrors = 0;
        async.eachSeries(lines, function(line, callback) {
          console.log('<p>' + line[6] + ', ' + line[7] + '</p><p>' + line[12] + line[8] + line[13]);
          var nextJsonLine = {
            type: 'Feature'
            , geometry: {
              type: 'Point'
              , coordinates: []
            }
            //property locations hardcoded for PPD's ish. for future use, make more robust

            , properties: {
              title: '<a href="">' + line[1] + '</a>'
              , description: '<p>' + line[6] + '</p><p>' + line[12] + ', ' + line[9] + ' ' + line[13]
              , 'marker-color': '#0E70B2'
            }
          };

          //try to find location latitude/longitude
          var addressEncoded = line[6] + ", " + line[9] + " " + line[13];
          console.log(addressEncoded);
          var requestUrl = "https://maps.googleapis.com/maps/api/geocode/json?&key=" + secrets.google_secret;
          requestUrl += "&address=" + addressEncoded;

          if(line[6] == 'undefined' || line[6] == undefined) {
            callback();
          } else {
            var t = setTimeout(function() {
              //google api limit: 5 requests/second
              request(requestUrl, function(error, response, body) {
                console.log("REQUESTING MAPS FROM GOOGLE: ");
                var jsonBody = JSON.parse(body);
                if(jsonBody && jsonBody.results[0]) {
                  console.log(jsonBody.results[0].geometry.location);
                  nextJsonLine.geometry.coordinates = [
                    jsonBody.results[0].geometry.location.lat
                    , jsonBody.results[0].geometry.location.lng
                  ];
                  jsonLines.push(nextJsonLine);
                  callback();
                } else {
                  nextJsonLine.errorMsg = "Could not get GPS coordinates from Google Maps api. Do it by hand nancy boy.";
                  jsonLines.push(nextJsonLine);
                  gpsErrors ++;
                  callback();
                }
                // res.send({success: false, message: "testing", jsonBody: jsonBody, location: location });

              });

            }, 250);
          }

          // callback();
        }, function(err) {
          console.log("DONE FN");
          res.send({success: true, message: "Done", gpsErrors: gpsErrors, jsonLines: jsonLines});
        })
        //this returns to the front end BEFORE the spots and contacts themselves have necessarily been created
        // we may want to implement some kind of "loading bar" in the future for large files.

      }
    });
  }

}

exports.update = function(req, res) {
  console.log('updating location');
  Location.findById(req.params.id).exec(function(err, location) {
    if(err) {
      res.send({ success: false, message: err });
    } else if(!location) {
      res.send({ success: false, message: "Location not found. Edit failed. :(" });
    } else {
      // run through and update all fields on the model
      for(var k in req.body) {
        if(req.body.hasOwnProperty(k)) {
          location[k] = req.body[k];
        }
      }
      // now edit the updated date
      location.updated = new Date();
      location.save(function(err, location) {
        if(err) {
          res.send({ success: false, message: err });
        } else if(!location) {
          res.send({ success: false, message: "Could not save location :("});
        } else {
          res.send({ success: true, location: location });
        }
      });
    }
  });
}

exports.delete = function(req, res) {
  console.log("deleting location");
  Location.findById(req.params.id).remove(function(err) {
    if(err) {
      res.send({ success: false, message: err });
    } else {
      res.send({ success: true, message: "Deleted location" });
    }
  });
}

