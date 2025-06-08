// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")
const regValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildDetailView));

// Route to build inventory management view
router.get("/",utilities.checkAdminOrEmployee, utilities.handleErrors(invController.buildManagement));

// Route to build add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Process the registration data
router.post(
  "/add-classification",
  regValidate.addClassificationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(invController.addClassification)
)

// Route to build add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Process the inventory data
router.post(
  "/add-inventory",
  regValidate.addInventoryRules(),
  regValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)
//get inventory by AJAX route
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

//build view for modifying inventory /inv/edit/2
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView));

router.post("/update/", utilities.handleErrors(invController.updateInventory))

//build view for deleting inventory /inv/edit/2
router.get("/delete/:inv_id", utilities.handleErrors(invController.deleteInventoryView));

//process for deletion
router.post("/delete/", utilities.handleErrors(invController.deleteInventory))
module.exports = router;