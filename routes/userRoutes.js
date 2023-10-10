const express = require("express");
const router = express.Router();

const {
  createExpense,
  getAllExpense,
  getExpenseById,
  updateExpense,
  deleteExpense,
} = require("../controllers/userController");



router.post("/", createExpense);
router.get("/", getAllExpense);
router.get("/:id", getExpenseById);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;