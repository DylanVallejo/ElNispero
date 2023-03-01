import {useState} from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
export default () =>{

    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState(0);
    const [stock, setStock] = useState(0);
    const [imageurl, setImg] = useState("");
    const [categoria, setCategoria] = useState("");
    const navigate=useNavigate();

    const addProduct = e => {
        e.preventDefault();
        axios.post ("http://localhost:8000/api/producto/new", {
            titulo,descripcion,precio,stock,imageurl,categoria
        },{withCredentials: true})
        .then(()=>{
            setTitulo("");
            setDescripcion("");
            setPrecio(0);
            setStock(0);
            setImg("");
            setCategoria("");
        })
        .catch(err => console.log(err))
    }
    const handleNavigation = e => {
        navigate('/')
    }


    return(
        <div className='addProductsForm'>
            <header className='productHeader'>Agregar productos a la tienda</header>
            <form onSubmit={addProduct} >
                <ul  className='productList'>
                    <li>
                        <TextField
                        required
                        margin='normal'
                        label="Titulo"
                        type='text'
                        color='secondary'
                        size='small'
                        autoComplete='off'
                        onChange={(e) => setTitulo(e.target.value)}
                        value={titulo}
                        />
                    </li>
                    <li>
                        <TextField
                        required
                        margin='normal'
                        label="Descripción"
                        type='text'
                        color='secondary'
                        size='small'
                        autoComplete='off'
                        onChange={(e) => setDescripcion(e.target.value)}
                        value={descripcion}
                        />
                    </li>
                    <li>
                        <TextField
                        required
                        margin='normal'
                        label="Precio"
                        type='number'
                        color='secondary'
                        size='small'
                        autoComplete='off'
                        onChange={(e) => setPrecio(e.target.value)}
                        value={precio}
                        />

                    </li>
                    <li>
                        <TextField
                        required
                        margin='normal'
                        label="Stock"
                        type='number'
                        color='secondary'
                        size='small'
                        autoComplete='off'
                        onChange={(e) => setStock(e.target.value)}
                        value={stock}
                        />
                    </li>
                    <li>
                        <TextField
                        margin='normal'
                        label="Imagen"
                        type='text'
                        color='secondary'
                        size='small'
                        autoComplete='off'
                        onChange={(e) => setImg(e.target.value)}
                        value={imageurl}
                        />
                    </li>
                    <li>
                        <TextField
                        margin='normal'
                        label="Categoria"
                        type='text'
                        color='secondary'
                        size='small'
                        autoComplete='off'
                        onChange={(e) => setCategoria(e.target.value)}
                        value={categoria}
                        />
                    </li>
                    {/* productBtn */}
                    <button type="submit" className='addNavigationBtn'>
                        Agregar
                    </button>
                    <button onClick={handleNavigation}  className='addNavigationBtn'>
                        Regresar
                    </button>
                </ul>
            </form>
        </div>
    )

}






