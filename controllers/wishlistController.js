const utilities = require("../utilities/")
const wishlistModel = require("../models/wishlist-model")
require("dotenv").config()

const wishlistCont = {}

/* ****************************************
*  Process add wishlist
* *************************************** */

// wishlistCont.addwishlist = async function addAccount(req, res) {
//   let nav = await utilities.getNav()
//   const { inv_id, account_id  } = req.body
//   const checkExistingWish = await wishlistModel.checkExistingWish(inv_id, account_id)
//   const regResult = await wishlistModel.addwishlist(inv_id, account_id)

//   if (checkExistingWish) {
//     req.flash(
//       "notice",
//       "Already in the wishlist.")
//     return res.redirect(`/inv/detail/${inv_id}`)
//   }

//   if (regResult && regResult.rowCount > 0) {
//     req.flash(
//       "notice",
//       "This car has been added to the wishlist.")
//     return res.redirect(`/inv/detail/${inv_id}`)  // redirect to inventory detail page
//   } else {
//     req.flash("notice", "Sorry, the registration failed.")
//     return res.status(501).redirect(`/inv/detail/${inv_id}`)
//   }
// }
wishlistCont.addwishlist = async function addwishlist(req, res) {
  const { inv_id, account_id } = req.body
  let nav = await utilities.getNav()

  // Debug log
  console.log("inv_id:", inv_id, "account_id:", account_id)

  try {
    const alreadyExists = await wishlistModel.checkExistingWish(inv_id, account_id)

    if (alreadyExists) {
      req.flash("notice", "Already in the wishlist.")
      return res.redirect(`/inv/detail/${inv_id}`)
    }

    const regResult = await wishlistModel.addwishlist(inv_id, account_id)

    if (regResult && regResult.rowCount > 0) {
      req.flash("notice", "This car has been added to the wishlist.")
      return res.redirect(`/inv/detail/${inv_id}`)
    } else {
      req.flash("notice", "Sorry, adding to wishlist failed.")
      return res.status(500).redirect(`/inv/detail/${inv_id}`)
    }
  } catch (error) {
    console.error("Wishlist add error:", error)
    req.flash("notice", "Unexpected error. Try again.")
    return res.status(500).redirect(`/inv/detail/${inv_id}`)
  }
}

/* ****************************************
 *  Build inventory by classification view
 * *************************************** */
wishlistCont.buildwishlistView = async function (req, res, next) {
  const account_id = res.locals.accountData.account_id
  console.log(account_id)
  const data = await wishlistModel.getwishlistVehicle(account_id)
  let nav = await utilities.getNav()

  let title = "My Wishlist"
  let grid = "<p>No vehicles available in this List.</p>"

  if (data && data.length > 0) {
    title = "My WishList"
    grid = await utilities.buildClassificationGrid(data)
  }

  res.render("./wishlist/wishlistview", {
    title,
    data,
    nav,
    grid,
    error:null
  })
}
module.exports = wishlistCont