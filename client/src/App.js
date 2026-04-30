import { useEffect, useState } from "react";
import "./App.css";

const API = process.env.REACT_APP_API_URL + "/expenses";;

function App() {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);

  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    date: ""
  });

  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError("");

      let url = API;
      const params = [];

      if (filter) params.push(`category=${filter}`);
      if (sort) params.push(`sort=${sort}`);

      if (params.length) {
        url += "?" + params.join("&");
      }

      const res = await fetch(url);
      const data = await res.json();

      setExpenses(data.expenses || data);
      setTotal(data.total || 0);
    } catch (err) {
      setError("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchExpenses();
  }, [filter, sort]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amount = parseFloat(form.amount);
    const category = form.category.trim();
    const description = form.description.trim();
    const date = form.date;

    if (!amount || amount <= 0) {
      setError("Amount must be a positive number");
      return;
    }

    if (!category) {
      setError("Category is required");
      return;
    }

    if (!date) {
      setError("Date is required");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const key = crypto.randomUUID();

      await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": key
        },
        body: JSON.stringify({
          amount,
          category,
          description,
          date
        })
      });

      setForm({
        amount: "",
        category: "",
        description: "",
        date: ""
      });

      fetchExpenses();
    } catch (err) {
      setError("Failed to add expense. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const categorySummary = expenses.reduce((acc, curr) => {
    const cat = curr.category;

    if (!acc[cat]) {
      acc[cat] = 0;
    }

    acc[cat] += curr.amount;

    return acc;
  }, {});

  return (
    <div className="container">
      <h2 className="title">💰 Expense Tracker</h2>

      {error && <p className="error">{error}</p>}

      {/* FORM */}
      <div className="card">
        <form onSubmit={handleSubmit} className="form">
          <input
            className="input"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />

          <input
            className="input"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <input
            className="input"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <input
            className="input"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />

          <button
            className="button"
            type="submit"
            disabled={!form.amount || !form.category || !form.date || loading}
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </form>
      </div>

      {/* CONTROLS */}
      <div className="controls">
        <input
          className="input"
          placeholder="Filter by category"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        <button
          className="btn-secondary"
          onClick={() => setSort("date_desc")}
        >
          ⬇ Sort
        </button>

        <button
          className="btn-secondary"
          onClick={() => setFilter("")}
        >
          Clear
        </button>
      </div>

      {/* TOTAL */}
      <h3>Total: ₹{total}</h3>

      <div className="summary">
        <h3>Summary by Category</h3>
        <ul>
          {Object.entries(categorySummary).map(([cat, amt]) => (
            <li key={cat}>
              <strong>{cat}</strong>: ₹{amt}
            </li>
          ))}
        </ul>
      </div>

      {/* STATES */}
      {loading && <p>Loading...</p>}
      {!loading && expenses.length === 0 && <p>No expenses found</p>}

      {/* TABLE */}
      {!loading && expenses.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Category</th>
              <th>Description</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id}>
                <td>₹{e.amount}</td>
                <td>{e.category}</td>
                <td>{e.description}</td>
                <td>{e.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;