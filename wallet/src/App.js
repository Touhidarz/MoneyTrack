import './App.css';
import {useEffect, useState} from 'react';
//Project 2024
//Hello
//darshan and touhid
function App() {

  const[name, setName] = useState('');
  const[datetime, setDatetime] = useState('');
  const[description, setDescription] = useState('');
  const[transaction, setTransaction] = useState([]);

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
    const price = name.split(' ')[0];

    try {
      const response = await fetch("http://localhost:4040/api/posttransaction",{
      method:"POST",
      headers:{'Content-type':'application/json'},
      body:JSON.stringify({
        price : price,
        name:name.substring(price.length+1), 
        description:description, 
        datetime:datetime
      })
    });
    console.log(response)
    } catch (error) {
      console.log(error.message)
    }
    finally{
      // e.target.reset();
      setName('');
      setDatetime('');
      setDescription('');
    }

  }

  let balance = 0;
  for (const i of transaction) {
    balance = balance + i.price;
    
  }
 
  return (
    <main>
      <h1> {balance} </h1>
      <form onSubmit={handleSubmit} >

        <div className='basic'>
          <input type="text" 
            value={name}
            name='name'
            onChange={ev => setName(ev.target.value)}
            placeholder={'+10 samsung tv'} 
            required={true}
          ></input>

          <input type="datetime-local" 
            value={datetime}
            name='datetime'
            onChange={ev => setDatetime(ev.target.value)}
            required={true}
          ></input> 

        </div>

        <div className='description'>
          <input type="text"
            value={description}
            name='description'
            
            onChange={ev => setDescription(ev.target.value)} 
          placeholder={'description'}></input>
        </div>
        
        <button type="submit">Add new Transaction</button>

      </form>

      <div className="transactions">
        
        {transaction.length > 0 && transaction.map(transaction => (
          <div className="transaction">

            <div className="left">
              <div className="name">{transaction.name}</div>
              <div className="description">{transaction.description}</div>
            </div>

            <div className="right">
              <div className={"price" + (transaction.price < 0 ? 'red' : 'green')}>
                {transaction.price}
              </div>
              <div className="datetime">{transaction.datetime}</div>
            </div>

          </div>
        ))}
        

      </div>

      
        
      

    </main>
  );
}

export default App;
