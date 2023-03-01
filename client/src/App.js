import './App.css';
import {useState,useEffect} from 'react';
import axios from 'axios';
import Main from './views/Main';
import {Route,Routes,BrowserRouter} from 'react-router-dom';
import ProductForm from './components/ProductForm';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import Details from './views/Details';
import MyContext from './context/MyContext';
import Navbar from './components/Navbar';
import Ventas from './views/Ventas';



function App() {
  const [usr,setUsr]=useState({
    id:"",
    nombre:"",
    apellido:"",
    rol:""
  });
  const [login,setLogin]=useState(false);
  const [flag,setFlag]=useState(false);

  const getUserInfo = async ()=>{
    await axios.get('http://localhost:8000/api/usercookie',{withCredentials: true})
        .then(res=>{
            setUsr({
              id:res.data._id,
              nombre:res.data.nombre,
              apellido:res.data.apellido,
              rol:res.data.rol
            });
            setLogin(true);
        })
        .catch(err=>console.log('el usuario no ha iniciado sesión'));
    setFlag(true);
  }

  useEffect(()=>{
    getUserInfo();
  },[]);

  return (
    <div className="App">
      <MyContext.Provider value={{usr,setUsr,login,setLogin}}>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Main flag={flag}/>}/>
          <Route path='/register' element={<RegisterForm rol={'user'}/>}/>
          <Route path='/registeradmin' element={<RegisterForm rol={'admin'}/>}/>
          <Route path='/login' element={<LoginForm/>}/>
          <Route path='/producto' element={<ProductForm/>}/>
          <Route path='/details/:id' element={<Details/>}/>
          <Route path='/ventas' element={<Ventas/>}/>
  
        </Routes>
      </BrowserRouter>
      </MyContext.Provider>
    </div>
  );
}

export default App;
