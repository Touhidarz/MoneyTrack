import React from 'react';
import './Home.css';
import {useEffect, useState} from 'react';


function Home() {

  const[amount, setAmount] = useState('');
  const[datetime, setDatetime] = useState('');
  const[transaction, setTransaction] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [totalBalance , setTotalBalance] = useState(0)
  const [balance, setBalance] = useState('');
  const handlePaymentChange = (event) => {
      setSelectedPayment(event.target.value);}
  

  useEffect(() => {
    const settransaction = async () => {
      try {
        const transactions = await getTransactions();
        setTransaction(transactions);
      } catch (error) {
        console.error('Error fetching transactions :',error);
      }
    };
    settransaction();
  },[]);

  // to Read the transactions from database
  async function getTransactions(){
    const url = "http://localhost:4040/api/gettransactions";
    const response = await fetch(url);
    return await response.json();
  }
  
  // for writing the transactions in database on submit 
  const handleSubmit = async (e)=>{
    e.preventDefault()
     
    try {
      const response = await fetch("http://localhost:4040/api/posttransaction",{
      method:"POST",
      headers:{'Content-type':'application/json'},
      body:JSON.stringify({
        amount : amount,
        selectedPayment:selectedPayment, 
        datetime:datetime
      }),
      
    });
    console.log(response)
      setAmount('');
      setSelectedPayment('');
      setDatetime('');
 
    } catch (error) {
      console.log(error.message)
    }

  }

  
// Iterate through all transactions to calculate the total balance
 useEffect(() => {
    // Calculate total balance when the component mounts or when transactions change
    let balance = 0;
    transaction.forEach(transaction => {
      balance += transaction.amount;
    });
    setTotalBalance(balance);
  }, [transaction]);


  const handleCredit = async (e) => {
    e.preventDefault(); // Prevents the default action of the event (in this case, form submission)
    console.log("credited"); // Logs "credited" to the console
    
    setTotalBalance(prev => (prev + amount));
  
    console.log(totalBalance); // Logs the updated total balance to the console.

    try {
      const response = await fetch("http://localhost:4040/api/posttransaction",{
      method:"POST",
      headers:{'Content-type':'application/json'},
      body:JSON.stringify({
        amount : amount,
        selectedPayment:selectedPayment, 
        datetime:datetime
      }),
      
    });
      console.log(response)
      setAmount('');
      setSelectedPayment('');
      setDatetime('');
      
      } catch (error) {
        console.log(error.message)
    }
  }

  
  const handleDebit = async (e)=>{
  e.preventDefault();
  console.log("debited")
  setTotalBalance(prev=> (prev-amount))
  // totalBalance=totalBalance-amount;
  console.log(totalBalance)

  try {
    const response = await fetch("http://localhost:4040/api/posttransaction",{
    method:"POST",
    headers:{'Content-type':'application/json'},
    body:JSON.stringify({
      amount : amount,
      selectedPayment:selectedPayment, 
      datetime:datetime
    }),
    
  });
    console.log(response)
    setAmount('');
    setSelectedPayment('');
    setDatetime('');
    
    } catch (error) {
      console.log(error.message)
  }
}


  // home page
  return (
    <main>
      <h1> {totalBalance} </h1>
      
      <form >

        <div className='basic'>
          
          <button className='add'type='submit' onClick={handleSubmit}>Credit</button> 
          <button className='sub'type='submit' onClick={handleDebit} >Debit</button>

          <input type="number" 
            value={amount}
            name='amount'
            onChange={ev => setAmount(ev.target.value) && setBalance(ev.target.value)}
            
            placeholder={'e.g; 500'} 
            required={true}
            
          ></input>

        </div>

        <div className='payment'>

          
            <select className={`Pmethods `} id="methods" value={selectedPayment} onChange={handlePaymentChange}>
              <option value="Cash">Cash</option>
              <option value="Upi">Upi</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Cheque">Cheque</option>
            </select>

          <input type="datetime-local" 
            value={datetime}
            name='datetime'
            onChange={ev => setDatetime(ev.target.value)}
            required={true}
          ></input> 

        </div>
        
        <div>
          {/* <button onClick={handleSubmit} type="submit">Submit</button> */}
          <button>Transactions</button>
        </div>

      </form>

      <div className="transactions">
        
        {transaction.length > 0 && transaction.map(transaction => (
          <div className="transaction">

            <div className="left">
              <div className={`amount ${transaction.amount ? ("credit") : ("debit")}`}>{transaction.amount}</div>
              <div className="selectedPayment">{transaction.selectedPayment}</div>
            </div>

            <div className="right">
              <div className="datetime">{transaction.datetime}</div>
            </div>

          </div>
        ))}
        

      </div>

    </main>
  );
}

export default Home;
