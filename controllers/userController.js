const db = require("../database");


const getAllExpense = async (req, res) => {
    try {
      const [rows] = await db.execute("SELECT * FROM tracker");
      res.json(rows);
    } catch (error) {
      console.error("Error fetching expenses:", error);  
      res.status(500).json({
        error: "An error occurred while fetching users.",
      });
    }
  };
  const getExpenseById =  async (req, res) => {
    const expenseId = req.params.id;
    try {
      const [result] = await db.execute("SELECT * FROM tracker WHERE id= ?",[expenseId]);
      if (result.length === 0) {
        return res.status(404).json({ error: "Expense not found" });
      }

    res.json(result[0]);
    } catch (error) {
        console.error("error fetching expense", error);
      res.status(500).json({
        error: "An error occurred while fetching a user.",
      });
    }
  };

  const createExpense = async (req, res) => {
    try {
      const { name, quantity, amount } = req.body;
      const result = await db.execute(
        "INSERT INTO tracker (name, quantity, amount) VALUES (?,?,?)",
        [name, quantity, amount]
      );
      const newExpense = {
        id: result[0].insertId,
        name,
        quantity,
        amount,
      };
      res.status(201).json(newExpense);
    } catch (error) {
      console.error("Error creating expense:", error);
      res.status(500).json({
        error: "An error occurred while inserting the user.",
      });
    }
  };

  const deleteExpense = async (req, res) => {
    const expenseId = req.params.id;
    try {
      const [result] = await db.execute("DELETE FROM tracker WHERE id = ?",[expenseId]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          error: "Expense not found",
        });
      }
      res.json({
        message: "Expense deleted successfully",
      });
    } catch (error) {
        console.error("error deleting expense:",error);
      res.status(500).json({
        error: "An error occurred while deleting the user.",
      });
    }
  };
  const updateExpense = async (req, res) => {
    const expenseId = req.params.id;
    const { name, quantity, amount } = req.body;

    try {
      const [result] = await db.execute("UPDATE tracker SET name = ?, quantity = ?, amount = ? WHERE id = ?",[name, quantity, amount, expenseId]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          error: "Expense not found",
        });
      }
      const updatedExpense = {
        id: expenseId,
        name,
        quantity,
        amount,
      };
      res.json(updatedExpense);
    } catch (error) {
        console.error("error updating expense:",error);
      res.status(500).json({
        error: "An error occurred while updating the user.",
      });
    }
  };

module.exports = {createExpense,getAllExpense, getExpenseById, updateExpense, deleteExpense};
