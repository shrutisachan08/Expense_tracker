const { v4: uuidv4 } = require("uuid");
const expenseModel = require("../models/expenseModel");

const createExpense = (req, res) => {
  const { amount, category, description, date } = req.body;
  const idempotencyKey = req.headers["idempotency-key"];

  if (!amount || !category || !date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (amount <= 0) {
    return res.status(400).json({ error: "Amount must be positive" });
  }

  if (!idempotencyKey) {
    return res.status(400).json({ error: "Idempotency-Key header required" });
  }

  const amountInPaise = Math.round(amount * 100);

  // ✅ Check idempotency
  expenseModel.findByIdempotencyKey(idempotencyKey, (err, existing) => {
    if (existing) {
      return res.status(200).json({
        ...existing,
        amount: existing.amount / 100
      });
    }

    const newExpense = {
      id: uuidv4(),
      amount: amountInPaise,
      category,
      description,
      date,
      created_at: new Date().toISOString(),
      idempotency_key: idempotencyKey
    };

    expenseModel.createExpense(newExpense, (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        ...newExpense,
        amount: newExpense.amount / 100
      });
    });
  });
};

const getExpenses = (req, res) => {
  const { category, sort } = req.query;

  expenseModel.getExpenses({ category, sort }, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const formatted = rows.map((e) => ({
      ...e,
      amount: e.amount / 100
    }));

    // ✅ Total calculation
    const total = rows.reduce((sum, e) => sum + e.amount, 0);

    res.json({
      expenses: formatted,
      total: total / 100
    });
  });
};

module.exports = {
  createExpense,
  getExpenses
};