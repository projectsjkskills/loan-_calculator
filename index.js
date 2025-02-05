const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Loan calculation function
function calculateLoan(amount, termYears, interestRate) {
  const termMonths = termYears * 12;
  const monthlyInterestRate = interestRate / 100 / 12;
  const monthlyPayment =
    (amount * monthlyInterestRate) /
    (1 - Math.pow(1 + monthlyInterestRate, -termMonths));

  const totalPayment = monthlyPayment * termMonths;
  const totalInterest = totalPayment - amount;

  return { monthlyPayment, totalPayment, totalInterest };
}

// API endpoint for loan calculation
app.post('/calculate', (req, res) => {
  const { amount, termYears, interestRate, successFee, currentRevenue, revenueIncrease } = req.body;

  // Calculate loan details
  const { monthlyPayment, totalPayment, totalInterest } = calculateLoan(amount, termYears, interestRate);

  // Calculate success fee
  const successFeeAmount = (successFee / 100) * amount;

  // Calculate ROI
  const projectedRevenue = currentRevenue + revenueIncrease;
  const roi = ((projectedRevenue - currentRevenue) / currentRevenue) * 100;

  // Return results
  res.json({
    principal: amount,
    monthlyPayment,
    totalPayment,
    totalInterest,
    successFee: successFeeAmount,
    roi,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});