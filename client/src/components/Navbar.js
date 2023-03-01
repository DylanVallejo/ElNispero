import React,{useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from './Navbar.module.css';
import MyContext from "../context/MyContext";
import axios from 'axios';
import {Button} from '@mui/material';


export default props => {
    const context = useContext(MyContext);
    const navigate = useNavigate();

    const logout=()=>{
        axios.get('http://localhost:8000/api/logout',{
            withCredentials: true
        })
            .then(res=>{
                context.setUsr({
                    id:'',
                    nombre:'',
                    apellido:'',
                    rol:''
                });
                context.setLogin(false);
            })
            .catch(err=>{console.log(err)})
        
    }

    return (
        <div className={styles.nb}>
            {context.usr.rol==='admin' && <div className={styles.adminbtns}>
                <Button style={{width:'175px'}} onClick={()=>navigate("/producto")} size="small" variant="contained" color="primary" className='mapBtn'>
                    Crear Producto
                </Button>
                <Button style={{width:'100px'}} onClick={()=>navigate("/ventas")} size="small" variant="contained" color="primary" className='mapBtn'>
                    Ventas
                </Button>
            </div>}
            <div>
                <h1 onClick={()=>navigate("/")}>El Níspero</h1>
                <h4>Artesanías y articulos hechos a mano</h4>
            </div>
            <div>
                {context.login && <p> {`${context.usr.nombre} ${context.usr.apellido}`} </p>}
                {!context.login && <Button onClick={()=>navigate("/register")} size="small" variant="contained" color="primary" className='mapBtn'>
                        Registro
                    </Button>}
                {!context.login && <Button onClick={()=>navigate("/login")} size="small" variant="contained" color="primary" className='mapBtn'>
                        Login
                    </Button>}
                {context.login && <Button onClick={()=>logout()} size="small" variant="contained" color="primary" className='mapBtn'>
                        Logout
                    </Button>}
            </div>
        </div>
    )
}

