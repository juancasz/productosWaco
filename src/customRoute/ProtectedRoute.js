import React from 'react';
import {Route, Redirect} from 'react-router-dom';

const ProtectedRoute = ({component: Component,isAuthenticated,...rest}) => {

    return (
        <Route 
          {...rest} 
          render={props => (
            isAuthenticated ?
              <Component {...rest}/> :
              <Redirect to='/' />
          )} 
        />
    )
}

export default ProtectedRoute 