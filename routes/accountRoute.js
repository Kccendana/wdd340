// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/index")
const regValidate = require('../utilities/account-validation')

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build login view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement));

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login data
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// // Process the login attempt
// router.post(
//   "/login",
//   (req, res) => {
//     res.status(200).send('login process')
//   }
// )

// Route to build update account management view 
router.get("/update/:accountId",utilities.checkJWTToken, utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateManagementView));

// Route to process update account 
router.post("/update", utilities.handleErrors(accountController.updateAccount));

// Route to process update password
router.post("/update-password", utilities.handleErrors(accountController.updatePassword));

// Route to process logout
router.get("/logout", utilities.handleErrors(accountController.logoutAccount));

module.exports = router;