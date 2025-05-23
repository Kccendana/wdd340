// controllers/errorController.js
const errorTest = (req, res, next) => {
  // Simulate an internal server error
  next(new Error("Intentional server crash for testing."));
};

module.exports = { errorTest };