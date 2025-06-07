const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

// /* ***************************
//  *  Build inventory by classification view
//  * ************************** */
// invCont.buildByClassificationId = async function (req, res, next) {
//   const classification_id = req.params.classificationId
//   const data = await invModel.getInventoryByClassificationId(classification_id)
//   console.log(data)
//   const grid = await utilities.buildClassificationGrid(data)
//   let nav = await utilities.getNav()
//   const className = data[0].classification_name
//   res.render("./inventory/classification", {
//     title: className + " vehicles",
//     data,
//     nav,
//     grid,
//   })
// }
/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  let nav = await utilities.getNav()

  let title = "Vehicles"
  let grid = "<p>No vehicles available in this classification.</p>"

  if (data && data.length > 0) {
    const className = data[0].classification_name
    title = `${className} vehicles`
    grid = await utilities.buildClassificationGrid(data)
  }

  res.render("./inventory/classification", {
    title,
    data,
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
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors:null,
    classificationSelect,
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
    res.status(501).render("inventory/addclassification", {
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
invCont.addInventory = async function (req, res) {
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = Number(req.params.inv_id)
  let nav = await utilities.getNav()
  const result = await invModel.getVehicleById(inv_id)
  const itemData = result[0]
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ****************************************
*  Process add vehicle
* *************************************** */
invCont.updateInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  const result = await invModel.updateInventory(
    parseInt(inv_id),
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    parseFloat(inv_price),
    parseInt(inv_year),
    parseInt(inv_miles),
    inv_color,
    parseInt(classification_id)
  )

  if (result) {
    req.flash("notice", `${inv_make} ${inv_model} has been updated.`)
    res.redirect("/inv/")
  } else {
    // Fix here — load select list before rendering
    const classificationSelect = await utilities.buildClassificationList(parseInt(classification_id))
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: `Edit ${inv_make} ${inv_model}`,
      nav,
      classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }
}

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = Number(req.params.inv_id)
  let nav = await utilities.getNav()
  const result = await invModel.getVehicleById(inv_id)
  const itemData = result[0]
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

/* ****************************************
*  Process delete vehicle
* *************************************** */
invCont.deleteInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
  
  } = req.body

  const result = await invModel.deleteInventory(
    parseInt(inv_id),
    inv_make,
    inv_model,
    parseFloat(inv_price),
    parseInt(inv_year),
   
  )

  if (result) {
    req.flash("notice", `${inv_make} ${inv_model} has been deleted.`)
    res.redirect("/inv/")
  } else {
    // Fix here — load select list before rendering
    req.flash("notice", "Sorry, the update failed.")
    res.redirect("/inv/")
  }
}

module.exports = invCont
