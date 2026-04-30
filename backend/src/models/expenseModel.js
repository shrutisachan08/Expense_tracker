const db = require("../db");

const createExpense = (expense, callback) => {
  const query = `
    INSERT INTO expenses 
    (id, amount, category, description, date, created_at, idempotency_key)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      expense.id,
      expense.amount,
      expense.category,
      expense.description,
      expense.date,
      expense.created_at,
      expense.idempotency_key
    ],
    function (err) {
      callback(err, this);
    }
  );
};

const getExpenses = (filters, callback) => {
  let query = `SELECT * FROM expenses`;
  let params = [];

  if (filters.category) {
    query += ` WHERE category = ?`;
    params.push(filters.category);
  }

  if (filters.sort === "date_desc") {
    query += ` ORDER BY datetime(date) DESC`;
  }

  db.all(query, params, (err, rows) => {
    callback(err, rows);
  });
};

const findByIdempotencyKey = (key, callback) => {
  db.get(
    `SELECT * FROM expenses WHERE idempotency_key = ?`,
    [key],
    callback
  );
};

module.exports = {
  createExpense,
  getExpenses,
  findByIdempotencyKey
};