import React, { useState } from 'react';
import axios from 'axios';
import { useSpring, animated } from '@react-spring/web';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    amount: 0,
    termYears: 3,
    interestRate: 8.5,
    successFee: 8.5,
    currentRevenue: 0,
    revenueIncrease: 0,
  });

  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateInput = (value) => {
    return isNaN(value) || value < 0 ? 0 : value;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: validateInput(parseFloat(value)) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.amount <= 0 || formData.interestRate <= 0 || formData.successFee <= 0) {
      alert('Please enter valid input for all fields.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/calculate', formData);
      setResults(response.data);
    } catch (error) {
      console.error('Error calculating loan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation for results section
  const resultsAnimation = useSpring({
    opacity: results ? 1 : 0,
    transform: results ? 'translateY(0)' : 'translateY(-20px)',
    config: { duration: 300 },
  });

  return (
    <div className="container">
      <h1>Loan Calculator</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Loan Amount ($):
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Loan Term (years):
          <select name="termYears" value={formData.termYears} onChange={handleChange}>
            <option value={3}>3 years</option>
            <option value={5}>5 years</option>
          </select>
        </label>
        <label>
          Interest Rate (%):
          <input
            type="number"
            step="0.1"
            name="interestRate"
            value={formData.interestRate}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Success Fee (%):
          <input
            type="number"
            step="0.1"
            name="successFee"
            value={formData.successFee}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Current Revenue ($):
          <input
            type="number"
            name="currentRevenue"
            value={formData.currentRevenue}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Revenue Increase ($):
          <input
            type="number"
            name="revenueIncrease"
            value={formData.revenueIncrease}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Calculate</button>
      </form>

      {results && (
        <animated.div style={resultsAnimation} className="results">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <h2>Results</h2>
              <p>Principal: ${results.principal?.toFixed(2)}</p>
              <p>Monthly Payment: ${results.monthlyPayment?.toFixed(2)}</p>
              <p>Total Payment: ${results.totalPayment?.toFixed(2)}</p>
              <p>Total Interest: ${results.totalInterest?.toFixed(2)}</p>
              <p>Success Fee: ${results.successFee?.toFixed(2)}</p>
              <p>ROI: {results.roi?.toFixed(2)}%</p>
            </>
          )}
        </animated.div>
      )}
    </div>
  );
}

export default App;
