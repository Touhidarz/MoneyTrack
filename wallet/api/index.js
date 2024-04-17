const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Transaction = require('./models/Transaction.js');
const mongoose = require('mongoose');
const app = express();
const port = 4040;

mongoose.connect("mongodb+srv://money-track:OOTTVrLNPVv3YoQF@cluster0.fw3r7eb.mongodb.net/")
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });

app.use(cors());
app.use(express.json());

app.get('/.env', (req, res) => {
  res.json({ message: 'test ok' });
});

app.post('/api/posttransaction', async (req, res) => {
  try {
    const { amount, selectedPayment, datetime } = req.body;
    const transaction = new Transaction ({ 
      amount:amount,
      selectedPayment:selectedPayment,
      datetime:datetime 
    });
    console.log('Transaction created:', transaction);
    await transaction.save();

  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: error.message });
  }
});
 
  

app.get('/api/gettransactions', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    console.log('Fetched transactions:', transactions);
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
