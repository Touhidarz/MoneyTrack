import React from 'react';
import './Home.css';
import {useEffect, useState} from 'react';


function Home() {

  const[amount, setAmount] = useState('');
  const[datetime, setDatetime] = useState('');
  const[transaction, setTransaction] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState('');
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

  async function getTransactions(){
    const url = "http://localhost:4040/api/gettransactions";
    const response = await fetch(url);
    return await response.json();
  }
  
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
      })
      
    });
    
    console.log(response)
      setAmount('');
      setSelectedPayment('');
      setDatetime('');
      e.target.reset();
      
    } catch (error) {
      console.log(error.message)
    }
    finally{
       e.target.reset();
    }

  }
  
  
  // let balance = 0;
  // for (const i of transaction) {
  //   balance = balance + i.amount;
    
  // }
  let totalBalance = 0;
  for (const i of transaction) {
    totalBalance += i.amount;
  }


 
  return (
    <main>
      <h1> {totalBalance} </h1>
      
      <form onSubmit={handleSubmit} >

        <div className='basic'>
          
          <button className='add'>Credit</button> 
          <button className='sub'>Debit</button>

          <input type="number" 
            value={amount}
            name='amount'
            onChange={ev => setAmount(ev.target.value)}
            placeholder={'e.g; 500'} 
            required={true}
          ></input>

        </div>

        <div className='payment'>

          
            <select className="Pmethods" id="methods" value={selectedPayment} onChange={handlePaymentChange}>
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
          <button onClick={handleSubmit} type="submit">Submit</button>
          <button type="submit">Transactions</button>
        </div>
        
        

      </form>

      <div className="transactions">
        
        {transaction.length > 0 && transaction.map(transaction => (
          <div className="transaction">

            <div className="left">
              <div className="amount">{transaction.amount}</div>
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
