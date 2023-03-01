
import {useState,useEffect,useContext} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import MyContext from "../context/MyContext";
import Popup from '../components/Popup';

export default (props) => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [categoria,setCategoria] = useState("");
    const [prodsCarrito,setProdsCarrito] = useState([]);
    const [carrito,setCarrito] = useState({});
    const [getNew,setGetNew] = useState(false);
    
    const navigate = useNavigate()
    const context = useContext(MyContext);

    const traerCarrito= ()=>{
        axios.get('http://localhost:8000/api/getcarrito/'+context.usr.id,{
                    withCredentials: true
                })
                .then(res=>{
                    if(res.data && !res.data.pagoefectuado){
                        setCarrito(res.data);
                        setProdsCarrito(res.data.listaprods);
                    }else{
                        setGetNew(true);
                    }
                })
                .catch(err=>console.log(err));
    }

    const traerProductos= async ()=>{
        await axios.get("http://localhost:8000/api/productos")
        .then(res => {
            setData(res.data);
        })
        .then(res=>{
            if(context.login){
                traerCarrito();
            }
        })
        .catch(err =>console.log(err))
    }

    useEffect(() => {
        traerProductos();
        console.log("entra")
    }, [props.flag]);
    
    const updateCarrito=(newcarrito)=>{
        axios.put('http://localhost:8000/api/updatecarrito/'+context.usr.id,newcarrito,{
            withCredentials: true
        })
            .catch(err=>console.log(err))
    }

    const createCarrito=(newcarrito)=>{
        axios.put('http://localhost:8000/api/newcarrito/'+context.usr.id,newcarrito,{
            withCredentials: true
        })
            .catch(err=>console.log(err))
    }

    const restarCarrito= (productoid) => {
        if(context.login){
            let prodidx = prodsCarrito.findIndex(obj=>obj.prodid===productoid);
            if(prodidx>=0){
                let nuevoProdsCarrito;
                if(prodsCarrito[prodidx].cantidad>1){
                    nuevoProdsCarrito=prodsCarrito.map((elt,idx)=>((elt.prodid===productoid)?{...elt,cantidad:elt.cantidad-1}:elt));
                }else{
                    nuevoProdsCarrito=[...prodsCarrito];
                    nuevoProdsCarrito.splice(prodidx,1);
                }
                updateCarrito({...carrito,listaprods:nuevoProdsCarrito});
                setProdsCarrito(nuevoProdsCarrito);
            }else{
                alert("La cantidad mínima es 0 productos.");
            }
        }else{
            alert("Debes iniciar sesión para poder modificar los productus del carrito.");
        }
    }

    const sumarCarrito= (productoid) => {
        if(context.login){
            let nuevoProdsCarrito;
            if(prodsCarrito.findIndex(obj=>obj.prodid===productoid)>=0){
                nuevoProdsCarrito=prodsCarrito.map((elt,idx)=>((elt.prodid===productoid)?{...elt,cantidad:elt.cantidad+1}:elt));
            }else{
                nuevoProdsCarrito=[...prodsCarrito,{prodid:productoid,cantidad:1}];
            }
            if(getNew){
                createCarrito({listaprods:nuevoProdsCarrito,pagoefectuado:false});
                setCarrito({listaprods:nuevoProdsCarrito,pagoefectuado:false});
                setGetNew(false);
            }else{
                updateCarrito({...carrito,listaprods:nuevoProdsCarrito});
            }
            setProdsCarrito(nuevoProdsCarrito);
        }else{
            alert("Debes iniciar sesión para poder modificar los productus del carrito.");
        }
    }

    return (
        <div>
            <div>
                <ul className='headerList'>
                    <li>
                        <input type="Buscar" placeholder="Search" className='searchBar'
                        onChange={event=>{setSearch(event.target.value)}} />
                    </li>
                        <li>
                            <Popup pc={prodsCarrito} setPC={setProdsCarrito} allprods={data} setAllprods={setData} carrito={carrito} setCarrito={setCarrito} setGetNew={setGetNew}/>
                        </li>
                    <li>
                        <select className='headerListSelectors' onChange={e=>{setCategoria(e.target.value)
                        }}>
                            <option value=""> Usos </option>
                            <option value="Decorativo"> Decorativo </option>
                            <option value="Ropa"> Ropa </option>
                            <option value="Juguete"> Juguete </option>
                            <option value="Accesorio"> Accesorio </option>

                        </select>
                    </li>
                    <li>
                        <select className='headerListSelectors' onChange={e=>{setCategoria(e.target.value)
                        }}>
                            <option value=""> Temas </option>
                            <option value="Navidad"> Navidad </option>
                            <option value="Pascua"> Pascua </option>
                            <option value="Personalizado"> Personalizado </option>
                            <option value="Verano"> Verano </option>

                        </select>
                    </li>
                    <li>
                        <select className='headerListSelectors'onChange={e=>{setCategoria(e.target.value)
                        }}>
                            <option value=""> Tecnica </option>
                            <option value="Crochet"> Crochet </option>
                            <option value="Bordado"> Bordado </option>
                        </select>
                    </li>
                </ul>
            </div>


            <div className='cardsContainer'>
                {data.filter((val)=>{
                    if (search === " " || categoria === " "){
                        return val
                    }else if (val.titulo.toLowerCase().includes(search.toLowerCase())
                    && val.categoria.toLowerCase().includes(categoria.toLowerCase())){
                        return val
                    }
                }).map((item,idx ) => {
                    return<div className='cards' key={idx}>
                    <img src={item.imageurl} alt="Logo" className='mapImg' />
                    <div className='cardInfo'>
                        <div className='cardActions'>
                            <h3 className='cardsTitles'>{item.titulo}</h3>
                            <p className='cardsP'><span className='mapTags'>Categoria:</span><br/> {item.categoria}</p>
                        </div>
                        <div className='cardActionsSecondary'>
                            <p className='cardsP'><span className='mapTags'>Precio:</span> {item.precio}$</p>
                                <div>
                                    <button className='mapBtn'onClick={()=>restarCarrito(item._id)} >
                                        -   
                                    </button>
                                        <p className='mapStock'> {prodsCarrito.findIndex(obj=>obj.prodid===item._id)>=0?prodsCarrito[prodsCarrito.findIndex(obj=>obj.prodid===item._id)].cantidad:0} </p>
                                    <button className='mapBtn' onClick={()=>sumarCarrito(item._id)} >
                                        +   
                                    </button>
                                </div>
                            <p className='cardsP'><span className='mapTags'>Stock:</span> {item.stock}</p>
                            <button className='cardDetailBtn' onClick={()=>{navigate('details/'+ item._id)}}>Detalles</button>

                        </div>
                    </div>
                </div>
                })}

            </div>
        
            <footer className='mainFotter'>
                <p>El Níspero</p>
            </footer>
        </div>
    );
}
