var express = require('express')
var router = express.Router()

// Require controller modules.
// var ressourceController = require('../controllers/ressourceController')
var userController = require('../controllers/userController')

/// RESSOURCE ROUTES ///

// la racine de /ressources ne retrourne rien au frontend...
// router.get('/', ressourceController.index)

/// USER ROUTES ///

// GET request for creating a User. NOTE This must come before routes that display User (uses id).
router.get('/user/create', userController.user_create_get)

// POST request for creating User.
router.post('/user/create', userController.user_create_post)

// GET request to delete User.
router.get('/user/:id/delete', userController.user_delete_get)

// POST request to delete User.
router.post('/user/:id/delete', userController.user_delete_post)

// GET request to update User.
router.get('/user/:id/update', userController.user_update_get)

// POST request to update User.
router.post('/user/:id/update', userController.user_update_post)

// GET request for one User.
router.get('/user/:id', userController.user_detail)

// GET request for list of all User items.
router.get('/users', userController.user_list)

module.exports = router
