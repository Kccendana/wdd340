const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function addwishlist(inv_id, account_id){
  try {
    const sql = "INSERT INTO wishlist (inv_id, account_id) VALUES ($1, $2) RETURNING *"
    return await pool.query(sql, [inv_id, account_id])
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingWish(inv_id, account_id){
  try {
    const sql = "SELECT 1 FROM wishlist WHERE account_id = $2 AND inv_id = $1"
    const exist = await pool.query(sql, [inv_id,account_id])
    return exist.rowCount
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Get all wishlist vehicle
 * ************************** */
async function getwishlistVehicle(account_id) {
  try {
    const data = await pool.query(
      `SELECT i.* FROM wishlist w JOIN inventory i ON w.inv_id = i.inv_id WHERE w.account_id = $1`,
      [account_id]
    )
    return data.rows
  } catch (error) {
    return error.message
  }
}

module.exports = { addwishlist, checkExistingWish, getwishlistVehicle}