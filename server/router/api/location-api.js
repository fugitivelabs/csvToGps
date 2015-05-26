/***********************************************************

API for Location.  

***********************************************************/

var locations = require('../../controllers/locations');

module.exports = function(router, requireLogin, requireRole) {

  // - Create 
  router.post('/api/locations'              , locations.create);

  // - Read
  router.get('/api/locations'               , locations.list);
  router.get('/api/locations/search'        , locations.search);
  router.get('/api/locations/:id/populate'  , locations.getAndPopulate);
  router.get('/api/locations/:id'           , locations.getById);

  // - Update
  router.put('/api/locations/:id'           , requireLogin(), locations.update); // must login by default

  // - Delete
  router.delete('/api/locations/:id'        , requireRole('admin'), locations.delete); // must be an 'admin' by default

}