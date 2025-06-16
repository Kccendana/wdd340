// Needed Resources 
const express = require("express")
const router = new express.Router() 
const wishlistController = require("../controllers/wishlistController")
const utilities = require("../utilities/index")


/*add wishlist*/
router.post("/add",utilities.checkLogin, utilities.handleErrors(wishlistController.addwishlist));

/*mylist view*/
router.get("/", utilities.handleErrors(wishlistController.buildwishlistView))

module.exports = router;