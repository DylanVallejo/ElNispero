import {useState,useEffect, useContext} from 'react';
import {Button} from '@mui/material';
import { useParams, useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import axios from "axios";
import MyContext from "../context/MyContext";




export default () => {
    const [data,setData] = useState([])
    const { id } = useParams();
    const navigate = useNavigate();
    const context = useContext(MyContext);

    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState(0);
    const [stock, setStock] = useState(0);
    const [imageurl, setImg] = useState("");
    const [categoria, setCategoria] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:8000/api/producto/${id}`)
        .then(res => {
            setData(res.data);
            setTitulo(res.data.titulo);
            setDescripcion(res.data.descripcion);
            setPrecio(res.data.precio);
            setStock(res.data.stock);
            setImg(res.data.imageurl);
            setCategoria(res.data.categoria);
        })
        .catch(err => {
            console.log(err);
        })
    }, []);

    const handleClick = (e) => {
        e.preventDefault();
        navigate('/');
    }

    const editProducto = e => {
        e.preventDefault();
        axios.put (`http://localhost:8000/api/producto/${id}`, {
            titulo,descripcion,precio,stock,imageurl,categoria
        },{withCredentials: true})
        .then(res =>{
            setData(res.data);
        })
        .catch(err => console.log(err))
    }

    const deleteProduct = (e) => {
        axios.delete(`http://localhost:8000/api/producto/${id}`,{withCredentials: true})
        
        .then(res => {
            navigate('/');
        })
        .catch(err => {
            console.log(err);
        })
    }


    return (
        <div className='itemDetailContainer'>
            <div className='imgDetailContainer'>
                <img src={data.imageurl} className="soloImg" />
            </div>
            <div className='dataDetailContainer'>
                <h3><span className='tagsSoloDetail'>Nombre:</span> {data.titulo}</h3>
                <p><span className='tagsSoloDetail'>Precio:</span> {data.precio}$</p>
                <p><span className='tagsSoloDetail'>Stock disponible:</span> {data.stock}</p>
                <p><span className='tagsSoloDetail'>Descripcion:</span> {data.descripcion}</p>
                <p><span className='tagsSoloDetail'>Categorias:</span> {data.categoria}</p>

                <Button  size="small" variant="contained" color="primary" onClick={handleClick} className="btnDetail" >Regresar</Button>
                {context.usr.rol=='admin' && <div> 
                    <Button style={{width: "150px", marginTop: '10px'}}  onClick={deleteProduct} size="small" variant="contained" color="primary">
                        Borrar producto
                    </Button>
                </div>}
            </div>
            {context.usr.rol=='admin' && <div className='updateForm'>
                <h4 className='updateHeader'>Editar Producto</h4>
                <form >
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
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
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
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
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
                            value={precio}
                            onChange={(e) => setPrecio(e.target.value)}
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
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
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
                            value={imageurl}
                            onChange={(e) => setImg(e.target.value)}
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
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                            />
                        </li>
                        <Button style={{width: "150px", marginTop: '10px'}}  onClick={editProducto} size="small" variant="contained" color="primary" >
                            Editar producto
                        </Button>
                    </ul>
                </form>
            </div>}
        </div>
    )



}