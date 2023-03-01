import React, {useState,useContext} from 'react'
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import MyContext from "../context/MyContext";
import styles from './LoginForm.module.css';
import {Button} from '@mui/material';

export default props => {
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const loginUser = user => {
        axios.post('http://localhost:8000/api/login', user,{
            withCredentials: true
        })
            .then(res=>{
                console.log(res)
                if(res.data.msg.includes('invalid login attempt')){
                    setError('Login inválido');
                }else{
                    context.setUsr({
                        id:res.data.userid,
                        nombre:res.data.nombre,
                        apellido:res.data.apellido,
                        rol:res.data.rol
                    });
                    context.setLogin(true);
                    navigate("/");
                }
            })
            .catch(err=>{console.log(err)})
    }

    const onSubmitHandler = e => {
        e.preventDefault();
        loginUser({email,password});
    }

    return (
        <div style={{textAlign:'center'}}>
            <h2>Login</h2>
            <form id="formlogin" className={styles.form} onSubmit={onSubmitHandler}>
            {error!=="" && <p>{error}</p>}
                <div className={styles.formelt}>
                    <label>Email</label><br/>
                    <input type="email" onChange = {(e)=>setEmail(e.target.value)} value={email} required/>
                </div>
                <div className={styles.formelt}>
                    <label>Contraseña</label><br/>
                    <input type="password" onChange = {(e)=>setPassword(e.target.value)} value={password} required/>
                </div>
                <Button type="submit" form="formlogin" size="small" variant="contained" color="primary" className='mapBtn'>
                    Login
                </Button>
            </form>
        </div>
    )
}