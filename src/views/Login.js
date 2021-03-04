import React,{useState} from 'react';
import Swal from 'sweetalert2'
import { useHistory } from "react-router-dom"
import { app } from '../services/firebase'
import firebase from "firebase/app"
import "firebase/auth"
import Card from '../components/Card'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

const Login = ({setUser}) => {
    const history = useHistory()
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
    const [formData,setFormData] = useState({email:"",password:""})

    const handleLogin = async(e) => {
        e.preventDefault()
        Swal.fire({
            title: 'Procesando'
        })
        Swal.showLoading()
        await app
            .auth()
            .signInWithEmailAndPassword(formData.email, formData.password)
            .then(user => {
                setUser(user)
                localStorage.setItem('user',JSON.stringify(user))
                Swal.close()
                history.push('/index')
            })
            .catch(error => {
                Swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'No existe el usuario ',
                })
            });
    }   

    const socialLogin = async (provider)=>{
        await app
            .auth()
            .signInWithPopup(provider)
            .then(user => {
                setUser(user)
                localStorage.setItem('user',JSON.stringify(user))
                Swal.fire({
                    title: 'Procesando',
                    timer: 500
                })
                Swal.showLoading()
                history.push('/index')
            })
            .catch(error => {
                console.log(error.message)
            });
    }

    return (
        <Card>
            <form onSubmit={(e) => handleLogin(e)}>
                <Grid container spacing={1}>
                    <Grid item md={12}>
                        <TextField 
                            required
                            variant='outlined'
                            value={formData.email}
                            onChange={(event)=> setFormData({...formData,email:event.target.value})}
                            id="user" 
                            label="correo" 
                            fullWidth
                        />
                    </Grid>
                    <Grid item md={12}>
                        <TextField 
                            required
                            variant='outlined'
                            type='password'
                            value={formData.password}
                            onChange={(event)=> setFormData({...formData,password:event.target.value})}
                            id="password" 
                            label="contraseña" 
                            fullWidth
                        />
                    </Grid>
                    <Grid item md={12}>
                        <Button 
                            color='primary'
                            type='submit' 
                            variant="contained" 
                            fullWidth
                        >
                            Iniciar Sesión
                        </Button>
                    </Grid>
                    <Grid item md={12}>
                        <Button 
                            color='secondary'
                            variant="contained" 
                            onClick={() =>socialLogin(googleAuthProvider)}
                            fullWidth
                        >
                            Iniciar con Google
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Card>
    );
}

export default Login;