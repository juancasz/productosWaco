import React,{ useState,useEffect } from 'react';
import Swal from 'sweetalert2'
import { app } from '../services/firebase'
import { Link,useHistory,useParams } from "react-router-dom"
import Card from '../components/Card'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

const EditProduct = () => {
    const id = useParams().id
    const history = useHistory()
    const[formData,setFormData] = useState({
        name: "",
        description: "",
        stock: "",
        price: ""
    })

    useEffect(() => {
        const getProduct = async () => {
            Swal.fire({
                title:'Procesando'
            })
            Swal.showLoading()
            const db = app.firestore();
            const product = await db.collection("products").doc(id).get()
            setFormData({...product.data(),id: product.id})
            Swal.close()
        }
        getProduct()
    },[id])

    const handleSubmit = async (e) => {
        e.preventDefault()
        Swal.fire({
            title:'Procesando'
        })
        Swal.showLoading()
        const db = app.firestore();
        await db.collection("products").doc(id).update(formData);
        Swal.close()
        history.push('/index')
    }

    return(
        <React.Fragment>
            <Card>
                <h2>Editar Producto</h2>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <Grid container spacing={1}>
                        <Grid item md={6}>
                            <TextField 
                                required
                                variant='outlined'
                                value={formData.name}
                                onChange={(event)=> setFormData({...formData,name:event.target.value})}
                                id="name" 
                                label="Nombre" 
                                fullWidth
                            />
                        </Grid>
                        <Grid item md={6}>
                            <TextField 
                                required
                                variant='outlined'
                                value={formData.description}
                                onChange={(event)=> setFormData({...formData,description:event.target.value})}
                                id="description" 
                                label="Descripción" 
                                fullWidth
                            />
                        </Grid>
                        <Grid item md={6}>
                            <TextField 
                                required
                                type='number'
                                variant='outlined'
                                value={formData.stock}
                                onChange={(event)=> setFormData({...formData,stock:Number(event.target.value)})}
                                id="stock" 
                                label="Cantidad" 
                                InputProps={{
                                    inputProps: { 
                                        min: 0 
                                    }
                                }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item md={6}>
                            <TextField 
                                required
                                variant='outlined'
                                type='number'
                                value={formData.price}
                                onChange={(event)=> setFormData({...formData,price:Number(event.target.value)})}
                                id="precio" 
                                label="Precio" 
                                InputProps={{
                                    inputProps: { 
                                        min: 0 
                                    }
                                }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item md={3}></Grid>
                        <Grid item md={3}>
                            <Button 
                                color='primary'
                                type='submit' 
                                variant="contained" 
                                fullWidth
                            >
                                Guardar
                            </Button>
                        </Grid>
                        <Grid item md={3}>
                            <Button 
                                color='secondary'
                                variant="contained" 
                                fullWidth
                                component={Link} 
                                to={'/index'}
                            >
                                Cancelar
                            </Button>
                        </Grid>
                        <Grid item md={3}></Grid>
                    </Grid>
                </form>
            </Card>
        </React.Fragment>
    )
}

export default EditProduct