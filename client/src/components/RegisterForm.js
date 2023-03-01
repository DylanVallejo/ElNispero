import {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {Button} from '@mui/material';
import styles from './LoginForm.module.css';

export default props =>{
    const navigate = useNavigate();
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [password, setStock] = useState("");
    const [errors, setErrors] = useState([]);

    const addUser = e => {
        e.preventDefault();
        const rol=props.rol;
        const carritos=[];
        if(rol=='admin' && email!='admin@admin.com'){
            alert('Registro no permitido, solo para el vendedor.')
        }else{
            axios.post ("http://localhost:8000/api/register", {
                nombre,apellido,email,password,rol,carritos
            })
            .then(res=>navigate("/login"))
            .catch(err=>{
                const errorResponse = err.response.data.errors;
                const errorArr = [];
                for (const key of Object.keys(errorResponse)) {
                    errorArr.push(errorResponse[key].message)
                }
                setErrors(errorArr);
            })
        }
    }

    return(
        <div style={{textAlign:'center'}}>
            <h2>Registro</h2>
            <form onSubmit={addUser} className={styles.form}>
                {errors.map((err, index) => <p key={index}>{err.includes("expected `email` to be unique")?"Email pertenece a un usuario ya existente":err}</p>)}
                <div className={styles.formelt}>
                    <label>Nombre</label><br/>
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}/>
                </div>
                <div className={styles.formelt}>
                    <label>Apellido</label><br/>
                    <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)}/>
                </div>
                <div className={styles.formelt}>
                    <label>Email</label><br/>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className={styles.formelt}>
                    <label>Contraseña</label><br/>
                    <input type="password" value={password} onChange={(e) => setStock(e.target.value)}/>
                </div>
                <Button type="submit" size="small" variant="contained" color="primary" className='mapBtn'>
                    Agregar
                </Button>
            </form>
        </div>
    )

}
