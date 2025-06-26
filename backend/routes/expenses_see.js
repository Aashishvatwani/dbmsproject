const express = require('express');
const router = express.Router();
const expense = require('../controllers/calculatePayment.js');
const db = require('../models/db');  // Move require here once to avoid repetition

// Route to calculate settlements
router.post('/', expense.calculatePayments);

// New Route to mark a transaction as paid
router.post('/mark-paid', async (req, res) => {
  const { from, to, amount } = req.body;

  if (!from || !to || !amount) {
    return res.status(400).json({ message: 'Missing required fields: from, to, amount' });
  }

  try {
    // Use correct column names payer and receiver
    const [result] = await db.promise().query(
      'UPDATE settlements SET paid = 1 WHERE payer = ? AND receiver = ? AND amount = ?',
      [from, to, amount]
    );

    // Optionally check if any row was updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No matching settlement found to update.' });
    }

    res.status(200).json({ message: '✅ Payment marked as paid and removed from list.' });
  } catch (err) {
    console.error('❌ Error marking payment as paid:', err);
    res.status(500).json({ message: 'Server error while updating payment status.' });
  }
});

module.exports = router;
