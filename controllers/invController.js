const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildDetailView = async function (req, res, next) {
  const inv_Id = req.params.invId
  const result = await invModel.getVehicleById(inv_Id)
  const vehicle = result[0]
  let nav = await utilities.getNav()
  res.render("./inventory/detail", {
    title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
    nav,
    vehicle
  })
}

/* ***************************
 *  Build inventory nanagement
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
  })
}

/* ***************************
 *  Build Add classification
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/addclassification", {
    title: "Add Classification",
    nav,
    errors: null,
    classification_name: null,
  })
}

/* ****************************************
*  Process classification
* *************************************** */
invCont.addClassification = async function addAccount(req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const regResult = await invModel.addClassification(classification_name)

  if (regResult && regResult.rowCount > 0) {
    req.flash(
      "notice",
      `Congratulations, ${classification_name} has been added.`
    )
    res.redirect("/inv/")  // redirect to inventory management or wherever
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inv/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      classification_name,
    })
  }
}

/* ***************************
 *  Build Add Inventory
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/addinventory", {
    title: "Add Vehicle",
    nav,
    classificationSelect,
    errors: null,
    inventory: null,
  })
}

/* ****************************************
*  Process add vehicle
* *************************************** */
invCont.addInventory = async function addAccount(req, res) {
  let nav = await utilities.getNav()
  const { inv_make, inv_model, inv_year, inv_description, inv_image,inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const regResult = await invModel.addInventory(
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image,
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color,
    classification_id)

    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, ${inv_make} ${inv_model} has been added.`
      )
      res.redirect("/inv/")  // redirect to inventory management or wherever
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("inventory/addinventory", {
        title: "Add Vehicle",
        nav,
        errors: null,
        classificationSelect,
      })
    }
}

module.exports = invCont