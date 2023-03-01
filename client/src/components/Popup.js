import React,{useState,useContext} from 'react';
import MyContext from "../context/MyContext";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton
    } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import styles from './Popup.module.css';

export default props => {
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [change, setChange] = useState(false);
    const [nocartmsg, setNocartmsg] = useState(false);
    const [monto, setMonto] = useState(0);
    const [prods, setProds] = useState([]);

    const getCarrito=()=>{
        if(props.carrito && !props.carrito.pagoefectuado && props.pc.length>0){
            setNocartmsg(false);
            let lpids=props.pc.map((p)=>p.prodid);
            let someprods=[];
            for(let i=0;i<lpids.length;i++){
                someprods.push({...props.allprods[props.allprods.findIndex(obj=>obj._id==lpids[i])]});
            }
            setProds(someprods);
            setMonto(someprods.reduce(
                (pv,cv,ci)=>pv+cv.precio*props.pc[ci].cantidad,
                0
                ));
        }else{
            setNocartmsg(true);
        }
        setOpen(true);
    }

    const openCarrito=()=>{
        if(context.login){
            getCarrito();
        }else{
            navigate("/login");
        }
    }

    const handlePlus=(idx)=>{
        let listamodif=[...props.pc];
        listamodif[idx].cantidad=props.pc[idx].cantidad+1;
        props.setPC(listamodif);
        setMonto(monto+prods[idx].precio);
        setChange(true);
    }

    const handleMinus=(idx)=>{
        if(props.pc[idx].cantidad>0){
            let listamodif=[...props.pc];
            listamodif[idx].cantidad=props.pc[idx].cantidad-1;
            props.setPC(listamodif);
            setMonto(monto-prods[idx].precio);
            setChange(true);
        }
    }

    const closeCarrito=()=>{
        if(change){
            let newcarrito={
                listaprods:props.pc.filter(elt=>elt.cantidad>0),
                pagoefectuado: props.carrito.pagoefectuado,
                montopago: monto
            };
            axios.put('http://localhost:8000/api/updatecarrito/'+context.usr.id,newcarrito,{
                withCredentials: true
            })
                .catch(err=>console.log(err))
        }
        props.setPC(props.pc.filter(elt=>elt.cantidad>0));
        let ids=props.pc.filter(elt=>elt.cantidad>0).map((p)=>p.prodid);
        setProds(prods.filter(elt=>ids.includes(elt)));
        setOpen(false);
    }

    const modifStocks=()=>{
        let lp=props.pc.filter(elt=>elt.cantidad>0);
        for(let i=0;i<lp.length;i++){
            axios.put('http://localhost:8000/api/productostock/'+lp[i].prodid,{cantidad:lp[i].cantidad},{
                withCredentials: true
            })
                .then(res=>{
                    let newallprods=[...props.allprods];
                    let stockidx=newallprods.findIndex(obj=>obj._id==lp[i].prodid);
                    if(newallprods[stockidx].stock>lp[i].cantidad){
                        newallprods[stockidx].stock-=lp[i].cantidad;
                    }else{
                        newallprods[stockidx].stock=0;
                    }
                    props.setAllprods(newallprods);
                })
                .catch(err=>console.log(err))
        }
    }

    const pagarCarrito=()=>{
        let carritopagado={
            listaprods:props.pc.filter(elt=>elt.cantidad>0),
            pagoefectuado: true,
            fechapago: new Date(),
            montopago: monto
        };
        axios.put('http://localhost:8000/api/updatecarrito/'+context.usr.id,carritopagado,{
            withCredentials: true
        })
            .then(res=>{
                alert('Pago efectuado por USD '+monto);
                props.setPC([]);
                setProds([]);
                modifStocks();
                props.setGetNew(true);
                setOpen(false);
            })
            .catch(err=>console.log(err))
    }

    return (
        <>
            <IconButton onClick={openCarrito} color="primary" aria-label="open shopping cart">
                <ShoppingCartIcon />
            </IconButton>
            <Dialog
                open={open}
                onClose={() => closeCarrito()}
                aria-labelledby='dialog-title'
                aria-describedby='dialog-description'
            >
                <DialogTitle style={{backgroundColor:'#ccf4cc',textAlign:'center'}} id='dialog-title'>Carrito</DialogTitle>
                <DialogContent style={{backgroundColor:'#ccf4cc'}}>
                    {nocartmsg && <h3>Tu carrito está vacío... </h3>}
                    {!nocartmsg && <div>
                        {prods.map((pr,idx)=>{
                            return <div className={styles.carritoinfo} key={idx}>
                            <h3>
                                <span>{pr.titulo}</span>
                                <em>USD {pr.precio*props.pc[idx].cantidad}</em>
                            </h3>
                            <div>
                                <IconButton onClick={()=>handleMinus(idx)} color="primary" aria-label="add to shopping cart">
                                    <IndeterminateCheckBoxRoundedIcon/>
                                </IconButton>
                                <em>{props.pc[idx].cantidad}</em>
                                <IconButton onClick={()=>handlePlus(idx)} color="primary" aria-label="add to shopping cart">
                                    <AddBoxRoundedIcon/>
                                </IconButton>
                            </div>
                        </div>
                        })}
                        <h2 className={styles.total}>
                            <span>Total:</span>
                            <em>USD {monto}</em>
                        </h2>
                    </div>}
                </DialogContent>
                <DialogActions style={{backgroundColor:'#ccf4cc'}}>
                    {!nocartmsg && <Button onClick={() => pagarCarrito()}>Pagar</Button>}
                    <Button onClick={() => closeCarrito()} autoFocus>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}