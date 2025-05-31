const utilities = require(".")
  const { body, validationResult } = require("express-validator")
const inventoryModel = require("../models/inventory-model")
  const validate = {}

  /*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.addClassificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("A valid classification_name is required.")
      .matches(/^\S+$/)  // This rejects any spaces
      .withMessage("Classification name must not contain spaces.")
      .custom(async (classification_name) => {
        const classificationNameExists = await inventoryModel.checkExistingClassification(classification_name)
        if (classificationNameExists) {
          throw new Error("Classification already exists. Please use a different name.")
        }
      })
  ]
}

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/addclassification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name
    })
    return
  }
  next()
}

/*  **********************************
  *  inventory Data Validation Rules
  * ********************************* */
validate.addInventoryRules = () => {
    return [
      // make is required and must be string and minimum of 3 characters
      body("inv_make")
        .trim()
        .escape()
        .notEmpty().withMessage("Make is required.")
        .isLength({ min: 3 }).withMessage("Make must be at least 3 characters long."),
  
      // model is required, must be string and minimum of 3 characters
      body("inv_make")
        .trim()
        .escape()
        .notEmpty().withMessage("Make is required.")
        .isLength({ min: 3 }).withMessage("Make must be at least 3 characters long."),
  
      // valid year is required and must be 4-digit year
      body("inv_year")
        .trim()
        .notEmpty().withMessage("Year is required.")
        .isInt({ min: 1900, max: new Date().getFullYear() + 1 }) // allow current or next year
        .withMessage("Year must be a valid 4-digit number."),
  
      // description is required and must be strong password
      body("inv_description")
        .trim()
        .escape()
        .notEmpty().withMessage("Description is required.")
        .isLength({ min: 10 }).withMessage("Description must be at least 10 characters long."),

      //image must be in this format
      body("inv_image")
        .trim()
        .notEmpty().withMessage("Image path is required.")
        .matches(/^\/images\/vehicles\/[a-zA-Z0-9\-]+\.(jpg|png)$/)
        .withMessage("Image path must be in the format: /images/vehicles/filename.jpg or .png"),
      
      //image must be in this format
      body("inv_image")
        .trim()
        .notEmpty().withMessage("Image path is required.")
        .matches(/^\/images\/vehicles\/[a-zA-Z0-9\-]+\.(jpg|png)$/)
        .withMessage("Image path must be in the format: /images/vehicles/filename.jpg or .png"), 
      
      //price must be greater than 0
      body("inv_price")
        .trim()
        .notEmpty().withMessage("Price is required.")
        .isFloat({ min: 0 }).withMessage("Price must be a number and greater than 0."),

      //miles must be greater than 0
      body("inv_miles")
        .trim()
        .notEmpty().withMessage("Mileage is required.")
        .isInt({ min: 0 }).withMessage("Mileage must be a whole number and not negative."),

      //color can contain letters and spaces
      body("inv_color")
        .trim()
        .notEmpty().withMessage("Color is required.")
        .isLength({ min: 3 }).withMessage("Color must be at least 3 characters.")
        .matches(/^[a-zA-Z\s]+$/).withMessage("Color can only contain letters and spaces.")
    ]
  }

  /* ******************************
 * Check data and return errors or continue to adding inventory
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image,inv_thumbnail, inv_price, inv_miles, inv_color, classification_name } = req.body
  const classificationSelect = await utilities.buildClassificationList(req.body.classification_id)
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/addinventory", {
      errors,
      title: "Add Vehicle",
      nav,
      classificationSelect,
      inv_make, 
      inv_model, 
      inv_year, 
      inv_description, 
      inv_image,inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color, 
      classification_name
    })
    return
  }
  next()
}

module.exports = validate
