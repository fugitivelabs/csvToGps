/***********************************************************

Model for Location.  

By default, Yote's server controllers are dynamic relative 
to their models -- i.e. if you add properties to the 
locationSchema below, the create and update controllers 
will respect the updated model.

NOTE: make sure to account for any model changes 
on the client

***********************************************************/

var mongoose = require('mongoose')
  , ObjectId = mongoose.SchemaTypes.ObjectId
  ;

// define location schema
var locationSchema = mongoose.Schema({
  created:                  { type: Date, default: Date.now }
  , updated:                { type: Date, default: Date.now }
  , title:                  { type: String, required: '{PATH} is required!' }
});

// location instance methods go here
// locationSchema.methods.methodName = function() {};

// location model static functions go here
// locationSchema.statics.staticFunctionName = function() {};

Location = mongoose.model('Location', locationSchema);
