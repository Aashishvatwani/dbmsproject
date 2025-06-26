// controllers/calculatePayment.js
const db = require('../models/db');

exports.calculatePayments = async (req, res) => {
  try {
    const person = req.query.name || req.body.name;
    const email = req.body.email || '';

    if (!person || !email) {
      return res.status(400).json({ message: 'Student name and email are required.' });
    }

    const [rows] = await db.promise().query('SELECT student_name, amount FROM expenditure');

    const totals = {};
    let totalSpent = 0;

    rows.forEach(({ student_name, amount }) => {
      if (!totals[student_name]) totals[student_name] = 0;
      totals[student_name] += parseFloat(amount);
      totalSpent += parseFloat(amount);
    });

    const people = Object.keys(totals);
    if (people.length === 0) {
      return res.status(200).json({
        totalExpenditure: 0,
        perPersonShare: 0,
        settlements: [],
        expenseHistory: [],
      });
    }

    const perPersonShare = totalSpent / people.length;

    const balances = people.map(student_name => ({
      student_name,
      balance: parseFloat((totals[student_name] - perPersonShare).toFixed(2)),
    }));

    const creditors = balances.filter(p => p.balance > 0).sort((a, b) => b.balance - a.balance);
    const debtors = balances.filter(p => p.balance < 0).sort((a, b) => a.balance - b.balance);

    const newTransactions = [];

    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];

      const amount = Math.min(Math.abs(debtor.balance), creditor.balance);
      if (amount > 0) {
        newTransactions.push({
          from: debtor.student_name,
          to: creditor.student_name,
          amount: parseFloat(amount.toFixed(2)),
        });

        debtor.balance += amount;
        creditor.balance -= amount;
      }

      if (Math.abs(debtor.balance) < 0.01) i++;
      if (creditor.balance < 0.01) j++;
    }

    // Fetch existing unpaid settlements
    const [existingSettlements] = await db.promise().query(
      'SELECT `from`, `to`, amount FROM settlements WHERE paid = 0'
    );

    const existingMap = new Set(
      existingSettlements.map(e => `${e.from}-${e.to}-${parseFloat(e.amount).toFixed(2)}`)
    );

    // Insert only new transactions not already in settlements
    for (const tx of newTransactions) {
      const key = `${tx.from}-${tx.to}-${tx.amount.toFixed(2)}`;
      if (!existingMap.has(key)) {
        await db.promise().query(
          'INSERT INTO settlements (`from`, `to`, amount, paid) VALUES (?, ?, ?, 0)',
          [tx.from, tx.to, tx.amount]
        );
      }
    }

    // Fetch updated settlements for the user
    const [settlements] = await db.promise().query(
      'SELECT * FROM settlements WHERE `from` = ? OR `to` = ?',
      [email, email]
    );

    // Also return raw expense history for chart
    const [expenseHistory] = await db.promise().query('SELECT * FROM expenditure');

    return res.status(200).json({
      totalExpenditure: totalSpent.toFixed(2),
      perPersonShare: perPersonShare.toFixed(2),
      settlements,
      expenseHistory
    });

  } catch (err) {
    console.error('❌ Error calculating payments:', err);
    return res.status(500).json({
      message: 'Failed to calculate payments.',
      error: err.message,
    });
  }
};
