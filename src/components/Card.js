import React from 'react';
import styled from 'styled-components'

const Card = (props) => {
    return(
        <Container>
            {props.children}
        </Container>
    )
}

const Container = styled.div`
    background-color: white;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    margin: 1rem;
    padding: 1rem;
    align-self: center;
    border-radius: 1rem;
    width: 30%;
`

export default Card