import { useState, useEffect} from "react";
import axios from "axios";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import moment from 'moment';


export default () => {
    const [pagos,setPagos] = useState([]);
    const [total,setTotal] = useState([]);
    const [loaded,setLoaded] = useState(false);

    useEffect(() => { 
        axios.get("http://localhost:8000/api/getVentas",{ withCredentials: true})
            .then(res => {
                setPagos(res.data);
                let suma=0;
                for(let i=0;i<res.data.length;i++){
                    for(let j=0;j<res.data[i].carritos.length;j++){
                        if(res.data[i].carritos[j].pagoefectuado){
                            suma+=res.data[i].carritos[j].montopago;
                        }
                    }
                }
                setTotal(suma);
                setLoaded(true);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

        return (

            <div className="globalDivVentas">
                <h1>Registro de Pagos</h1>
                <h3>Ganancias Totales: {total}</h3>
                {loaded  && 
                <div className="divTableContainer">

                    <TableContainer  className='ventasContainerTable'>
                        <Table sx={{ minWidth: 300 }} aria-label="simple table">
                            <TableHead className='tableVentasHeaders'>
                                <TableRow>
                                    <TableCell className="tableRows">Nombre</TableCell >
                                    <TableCell className="tableRows">Apellido</TableCell>
                                    <TableCell className="tableRows">Fecha</TableCell>
                                    <TableCell className="tableRows">Pago</TableCell>
                                </TableRow>

                            </TableHead>
                            <TableBody>
                                {pagos.filter(item=>item.carritos&&item.carritos.length>0).map((listpagosmui,idx)=>{
                                    return <>
                                            {listpagosmui.carritos.filter(item2=>item2.pagoefectuado).map((crt,cidx)=>{
                                                return <TableRow key={cidx} className='containTables'>
                                                        <TableCell className="tableRows">{listpagosmui.nombre}</TableCell >
                                                        <TableCell className="tableRows">{listpagosmui.apellido}</TableCell>
                                                        <TableCell className="tableRows">{ moment.utc(crt.fechapago.slice(0,19)).local().format("DD/MM/YYYY LTS")}</TableCell>
                                                        <TableCell className="tableRows">{crt.montopago}</TableCell>
                                                    </TableRow>
                                            })}
                                        </>
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer >
                    
                </div>  }   
            </div>
        )

}
