import './App.css';
import Products from './Components/Products';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <br /><br /><br /><h2 style={{float:'left',marginLeft:'150px'}}>Fresh-stock in</h2>
      <br /><br /><br />
      
      
      <Products />
    </div>
  );
}

export default App;
