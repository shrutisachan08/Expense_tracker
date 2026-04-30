const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db");

const expenseRoutes = require("./routes/expenses");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/expenses", expenseRoutes);

app.get("/", (req, res) => {
  res.send("Expense Tracker API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});