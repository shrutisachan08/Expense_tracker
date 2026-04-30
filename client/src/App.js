import { useEffect, useState } from "react";

const API = "http://localhost:5000/expenses";

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

  useEffect(() => {
    fetchExpenses();
  }, [filter, sort]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.amount <= 0) {
      setError("Amount must be positive");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const key = crypto.randomUUID();

      await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": key
        },
        body: JSON.stringify(form)
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

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Expense Tracker</h2>

      {/* ERROR */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <button
          type="submit"
          disabled={!form.amount || !form.category || !form.date || loading}
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </form>

      {/* FILTER + SORT */}
      <div style={{ marginTop: "20px" }}>
        <input
          placeholder="Filter by category"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        <button onClick={() => setSort("date_desc")}>
          Sort by Date ↓
        </button>

        <button onClick={() => setFilter("")}>
          Clear Filter
        </button>
      </div>

      {/* TOTAL */}
      <h3>Total: ₹{total}</h3>

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* EMPTY STATE */}
      {!loading && expenses.length === 0 && <p>No expenses found</p>}

      {/* TABLE */}
      {!loading && expenses.length > 0 && (
        <table border="1" cellPadding="8">
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