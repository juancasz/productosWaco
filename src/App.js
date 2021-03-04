import React,{ useState,useEffect } from 'react';
import styled from 'styled-components'
import Swal from 'sweetalert2'
import { app } from './services/firebase'
import ProtectedRoute from './customRoute/ProtectedRoute'
import {
  Switch,
  Route,
  useHistory
} from "react-router-dom"
import Navbar from './components/Navbar'
import Login from './views/Login'
import ProductList from './views/ProductList'
import NewProduct from './views/NewProduct'
import EditProduct from './views/EditProduct'
import NotFound from './views/NotFound'

const App = () => {
  const history = useHistory()
  const [user,setUser] = useState(null)

  useEffect(() => {
    if(localStorage.getItem('user')){
      const storedUser = JSON.parse(localStorage.getItem('user'))
      setUser(storedUser)
      history.push('/index')
    }
  },[history])

  const logOut = async() => {
    Swal.fire({
      title: 'Procesando',
    })
    Swal.showLoading()
    await app.auth().signOut()
    localStorage.clear()
    setUser(null)
    Swal.close()
    history.push('/')
  }
  
  return (
    <AppContainer>
      <Navbar logOut={logOut} user={user}/>
      <Content>
        <Switch>
          <Route exact path="/">
            <Login setUser={setUser}/>
          </Route>
          <ProtectedRoute
            isAuthenticated={user}
            exact path="/index"
            component={ProductList}
          />
          <ProtectedRoute
            isAuthenticated={user}
            exact path="/newProduct"
            component={NewProduct}
          />
          <ProtectedRoute
            isAuthenticated={user}
            exact path="/product/:id"
            component={EditProduct}
          />
          <Route path="*">
            <NotFound/>
          </Route>
        </Switch>
      </Content>
    </AppContainer>
  );
}

const AppContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  min-height: 100vh;
  width: 100%;
`

const Content = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 1rem
`

export default App;
