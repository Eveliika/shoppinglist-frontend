import './App.css';
import {useState, useEffect} from 'react';
import axios from 'axios';

const URL = 'http://localhost/ostoslista/';

function App() {
  const [item, setItem] = useState("");
  const [items, setItems] = useState([]);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    axios.get(URL)
      .then((response) => {
        setItems(response.data);
      }).catch(error => {
        alert(error.response ? error.response.data.error : error)
      });
  }, [])
   
  function save(e) {
    e.preventDefault();
    const json = JSON.stringify({description:item, amount:amount})
    axios.post(URL + 'add.php',json, {
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    .then ((response) => {
      setItems(items => [...items,response.data]);
      setAmount(items => [...items,response.data]);
      setItem('');
      setAmount('');
    }).catch(error => {
      alert(error.response ? error.response.data.error : error)
    })
  }

  function remove(id) {
    const json = JSON.stringify({id:id})
    axios.post(URL + 'delete.php',json,{
      headers: {
        'Content-Type' : 'application/json'
      }
    })
      .then((response) => {
        const newListWithoutRemoved = items.filter((item) => item.id !== id);
        setItems(newListWithoutRemoved);
      }).catch (error => {
        alert(error.response ? error.response.data.error : error);
      });
  }

  return (
    <div className='container'>
      <form onSubmit={save}>
        <h2>Shopping list</h2>
        <label>New item</label>
        <input value={item} placeholder='Type description' onChange={e => setItem(e.target.value)}/>
        <input value={amount} placeholder='Type amount' onChange={e => setAmount(e.target.value)}/>
        <button>Add</button>
      </form>
      <ol>
        {items?.map(item => (
          <li key={item.id}>
            <div>
              {item.description}
            </div>
            <div>
              {item.amount}
            </div>
            <div>
              <a className='delete' onClick={() => remove(item.id)} href="#">
              Delete
              </a>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default App;