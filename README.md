# Expense Tracker

A minimal full-stack Expense Tracker built with a focus on **correctness, reliability, and real-world behavior** under conditions like network retries, page refreshes, and duplicate submissions.

---

##  Overview

This project allows users to:
- Record expenses (amount, category, description, date)
- View and filter expenses
- Sort by most recent
- See total spending for the current view
- Understand spending distribution via category summary

The implementation prioritizes **data correctness and robustness** over feature breadth.

---

## Tech Stack

### Backend
- Node.js + Express  
- SQLite (`sqlite3`)

### Frontend
- React (Create React App)  
- Plain CSS (modular, minimal styling)

---

## Key Design Decisions

### 1. SQLite for Persistence
SQLite was chosen as a lightweight, file-based database:
- No setup overhead
- Suitable for small-scale applications
- Ensures persistence without external dependencies

This keeps the system simple while still reflecting real-world data handling.

---

### 2. Handling Money Safely
Monetary values are stored as **integers (paise)** in the backend:
- Avoids floating-point precision errors
- Ensures correctness in calculations

---

### 3. Idempotent Expense Creation
To handle unreliable network conditions:
- Each request includes an `Idempotency-Key`
- Duplicate requests return the same result instead of creating new entries

This protects against:
- Multiple clicks
- Page refreshes
- Network retries

---

### 4. Separation of Concerns
- Backend focuses on correctness and data integrity
- Frontend handles presentation and lightweight aggregation (e.g., category summary)

---

### 5. Framework Choices

**Express (Backend):**
- Minimal and unopinionated
- Fast to implement within time constraints
- Suitable for building a clean REST API without unnecessary complexity

**React (Frontend):**
- Simple state management with hooks
- Quick iteration for UI
- Clear separation between logic and presentation

These choices balance **speed of development** with **maintainability**.

---

## Trade-offs (Time-Constrained Decisions)

Given the limited time, the following trade-offs were made:

- Used SQLite instead of a production-grade database
- Computed category summaries on the frontend instead of backend
- Did not implement pagination or advanced querying
- Skipped automated testing to prioritize core correctness and UX

These decisions were made to ensure a **working, reliable system** rather than partial implementations of advanced features.

---

## What Was Intentionally Not Done

To keep the scope focused:

- No authentication/authorization
- No edit/delete functionality
- No complex UI frameworks
- No over-engineering of backend architecture

The goal was to deliver a **clean, correct, and extensible foundation**.

---

## Real-World Considerations Handled

- Duplicate submissions (idempotency)
- Network/API failures (error handling)
- Multiple rapid clicks
- Empty and invalid inputs
- Data persistence across restarts
- Empty state UI

---

## Additional Feature

- **Category Summary**  
  Provides a quick breakdown of spending by category, helping users gain insight into their expenses.

---

## Project Structure
Expense_tracker/
│
├── backend/
│ ├── src/
│ ├── database.sqlite
│ └── package.json
│
├── frontend/
│ ├── src/
│ ├── public/
│ └── package.json


---

## Setup

### Backend

cd backend
npm install
npm start

Runs on:
http://localhost:5000


---

### Frontend

cd frontend
npm install
npm start

Runs on:
http://localhost:3000

---

## Final Note

This project focuses on building a **small but reliable system** rather than a feature-heavy one.

Priority was given to:
- Correct handling of edge cases
- Real-world robustness
- Clear and maintainable code

---

## Author

Shruti Sachan